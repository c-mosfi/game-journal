import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';
import { gameService } from '../../services/firebase/gameService';

export const CollectionDetailPage = () => {
	const { collectionId } = useParams();
	const navigate = useNavigate();
	const [collection, setCollection] = useState(null);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchCollectionData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionId]);

	const fetchCollectionData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch collection details
			const collectionRef = doc(db, 'collections', collectionId);
			const collectionSnap = await getDoc(collectionRef);

			if (!collectionSnap.exists()) {
				setError('Collection not found');
				setLoading(false);
				return;
			}

			setCollection({
				id: collectionSnap.id,
				...collectionSnap.data(),
			});

			// Fetch games in this collection
			const gamesData = await gameService.getGamesInCollection(collectionId);
			setGames(gamesData);
		} catch (err) {
			console.error('Error fetching collection:', err);
			setError('Failed to load collection');
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveGame = async (gameId) => {
		if (!window.confirm('Remove this game from the collection?')) {
			return;
		}

		try {
			await gameService.removeGameFromCollection(collectionId, gameId);
			await fetchCollectionData();
		} catch (err) {
			console.error('Error removing game:', err);
			setError('Failed to remove game');
		}
	};

	const formatDate = (timestamp) => {
		if (!timestamp) return 'Just now';
		const date = timestamp.toDate();
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
					<div className="text-center py-12">
						<div className="text-gray-500">Loading collection...</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !collection) {
		return (
			<div className="min-h-screen bg-gray-100">
				<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
						{error || 'Collection not found'}
					</div>
					<button
						onClick={() => navigate('/collections')}
						className="mt-4 text-teal-600 hover:text-teal-700 font-medium">
						← Back to Collections
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="mb-6">
					<button
						onClick={() => navigate('/collections')}
						className="text-teal-600 hover:text-teal-700 font-medium mb-4 inline-flex items-center">
						← Back to Collections
					</button>

					<div className="flex flex-col gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 wrap-anywhere">
								{collection.name}
							</h1>
							{collection.description && (
								<p className="text-gray-600 wrap-anywhere">
									{collection.description}
								</p>
							)}
							<p className="text-sm text-gray-400 mt-2">
								Created {formatDate(collection.createdAt)}
							</p>
						</div>
					</div>
				</div>

				{/* List of games*/}
				{games.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm p-12 text-center">
						<div className="text-gray-400 mb-4">
							<p className="text-lg font-medium">
								No games in this collection yet
							</p>
							<p className="text-sm mt-2 mb-6">
								Browse games and add them to this collection
							</p>
							<Link
								to="/browse"
								className="inline-block px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition">
								Browse Games
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
						{games.map((game) => (
							<div
								key={game.id}
								className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
								{game.coverUrl && (
									<div
										className="h-48 bg-cover bg-center w-full"
										style={{ backgroundImage: `url(${game.coverUrl})` }}
									/>
								)}

								<div className="p-4 flex flex-col flex-1">
									<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 wrap-break-words">
										{game.title}
									</h3>

									{/* Badge */}
									<div className="mb-3">
										<span
											className={`inline-block px-2 py-1 text-xs font-medium rounded ${
												game.status === 'Completed'
													? 'bg-green-100 text-green-700'
													: game.status === 'Playing'
													? 'bg-blue-100 text-blue-700'
													: game.status === 'Paused'
													? 'bg-yellow-100 text-yellow-700'
													: game.status === 'Dropped'
													? 'bg-red-100 text-red-700'
													: 'bg-gray-100 text-gray-700'
											}`}>
											{game.status}
										</span>
									</div>

									{/* Rating */}
									{game.personalRating && (
										<div className="flex items-center gap-1 mb-3">
											{[...Array(5)].map((_, i) => (
												<span
													key={i}
													className={`text-sm ${
														i < game.personalRating
															? 'text-yellow-400'
															: 'text-gray-300'
													}`}>
													★
												</span>
											))}
										</div>
									)}

									{/* Genres */}
									{game.genre && game.genre.length > 0 && (
										<p className="text-xs text-gray-500 mb-3 line-clamp-1">
											{game.genre.join(', ')}
										</p>
									)}

									{/* Actions */}
									<div className="flex flex-wrap gap-2 mt-auto">
										<button
											onClick={() => handleRemoveGame(game.id)}
											className="flex-1 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition">
											Remove
										</button>

										<Link
											to={`/collections/${collectionId}/games/${game.id}`}
											className="flex-1 px-3 py-1.5 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition text-center">
											Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Stats */}
				<div className="flex flex-wrap items-center gap-4 mt-6 bg-white rounded-xl shadow-sm p-4">
					<div className="text-sm text-gray-600 mr-auto">
						<span className=" font-medium text-gray-900">{games.length}</span>{' '}
						{games.length === 1 ? 'game' : 'games'} in this collection
					</div>
					<Link
						to="/browse"
						className="px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition text-center">
						Add Game
					</Link>
				</div>
			</div>
		</div>
	);
};
