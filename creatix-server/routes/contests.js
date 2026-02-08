import express from 'express';
import Contest from '../models/Contest.js';
import { verifyToken, isAdmin, isCreator } from '../middlewares/auth.js';

const router = express.Router();

// Get all approved contests (public)
router.get('/', async (req, res) => {
    try {
        const { type, search, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = { status: 'approved' };

        if (type && type !== 'all') {
            filter.contestType = type;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { contestType: { $regex: search, $options: 'i' } },
            ];
        }

        const contests = await Contest.find(filter)
            .populate('creator', 'name photo')
            .populate('winner', 'name photo')
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
        console.error('Get contests error:', error);
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
