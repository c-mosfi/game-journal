import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BrowsePage } from '../src/pages/public/BrowsePage';
import * as rawgAPI from '../src/services/api/rawgAPI';

vi.mock('../src/services/api/rawgAPI', () => ({
	searchGames: vi.fn(),
}));

// Mock GameGrid component
vi.mock('../src/components/game/GameGrid', () => ({
	GameGrid: ({ games, loading }) => (
		<div data-testid="game-grid">
			{loading && <p>Loading games...</p>}
			{!loading && games.length === 0 && <p>No games found</p>}
			{!loading && games.length > 0 && (
				<div>
					{games.map((game) => (
						<div key={game.id}>{game.name}</div>
					))}
				</div>
			)}
		</div>
	),
}));

describe('BrowsePage', () => {
	const mockGamesResponse = {
		results: [
			{ id: 1, name: 'Game 1' },
			{ id: 2, name: 'Game 2' },
		],
		next: 'https://api.example.com/games?page=2',
	};

	const renderBrowsePage = () => {
		return render(
			<BrowserRouter>
				<BrowsePage />
			</BrowserRouter>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Search', () => {
		it('allows user to type in search input', async () => {
			const user = userEvent.setup();
			renderBrowsePage();

			const searchInput = screen.getByRole('searchbox');
			await user.type(searchInput, 'Zelda');

			expect(searchInput).toHaveValue('Zelda');
		});

		it('searches when search button is clicked', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue(mockGamesResponse);

			renderBrowsePage();

			await user.type(screen.getByRole('searchbox'), 'Zelda');
			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(rawgAPI.searchGames).toHaveBeenCalledWith({
					query: 'Zelda',
					genres: '',
					platforms: '',
					page: 1,
				});
			});
		});

		it('searches when Enter key is pressed', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue(mockGamesResponse);

			renderBrowsePage();

			const searchInput = screen.getByRole('searchbox');
			await user.type(searchInput, 'Mario{Enter}');

			await waitFor(() => {
				expect(rawgAPI.searchGames).toHaveBeenCalledWith({
					query: 'Mario',
					genres: '',
					platforms: '',
					page: 1,
				});
			});
		});

		it('displays search results', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue(mockGamesResponse);

			renderBrowsePage();

			await user.type(screen.getByRole('searchbox'), 'Test');
			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(screen.getByText('Game 1')).toBeInTheDocument();
				expect(screen.getByText('Game 2')).toBeInTheDocument();
			});
		});
	});

	describe('Pagination', () => {
		it('shows load more button when more results are available', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue(mockGamesResponse);

			renderBrowsePage();

			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(
					screen.getByRole('button', { name: /load more/i })
				).toBeInTheDocument();
			});
		});

		it('loads more results when button is clicked', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames
				.mockResolvedValueOnce(mockGamesResponse)
				.mockResolvedValueOnce({
					results: [{ id: 3, name: 'Game 3' }],
					next: null,
				});

			renderBrowsePage();

			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(screen.getByText('Game 1')).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /load more/i }));

			await waitFor(() => {
				expect(rawgAPI.searchGames).toHaveBeenCalledWith(
					expect.objectContaining({ page: 2 })
				);
			});

			await waitFor(() => {
				expect(screen.getByText('Game 3')).toBeInTheDocument();
			});
		});

		it('hides load more button when no more results', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue({
				results: mockGamesResponse.results,
				next: null,
			});

			renderBrowsePage();

			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(screen.getByText('Game 1')).toBeInTheDocument();
			});

			expect(
				screen.queryByRole('button', { name: /load more/i })
			).not.toBeInTheDocument();
		});
	});

	describe('Rate limiting', () => {
		it('delays requests to prevent rate limiting', async () => {
			const user = userEvent.setup();
			rawgAPI.searchGames.mockResolvedValue(mockGamesResponse);

			renderBrowsePage();

			const startTime = Date.now();

			await user.click(screen.getByRole('button', { name: /^search$/i }));

			await waitFor(() => {
				expect(screen.getByText('Game 1')).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /load more/i }));

			await waitFor(() => {
				const elapsed = Date.now() - startTime;
				expect(elapsed).toBeGreaterThanOrEqual(1000);
			});
		});
	});

	describe('Accessibility', () => {
		it('has proper filter region', () => {
			renderBrowsePage();

			expect(
				screen.getByRole('region', { name: /search filters/i })
			).toBeInTheDocument();
		});

		it('has proper results region', () => {
			renderBrowsePage();

			expect(
				screen.getByRole('region', { name: /search results/i })
			).toBeInTheDocument();
		});

		it('filter button has proper ARIA attributes', () => {
			renderBrowsePage();

			const filterButton = screen.getByRole('button', { name: /^filters$/i });
			expect(filterButton).toHaveAttribute('aria-expanded');
			expect(filterButton).toHaveAttribute('aria-controls', 'filters-panel');
		});
	});
});
