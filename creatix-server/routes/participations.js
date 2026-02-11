import express from 'express';
import Contest from '../models/Contest.js';
import { verifyToken, isCreator, isOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Get participants of a contest
// @route   GET /api/participations/contest/:contestId
// @access  Private (Creator/Admin or contest owner)
router.get('/contest/:contestId', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.contestId)
            .populate('participants', 'name email photo contestsWon contestsParticipated');

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Only creator of contest or admin can view full participant list
        if (contest.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            success: true,
            count: contest.participants.length,
            data: contest.participants,
        });
    } catch (error) {
        console.error('Get contest participants error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Check if current user is registered for a contest
// @route   GET /api/participations/check/:contestId
// @access  Private
router.get('/check/:contestId', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.contestId);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        const isRegistered = contest.participants.includes(req.user._id);

        res.json({
            success: true,
            data: {
                contestId: contest._id,
                isRegistered,
                participantsCount: contest.participantsCount,
            },
        });
    } catch (error) {
        console.error('Check participation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get user's participated contests
// @route   GET /api/participations/user/:userId
// @access  Private (Owner or Admin)
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        // Only owner or admin can view
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const contests = await Contest.find({ participants: req.params.userId })
            .populate('creator', 'name photo')
            .populate('winner', 'name photo')
            .select('name image deadline status winner prizeMoney contestType')
            .sort({ deadline: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contest.countDocuments({ participants: req.params.userId });

        res.json({
            success: true,
            count: contests.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            data: contests,
        });
    } catch (error) {
        console.error('Get user participations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get user's winning contests
// @route   GET /api/participations/user/:userId/winning
// @access  Private (Owner or Admin)
router.get('/user/:userId/winning', verifyToken, async (req, res) => {
    try {
        // Only owner or admin can view
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const contests = await Contest.find({ winner: req.params.userId })
            .populate('creator', 'name photo')
            .select('name image prizeMoney contestType deadline updatedAt')
            .sort({ updatedAt: -1 });

        const totalPrizeWon = contests.reduce((sum, c) => sum + (c.prizeMoney || 0), 0);

        res.json({
            success: true,
            count: contests.length,
            totalPrizeWon,
            data: contests,
        });
    } catch (error) {
        console.error('Get user winnings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
