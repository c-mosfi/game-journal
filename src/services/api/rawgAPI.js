const BASE_URL = '/.netlify/functions/rawg';

// For BrowsePage.jsx
export async function searchGames({
	query = '',
	genres = '',
	platforms = '',
	page = 1,
}) {
	const url = new URL(BASE_URL, window.location.origin);
	url.searchParams.append('endpoint', 'games');
	url.searchParams.append('page', page);
	url.searchParams.append('page_size', 20);

	if (query) url.searchParams.append('search', query);
	if (genres) url.searchParams.append('genres', genres);
	if (platforms) url.searchParams.append('platforms', platforms);

	const response = await fetch(url);
	if (!response.ok) throw new Error('Failed to fetch games');
	return response.json();
}

// For GameDetail.jsx
export async function getGameDetails(id) {
	const url = new URL(BASE_URL, window.location.origin);
	url.searchParams.append('endpoint', `games/${id}`);

	const response = await fetch(url);
	if (!response.ok) throw new Error('Failed to fetch game details');
	return response.json();
}
