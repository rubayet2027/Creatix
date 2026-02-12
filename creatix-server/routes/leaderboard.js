import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get full leaderboard (paginated)
// @route   GET /api/leaderboard
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find({ points: { $gt: 0 } })
            .select('name photo contestsWon contestsParticipated points')
            .sort({ points: -1, contestsWon: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ points: { $gt: 0 } });

        // Add rank to each user
        const rankedUsers = users.map((user, index) => ({
            ...user.toObject(),
            rank: skip + index + 1,
        }));

        res.json({
            success: true,
            count: users.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            data: rankedUsers,
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get top winners
// @route   GET /api/leaderboard/top
// @access  Public
router.get('/top', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topWinners = await User.find({ points: { $gt: 0 } })
            .select('name photo contestsWon contestsParticipated points')
            .sort({ points: -1, contestsWon: -1 })
            .limit(limit);

        // Add rank to each user
        const rankedWinners = topWinners.map((user, index) => ({
            ...user.toObject(),
            rank: index + 1,
        }));

        res.json({
            success: true,
            count: topWinners.length,
            data: rankedWinners,
        });
    } catch (error) {
        console.error('Get top winners error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get user's rank by ID
// @route   GET /api/leaderboard/rank/:userId
// @access  Public
router.get('/rank/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('points contestsParticipated');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user has no participation or no points, rank is N/A
        if (user.contestsParticipated === 0 || user.points === 0) {
            return res.json({
                success: true,
                data: {
                    rank: null,
                    points: user.points || 0,
                    message: 'N/A - No participated contests with points',
                },
            });
        }

        // Count users with more points than this user
        const usersAhead = await User.countDocuments({
            points: { $gt: user.points },
        });

        const rank = usersAhead + 1;

        res.json({
            success: true,
            data: {
                rank,
                points: user.points,
            },
        });
    } catch (error) {
        console.error('Get user rank error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
