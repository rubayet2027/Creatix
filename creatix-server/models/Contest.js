import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Contest name is required'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Contest image is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Entry price is required'],
        min: 0,
    },
    prizeMoney: {
        type: Number,
        required: [true, 'Prize money is required'],
        min: 0,
    },
    taskInstruction: {
        type: String,
        required: [true, 'Task instruction is required'],
    },
    contestType: {
        type: String,
        required: [true, 'Contest type is required'],
        enum: ['Image Design', 'Article Writing', 'Marketing Strategy', 'Digital Advertisement', 'Gaming Review', 'Book Review', 'Business Idea', 'Movie Review'],
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required'],
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'payment_pending', 'published', 'completed'],
        default: 'pending',
    },
    participantsCount: {
        type: Number,
        default: 0,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Support for top 3 winners with prize distribution
    winners: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rank: {
            type: Number,
            enum: [1, 2, 3],
        },
        prize: {
            type: Number,
        },
        paid: {
            type: Boolean,
            default: false,
        },
    }],
    // Keep single winner for backwards compatibility
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    winnerDeclared: {
        type: Boolean,
        default: false,
    },
    // Prize distribution percentages (default: 50%, 30%, 20%)
    prizeDistribution: {
        first: { type: Number, default: 50 },
        second: { type: Number, default: 30 },
        third: { type: Number, default: 20 },
    },
    // Creator payment for prize money
    creatorPaymentStatus: {
        type: String,
        enum: ['not_required', 'pending', 'requested', 'paid'],
        default: 'not_required',
    },
    creatorPaymentId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for search functionality
contestSchema.index({ name: 'text', description: 'text', contestType: 'text' });

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
