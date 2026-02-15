import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Contest from '../models/Contest.js';
import Submission from '../models/Submission.js';
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

// Get user's participated contests with submission info
router.get('/participated', verifyToken, async (req, res) => {
    try {
        // Get all contests the user has participated in
        const contests = await Contest.find({ participants: req.user._id })
            .populate('creator', 'name photo')
            .populate('winners.user', 'name photo')
            .sort({ deadline: -1 });

        // Get user's submissions for these contests
        const submissions = await Submission.find({
            participant: req.user._id,
            contest: { $in: contests.map(c => c._id) }
        });

        // Create a map of contest ID to submission
        const submissionMap = {};
        submissions.forEach(sub => {
            submissionMap[sub.contest.toString()] = sub;
        });

        // Combine contest data with submission data
        const contestsWithSubmissions = contests.map(contest => {
            const submission = submissionMap[contest._id.toString()];
            return {
                ...contest.toObject(),
                userSubmission: submission ? {
                    _id: submission._id,
                    rank: submission.rank,
                    isWinner: submission.isWinner,
                    prizeAmount: submission.prizeAmount,
                } : null,
            };
        });

        res.json(contestsWithSubmissions);
    } catch (error) {
        console.error('Get participated contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's winning contests with prize details
router.get('/winnings', verifyToken, async (req, res) => {
    try {
        // Get all submissions where user won (has a rank)
        const winningSubmissions = await Submission.find({
            participant: req.user._id,
            isWinner: true,
        }).populate({
            path: 'contest',
            populate: { path: 'creator', select: 'name photo' }
        });

        // Calculate totals
        const user = await User.findById(req.user._id);
        const totalWinnings = winningSubmissions.reduce((sum, sub) => sum + (sub.prizeAmount || 0), 0);
        
        res.json({
            winnings: winningSubmissions.map(sub => ({
                _id: sub._id,
                contest: sub.contest,
                rank: sub.rank,
                prizeAmount: sub.prizeAmount,
                createdAt: sub.createdAt,
            })),
            summary: {
                totalWinnings,
                balance: user.balance || 0,
                totalEarnings: user.totalEarnings || 0,
                contestsWon: user.contestsWon || 0,
            },
        });
    } catch (error) {
        console.error('Get winnings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Withdraw winnings
router.post('/withdraw', verifyToken, async (req, res) => {
    try {
        const { amount, method, accountDetails } = req.body;

        const user = await User.findById(req.user._id);
        
        if (!user.balance || user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        if (amount < 10) {
            return res.status(400).json({ message: 'Minimum withdrawal amount is $10' });
        }

        const stripe = getStripe();
        let stripePayoutId = null;
        let payoutStatus = 'pending';

        // Process with Stripe if available
        if (stripe && accountDetails?.accountNumber) {
            try {
                // In production, you would use Stripe Connect or Payouts
                // For now, we'll create a record and mark for manual processing
                // Real implementation would require:
                // 1. User to have a connected Stripe account, OR
                // 2. Bank account verification via Stripe
                
                // Simulate successful payout in test mode
                if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
                    payoutStatus = 'completed';
                    stripePayoutId = `payout_test_${Date.now()}`;
                }
            } catch (stripeError) {
                console.error('Stripe payout error:', stripeError);
                // Continue with pending status for manual processing
            }
        } else if (!stripe) {
            // Test mode - auto complete
            payoutStatus = 'completed';
            stripePayoutId = `payout_test_${Date.now()}`;
        }

        // Create withdrawal payment record
        const payment = await Payment.create({
            user: req.user._id,
            contest: null,
            amount: amount,
            type: 'withdrawal',
            status: payoutStatus,
            withdrawalMethod: method || 'bank_transfer',
            withdrawalDetails: accountDetails ? {
                last4: accountDetails.accountNumber?.slice(-4),
                bankName: accountDetails.bankName,
                accountHolder: accountDetails.accountHolder,
            } : null,
            stripePayoutId,
        });

        // Deduct from user balance
        user.balance -= amount;
        await user.save();

        res.json({
            message: payoutStatus === 'completed' 
                ? 'Withdrawal processed successfully!' 
                : 'Withdrawal request submitted. Processing within 2-3 business days.',
            newBalance: user.balance,
            status: payoutStatus,
            paymentId: payment._id,
        });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
