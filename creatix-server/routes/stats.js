import express from 'express';
import Contest from '../models/Contest.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Get public platform statistics
// @route   GET /api/stats/platform
// @access  Public
router.get('/platform', async (req, res) => {
    try {
        const [
            totalContests,
            activeContests,
            totalUsers,
            totalCreators,
            totalParticipations,
        ] = await Promise.all([
            Contest.countDocuments({ status: 'approved' }),
            Contest.countDocuments({
                status: 'approved',
                deadline: { $gt: new Date() },
                winnerDeclared: false,
            }),
            User.countDocuments(),
            User.countDocuments({ role: 'creator' }),
            Contest.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: null, total: { $sum: '$participantsCount' } } },
            ]),
        ]);

        // Calculate total prize money distributed
        const prizesDistributed = await Contest.aggregate([
            { $match: { winnerDeclared: true } },
            { $group: { _id: null, total: { $sum: '$prizeMoney' } } },
        ]);

        res.json({
            success: true,
            data: {
                totalContests,
                activeContests,
                totalUsers,
                totalCreators,
                totalParticipations: totalParticipations[0]?.total || 0,
                totalPrizesDistributed: prizesDistributed[0]?.total || 0,
            },
        });
    } catch (error) {
        console.error('Get platform stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get recent contest winners
// @route   GET /api/stats/winners/recent
// @access  Public
router.get('/winners/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const recentWinners = await Contest.find({
            winnerDeclared: true,
            winner: { $ne: null },
        })
            .populate('winner', 'name photo email')
            .populate('creator', 'name')
            .select('name image prizeMoney winner creator contestType updatedAt')
            .sort({ updatedAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            count: recentWinners.length,
            data: recentWinners,
        });
    } catch (error) {
        console.error('Get recent winners error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get admin dashboard statistics
// @route   GET /api/stats/admin
// @access  Private (Admin only)
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalCreators,
            totalAdmins,
            pendingContests,
            approvedContests,
            rejectedContests,
            totalRevenue,
            contestsByType,
            recentUsers,
            recentContests,
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'creator' }),
            User.countDocuments({ role: 'admin' }),
            Contest.countDocuments({ status: 'pending' }),
            Contest.countDocuments({ status: 'approved' }),
            Contest.countDocuments({ status: 'rejected' }),
            Payment.aggregate([
                { $match: { status: 'succeeded' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Contest.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$contestType', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            User.find()
                .select('name email role createdAt')
                .sort({ createdAt: -1 })
                .limit(5),
            Contest.find()
                .populate('creator', 'name email')
                .select('name status createdAt creator')
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers + totalCreators + totalAdmins,
                    byRole: {
                        users: totalUsers,
                        creators: totalCreators,
                        admins: totalAdmins,
                    },
                },
                contests: {
                    total: pendingContests + approvedContests + rejectedContests,
                    byStatus: {
                        pending: pendingContests,
                        approved: approvedContests,
                        rejected: rejectedContests,
                    },
                    byType: contestsByType,
                },
                revenue: {
                    total: totalRevenue[0]?.total || 0,
                },
                recent: {
                    users: recentUsers,
                    contests: recentContests,
                },
            },
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
