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
        enum: ['pending', 'approved', 'rejected'],
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
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    winnerDeclared: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Index for search functionality
contestSchema.index({ name: 'text', description: 'text', contestType: 'text' });

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
