import { createContext, useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(); // [user, loading, isAuthenticated]

// Provider component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// check for changes on auth states
		const unsubscribe = onIdTokenChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = {
		user,
		loading,
		isAuthenticated: !!user, // true if user exists
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
