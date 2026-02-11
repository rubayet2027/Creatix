// API Constants

// =====================================================
// HARDCODED ADMIN CREDENTIALS
// This is the ONLY admin account allowed in the system
// Email: admin@creatix.com
// Password: Admin@123456
// =====================================================
export const ADMIN_EMAIL = 'admin@creatix.com';

export const CONTEST_TYPES = [
    'Image Design',
    'Article Writing',
    'Marketing Strategy',
    'Digital Advertisement',
    'Gaming Review',
    'Book Review',
    'Business Idea',
    'Movie Review'
];

export const CONTEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const USER_ROLES = {
    USER: 'user',
    CREATOR: 'creator',
    ADMIN: 'admin'
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

export const SORT_OPTIONS = {
    CREATED_AT_DESC: { createdAt: -1 },
    CREATED_AT_ASC: { createdAt: 1 },
    DEADLINE_DESC: { deadline: -1 },
    DEADLINE_ASC: { deadline: 1 },
    PRICE_DESC: { price: -1 },
    PRICE_ASC: { price: 1 },
    PRIZE_DESC: { prizeMoney: -1 },
    PRIZE_ASC: { prizeMoney: 1 }
};

export const RESPONSE_MESSAGES = {
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Permission denied',
    BAD_REQUEST: 'Invalid request',
    INTERNAL_ERROR: 'Internal server error'
};

export default {
    CONTEST_TYPES,
    CONTEST_STATUS,
    USER_ROLES,
    PAGINATION,
    SORT_OPTIONS,
    RESPONSE_MESSAGES
};
