// TODO (MMP): Import signInWithPopup and GoogleAuthProvider for Google sign-in

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	deleteUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig.js';

// Register
export const registerEmailPassword = async (email, password, displayName) => {
	try {
		// 1. Create account
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// 2. Update profile
		await updateProfile(user, { displayName });

		// 3. Create user document in Firestore (db)
		await setDoc(doc(db, 'users', user.uid), {
			email: user.email,
			displayName,
			createdAt: serverTimestamp(),
		});
		return user;
	} catch (error) {
		console.error('Registration error:', error);
		throw error;
	}
};

// Login
export const loginEmailPassword = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log(userCredential.user);
		return userCredential.user;
	} catch (error) {
		console.error('Login error:', error);
		throw error;
	}
};

// Logout
export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
};

// Get current user (synchronous)
export const getCurrentUser = () => {
	return auth.currentUser;
};
// TODO: Test these methods when the SettingPage is done
// Password reset
export const resetPassword = async (email) => {
	await sendPasswordResetEmail(auth, email);
};

// Update user profile
export const updateUserProfile = async (updates) => {
	await updateProfile(auth.currentUser, updates);
};

// Delete account
export const deleteAccount = async () => {
	await deleteUser(auth.currentUser);
};
