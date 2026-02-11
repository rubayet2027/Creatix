import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lazy initialization for serverless compatibility
let firebaseApp = null;
let authInstance = null;

const initializeFirebase = () => {
    if (firebaseApp) {
        return firebaseApp;
    }
    
    try {
        let serviceAccount;

        // Check if running in production with base64 encoded credentials
        if (process.env.FIREBASE_ADMIN_SDK_BASE64) {
            console.log('🔧 Loading Firebase Admin SDK from environment variable');
            const decoded = Buffer.from(process.env.FIREBASE_ADMIN_SDK_BASE64, 'base64').toString();
            serviceAccount = JSON.parse(decoded);
        } else {
            // Local development - read from file
            console.log('🔧 Loading Firebase Admin SDK from file');
            const serviceAccountPath = join(__dirname, '..', 'firebase-admin-sdk.json');
            serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        }

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
        return firebaseApp;
    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization failed:', error.message);
        throw error;
    }
};

// Getter for auth that ensures Firebase is initialized
export const getAuth = () => {
    if (!authInstance) {
        initializeFirebase();
        authInstance = admin.auth();
    }
    return authInstance;
};

// Legacy export for compatibility
export const auth = {
    verifyIdToken: async (token) => {
        const firebaseAuth = getAuth();
        return firebaseAuth.verifyIdToken(token);
    }
};

export default { initializeFirebase, getAuth };
