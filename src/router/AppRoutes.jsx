import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../pages/public/LandingPage';
import { ErrorPage } from '../pages/public/ErrorPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProfilePage } from '../pages/protected/ProfilePage';
import { SettingsPage } from '../pages/protected/SettingsPage';
import { BrowsePage } from '../pages/public/BrowsePage';
import { GameDetailPage } from '../pages/public/GameDetailPage';
import { CollectionsPage } from '../pages/protected/CollectionsPage';
import { CollectionDetailPage } from '../pages/protected/CollectionDetailPage';
import { ProfilePage } from '../pages/protected/ProfilePage';
import { SettingsPage } from '../pages/protected/SettingsPage';

export const routes = [
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			// Available for both auth and non-auth users
			{ index: true, element: <LandingPage /> },
			{ path: 'browse', element: <BrowsePage /> },
			{ path: 'games/:gameId', element: <GameDetailPage /> },
			// Only for non-auth 
			{
				element: <PublicRoute />,
				children: [
					{ path: 'login', element: <LoginPage /> },
					{ path: 'register', element: <RegisterPage /> },
				],
			},
			// Auth only
			{
				element: <ProtectedRoute />,
				children: [
					{ path: 'profile', element: <ProfilePage /> },
					{ path: 'settings', element: <SettingsPage /> },
					{ path: 'collections', element: <CollectionsPage /> },
					{
						path: 'collections/:collectionId',
						element: <CollectionDetailPage />,
					},
				],
			},
		],
	},
];
