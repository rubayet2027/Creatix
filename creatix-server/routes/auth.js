import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token for a user
router.post('/jwt', async (req, res) => {
    try {
        const { email, name, photo, firebaseUid } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name: name || email.split('@')[0],
                photo: photo || '',
                firebaseUid: firebaseUid || null,
            });
        } else if (firebaseUid && !user.firebaseUid) {
            // Update firebaseUid if not set
            user.firebaseUid = firebaseUid;
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user });
    } catch (error) {
        console.error('JWT generation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user info
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
