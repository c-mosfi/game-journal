import { GameCard } from './GameCard';

export const GameGrid = ({ games, loading }) => {
	if (loading) {
		return (
			<div className="text-center text-gray-500 py-10">Loading games...</div>
		);
	}

	if (!games.length) {
		return (
			<div className="text-center text-gray-400 py-10">No games found.</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
			{games.map((game) => (
				<GameCard key={game.id} game={game} />
			))}
		</div>
	);
};