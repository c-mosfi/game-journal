import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SettingsPage } from '../src/pages/protected/SettingsPage';
import * as authService from '../src/services/firebase/authService';

vi.mock('../src/hooks/useAuth', () => ({
	useAuth: vi.fn(),
}));

vi.mock('../src/services/firebase/authService', () => ({
	updateUsername: vi.fn(),
	changeEmail: vi.fn(),
	resendVerification: vi.fn(),
	deleteAccount: vi.fn(),
}));

const { useAuth } = await import('../src/hooks/useAuth');

describe('SettingsPage', () => {
	const mockUser = {
		displayName: 'User Name',
		email: 'test@example.com',
		emailVerified: true,
	};

	const renderSettingsPage = () => {
		return render(
			<BrowserRouter>
				<SettingsPage />
			</BrowserRouter>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		useAuth.mockReturnValue({ user: mockUser });
	});

	describe('Change username', () => {
		it('allows user to enter new username', async () => {
			const user = userEvent.setup();
			renderSettingsPage();

			const input = screen.getByLabelText(/new username/i);
			await user.type(input, 'NewUsername');

			expect(input).toHaveValue('NewUsername');
		});

		it('successfully updates username', async () => {
			const user = userEvent.setup();
			authService.updateUsername.mockResolvedValue();

			renderSettingsPage();

			await user.type(screen.getByLabelText(/new username/i), 'NewUsername');
			await user.click(
				screen.getByRole('button', { name: /update username/i })
			);

			await waitFor(() => {
				expect(authService.updateUsername).toHaveBeenCalledWith('NewUsername');
			});

			expect(
				await screen.findByText(/username updated successfully/i)
			).toBeInTheDocument();
		});

		it('shows error for username too short', async () => {
			const user = userEvent.setup();
			renderSettingsPage();

			await user.type(screen.getByLabelText(/new username/i), 'a');
			await user.click(
				screen.getByRole('button', { name: /update username/i })
			);

			await waitFor(() => {
				expect(
					screen.getByText(/must be between 2 and 12 characters/i)
				).toBeInTheDocument();
			});
		});

		it('shows error for username too long', async () => {
			const user = userEvent.setup();
			renderSettingsPage();

			await user.type(
				screen.getByLabelText(/new username/i),
				'loooooooooong name'
			);
			await user.click(
				screen.getByRole('button', { name: /update username/i })
			);

			await waitFor(() => {
				expect(
					screen.getByText(/must be between 2 and 12 characters/i)
				).toBeInTheDocument();
			});
		});
	});

	describe('Change email', () => {
		it('allows user to enter new email and password', async () => {
			const user = userEvent.setup();
			renderSettingsPage();

			await user.type(
				screen.getByLabelText(/new email/i),
				'newemail@example.com'
			);
			await user.type(
				screen.getByLabelText(/current password/i),
				'password123'
			);

			expect(screen.getByLabelText(/new email/i)).toHaveValue(
				'newemail@example.com'
			);
			expect(screen.getByLabelText(/current password/i)).toHaveValue(
				'password123'
			);
		});

		it('successfully changes email', async () => {
			const user = userEvent.setup();
			authService.changeEmail.mockResolvedValue();

			renderSettingsPage();

			await user.type(
				screen.getByLabelText(/new email/i),
				'newemail@example.com'
			);
			await user.type(
				screen.getByLabelText(/current password/i),
				'password123'
			);
			await user.click(screen.getByRole('button', { name: /change email/i }));

			await waitFor(() => {
				expect(authService.changeEmail).toHaveBeenCalledWith(
					'newemail@example.com',
					'password123'
				);
			});

			expect(
				await screen.findByText(/email updated successfully/i)
			).toBeInTheDocument();
		});

		it('shows error for wrong password', async () => {
			const user = userEvent.setup();
			authService.changeEmail.mockRejectedValue({
				code: 'auth/wrong-password',
			});

			renderSettingsPage();

			await user.type(
				screen.getByLabelText(/new email/i),
				'newemail@example.com'
			);
			await user.type(screen.getByLabelText(/current password/i), 'wrongggg');
			await user.click(screen.getByRole('button', { name: /change email/i }));

			await waitFor(() => {
				expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
			});
		});
	});

	describe('Delete account', () => {
		it('delete button is disabled until DELETE is typed', async () => {
			const user = userEvent.setup();
			renderSettingsPage();

			await user.click(
				screen.getByRole('button', { name: /proceed to delete/i })
			);

			const deleteButton = screen.getByRole('button', {
				name: /^delete account$/i,
			});
			expect(deleteButton).toBeDisabled();

			await user.type(
				screen.getByLabelText(/type delete to confirm/i),
				'DELETE'
			);

			expect(deleteButton).toBeEnabled();
		});

		it('calls deleteAccount when confirmed', async () => {
			const user = userEvent.setup();
			authService.deleteAccount.mockResolvedValue();

			renderSettingsPage();

			await user.click(
				screen.getByRole('button', { name: /proceed to delete/i })
			);
			await user.type(
				screen.getByLabelText(/type delete to confirm/i),
				'DELETE'
			);
			await user.click(
				screen.getByRole('button', { name: /^delete account$/i })
			);

			await waitFor(() => {
				expect(authService.deleteAccount).toHaveBeenCalledTimes(1);
			});
		});
	});
});
