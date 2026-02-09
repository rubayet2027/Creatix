// Environment configuration with validation

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
];

const optionalEnvVars = {
    PORT: 5000,
    NODE_ENV: 'development',
    CLIENT_URL: 'http://localhost:5173',
    STRIPE_SECRET_KEY: '',
};

// Validate required environment variables
export const validateEnv = () => {
    const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (missing.length > 0) {
        console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
    }
};

// Get environment configuration
export const config = {
    // Server
    port: parseInt(process.env.PORT) || optionalEnvVars.PORT,
    nodeEnv: process.env.NODE_ENV || optionalEnvVars.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',

    // Database
    mongoUri: process.env.MONGODB_URI,

    // Authentication
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Client
    clientUrl: process.env.CLIENT_URL || optionalEnvVars.CLIENT_URL,

    // Stripe
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || optionalEnvVars.STRIPE_SECRET_KEY,

    // CORS
    corsOrigins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : [optionalEnvVars.CLIENT_URL],
};

export default config;
