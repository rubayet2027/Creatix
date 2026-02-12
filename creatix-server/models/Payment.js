import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['entry_fee', 'prize_payout', 'creator_fee', 'withdrawal'],
        default: 'entry_fee',
    },
    stripePaymentIntentId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
    },
    // For withdrawals
    withdrawalMethod: {
        type: String,
        enum: ['stripe', 'bank_transfer'],
        default: null,
    },
    withdrawalDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
