import express from 'express';
import { auth } from '../config/firebase.js';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Sync user data from Firebase to database (called after Firebase auth)
// SECURITY: Now verifies Firebase token before trusting any user data
router.post('/sync', async (req, res) => {
    try {
        // SECURITY FIX: Extract and verify Firebase token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        
        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        try {
            decodedToken = await auth.verifyIdToken(token);
        } catch (tokenError) {
            console.error('Token verification failed in sync:', tokenError.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        
        // Now we trust the decoded token, not the request body for critical fields
        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email;
        
        // Get additional data from body (name, photo, etc.) but NOT firebaseUid or email
        const { name, photo, bio, address, creatorRequest } = req.body;

        // Find or create user
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            // Create new user with possible creator request
            const userData = {
                email,
                name: name || email.split('@')[0],
                photo: photo || '',
                firebaseUid,
                bio: bio || '',
                address: address || '',
            };

            // Handle creator request on registration
            if (creatorRequest) {
                userData.creatorRequest = true;
                userData.creatorStatus = 'pending';
            }

            user = await User.create(userData);
        } else {
            // Update user info if changed
            user.name = name || user.name;
            user.photo = photo || user.photo;
            if (bio) user.bio = bio;
            if (address) user.address = address;
            await user.save();
        }

        res.json({ user });
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user info (uses Firebase token verification)
router.get('/me', verifyToken, async (req, res) => {
    try {
        // req.user is already attached by verifyToken middleware with fresh DB data
        res.json(req.user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Request to become a creator
router.post('/request-creator', verifyToken, async (req, res) => {
    try {
        const user = req.user;

        // Check if user is already a creator or admin
        if (user.role === 'creator' || user.role === 'admin') {
            return res.status(400).json({ message: 'You already have creator privileges' });
        }

        // Check if there's already a pending request
        if (user.creatorStatus === 'pending') {
            return res.status(400).json({ message: 'You already have a pending creator request' });
        }

        // Submit creator request
        user.creatorRequest = true;
        user.creatorStatus = 'pending';
        await user.save();

        res.json({ 
            message: 'Creator request submitted successfully. Please wait for admin approval.',
            user 
        });
    } catch (error) {
        console.error('Creator request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
