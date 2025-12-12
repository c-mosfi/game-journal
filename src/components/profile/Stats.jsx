export const Stats = ({ loading, stats }) => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				{/* Favorite genres */}
				<div
					className="bg-gray-50 rounded-lg p-4 text-center"
					role="region"
					aria-label="Most played genres">
					<div className="text-4xl mb-2">🎯</div>

					<div className="h-10 font-bold text-gray-900">
						{loading
							? '...'
							: stats.favoriteGenres.length > 0
							? stats.favoriteGenres.join(', ')
							: 'None yet'}
					</div>

					<div className="text-sm text-gray-600">Most Played Genres</div>
				</div>

				{/* Total hours this year */}
				<div
					className="bg-gray-50 rounded-lg p-4 text-center"
					role="region"
					aria-label="Hours this year">
					<div className="text-4xl mb-2">⏱️</div>

					<div className="h-10 text-2xl font-bold text-gray-900">
						{loading ? '...' : stats.totalHoursThisYear}
					</div>

					<div className="text-sm text-gray-600">Hours This Year</div>
				</div>

				{/* Total journal entries */}
				<div
					className="bg-gray-50 rounded-lg p-4 text-center"
					role="region"
					aria-label="Total journal entries">
					<div className="text-4xl mb-2">📝</div>

					<div className="h-10 text-2xl font-bold text-gray-900">
						{loading ? '...' : stats.journalEntries}
					</div>

					<div className="text-sm text-gray-600">Total Entries</div>
				</div>
			</div>
		</div>
	);
};
