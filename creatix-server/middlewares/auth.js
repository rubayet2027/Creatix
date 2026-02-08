import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
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
