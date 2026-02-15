import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createRateLimiter } from './middlewares/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contestRoutes from './routes/contests.js';
import submissionRoutes from './routes/submissions.js';
import paymentRoutes from './routes/payments.js';
import participationRoutes from './routes/participations.js';
import leaderboardRoutes from './routes/leaderboard.js';
import statsRoutes from './routes/stats.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB on first request (serverless compatible)
let dbConnected = false;
app.use(async (req, res, next) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            return res.status(500).json({ message: 'Database connection failed', error: error.message });
        }
    }
    next();
});

// Security middleware - set security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Rate limiting - 100 requests per minute per IP
const apiLimiter = createRateLimiter({
    windowMs: 60000,
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again after a minute',
});

// CORS configuration - allow multiple origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://creatix-cdeb7.web.app',
    'https://creatix-cdeb7.firebaseapp.com',
    process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Allow all origins in production for now
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS requests explicitly
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

app.use(express.json());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/participations', participationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Creatix API is running' });
});

// Debug Firebase Admin SDK initialization
app.get('/api/debug/firebase', async (req, res) => {
    try {
        const { getAuth } = await import('./config/firebase.js');
        const auth = getAuth();
        res.json({ 
            status: 'ok', 
            message: 'Firebase Admin SDK initialized',
            hasAuth: !!auth,
            hasVerifyIdToken: typeof auth?.verifyIdToken === 'function'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            stack: error.stack
        });
    }
});

// Debug token verification
app.post('/api/debug/verify-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        const { auth } = await import('./config/firebase.js');
        
        console.log('Attempting to verify token...');
        const decoded = await auth.verifyIdToken(token);
        console.log('Token verified for:', decoded.email);
        
        res.json({ 
            status: 'ok',
            email: decoded.email,
            uid: decoded.uid,
            iat: decoded.iat,
            exp: decoded.exp
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ 
            status: 'error', 
            code: error.code,
            message: error.message 
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Creatix API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            contests: '/api/contests',
            submissions: '/api/submissions',
            payments: '/api/payments',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Only listen in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 API available at http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
