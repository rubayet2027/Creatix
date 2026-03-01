import express from 'express';
import Contact from '../models/Contact.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/contact - Public: Submit a contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: 'All fields are required: name, email, subject, message',
            });
        }

        if (name.length > 100) {
            return res.status(400).json({ message: 'Name cannot exceed 100 characters' });
        }

        if (subject.length > 200) {
            return res.status(400).json({ message: 'Subject cannot exceed 200 characters' });
        }

        if (message.length > 5000) {
            return res.status(400).json({ message: 'Message cannot exceed 5000 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
        });

        res.status(201).json({
            message: 'Your message has been sent successfully. We will get back to you soon!',
            data: { id: contact._id },
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// GET /api/contact - Admin only: List all contact submissions
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = {};

        if (status && ['new', 'read', 'replied'].includes(status)) {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Contact.countDocuments(query);

        res.json({
            data: contacts,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contact submissions' });
    }
});

// PATCH /api/contact/:id/status - Admin only: Update contact status
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ message: 'Valid status required: new, read, replied' });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact submission not found' });
        }

        res.json({ message: 'Status updated', data: contact });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contact status' });
    }
});

export default router;
