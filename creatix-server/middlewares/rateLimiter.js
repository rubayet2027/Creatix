// Simple in-memory rate limiter middleware

const rateLimitStore = new Map();

// Clean up old entries periodically (every 60 seconds)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now - value.windowStart > 60000) {
            rateLimitStore.delete(key);
        }
    }
}, 60000);

export const createRateLimiter = (options = {}) => {
    const {
        windowMs = 60000,        // 1 minute window
        maxRequests = 100,       // Max requests per window
        message = 'Too many requests, please try again later',
        keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
    } = options;

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();

        let record = rateLimitStore.get(key);

        if (!record || now - record.windowStart > windowMs) {
            // Start new window
            record = {
                windowStart: now,
                count: 1,
            };
            rateLimitStore.set(key, record);
        } else {
            record.count++;
        }

        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
        res.setHeader('X-RateLimit-Reset', new Date(record.windowStart + windowMs).toISOString());

        if (record.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((record.windowStart + windowMs - now) / 1000),
            });
        }

        next();
    };
};

// Pre-configured rate limiters
export const apiRateLimiter = createRateLimiter({
    windowMs: 60000,
    maxRequests: 100,
    message: 'Too many API requests',
});

export const authRateLimiter = createRateLimiter({
    windowMs: 300000,    // 5 minutes
    maxRequests: 10,
    message: 'Too many authentication attempts',
});

export const paymentRateLimiter = createRateLimiter({
    windowMs: 60000,
    maxRequests: 5,
    message: 'Too many payment requests',
});

export default {
    createRateLimiter,
    apiRateLimiter,
    authRateLimiter,
    paymentRateLimiter,
};
