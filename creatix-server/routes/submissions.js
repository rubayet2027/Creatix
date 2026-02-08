import express from 'express';
import Submission from '../models/Submission.js';
import Contest from '../models/Contest.js';
import User from '../models/User.js';
import { verifyToken, isCreator } from '../middlewares/auth.js';

const router = express.Router();

// Submit task to a contest
router.post('/', verifyToken, async (req, res) => {
    try {
        const { contestId, taskSubmission } = req.body;

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check if user is a participant
        if (!contest.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'You must register for this contest first' });
        }

        // Check if contest deadline has passed
        if (new Date() > new Date(contest.deadline)) {
            return res.status(400).json({ message: 'Contest deadline has passed' });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            contest: contestId,
            participant: req.user._id,
        });

        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted to this contest' });
        }

        const submission = await Submission.create({
            contest: contestId,
            participant: req.user._id,
            taskSubmission,
        });

        res.status(201).json(submission);
    } catch (error) {
        console.error('Create submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get submissions for a contest (Creator only)
router.get('/contest/:contestId', verifyToken, isCreator, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.contestId);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Only creator of the contest can view submissions
        if (contest.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const submissions = await Submission.find({ contest: req.params.contestId })
            .populate('participant', 'name email photo')
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Declare winner (Creator only)
router.post('/:id/declare-winner', verifyToken, isCreator, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('contest');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const contest = submission.contest;

        // Only creator of the contest can declare winner
        if (contest.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if deadline has passed
        if (new Date() < new Date(contest.deadline)) {
            return res.status(400).json({ message: 'Cannot declare winner before deadline' });
        }

        // Check if winner already declared
        if (contest.winnerDeclared) {
            return res.status(400).json({ message: 'Winner already declared for this contest' });
        }

        // Update contest with winner
        await Contest.findByIdAndUpdate(contest._id, {
            winner: submission.participant,
            winnerDeclared: true,
        });

        // Mark submission as winner
        submission.isWinner = true;
        await submission.save();

        // Update user stats
        await User.findByIdAndUpdate(submission.participant, {
            $inc: { contestsWon: 1 },
        });

        res.json({ message: 'Winner declared successfully', submission });
    } catch (error) {
        console.error('Declare winner error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's submissions
router.get('/my-submissions', verifyToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ participant: req.user._id })
            .populate({
                path: 'contest',
                select: 'name image prizeMoney deadline status winner',
                populate: { path: 'winner', select: 'name photo' },
            })
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Get my submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
