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

const User = mongoose.model('User', userSchema);

export default User;
