import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';

export const CollectionDetailPage = () => {
	const { collectionId } = useParams();
	const navigate = useNavigate();
	const [collection, setCollection] = useState(null);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
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

				// TODO: Fetch games in this collection

				setGames([]);
			} catch (err) {
				console.error('Error fetching collection:', err);
				setError('Failed to load collection');
			} finally {
				setLoading(false);
			}
		};

		fetchCollectionData();
	}, [collectionId]);

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
						Back to Collections
					</button>

					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
								{collection.name}
							</h1>
							{collection.description && (
								<p className="text-gray-600">{collection.description}</p>
							)}
							<p className="text-sm text-gray-400 mt-2">
								Created {formatDate(collection.createdAt)}
							</p>
						</div>

						<Link
							to="/browse"
							className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition text-center">
							Add Game
						</Link>
					</div>
				</div>

				{/* Games list */}
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
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
						{games.map((game) => (
							<div
								key={game.id}
								className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
								{/* TODO: Games here */}
								<div className="text-gray-900 font-medium">{game.name}</div>
							</div>
						))}
					</div>
				)}

				{/* Stats */}
				<div className="mt-6 bg-white rounded-xl shadow-sm p-4">
					<div className="text-sm text-gray-600">
						<span className="font-medium text-gray-900">{games.length}</span>{' '}
						{games.length === 1 ? 'game' : 'games'} in this collection
					</div>
				</div>
			</div>
		</div>
	);
};
