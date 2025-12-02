// TODO (MMP): Import signInWithPopup and GoogleAuthProvider for Google sign-in

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	updateEmail,
	sendEmailVerification,
	// sendPasswordResetEmail,
	reauthenticateWithCredential,
	EmailAuthProvider,
	deleteUser,
} from 'firebase/auth';
import {
	doc,
	setDoc,
	serverTimestamp,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore';
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

		// 4. Send verification email
		await sendEmailVerification(user);

		await user.reload();
		return auth.currentUser;
	} catch (error) {
		console.error('Registration error:', error);
		throw error;
	}
};

// Login
export const loginEmailPassword = async (email, password) => {
	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		return user;
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

// Update username
export const updateUsername = async (newUsername) => {
	try {
		const user = auth.currentUser;

		// 1. Update auth
		await updateProfile(user, { displayName: newUsername });

		// 2. Update database
		const userRef = doc(db, 'users', user.uid);
		await updateDoc(userRef, {
			displayName: newUsername,
			updatedAt: serverTimestamp(),
		});

		// 3. Force reload and token refresh to get updated data
		await user.reload();
		await user.getIdToken(true);

		return auth.currentUser;
	} catch (error) {
		console.error('Error updating username:', error);
		throw error;
	}
};

// Change email
export const changeEmail = async (newEmail, password) => {
	try {
		const user = auth.currentUser;

		// 1. Reauthenticate (required for sensitive operations)
		const credential = EmailAuthProvider.credential(user.email, password);
		await reauthenticateWithCredential(user, credential);

		// 2. Update auth
		await updateEmail(user, newEmail);

		// 3. Update database
		const userRef = doc(db, 'users', user.uid);
		await updateDoc(userRef, {
			email: newEmail,
			updatedAt: serverTimestamp(),
		});

		// 4. Send verification to new email
		await sendEmailVerification(user);

		// 5. Force reload and token refresh to get updated data
		await user.reload();
		await user.getIdToken(true);

		return auth.currentUser;
	} catch (error) {
		console.error('Error updating email:', error);
		throw error;
	}
};

// Send verification again
export const resendVerification = async () => {
	try {
		await sendEmailVerification(auth.currentUser);
	} catch (error) {
		console.error('Error sending verification email:', error);
		throw error;
	}
};

// TODO: Password reset
// export const resetPassword = async (email) => {
// 	try {
// 		await sendPasswordResetEmail(auth, email);
// 	} catch (error) {
// 		console.error('Error sending password reset email:', error);
// 		throw error;
// 	}
// };

// Delete account
export const deleteAccount = async () => {
	try {
		const user = auth.currentUser;
		await deleteDoc(doc(db, 'users', user.uid));
		await deleteUser(auth.currentUser);
	} catch (error) {
		console.error('Error deleting account:', error);
		throw error;
	}
};
