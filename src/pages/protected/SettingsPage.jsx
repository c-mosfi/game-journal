import { useState } from 'react';
import {
	updateUsername,
	changeEmail,
	resendVerification,
	deleteAccount,
} from '../../services/firebase/authService';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage = () => {
	const { user } = useAuth();

	// Username
	const [newUsername, setNewUsername] = useState('');
	const [loadingUsername, setLoadingUsername] = useState(false);
	const [usernameError, setUsernameError] = useState('');
	const [usernameSuccess, setUsernameSuccess] = useState('');

	// Email
	const [newEmail, setNewEmail] = useState('');
	const [emailPassword, setEmailPassword] = useState('');
	const [loadingEmail, setLoadingEmail] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [emailSuccess, setEmailSuccess] = useState('');

	// Delete account
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [deleteError, setDeleteError] = useState('');

	const handleUsername = async (e) => {
		e.preventDefault();
		setLoadingUsername(true);
		setUsernameError('');
		setUsernameSuccess('');

		try {
			const username = newUsername.trim();
			if (!username) {
				setUsernameError('Username cannot be empty');
				return;
			}
			if (username.length < 2 || username.length > 12) {
				setUsernameError(
					`Username must be between 2 and 12 characters. Yours is ${username.length} characters.`
				);
				return;
			}

			await updateUsername(username);
			setNewUsername('');
			setUsernameSuccess('Username updated successfully!');
			setTimeout(() => setUsernameSuccess(''), 5000);
		} catch (error) {
			setUsernameError(error.message || 'Failed to update username.');
		} finally {
			setLoadingUsername(false);
		}
	};

	const handleEmailChange = async (e) => {
		e.preventDefault();
		setLoadingEmail(true);
		setEmailError('');
		setEmailSuccess('');

		try {
			const email = newEmail.trim();
			const password = emailPassword.trim();

			if (!email || !password) {
				setEmailError('Please fill in all fields.');
				return;
			}

			await changeEmail(email, password);
			setNewEmail('');
			setEmailPassword('');
			setEmailSuccess(
				'Email updated successfully! Please verify your new email.'
			);
		} catch (error) {
			if (error.code === 'auth/wrong-password') {
				setEmailError('Incorrect password. Please try again.');
			} else {
				setEmailError('Failed to update email.');
			}
		} finally {
			setLoadingEmail(false);
		}
	};

	const handleDeleteAccount = async () => {
		setDeleteError('');
		if (deleteConfirmText !== 'DELETE') {
			return;
		}

		setLoadingDelete(true);
		try {
			await deleteAccount();
		} catch (error) {
			setDeleteError(error.message || 'Failed to delete account.');
		} finally {
			setLoadingDelete(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
			<main className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
				<header className="text-center mb-10">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Account Settings
					</h1>
					<p className="text-gray-600 text-sm">
						Manage your account details and preferences
					</p>
				</header>

				{/* Username */}
				<section
					className="mb-10 pb-8 border-b border-gray-200"
					aria-labelledby="username-heading">
					<h2
						id="username-heading"
						className="text-xl font-semibold text-gray-800 mb-4">
						Change Username
					</h2>

					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-sm text-gray-600 mb-4">
							Current username:{' '}
							<span className="font-semibold text-gray-900">
								{user?.displayName || 'Not set'}
							</span>
						</p>

						{usernameError && (
							<div
								role="alert"
								className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
								<p className="text-sm font-medium">{usernameError}</p>
							</div>
						)}

						{usernameSuccess && (
							<div
								role="status"
								className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
								<p className="text-sm font-medium">{usernameSuccess}</p>
							</div>
						)}

						<form
							onSubmit={handleUsername}
							className="space-y-4"
							aria-label="Change username form">
							<div>
								<label
									htmlFor="new-username"
									className="block text-sm font-medium text-gray-700 mb-2">
									New username
								</label>
								<input
									id="new-username"
									type="text"
									value={newUsername}
									onChange={(e) => setNewUsername(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
									placeholder="Enter new username"
								/>
							</div>

							<button
								type="submit"
								disable={loadingUsername || !newUsername.trim()}
								aria-busy={loadingUsername}
								className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
								{loadingUsername ? 'Updating...' : 'Update Username'}
							</button>
						</form>
					</div>
				</section>

				{/* Email */}
				<section
					className="mb-10 pb-8 border-b border-gray-200"
					aria-labelledby="email-heading">
					<h2
						id="email-heading"
						className="text-xl font-semibold text-gray-800 mb-4">
						Change Email
					</h2>

					<div className="bg-gray-50 p-6 rounded-lg">
						<p className="text-sm text-gray-600 mb-4">
							Current email:{' '}
							<span className="font-semibold text-gray-900">{user?.email}</span>
							{!user?.emailVerified && (
								<span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
									Not verified
								</span>
							)}
						</p>

						{emailError && (
							<div
								role="alert"
								className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
								<p className="text-sm font-medium">{emailError}</p>
							</div>
						)}

						{emailSuccess && (
							<div
								role="status"
								className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
								<p className="text-sm font-medium">{emailSuccess}</p>
							</div>
						)}

						<form
							onSubmit={handleEmailChange}
							className="space-y-4"
							aria-label="Change email form">
							<div>
								<label
									htmlFor="new-email"
									className="block text-sm font-medium text-gray-700 mb-2">
									New email
								</label>
								<input
									id="new-email"
									type="email"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
									autoComplete="email"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
									placeholder="Enter a new email"
								/>
							</div>

							<div>
								<label
									htmlFor="email-password"
									className="block text-sm font-medium text-gray-700 mb-2">
									Current password
								</label>
								<input
									id="email-password"
									type="password"
									value={emailPassword}
									onChange={(e) => setEmailPassword(e.target.value)}
									autoComplete="current-password"
									aria-describedby="email-password-hint"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
									placeholder="Confirm your identity"
								/>
								<p
									id="email-password-hint"
									className="text-xs text-gray-500 mt-1">
									Required for security verification
								</p>
							</div>

							<button
								type="submit"
								disabled={
									loadingEmail || !newEmail.trim() || !emailPassword.trim()
								}
								aria-busy={loadingEmail}
								className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
								{loadingEmail ? 'Updating...' : 'Change Email'}
							</button>
						</form>

						{!user?.emailVerified && (
							<div className="mt-4 pt-4 border-t border-gray-200">
								<button
									onClick={resendVerification}
									className="cursor-pointer text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline">
									Resend verification email
								</button>
							</div>
						)}
					</div>
				</section>

				{/* Delete account */}
				<section
					className="rounded-lg p-6 bg-red-50 border border-red-200"
					aria-labelledby="danger-heading">
					<h2
						id="danger-heading"
						className="text-xl font-semibold text-red-700 mb-3">
						Danger Zone
					</h2>

					<p className="text-sm text-red-700 mb-4">
						Deleting your account permanently removes all your data.
					</p>

					{deleteError && (
						<div
							role="alert"
							className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded-lg mb-4">
							<p className="text-sm">{deleteError}</p>
						</div>
					)}

					{!showDeleteConfirm ? (
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="cursor-pointer w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition">
							Proceed to Delete
						</button>
					) : (
						<div className="space-y-4 bg-white p-4 rounded-lg border-2 border-red-300">
							<p className="text-red-800 font-semibold">
								Type <span className="font-mono">DELETE</span> to confirm
							</p>

							<label htmlFor="delete-confirm" className="sr-only">
								Type DELETE to confirm account deletion
							</label>
							<input
								id="delete-confirm"
								type="text"
								value={deleteConfirmText}
								onChange={(e) => setDeleteConfirmText(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition"
								placeholder="DELETE"
							/>

							<div className="flex gap-3">
								<button
									onClick={handleDeleteAccount}
									disabled={loadingDelete || deleteConfirmText !== 'DELETE'}
									aria-busy={loadingDelete}
									className="cursor-pointer flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
									{loadingDelete ? 'Deleting...' : 'Delete Account'}
								</button>

								<button
									onClick={() => {
										setShowDeleteConfirm(false);
										setDeleteConfirmText('');
									}}
									className="cursor-pointer flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
									Cancel
								</button>
							</div>
						</div>
					)}
				</section>
			</main>
		</div>
	);
};
