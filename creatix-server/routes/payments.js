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
// SECURITY: Added idempotency key support for Stripe
router.post('/create-intent', verifyToken, async (req, res) => {
    try {
        const { contestId, idempotencyKey } = req.body;

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

        // Check for existing payment intent for this user & contest
        const existingPayment = await Payment.findOne({
            contest: contestId,
            user: req.user._id,
            status: 'pending',
        });

        if (existingPayment && existingPayment.stripePaymentIntentId) {
            // Return existing payment intent
            const stripe = getStripe();
            if (stripe) {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.stripePaymentIntentId);
                    if (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'canceled') {
                        return res.json({
                            clientSecret: paymentIntent.client_secret,
                            amount: contest.price,
                            existingPayment: true,
                        });
                    }
                } catch (e) {
                    // Payment intent not found, create new one
                }
            }
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

        // SECURITY: Create Stripe payment intent with idempotency key
        const stripeOptions = {
            amount: Math.round(contest.price * 100), // Stripe uses cents
            currency: 'usd',
            metadata: {
                contestId: contest._id.toString(),
                userId: req.user._id.toString(),
            },
        };

        // Add idempotency key if provided
        const requestOptions = idempotencyKey ? { idempotencyKey: `intent_${idempotencyKey}` } : {};
        
        const paymentIntent = await stripe.paymentIntents.create(stripeOptions, requestOptions);

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
// SECURITY: Added idempotency check and race condition protection
router.post('/withdraw', verifyToken, async (req, res) => {
    try {
        const { amount, method, accountDetails, idempotencyKey } = req.body;

        // SECURITY: Require idempotency key for withdrawals to prevent double-spend
        if (!idempotencyKey) {
            return res.status(400).json({ message: 'Idempotency key is required for withdrawals' });
        }

        // Check if this idempotency key was already used
        const existingWithdrawal = await Payment.findOne({
            user: req.user._id,
            type: 'withdrawal',
            idempotencyKey: idempotencyKey,
        });

        if (existingWithdrawal) {
            // Return the existing withdrawal result
            return res.json({
                message: 'Withdrawal already processed',
                newBalance: (await User.findById(req.user._id)).balance,
                status: existingWithdrawal.status,
                paymentId: existingWithdrawal._id,
                duplicate: true,
            });
        }

        // SECURITY: Check for pending withdrawals to prevent race conditions
        const pendingWithdrawal = await Payment.findOne({
            user: req.user._id,
            type: 'withdrawal',
            status: 'pending',
            createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
        });

        if (pendingWithdrawal) {
            return res.status(429).json({ 
                message: 'You have a pending withdrawal. Please wait for it to complete.',
                pendingId: pendingWithdrawal._id
            });
        }

        // Use MongoDB atomic operation to prevent race conditions
        const user = await User.findOneAndUpdate(
            { 
                _id: req.user._id, 
                balance: { $gte: amount }, // Only proceed if balance is sufficient
            },
            { 
                $inc: { balance: -amount } // Atomically deduct balance
            },
            { new: true }
        );

        if (!user) {
            // Either user not found or insufficient balance
            const currentUser = await User.findById(req.user._id);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(400).json({ 
                message: 'Insufficient balance',
                currentBalance: currentUser.balance
            });
        }

        if (amount < 10) {
            // Refund the deducted amount
            await User.findByIdAndUpdate(req.user._id, { $inc: { balance: amount } });
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

        // Create withdrawal payment record with idempotency key
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
            idempotencyKey, // Store for duplicate detection
        });

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

// SECURITY: Stripe webhook endpoint with signature verification
// This endpoint must be added BEFORE express.json() middleware in the main app
// Configure webhook endpoint in Stripe dashboard: /api/payments/webhook
router.post('/webhook', async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
        return res.status(503).json({ message: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(503).json({ message: 'Webhook secret not configured' });
    }

    let event;

    try {
        // SECURITY: Verify webhook signature to ensure request is from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent.id);
            
            // Update payment record
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: 'succeeded' }
            );
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            console.log('PaymentIntent failed:', failedIntent.id);
            
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: failedIntent.id },
                { status: 'failed' }
            );
            break;

        case 'charge.refunded':
            const refund = event.data.object;
            console.log('Charge refunded:', refund.payment_intent);
            
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: refund.payment_intent },
                { status: 'refunded' }
            );
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    res.json({ received: true });
});

export default router;
