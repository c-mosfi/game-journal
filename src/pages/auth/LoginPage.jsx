import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginEmailPassword } from '../../services/firebase/authService.js';

export const LoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		if (error) setError('');

		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await loginEmailPassword(formData.email, formData.password);
			navigate('/');
		} catch (error) {
			if (
				error.code === 'auth/invalid-credential' ||
				error.code === 'auth/wrong-password'
			) {
				setError('Incorrect email or password. Please try again.');
			} else if (error.code === 'auth/user-not-found') {
				setError('No account found with this email address.');
			} else if (error.code === 'auth/user-disabled') {
				setError('This account has been disabled. Please contact support.');
			} else if (error.code === 'auth/invalid-email') {
				setError('Invalid email address format.');
			} else {
				setError('Failed to log in. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
			<main className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
				<header className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600 text-sm">
						Sign in to continue to GameJournal
					</p>
				</header>

				{/* Error */}
				{error && (
					<div
						role="alert"
						className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
						<p className="text-sm font-medium">{error}</p>
					</div>
				)}

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
					aria-label="Login form">
					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2">
							Email address
						</label>
						<input
							id="email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							autoComplete="email"
							aria-required="true"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
							placeholder="you@example.com"
						/>
					</div>

					{/* Password */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700">
								Password
							</label>
						</div>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								autoComplete="current-password"
								aria-required="true"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
								placeholder="Enter your password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								aria-pressed={showPassword}
								className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 font-medium">
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Login btn */}
					<button
						type="submit"
						disabled={loading || !formData.email || !formData.password}
						aria-busy={loading}
						className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
						{loading ? 'Logging in...' : 'Log In'}
					</button>
				</form>

				{/* Divider */}
				<div className="relative my-6" aria-hidden="true">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">
							New to GameJournal?
						</span>
					</div>
				</div>

				{/* Link to RegisterPage */}
				<div className="text-center">
					<Link
						to="/register"
						className="inline-block w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition">
						Create an account
					</Link>
				</div>
			</main>
		</div>
	);
};
