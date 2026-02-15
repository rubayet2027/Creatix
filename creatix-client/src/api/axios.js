import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to wait for Firebase auth to be ready
const waitForAuth = () => {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
    async (config) => {
        // Wait for auth to be ready if currentUser is null but we're still initializing
        let currentUser = auth.currentUser;
        
        if (!currentUser) {
            // Wait a bit for auth to initialize
            currentUser = await waitForAuth();
        }
        
        if (currentUser) {
            try {
                // Get fresh Firebase ID token
                const token = await currentUser.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error getting Firebase token:', error);
                // Try without force refresh as fallback
                try {
                    const token = await currentUser.getIdToken(false);
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (fallbackError) {
                    console.error('Fallback token fetch failed:', fallbackError);
                }
            }
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
            
            // Try to refresh the token and retry
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const newToken = await currentUser.getIdToken(true);
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
