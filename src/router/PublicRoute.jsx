import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = () => {
	const { isAuthenticated, loading } = useAuth();
	if (loading) return <div>Loading...</div>;

	return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
