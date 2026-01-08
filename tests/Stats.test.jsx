import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stats } from '../src/components/profile/Stats';

describe('Stats', () => {
	describe('Loading state', () => {
		it('shows loading indicators when loading is true', () => {
			const stats = {
				favoriteGenres: [],
				totalHoursThisYear: 0,
				journalEntries: 0,
			};

			render(<Stats loading={true} stats={stats} />);

			const loadingIndicators = screen.getAllByText('...');
			expect(loadingIndicators).toHaveLength(3);
		});
	});

	describe('Genres', () => {
		it('displays favorite genres when available', () => {
			const stats = {
				favoriteGenres: ['Action', 'RPG', 'Adventure'],
				totalHoursThisYear: 120,
				journalEntries: 15,
			};

			render(<Stats loading={false} stats={stats} />);

			expect(screen.getByText('Action, RPG, Adventure')).toBeInTheDocument();
			expect(screen.getByText('Most Played Genres')).toBeInTheDocument();
		});

		it('shows "None yet" when no favorite genres', () => {
			const stats = {
				favoriteGenres: [],
				totalHoursThisYear: 0,
				journalEntries: 0,
			};

			render(<Stats loading={false} stats={stats} />);

			expect(screen.getByText('None yet')).toBeInTheDocument();
		});
	});

	describe('Hours', () => {
		it('displays total hours this year', () => {
			const stats = {
				favoriteGenres: [],
				totalHoursThisYear: 150,
				journalEntries: 0,
			};

			render(<Stats loading={false} stats={stats} />);

			expect(screen.getByText('150')).toBeInTheDocument();
			expect(screen.getByText('Hours This Year')).toBeInTheDocument();
		});
	});

	describe('Entries', () => {
		it('displays total journal entries', () => {
			const stats = {
				favoriteGenres: [],
				totalHoursThisYear: 0,
				journalEntries: 42,
			};

			render(<Stats loading={false} stats={stats} />);

			expect(screen.getByText('42')).toBeInTheDocument();
			expect(screen.getByText('Total Entries')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has proper ARIA labels', () => {
			const stats = {
				favoriteGenres: ['Action'],
				totalHoursThisYear: 100,
				journalEntries: 10,
			};

			render(<Stats loading={false} stats={stats} />);

			expect(
				screen.getByRole('region', { name: /user statistics/i })
			).toBeInTheDocument();
		});

		it('renders stats in separate articles', () => {
			const stats = {
				favoriteGenres: ['Action'],
				totalHoursThisYear: 100,
				journalEntries: 10,
			};

			render(<Stats loading={false} stats={stats} />);

			const articles = screen.getAllByRole('article');
			expect(articles).toHaveLength(3);
		});
	});
});
