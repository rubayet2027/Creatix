import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI } from '../api';
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

    // Get JWT token from backend
    const getJwtToken = async (firebaseUser) => {
        try {
            const userData = {
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                photo: firebaseUser.photoURL || '',
                firebaseUid: firebaseUser.uid,
            };

            const response = await authAPI.getToken(userData);
            const { token, user: backendUser } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(backendUser));
            setDbUser(backendUser);

            return backendUser;
        } catch (error) {
            console.error('Failed to get JWT token:', error);
            throw error;
        }
    };

    // Register with email and password
    const register = async (name, email, password, photo = '') => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update Firebase profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photo,
            });

            // Get JWT token
            await getJwtToken({ ...result.user, displayName: name, photoURL: photo });

            toast.success('Account created successfully!');
            return result.user;
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
            await getJwtToken(result.user);
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
            await getJwtToken(result.user);
            toast.success('Welcome!');
            return result.user;
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Google sign-in failed');
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setDbUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
            throw error;
        }
    };

    // Refresh user data from backend
    const refreshUser = async () => {
        try {
            const response = await authAPI.getMe();
            setDbUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Refresh user error:', error);
            throw error;
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Check if we have a token in localStorage
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    setDbUser(JSON.parse(storedUser));
                } else {
                    // Get new token
                    try {
                        await getJwtToken(firebaseUser);
                    } catch (error) {
                        console.error('Failed to refresh token:', error);
                    }
                }
            } else {
                setDbUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        dbUser,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        isAdmin: dbUser?.role === 'admin',
        isCreator: dbUser?.role === 'creator' || dbUser?.role === 'admin',
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
