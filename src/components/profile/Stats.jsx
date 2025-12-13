export const Stats = ({ loading, stats }) => {
	return (
		<section aria-label="User statistics">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				{/* Favorite genres */}
				<article className="bg-gray-50 rounded-lg p-4 text-center">
					<div className="text-4xl mb-2" aria-hidden="true">
						🎯
					</div>

					<p className="h-10 font-bold text-gray-900">
						{loading
							? '...'
							: stats.favoriteGenres.length > 0
							? stats.favoriteGenres.join(', ')
							: 'None yet'}
					</p>

					<p className="text-sm text-gray-600">Most Played Genres</p>
				</article>

				{/* Total hours this year */}
				<article className="bg-gray-50 rounded-lg p-4 text-center">
					<div className="text-4xl mb-2" aria-hidden="true">
						⏱️
					</div>

					<p className="h-10 text-2xl font-bold text-gray-900">
						{loading ? '...' : stats.totalHoursThisYear}
					</p>

					<p className="text-sm text-gray-600">Hours This Year</p>
				</article>

				{/* Total journal entries */}
				<article className="bg-gray-50 rounded-lg p-4 text-center">
					<div className="text-4xl mb-2" aria-hidden="true">
						📝
					</div>

					<p className="h-10 text-2xl font-bold text-gray-900">
						{loading ? '...' : stats.journalEntries}
					</p>

					<p className="text-sm text-gray-600">Total Entries</p>
				</article>
			</div>
		</section>
	);
};
