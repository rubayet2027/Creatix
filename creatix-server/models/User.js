import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    photo: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin'],
        default: 'user',
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    bio: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    // Creator request workflow fields
    creatorRequest: {
        type: Boolean,
        default: false,
    },
    creatorStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
    },
    contestsWon: {
        type: Number,
        default: 0,
    },
    contestsParticipated: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for faster queries
userSchema.index({ role: 1 });
userSchema.index({ creatorStatus: 1 });

const User = mongoose.model('User', userSchema);

export default User;
