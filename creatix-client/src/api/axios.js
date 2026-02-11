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

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
    async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                // Get fresh Firebase ID token
                const token = await currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error getting Firebase token:', error);
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
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('user');
            // Firebase will handle the logout via onAuthStateChanged
        }
        return Promise.reject(error);
    }
);

export default api;
