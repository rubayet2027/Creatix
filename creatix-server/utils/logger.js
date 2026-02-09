// Simple logger utility with colored console output

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const getTimestamp = () => {
    return new Date().toISOString();
};

export const logger = {
    info: (message, ...args) => {
        console.log(`${colors.blue}[INFO]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
    },

    success: (message, ...args) => {
        console.log(`${colors.green}[SUCCESS]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
    },

    warn: (message, ...args) => {
        console.log(`${colors.yellow}[WARN]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
    },

    error: (message, ...args) => {
        console.error(`${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
    },

    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.magenta}[DEBUG]${colors.reset} ${getTimestamp()} - ${message}`, ...args);
        }
    },

    request: (req) => {
        console.log(
            `${colors.cyan}[REQUEST]${colors.reset} ${getTimestamp()} - ${req.method} ${req.originalUrl}`
        );
    },
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? colors.red : colors.green;
        console.log(
            `${colors.cyan}[${req.method}]${colors.reset} ${req.originalUrl} - ${statusColor}${res.statusCode}${colors.reset} ${duration}ms`
        );
    });

    next();
};

export default logger;
