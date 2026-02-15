import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth, authReady } from '../config/firebase';
import { authAPI } from '../api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const queryClient = useQueryClient();

    // Sync user with backend database
    const syncUserWithBackend = useCallback(async (firebaseUser, additionalData = {}) => {
        try {
            const userData = {
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                photo: firebaseUser.photoURL || '',
                firebaseUid: firebaseUser.uid,
                ...additionalData,
            };

            const response = await authAPI.syncUser(userData);
            const { user: backendUser } = response.data;

            localStorage.setItem('user', JSON.stringify(backendUser));
            setDbUser(backendUser);

            return backendUser;
        } catch (error) {
            console.error('Failed to sync user:', error);
            throw error;
        }
    }, []);

    // Register with email and password
    const register = async (name, email, password, photo = '', additionalData = {}) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update Firebase profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photo,
            });

            // Sync with backend including creator request if applicable
            const backendUser = await syncUserWithBackend(
                { ...result.user, displayName: name, photoURL: photo },
                additionalData
            );

            // Show appropriate message
            if (additionalData.creatorRequest) {
                toast.success('Account created! Creator request sent for admin approval.');
            } else {
                toast.success('Account created successfully!');
            }

            return backendUser;
        } catch (error) {
            console.error('Registration error:', error);
            let message = 'Registration failed';
            if (error.code === 'auth/email-already-in-use') {
                message = 'Email already in use';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password is too weak';
            }
            toast.error(message);
            throw error;
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserWithBackend(result.user);
            toast.success('Welcome back!');
            return result.user;
        } catch (error) {
            console.error('Login error:', error);
            let message = 'Login failed';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = 'Invalid email or password';
            }
            toast.error(message);
            throw error;
        }
    };

    // Login with Google
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await syncUserWithBackend(result.user);
            toast.success('Welcome!');
            return result.user;
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Google sign-in failed');
            throw error;
        }
    };

    // Logout - clear everything properly
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user');
            setDbUser(null);
            setUser(null);
            // Clear all cached queries
            queryClient.clear();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
            throw error;
        }
    };

    // Refresh user data from backend - always fetch fresh data
    const refreshUser = useCallback(async () => {
        try {
            const response = await authAPI.getMe();
            const freshUser = response.data;
            setDbUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
            return freshUser;
        } catch (error) {
            console.error('Refresh user error:', error);
            // If refresh fails, clear local data
            localStorage.removeItem('user');
            setDbUser(null);
            throw error;
        }
    }, []);

    // Request to become a creator
    const requestCreatorRole = async () => {
        try {
            const response = await authAPI.requestCreator();
            const updatedUser = response.data.user;
            setDbUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('Creator request submitted! Please wait for admin approval.');
            return updatedUser;
        } catch (error) {
            console.error('Creator request error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit creator request');
            throw error;
        }
    };

    // Listen for auth state changes with improved persistence
    useEffect(() => {
        let isMounted = true;
        let unsubscribeAuth = null;
        
        // Wait for auth to be ready before setting up listener
        authReady.then(() => {
            if (!isMounted) return;
            
            unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
                if (!isMounted) return;
                
                setUser(firebaseUser);

                if (firebaseUser) {
                    try {
                        // Small delay to ensure token is ready for API calls
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        // Fetch fresh user data from backend
                        await refreshUser();
                    } catch (error) {
                        console.error('Failed to refresh user on auth change:', error);
                        // Fallback to stored user if available
                        const storedUser = localStorage.getItem('user');
                        if (storedUser && isMounted) {
                            setDbUser(JSON.parse(storedUser));
                        }
                    }
                } else {
                    if (isMounted) {
                        setDbUser(null);
                        localStorage.removeItem('user');
                    }
                }

                setLoading(false);
                setAuthChecked(true);
            });
        });

        return () => {
            isMounted = false;
            if (unsubscribeAuth) {
                unsubscribeAuth();
            }
        };
    }, [refreshUser]);

    const value = {
        user,
        dbUser,
        loading,
        authChecked,
        register,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        requestCreatorRole,
        // Role helpers - derived from database user
        isAdmin: dbUser?.role === 'admin',
        isCreator: dbUser?.role === 'creator' || dbUser?.role === 'admin',
        isUser: dbUser?.role === 'user',
        role: dbUser?.role || null,
        creatorStatus: dbUser?.creatorStatus || 'none',
        isAuthenticated: !!user && !!dbUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
