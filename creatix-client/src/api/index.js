import api from './axios';

// Auth API
export const authAPI = {
    syncUser: (userData) => api.post('/auth/sync', userData),
    getMe: () => api.get('/auth/me'),
    requestCreator: () => api.post('/auth/request-creator'),
};

// Users API
export const usersAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    getLeaderboard: () => api.get('/users/leaderboard'),
    update: (id, data) => api.patch(`/users/${id}`, data),
    updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
    approveCreator: (id) => api.patch(`/users/${id}/approve-creator`),
    rejectCreator: (id) => api.patch(`/users/${id}/reject-creator`),
    getPendingCreatorRequests: () => api.get('/users/creator-requests/pending'),
    delete: (id) => api.delete(`/users/${id}`),
    ban: (id) => api.patch(`/users/${id}/ban`),
    unban: (id) => api.patch(`/users/${id}/unban`),
};

// Contests API
export const contestsAPI = {
    getAll: (params) => api.get('/contests', { params }),
    getByTimeline: () => api.get('/contests/by-timeline'),
    getPopular: (limit = 6) => api.get('/contests/popular', { params: { limit } }),
    getById: (id) => api.get(`/contests/${id}`),
    getLeaderboard: (id, params) => api.get(`/contests/${id}/leaderboard`, { params }),
    getMyContests: () => api.get('/contests/my-contests'),
    getAdminAll: (params) => api.get('/contests/admin/all', { params }),
    create: (data) => api.post('/contests', data),
    update: (id, data) => api.patch(`/contests/${id}`, data),
    updateStatus: (id, status) => api.patch(`/contests/${id}/status`, { status }),
    delete: (id) => api.delete(`/contests/${id}`),
};

// Submissions API
export const submissionsAPI = {
    submit: (data) => api.post('/submissions', data),
    getByContest: (contestId) => api.get(`/submissions/contest/${contestId}`),
    getMySubmissions: () => api.get('/submissions/my-submissions'),
    declareWinner: (id) => api.post(`/submissions/${id}/declare-winner`),
};

// Payments API
export const paymentsAPI = {
    createIntent: (contestId) => api.post('/payments/create-intent', { contestId }),
    confirm: (data) => api.post('/payments/confirm', data),
    getMyPayments: () => api.get('/payments/my-payments'),
    getParticipated: () => api.get('/payments/participated'),
    getWinnings: () => api.get('/payments/winnings'),
    withdraw: (amount, method, accountDetails) => api.post('/payments/withdraw', { amount, method, accountDetails }),
};

// Leaderboard API
export const leaderboardAPI = {
    getAll: (params) => api.get('/leaderboard', { params }),
    getTop: (limit = 10) => api.get('/leaderboard/top', { params: { limit } }),
    getUserRank: (userId) => api.get(`/leaderboard/rank/${userId}`),
};

// Stats API
export const statsAPI = {
    getPlatform: () => api.get('/stats/platform'),
    getRecentWinners: (limit = 10) => api.get('/stats/winners/recent', { params: { limit } }),
    getAdmin: () => api.get('/stats/admin'),
};

export default api;
