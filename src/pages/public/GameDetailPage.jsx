import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getGameDetails } from '../../services/api/rawgAPI';
import { collectionService } from '../../services/firebase/collectionService';
import { gameService } from '../../services/firebase/gameService';

export const GameDetailPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuth();
	const { gameId } = useParams();
	const [game, setGame] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Collection modal state
	const [showCollectionModal, setShowCollectionModal] = useState(false);
	const [collections, setCollections] = useState([]);
	const [loadingCollections, setLoadingCollections] = useState(false);
	const [addingToCollection, setAddingToCollection] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		const fetchGameDetails = async () => {
			try {
				setLoading(true);
				const data = await getGameDetails(gameId);
				setGame(data);
			} catch (error) {
				setError('Failed to load game details');
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchGameDetails();
	}, [gameId]);

	const handleAddToCollectionClick = async () => {
		if (!isAuthenticated || !user) {
			return;
		}

		try {
			setLoadingCollections(true);
			setShowCollectionModal(true);
			const userCollections = await collectionService.getUserCollections(
				user.uid
			);
			setCollections(userCollections);
		} catch (error) {
			console.error('Error loading collections:', error);
			alert('Failed to load collections');
			setShowCollectionModal(false);
		} finally {
			setLoadingCollections(false);
		}
	};

	const handleSelectCollection = async (collectionId) => {
		try {
			setAddingToCollection(true);
			await gameService.addGameToCollection(collectionId, game);
			setSuccessMessage('Game added to collection!');
			setTimeout(() => {
				setSuccessMessage('');
				setShowCollectionModal(false);
			}, 1500);
		} catch (error) {
			if (error.message === 'Game already exists in this collection') {
				alert('This game is already in that collection');
			} else {
				console.error('Error adding game to collection:', error);
				alert('Failed to add game to collection');
			}
		} finally {
			setAddingToCollection(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-gray-500 text-lg">Loading game details...</div>
			</div>
		);
	}

	if (error || !game) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 text-lg mb-4">
						{error || 'Game not found'}
					</p>
					<Link to="/browse" className="text-teal-500 hover:underline">
						Back to Browse
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* Back button */}
				<Link
					to="/browse"
					className="inline-block mb-4 text-teal-500 hover:text-teal-600 transition">
					← Back to Browse
				</Link>

				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					{/* Cover */}
					<div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center">
						{game.background_image ? (
							<img
								src={game.background_image}
								alt={game.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-gray-400">No cover available</span>
						)}
					</div>

					{/* Info */}
					<div className="p-6 sm:p-8">
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							{game.name}
						</h1>

						{game.genres && game.genres.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-4">
								{game.genres.map((genre) => (
									<span
										key={genre.id}
										className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">
										{genre.name}
									</span>
								))}
							</div>
						)}

						{game.platforms && game.platforms.length > 0 && (
							<div className="mb-6">
								<h3 className="text-sm font-semibold text-gray-600 mb-2">
									Available on:
								</h3>
								<div className="flex flex-wrap gap-2">
									{game.platforms.map((p) => (
										<span
											key={p.platform.id}
											className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
											{p.platform.name}
										</span>
									))}
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
							{game.released && (
								<div>
									<span className="font-semibold text-gray-600">
										Released:{' '}
									</span>
									<span className="text-gray-800">{game.released}</span>
								</div>
							)}

							{game.rating && (
								<div>
									<span className="font-semibold text-gray-600">Rating: </span>
									<span className="text-gray-800">{game.rating} / 5</span>
								</div>
							)}
						</div>

						{/* Description */}
						{game.description_raw && (
							<div className="mb-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-3">
									About
								</h2>
								<p className="text-gray-700 leading-relaxed whitespace-pre-line">
									{game.description_raw}
								</p>
							</div>
						)}

						{/* Add to Collection btn */}
						<div className="pt-6 border-t">
							{isAuthenticated ? (
								<button
									onClick={handleAddToCollectionClick}
									className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition">
									Add to Collection
								</button>
							) : (
								<div className="text-center sm:text-left">
									<p className="text-gray-600 mb-3">
										Want to add this game to your collection?
									</p>
									<Link
										to="/login"
										className="inline-block w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition text-center">
										Login
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Modal to select collection */}
			{showCollectionModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-900">
								Add to Collection
							</h2>
							<button
								onClick={() => setShowCollectionModal(false)}
								disabled={addingToCollection}
								className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-50">
								×
							</button>
						</div>

						{successMessage && (
							<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
								{successMessage}
							</div>
						)}

						{loadingCollections ? (
							<div className="py-8 text-center text-gray-500">
								Loading collections...
							</div>
						) : collections.length === 0 ? (
							<div className="py-8 text-center">
								<p className="text-gray-500 mb-4">No collections yet</p>
								<button
									onClick={() => navigate('/collections')}
									className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
									Create Collection
								</button>
							</div>
						) : (
							<div className="space-y-2 max-h-96 overflow-y-auto">
								{collections.map((collection) => (
									<button
										key={collection.id}
										onClick={() => handleSelectCollection(collection.id)}
										disabled={addingToCollection}
										className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
										<div className="font-medium text-gray-900">
											{collection.name}
										</div>
										{collection.description && (
											<div className="text-sm text-gray-500 mt-1">
												{collection.description}
											</div>
										)}
									</button>
								))}
							</div>
						)}

						<div className="mt-4 pt-4 border-t">
							<button
								onClick={() => navigate('/collections')}
								className="text-sm text-teal-600 hover:text-teal-700 font-medium">
								+ Create New Collection
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
