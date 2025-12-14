/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const BASE_URL = 'https://api.rawg.io/api';

export default async (req) => {
	const RAWG_API_KEY = Netlify.env.get('RAWG_API_KEY');

	if (!RAWG_API_KEY) {
		return new Response(JSON.stringify({ error: 'API key not configured' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const { searchParams } = new URL(req.url);
	const endpoint = searchParams.get('endpoint');

	if (!endpoint) {
		return new Response(
			JSON.stringify({ error: 'Endpoint parameter required' }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	try {
		// Build the RAWG API URL
		const rawgUrl = new URL(`${BASE_URL}/${endpoint}`);
		rawgUrl.searchParams.append('key', RAWG_API_KEY);

		// Copy all other query params from the request
		for (const [key, value] of searchParams.entries()) {
			if (key !== 'endpoint') {
				rawgUrl.searchParams.append(key, value);
			}
		}

		const response = await fetch(rawgUrl);
		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to fetch from RAWG API' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};
