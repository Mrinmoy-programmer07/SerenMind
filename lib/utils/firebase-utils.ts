import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export async function ensureUserDocument(userId: string) {
    try {
        if (!db) {
            throw new Error('Firebase is not initialized');
        }

        if (!auth?.currentUser) {
            throw new Error('No authenticated user');
        }

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.log('Creating user document for:', userId);
            await setDoc(userRef, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                email: auth.currentUser.email,
                displayName: auth.currentUser.displayName,
                lastActive: serverTimestamp()
            });
            console.log('User document created successfully');
        } else {
            // Update lastActive timestamp
            await setDoc(userRef, {
                lastActive: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error ensuring user document:', error);
        throw error;
    }
} 