import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../pages/public/LandingPage';
import { ErrorPage } from '../pages/public/ErrorPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { BrowsePage } from '../pages/public/BrowsePage';
import { GameDetailPage } from '../pages/public/GameDetailPage';
import { HomePage } from '../pages/protected/HomePage';
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
					{ path: 'profile', element: <ProfilePage /> },
					{ path: 'settings', element: <SettingsPage /> },
					{ path: 'collections', element: <CollectionsPage /> },
					{
						path: 'collections/:collectionId',
						element: <CollectionDetailPage />,
					},
				],
			},
			// Available for both auth and non-auth users
			{ path: 'browse', element: <BrowsePage /> },
			{ path: 'games/:gameId', element: <GameDetailPage /> },
		],
	},
];
