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

        const users = await User.find({ contestsWon: { $gt: 0 } })
            .select('name photo contestsWon contestsParticipated')
            .sort({ contestsWon: -1, contestsParticipated: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ contestsWon: { $gt: 0 } });

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

        const topWinners = await User.find({ contestsWon: { $gt: 0 } })
            .select('name photo contestsWon contestsParticipated')
            .sort({ contestsWon: -1, contestsParticipated: -1 })
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

export default router;
