import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true,
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskSubmission: {
        type: String,
        required: [true, 'Task submission is required'],
    },
    isWinner: {
        type: Boolean,
        default: false,
    },
    rank: {
        type: Number,
        default: null, // null means not ranked, 1, 2, 3 for top 3
    },
    prizeAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Compound index to ensure one submission per user per contest
submissionSchema.index({ contest: 1, participant: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
