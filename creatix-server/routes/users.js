import express from 'express';
import User from '../models/User.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-firebaseUid')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get leaderboard (public)
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ contestsWon: { $gt: 0 } })
            .select('name photo contestsWon contestsParticipated')
            .sort({ contestsWon: -1 })
            .limit(20);

        res.json(users);
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-firebaseUid');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        // Users can only update their own profile (unless admin)
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, photo, bio, address } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (photo !== undefined) updateData.photo = photo;
        if (bio !== undefined) updateData.bio = bio;
        if (address !== undefined) updateData.address = address;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-firebaseUid');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change user role (Admin only)
router.patch('/:id/role', verifyToken, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'creator', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-firebaseUid');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Change role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
