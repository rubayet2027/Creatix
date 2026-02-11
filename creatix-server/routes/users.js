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

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
router.get('/:id/stats', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            'name photo contestsWon contestsParticipated createdAt'
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate win rate
        const winRate =
            user.contestsParticipated > 0
                ? ((user.contestsWon / user.contestsParticipated) * 100).toFixed(1)
                : 0;

        // Get recent activity (last 5 participations)
        const Contest = (await import('../models/Contest.js')).default;
        const recentContests = await Contest.find({
            participants: req.params.id,
        })
            .select('name image deadline status winner')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    photo: user.photo,
                    memberSince: user.createdAt,
                },
                stats: {
                    contestsWon: user.contestsWon,
                    contestsParticipated: user.contestsParticipated,
                    winRate: parseFloat(winRate),
                },
                recentContests,
            },
        });
    } catch (error) {
        console.error('Get user stats error:', error);
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

        const updateData = { role };
        
        // If promoting to creator, update creator status
        if (role === 'creator') {
            updateData.creatorStatus = 'approved';
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
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

// Approve creator request (Admin only)
router.patch('/:id/approve-creator', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.creatorStatus !== 'pending') {
            return res.status(400).json({ message: 'No pending creator request for this user' });
        }

        user.role = 'creator';
        user.creatorStatus = 'approved';
        await user.save();

        res.json({ 
            message: 'Creator request approved successfully',
            user 
        });
    } catch (error) {
        console.error('Approve creator error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject creator request (Admin only)
router.patch('/:id/reject-creator', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.creatorStatus !== 'pending') {
            return res.status(400).json({ message: 'No pending creator request for this user' });
        }

        user.creatorStatus = 'rejected';
        user.creatorRequest = false;
        await user.save();

        res.json({ 
            message: 'Creator request rejected',
            user 
        });
    } catch (error) {
        console.error('Reject creator error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get pending creator requests (Admin only)
router.get('/creator-requests/pending', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ creatorStatus: 'pending' })
            .select('-firebaseUid')
            .sort({ createdAt: -1 });

        res.json({ users, total: users.length });
    } catch (error) {
        console.error('Get pending requests error:', error);
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
