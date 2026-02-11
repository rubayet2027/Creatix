import express from 'express';
import { auth } from '../config/firebase.js';
import User from '../models/User.js';

const router = express.Router();

// Sync user data from Firebase to database (called after Firebase auth)
router.post('/sync', async (req, res) => {
    try {
        const { firebaseUid, email, name, photo } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({ message: 'Firebase UID and email are required' });
        }

        // Find or create user
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = await User.create({
                email,
                name: name || email.split('@')[0],
                photo: photo || '',
                firebaseUid,
            });
        } else {
            // Update user info if changed
            user.name = name || user.name;
            user.photo = photo || user.photo;
            await user.save();
        }

        res.json({ user });
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user info (now uses Firebase token)
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify Firebase token
        const decodedToken = await auth.verifyIdToken(token);

        // Get user from database
        const user = await User.findOne({ firebaseUid: decodedToken.uid });

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
