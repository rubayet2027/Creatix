import express from 'express';
import Contest from '../models/Contest.js';
import { verifyToken, isAdmin, isCreator } from '../middlewares/auth.js';

const router = express.Router();

// Get all approved contests (public)
router.get('/', async (req, res) => {
    try {
        const { type, search, timeline, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const now = new Date();

        // For past contests, include 'completed' status; for others, only 'approved'
        let filter = {};
        
        if (timeline === 'past') {
            filter.$or = [
                { status: 'completed' },
                { status: 'approved', deadline: { $lt: now } }
            ];
        } else if (timeline === 'ongoing') {
            // Ongoing: has started (startDate <= now or no startDate) AND deadline hasn't passed
            filter.status = 'approved';
            filter.deadline = { $gte: now };
            filter.$or = [
                { startDate: { $lte: now } },
                { startDate: null },
                { startDate: { $exists: false } }
            ];
        } else if (timeline === 'upcoming') {
            // Upcoming: startDate is in the future
            filter.status = 'approved';
            filter.startDate = { $gt: now };
        } else {
            // Default: show all approved and completed
            filter.$or = [
                { status: 'approved' },
                { status: 'completed' }
            ];
        }

        if (type && type !== 'all') {
            filter.contestType = type;
        }

        if (search) {
            const searchFilter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { contestType: { $regex: search, $options: 'i' } },
                ],
            };
            // Combine with existing filter
            filter = { $and: [filter, searchFilter] };
        }

        const contests = await Contest.find(filter)
            .populate('creator', 'name photo')
            .populate('winners.user', 'name photo')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ deadline: timeline === 'past' ? -1 : 1 });

        const total = await Contest.countDocuments(filter);

        res.json({
            contests,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get contests grouped by timeline (for All Contests page sections)
router.get('/by-timeline', async (req, res) => {
    try {
        const now = new Date();

        // Past contests (deadline passed or status is completed)
        const pastContests = await Contest.find({
            $or: [
                { status: 'completed' },
                { status: 'approved', deadline: { $lt: now } }
            ]
        })
            .populate('creator', 'name photo')
            .populate('winners.user', 'name photo')
            .sort({ deadline: -1 })
            .limit(6);

        // Ongoing contests (has started AND deadline not passed)
        const ongoingContests = await Contest.find({
            status: 'approved',
            deadline: { $gte: now },
            $or: [
                { startDate: { $lte: now } },
                { startDate: null },
                { startDate: { $exists: false } }
            ]
        })
            .populate('creator', 'name photo')
            .sort({ deadline: 1 })
            .limit(6);

        // Upcoming contests (startDate is in the future)
        const upcomingContests = await Contest.find({
            status: 'approved',
            startDate: { $gt: now }
        })
            .populate('creator', 'name photo')
            .sort({ startDate: 1 })
            .limit(6);

        // Get counts for each category
        const pastCount = await Contest.countDocuments({
            $or: [
                { status: 'completed' },
                { status: 'approved', deadline: { $lt: now } }
            ]
        });
        const ongoingCount = await Contest.countDocuments({
            status: 'approved',
            deadline: { $gte: now },
            $or: [
                { startDate: { $lte: now } },
                { startDate: null },
                { startDate: { $exists: false } }
            ]
        });
        const upcomingCount = await Contest.countDocuments({
            status: 'approved',
            startDate: { $gt: now }
        });

        res.json({
            past: { contests: pastContests, total: pastCount },
            ongoing: { contests: ongoingContests, total: ongoingCount },
            upcoming: { contests: upcomingContests, total: upcomingCount },
        });
    } catch (error) {
        console.error('Get contests by timeline error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get popular contests (sorted by participation count)
router.get('/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        const contests = await Contest.find({ status: 'approved' })
            .populate('creator', 'name photo')
            .populate('winner', 'name photo')
            .sort({ participantsCount: -1 })
            .limit(limit);

        res.json(contests);
    } catch (error) {
        console.error('Get popular contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get available contest types
// @route   GET /api/contests/types
// @access  Public
router.get('/types', (req, res) => {
    const contestTypes = [
        'Image Design',
        'Article Writing',
        'Marketing Strategy',
        'Digital Advertisement',
        'Gaming Review',
        'Book Review',
        'Business Idea',
        'Movie Review',
    ];

    res.json({
        success: true,
        count: contestTypes.length,
        data: contestTypes,
    });
});

// @desc    Get contests by creator ID
// @route   GET /api/contests/creator/:userId
// @access  Public
router.get('/creator/:userId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Only show approved contests to public
        const filter = {
            creator: req.params.userId,
            status: 'approved',
        };

        const contests = await Contest.find(filter)
            .populate('creator', 'name photo')
            .populate('winner', 'name photo')
            .select('name image description prizeMoney participantsCount deadline status contestType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contest.countDocuments(filter);

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
        console.error('Get creator contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all contests for admin
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const contests = await Contest.find(filter)
            .populate('creator', 'name email photo')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Contest.countDocuments(filter);

        res.json({
            contests,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get admin contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get creator's contests
router.get('/my-contests', verifyToken, isCreator, async (req, res) => {
    try {
        const contests = await Contest.find({ creator: req.user._id })
            .populate('winner', 'name photo')
            .sort({ createdAt: -1 });

        res.json(contests);
    } catch (error) {
        console.error('Get my contests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get contest leaderboard/participants with pagination
router.get('/:id/leaderboard', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const contest = await Contest.findById(req.params.id)
            .populate('participants', 'name photo email')
            .populate('winner', 'name photo');

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Import Submission model to get submission status
        const Submission = (await import('../models/Submission.js')).default;

        // Get all participants with their submission status
        const participantsWithStatus = await Promise.all(
            contest.participants.map(async (participant) => {
                const submission = await Submission.findOne({
                    contest: req.params.id,
                    participant: participant._id,
                });
                return {
                    _id: participant._id,
                    name: participant.name,
                    photo: participant.photo,
                    email: participant.email,
                    hasSubmitted: !!submission,
                    submissionDate: submission?.createdAt || null,
                    isWinner: contest.winner?._id?.toString() === participant._id.toString(),
                };
            })
        );

        // Sort: winners first, then by submission date (submitted first), then by name
        participantsWithStatus.sort((a, b) => {
            if (a.isWinner !== b.isWinner) return b.isWinner - a.isWinner;
            if (a.hasSubmitted !== b.hasSubmitted) return b.hasSubmitted - a.hasSubmitted;
            if (a.submissionDate && b.submissionDate) {
                return new Date(a.submissionDate) - new Date(b.submissionDate);
            }
            return a.name.localeCompare(b.name);
        });

        // Paginate
        const total = participantsWithStatus.length;
        const paginatedParticipants = participantsWithStatus.slice(skip, skip + parseInt(limit));

        res.json({
            success: true,
            contest: {
                _id: contest._id,
                name: contest.name,
                status: contest.status,
                deadline: contest.deadline,
                winner: contest.winner,
            },
            participants: paginatedParticipants,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get contest leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single contest by ID
router.get('/:id', async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('creator', 'name photo email')
            .populate('winner', 'name photo')
            .populate('participants', 'name photo');

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.json(contest);
    } catch (error) {
        console.error('Get contest error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new contest (Creator only)
router.post('/', verifyToken, isCreator, async (req, res) => {
    try {
        const {
            name,
            image,
            description,
            price,
            prizeMoney,
            taskInstruction,
            contestType,
            deadline,
        } = req.body;

        const contest = await Contest.create({
            name,
            image,
            description,
            price,
            prizeMoney,
            taskInstruction,
            contestType,
            deadline: new Date(deadline),
            creator: req.user._id,
            status: 'pending',
        });

        res.status(201).json(contest);
    } catch (error) {
        console.error('Create contest error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update contest (Creator only, before approval)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Only creator can update their own contest
        if (contest.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Only pending contests can be updated by creators
        if (contest.status !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({ message: 'Only pending contests can be updated' });
        }

        const allowedUpdates = ['name', 'image', 'description', 'price', 'prizeMoney', 'taskInstruction', 'contestType', 'deadline'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = key === 'deadline' ? new Date(req.body[key]) : req.body[key];
            }
        }

        const updatedContest = await Contest.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json(updatedContest);
    } catch (error) {
        console.error('Update contest error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update contest status (Admin only)
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const contest = await Contest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.json(contest);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete contest
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Admin can delete any, creator can only delete pending
        if (req.user.role !== 'admin') {
            if (contest.creator.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
            if (contest.status !== 'pending') {
                return res.status(400).json({ message: 'Only pending contests can be deleted' });
            }
        }

        await Contest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contest deleted successfully' });
    } catch (error) {
        console.error('Delete contest error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
