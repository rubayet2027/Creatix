import axios from 'axios';
import { auth, authReady } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if initial auth check is complete
let initialAuthComplete = false;

// Wait for initial auth to be ready
authReady.then(() => {
    initialAuthComplete = true;
    console.log('Auth ready, user:', auth.currentUser?.email || 'none');
});

// Helper to get a valid token with retries
const getValidToken = async (user, forceRefresh = false) => {
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
        try {
            const token = await user.getIdToken(forceRefresh || retries > 0);
            return token;
        } catch (error) {
            retries++;
            console.error(`Token fetch attempt ${retries} failed:`, error.message);
            if (retries >= maxRetries) throw error;
            // Wait with exponential backoff
            await new Promise(r => setTimeout(r, 300 * retries));
        }
    }
};

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
    async (config) => {
        // Wait for initial auth check to complete
        if (!initialAuthComplete) {
            await authReady;
        }
        
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            try {
                // Always try to get a fresh token for authenticated requests
                const token = await getValidToken(currentUser, true);
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Token attached for:', config.url);
            } catch (error) {
                console.error('Error getting Firebase token:', error);
            }
        } else {
            console.log('No current user for request:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Try to refresh the token
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    // Force refresh the token
                    const newToken = await getValidToken(currentUser, true);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }
            
            // If all fails, clear local storage
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;
