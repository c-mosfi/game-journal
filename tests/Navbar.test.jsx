import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../src/components/layout/Navbar';
import * as authService from '../src/services/firebase/authService';

// Mock useAuth hook
vi.mock('../src/hooks/useAuth', () => ({
	useAuth: vi.fn(),
}));

const { useAuth } = await import('../src/hooks/useAuth');

// Mock logout function
vi.mock('../src/services/firebase/authService', () => ({
	logout: vi.fn(),
}));

describe('Navbar', () => {
	const renderNavbar = () => {
		return render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Unauthenticated', () => {
		beforeEach(() => {
			useAuth.mockReturnValue({ isAuthenticated: false });
		});

		it('renders app name', () => {
			renderNavbar();
			expect(screen.getByText('GameJournal')).toBeInTheDocument();
		});

		it('shows login and register links', () => {
			renderNavbar();
			expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
			expect(
				screen.getByRole('link', { name: /register/i })
			).toBeInTheDocument();
		});

		it('does not show authenticated navigation links', () => {
			renderNavbar();
			expect(
				screen.queryByRole('link', { name: /collections/i })
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole('link', { name: /profile/i })
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole('button', { name: /logout/i })
			).not.toBeInTheDocument();
		});
	});

	describe('Authenticated', () => {
		beforeEach(() => {
			useAuth.mockReturnValue({ isAuthenticated: true });
		});

		it('shows all authenticated navigation links', () => {
			renderNavbar();

			expect(
				screen.getAllByRole('link', { name: /home/i })[0]
			).toBeInTheDocument();
			expect(
				screen.getAllByRole('link', { name: /browse/i })[0]
			).toBeInTheDocument();
			expect(
				screen.getAllByRole('link', { name: /collections/i })[0]
			).toBeInTheDocument();
			expect(
				screen.getAllByRole('link', { name: /profile/i })[0]
			).toBeInTheDocument();
		});

		it('shows logout button', () => {
			renderNavbar();
			expect(
				screen.getAllByRole('button', { name: /logout/i })[0]
			).toBeInTheDocument();
		});

		it('does not show login and register links', () => {
			renderNavbar();
			const loginLinks = screen.queryAllByRole('link', { name: /^login$/i });
			const registerLinks = screen.queryAllByRole('link', {
				name: /^register$/i,
			});

			expect(loginLinks).toHaveLength(0);
			expect(registerLinks).toHaveLength(0);
		});
	});

	describe('Mobile menu', () => {
		beforeEach(() => {
			useAuth.mockReturnValue({ isAuthenticated: true });
		});

		it('mobile menu is hidden by default', () => {
			renderNavbar();
			expect(
				screen.queryByRole('navigation', { name: /mobile navigation/i })
			).not.toBeInTheDocument();
		});

		it('toggles mobile menu when menu button is clicked', async () => {
			const user = userEvent.setup();
			renderNavbar();

			const menuButton = screen.getByRole('button', {
				name: /toggle navigation menu/i,
			});

			expect(menuButton).toHaveAttribute('aria-expanded', 'false');

			await user.click(menuButton);
			expect(menuButton).toHaveAttribute('aria-expanded', 'true');
			expect(
				screen.getByRole('navigation', { name: /mobile navigation/i })
			).toBeInTheDocument();

			await user.click(menuButton);
			expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		});

		it('closes mobile menu when a link is clicked', async () => {
			const user = userEvent.setup();
			renderNavbar();

			const menuButton = screen.getByRole('button', {
				name: /toggle navigation menu/i,
			});
			await user.click(menuButton);

			const mobileNav = screen.getByRole('navigation', {
				name: /mobile navigation/i,
			});
			const homeLink = mobileNav.querySelector('a[href="/"]');
			await user.click(homeLink);

			expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('Logout', () => {
		beforeEach(() => {
			useAuth.mockReturnValue({ isAuthenticated: true });
		});

		it('calls logout service when logout button is clicked', async () => {
			const user = userEvent.setup();
			authService.logout.mockResolvedValue();

			renderNavbar();

			const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
			await user.click(logoutButtons[0]);

			expect(authService.logout).toHaveBeenCalledTimes(1);
		});

		it('shows alert when logout fails', async () => {
			const user = userEvent.setup();
			const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
			authService.logout.mockRejectedValue(new Error('Logout failed'));

			renderNavbar();

			const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
			await user.click(logoutButtons[0]);

			await vi.waitFor(() => {
				expect(alertSpy).toHaveBeenCalledWith('Failed to logout');
			});

			alertSpy.mockRestore();
		});
	});

	describe('Accessibility', () => {
		it('has proper navigation landmark', () => {
			useAuth.mockReturnValue({ isAuthenticated: true });
			renderNavbar();

			expect(
				screen.getByRole('navigation', { name: /main navigation/i })
			).toBeInTheDocument();
		});

		it('menu button has proper ARIA attributes', () => {
			useAuth.mockReturnValue({ isAuthenticated: true });
			renderNavbar();

			const menuButton = screen.getByRole('button', {
				name: /toggle navigation menu/i,
			});

			expect(menuButton).toHaveAttribute('aria-expanded');
			expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
		});
	});
});
