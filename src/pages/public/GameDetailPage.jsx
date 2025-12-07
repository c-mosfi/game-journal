import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getGameDetails } from '../../services/api/rawgAPI';

export const GameDetailPage = () => {
	const { isAuthenticated } = useAuth();
	const { gameId } = useParams();
	const [game, setGame] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGameDetails = async () => {
			try {
				setLoading(true);
				const data = await getGameDetails(gameId);
				setGame(data);
			} catch (err) {
				setError('Failed to load game details');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchGameDetails();
	}, [gameId]);

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
								<button className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition">
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
		</div>
	);
};
