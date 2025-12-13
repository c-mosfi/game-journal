import { Link } from 'react-router-dom';

export const GameCard = ({ game }) => {
	const cover = game.background_image;

	return (
		<Link
			to={`/games/${game.id}`}
			className="bg-white rounded-xl shadow-sm p-3 hover:shadow-lg transition flex flex-col h-full">
			<div className="w-full h-48 sm:h-52 md:h-60 bg-gray-200 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
				{cover ? (
					<img
						src={cover}
						alt={game.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<span className="text-gray-500 text-sm px-4 text-center">
						No cover available.
					</span>
				)}
			</div>
			<h1 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">
				{game.name}
			</h1>
			{/* Genres */}
			<div className="flex flex-wrap gap-1 mb-2 mt-auto">
				{game.genres?.slice(0, 2).map((g) => (
					<span
						key={g.id}
						className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
						{g.name}
					</span>
				))}
			</div>
		</Link>
	);
};
