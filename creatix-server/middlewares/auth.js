import { auth } from '../config/firebase.js';
import User from '../models/User.js';

// Verify Firebase ID token and attach user to request
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);

        // ALWAYS fetch fresh user data from database - never trust cached data
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

        // Attach fresh user data to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Generic role verification middleware factory
// CRITICAL: Always verify role from database, never trust frontend
export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                requiredRole: allowedRoles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Check if user is creator or admin
export const isCreator = (req, res, next) => {
    if (!req.user || (req.user.role !== 'creator' && req.user.role !== 'admin')) {
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
