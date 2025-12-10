import { useState, useRef, useCallback } from 'react';
import { GameGrid } from '../../components/game/GameGrid';
import { searchGames } from '../../services/api/rawgAPI';
import { PLATFORMS, GENRES } from '../../services/api/data';

export const BrowsePage = () => {
	const [query, setQuery] = useState('');
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedPlatforms, setSelectedPlatforms] = useState([]);
	const [games, setGames] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [showFilters, setShowFilters] = useState(false);

	// Active search parameters
	const [activeQuery, setActiveQuery] = useState('');
	const [activeGenres, setActiveGenres] = useState([]);
	const [activePlatforms, setActivePlatforms] = useState([]);

	// Requests limit to 1 per second
	const lastRequestRef = useRef(0);
	const MIN_REQUEST_INTERVAL = 1000;

	// Fetch with request delay
	const delayFetch = async (fn) => {
		const now = Date.now();
		const diff = now - lastRequestRef.current;

		if (diff < MIN_REQUEST_INTERVAL) {
			await new Promise((response) =>
				setTimeout(response, MIN_REQUEST_INTERVAL - diff)
			);
		}
		lastRequestRef.current = Date.now();

		// returns the actual fetch function
		return fn();
	};

	const fetchGames = useCallback(
		async (
			searchQuery,
			searchGenres,
			searchPlatforms,
			searchPage,
			reset = false
		) => {
			setLoading(true);

			const genreParam = searchGenres.join(',');
			const platformParam = searchPlatforms.join(',');

			try {
				const data = await delayFetch(() =>
					searchGames({
						query: searchQuery,
						genres: genreParam,
						platforms: platformParam,
						page: searchPage,
					})
				);

				setGames((prev) => (reset ? data.results : [...prev, ...data.results]));
				setHasMore(Boolean(data.next));
			} catch (error) {
				console.error('Error fetching games:', error);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Handle search
	const handleSearch = () => {
		// reset games and page before new search
		setGames([]);
		setActiveQuery(query);
		setActiveGenres(selectedGenres);
		setActivePlatforms(selectedPlatforms);
		setPage(1);
		// call to searchGames
		fetchGames(query, selectedGenres, selectedPlatforms, 1, true);
		setShowFilters(false);
	};

	// Pressing Enter key in search input triggers a search
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Load more pages, using the active search parameters
	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchGames(activeQuery, activeGenres, activePlatforms, nextPage, false);
	};

	function toggleGenre(id) {
		setSelectedGenres((prev) =>
			prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
		);
	}

	function togglePlatform(id) {
		setSelectedPlatforms((prev) =>
			prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
		);
	}

	function clearFilters() {
		setSelectedGenres([]);
		setSelectedPlatforms([]);
	}

	const activeFilterCount = selectedGenres.length + selectedPlatforms.length;

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				<h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
					Browse Games
				</h1>

				{/* Search bar*/}
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
					<input
						type="text"
						placeholder="Search games by title..."
						className="flex-1 px-4 py-2.5 sm:py-2 border rounded-lg bg-white text-base"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyPress}
					/>
					<div className="flex gap-3">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border rounded-lg hover:bg-gray-50 transition relative">
							<span className="text-sm">Filters</span>
							{activeFilterCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
									{activeFilterCount}
								</span>
							)}
						</button>
						{/* Search btn */}
						<button
							onClick={handleSearch}
							disabled={loading}
							className="flex-1 sm:flex-none px-6 py-2.5 sm:py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-base">
							{loading ? 'Searching...' : 'Search'}
						</button>
					</div>
				</div>

				<div className="flex gap-6">
					{/* Filters */}
					<aside
						className={`
						fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto
						w-full sm:w-80 lg:w-60 
						bg-white lg:rounded-xl lg:shadow 
						p-4 lg:h-fit
						transform transition-transform duration-300 ease-in-out
						${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
						overflow-y-auto
					`}>
						<div className="flex items-center justify-between mb-4 lg:block">
							<h2 className="font-medium text-lg lg:text-base">
								Select Filters
							</h2>
							<button
								onClick={() => setShowFilters(false)}
								className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 text-xl leading-none">
								×
							</button>
						</div>

						{/* Genres */}
						<h3 className="font-semibold mb-2 text-sm">Genre</h3>
						<div className="flex flex-col gap-1.5 mb-4 max-h-60 overflow-y-auto">
							{GENRES.map((g) => (
								<label
									key={g.id}
									className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
									<input
										type="checkbox"
										checked={selectedGenres.includes(g.id)}
										onChange={() => toggleGenre(g.id)}
										className="w-4 h-4"
									/>
									{g.name}
								</label>
							))}
						</div>

						{/* Platforms */}
						<h3 className="font-semibold mb-2 text-sm">Platform</h3>
						<div className="flex flex-col gap-1.5 mb-4 max-h-60 overflow-y-auto">
							{PLATFORMS.map((p) => (
								<label
									key={p.id}
									className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
									<input
										type="checkbox"
										checked={selectedPlatforms.includes(p.id)}
										onChange={() => togglePlatform(p.id)}
										className="w-4 h-4"
									/>
									{p.name}
								</label>
							))}
						</div>

						<div className="flex flex-col gap-2">
							<button
								onClick={clearFilters}
								className="text-sm bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 w-full transition">
								Clear Filters
							</button>
							<button
								onClick={handleSearch}
								className="lg:hidden text-sm bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 w-full transition">
								Apply Filters
							</button>
						</div>
					</aside>

					{showFilters && (
						<div
							className="lg:hidden fixed inset-0 bg-gray-100 bg-opacity-50 z-40"
							onClick={() => setShowFilters(false)}
						/>
					)}

					{/* Grid */}
					<div className="flex-1 min-w-0">
						<GameGrid games={games} loading={loading} />

						{hasMore && !loading && games.length > 0 && (
							<div className="text-center mt-6">
								<button
									onClick={handleLoadMore}
									className="px-6 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-base">
									Load More
								</button>
							</div>
						)}

						{!loading && games.length === 0 && (
							<div className="text-center text-gray-400 py-16 px-4 text-base">
								Click "Search" to find games
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
