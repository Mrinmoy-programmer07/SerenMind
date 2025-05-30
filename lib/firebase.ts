import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log config (without sensitive values)
console.log('Firebase Config Status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  hasMeasurementId: !!firebaseConfig.measurementId,
});

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('Missing required Firebase configuration fields:', missingFields);
    return false;
  }
  
  return true;
};

// Initialize Firebase only if it hasn't been initialized already and config is valid
let app;
let db;
let auth: Auth | null;
let provider;

try {
  if (!validateFirebaseConfig()) {
    throw new Error('Invalid Firebase configuration');
  }

  console.log('Initializing Firebase...');
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase app initialized:', app.name);
  
  db = getFirestore(app);
  console.log('Firestore initialized');
  
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  
  provider = new GoogleAuthProvider();
  console.log('Google Auth Provider initialized');

  // Set persistence (so user stays logged in even after refresh)
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Firebase Auth Persistence Error:", error);
  });

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Initialize with empty objects to prevent undefined errors
  app = null;
  db = null;
  auth = null;
  provider = null;
}

export { db, auth, provider };
