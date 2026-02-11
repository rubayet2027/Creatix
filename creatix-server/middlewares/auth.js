import { auth } from '../config/firebase.js';
import User from '../models/User.js';

// Verify Firebase ID token
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);

        // Find or create user in database
        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
            // Auto-create user if doesn't exist
            user = await User.create({
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email?.split('@')[0],
                photo: decodedToken.picture || '',
                firebaseUid: decodedToken.uid,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Check if user is creator or admin
export const isCreator = (req, res, next) => {
    if (req.user.role !== 'creator' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Creator access required' });
    }
    next();
};

// Check if user is the owner of a resource or admin
export const isOwnerOrAdmin = (resourceUserIdField) => {
    return (req, res, next) => {
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

        if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied' });
    };
};
