import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Contest from '../models/Contest.js';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Initialize Stripe
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Create payment intent
router.post('/create-intent', verifyToken, async (req, res) => {
    try {
        const { contestId } = req.body;

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contest.status !== 'approved') {
            return res.status(400).json({ message: 'Contest is not available for registration' });
        }

        // Check if already registered
        if (contest.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this contest' });
        }

        // Check if deadline passed
        if (new Date() > new Date(contest.deadline)) {
            return res.status(400).json({ message: 'Contest registration has ended' });
        }

        const stripe = getStripe();
        if (!stripe) {
            // If Stripe is not configured, allow free registration for testing
            return res.json({
                clientSecret: 'test_mode',
                testMode: true,
                amount: contest.price,
            });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(contest.price * 100), // Stripe uses cents
            currency: 'usd',
            metadata: {
                contestId: contest._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        // Save payment record
        await Payment.create({
            contest: contestId,
            user: req.user._id,
            amount: contest.price,
            stripePaymentIntentId: paymentIntent.id,
            status: 'pending',
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: contest.price,
        });
    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Confirm payment and register user
router.post('/confirm', verifyToken, async (req, res) => {
    try {
        const { contestId, paymentIntentId, testMode } = req.body;

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check if already registered
        if (contest.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this contest' });
        }

        if (!testMode && paymentIntentId) {
            // Verify payment with Stripe
            const stripe = getStripe();
            if (stripe) {
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                if (paymentIntent.status !== 'succeeded') {
                    return res.status(400).json({ message: 'Payment not completed' });
                }

                // Update payment status
                await Payment.findOneAndUpdate(
                    { stripePaymentIntentId: paymentIntentId },
                    { status: 'succeeded' }
                );
            }
        }

        // Add user to participants
        contest.participants.push(req.user._id);
        contest.participantsCount += 1;
        await contest.save();

        // Update user's participated count
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { contestsParticipated: 1 },
        });

        res.json({
            message: 'Successfully registered for contest',
            contest,
        });
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's payment history
router.get('/my-payments', verifyToken, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('contest', 'name image deadline status')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's participated contests
router.get('/participated', verifyToken, async (req, res) => {
    try {
        const contests = await Contest.find({ participants: req.user._id })
            .populate('winner', 'name photo')
            .sort({ deadline: 1 });

        res.json(contests);
    } catch (error) {
        console.error('Get participated contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's winning contests
router.get('/winnings', verifyToken, async (req, res) => {
    try {
        const contests = await Contest.find({ winner: req.user._id })
            .sort({ createdAt: -1 });

        res.json(contests);
    } catch (error) {
        console.error('Get winnings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
