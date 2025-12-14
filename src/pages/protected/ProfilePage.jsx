import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { collectionService } from '../../services/firebase/collectionService';
import { gameService } from '../../services/firebase/gameService';
import { journalService } from '../../services/firebase/journalService';
import { logout } from '../../services/firebase/authService';
import { Stats } from '../../components/profile/Stats';

export const ProfilePage = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [stats, setStats] = useState({
		favoriteGenres: [],
		totalHoursThisYear: 0,
		journalEntries: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserStats = async () => {
			if (!user) return;
			try {
				setLoading(true);

				// Fetch collections
				const collections = await collectionService.getUserCollections(
					user.uid
				);

				let totalJournalEntries = 0;
				let totalHoursThisYear = 0;
				const genreCount = {};
				const currentYear = new Date().getFullYear();

				for (const collection of collections) {
					const games = await gameService.getGamesInCollection(collection.id);

					for (const game of games) {
						// Count hours played this year
						if (game.hoursPlayed && game.startDate) {
							const startYear = new Date(game.startDate).getFullYear();
							if (startYear === currentYear) {
								totalHoursThisYear += game.hoursPlayed;
							}
						}

						// Count genres
						if (game.genre && game.genre.length > 0) {
							game.genre.forEach((genre) => {
								genreCount[genre] = (genreCount[genre] || 0) + 1;
							});
						}

						// Count journal entries for each game
						const entries = await journalService.getEntries(
							collection.id,
							game.id
						);
						totalJournalEntries += entries.length;
					}
				}

				// Get top 3 favorite genres
				const favoriteGenres = Object.entries(genreCount)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 3)
					.map(([genre]) => genre);

				setStats({
					favoriteGenres,
					totalHoursThisYear,
					journalEntries: totalJournalEntries,
				});
			} catch (error) {
				console.error('Error fetching user stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserStats();
	}, [user]);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/');
		} catch (error) {
			console.error('Error logging out:', error);
			alert('Failed to logout');
		}
	};

	const getInitials = (name) => {
		if (!name) return ':)';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-500">Loading profile...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* Profile card */}
				<div className="bg-white rounded-xl shadow-sm p-8 mb-6">
					<header className="flex flex-col items-center mb-8">
						{/* Avatar and info */}
						<div
							className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mb-4"
							aria-hidden="true">
							<span className="text-3xl font-semibold text-teal-600">
								{getInitials(user.displayName)}
							</span>
						</div>
						<h1 className="text-xl font-semibold text-gray-900 mb-1">
							{user.displayName}
						</h1>
						<p className="text-gray-600 mb-2">{user.email}</p>
						<p className="text-sm text-gray-500">
							Member since {formatDate(user.metadata?.creationTime)}
						</p>
					</header>

					{/* Stats */}
					<Stats
						loading={loading}
						stats={stats}
						role="region"
						aria-label="User statistics"
					/>
				</div>

				{/* Links */}
				<nav
					className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
					aria-label="Quick navigation">
					<Link
						to={'/collections'}
						className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left">
						<span className="mb-2" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
								/>
							</svg>
						</span>
						<h2 className="text-lg font-semibold text-gray-900 mb-1">
							My Collections
						</h2>
						<p className="text-sm text-gray-600">
							View and manage your game collections
						</p>
					</Link>

					<Link
						to={'/browse'}
						className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left">
						<span className=" mb-2" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</span>
						<h2 className="text-lg font-semibold text-gray-900 mb-1">
							Browse Games
						</h2>
						<p className="text-sm text-gray-600">
							Discover new games to add to your collection
						</p>
					</Link>
				</nav>

				{/* Actions */}
				<section>
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Account Actions
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<Link
							to={'/settings'}
							className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-900 transition">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Settings
						</Link>
						<button
							onClick={handleLogout}
							className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition">
							Logout
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
						</button>
					</div>
				</section>
			</main>
		</div>
	);
};
