import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../pages/public/LandingPage';
import { ErrorPage } from '../pages/public/ErrorPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { BrowsePage } from '../pages/public/BrowsePage';
import { HomePage } from '../pages/protected/HomePage';
import { CollectionsPage } from '../pages/protected/CollectionsPage';
import { ProfilePage } from '../pages/protected/ProfilePage';
import { SettingsPage } from '../pages/protected/SettingsPage';

export const routes = [
	// TODO: add paths to the rest of the pages
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{ path: 'browse', element: <BrowsePage /> },
			{
				element: <PublicRoute />,
				children: [
					{ index: true, element: <LandingPage /> },
					{ path: 'login', element: <LoginPage /> },
					{ path: 'register', element: <RegisterPage /> },
				],
			},
			{
				element: <ProtectedRoute />,
				children: [
					{ path: 'home', element: <HomePage /> },
					{ path: 'collections', element: <CollectionsPage /> },
					{ path: 'profile', element: <ProfilePage /> },
					{ path: 'settings', element: <SettingsPage /> },
				],
			},
		],
	},
];
