import { auth } from '../config/firebase.js';
import User from '../models/User.js';
import { ADMIN_EMAIL } from '../utils/constants.js';

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
            // Determine if this is the hardcoded admin
            const isHardcodedAdmin = decodedToken.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            
            // Auto-create user if doesn't exist
            user = await User.create({
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email?.split('@')[0],
                photo: decodedToken.picture || '',
                firebaseUid: decodedToken.uid,
                // Only grant admin role to the hardcoded admin email
                role: isHardcodedAdmin ? 'admin' : 'user',
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
// ADMIN ACCESS: Only the hardcoded admin email (admin@creatix.com) can access admin routes
export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // SPECIAL CHECK: If admin role is required, verify it's the hardcoded admin
        if (allowedRoles.includes('admin')) {
            const isHardcodedAdmin = req.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            
            // If user claims to be admin but isn't the hardcoded admin, deny access
            if (req.user.role === 'admin' && !isHardcodedAdmin) {
                // Demote this user - they shouldn't be admin
                return res.status(403).json({ 
                    message: 'Access denied. You are not the system administrator.',
                });
            }
            
            // If hardcoded admin, allow access
            if (isHardcodedAdmin && req.user.role === 'admin') {
                return next();
            }
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

// Check if user is admin - ONLY allows hardcoded admin email
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    const isHardcodedAdmin = req.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    
    if (req.user.role !== 'admin' || !isHardcodedAdmin) {
        return res.status(403).json({ 
            message: 'Admin access required. Only the system administrator can access this.',
        });
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
