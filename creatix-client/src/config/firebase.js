import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import firebaseConfig from './firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export a promise that resolves when auth is fully ready (persistence set + initial state resolved)
export const authReady = new Promise((resolve) => {
    // First, ensure persistence is set
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            console.log('Firebase persistence set to LOCAL');
        })
        .catch((error) => {
            console.error('Error setting auth persistence:', error);
        })
        .finally(() => {
            // After persistence is configured, wait for auth state
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                console.log('Firebase auth ready, user:', user?.email || 'none');
                resolve(user);
            });
        });
});

export { auth };
export default app;
