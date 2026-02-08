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
    stripePaymentIntentId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
