import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerEmailPassword } from '../../services/firebase/authService';

export const RegisterPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

		// Validation
		const nameLength = formData.username.trim().length;
		if (nameLength < 2 || nameLength > 12) {
			setError(
				`Display name must be between 2 and 12 characters. Yours has ${nameLength} characters.`
			);
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setLoading(true);

		try {
			await registerEmailPassword(
				formData.email,
				formData.password,
				formData.username.trim()
			);
			navigate('/');
		} catch (error) {
			if (error.code === 'auth/email-already-in-use') {
				setError('This email is already registered. Try logging in instead.');
			} else if (error.code === 'auth/invalid-email') {
				setError('Invalid email address format.');
			} else if (error.code === 'auth/weak-password') {
				setError('Password is too weak. Use a stronger password.');
			} else {
				setError(
					error.message || 'Failed to create account. Please try again.'
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// Check if form is valid
	const isFormValid =
		formData.username.trim() &&
		formData.email.trim() &&
		formData.password &&
		formData.confirmPassword;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Create Account
					</h1>
					<p className="text-gray-600 text-sm">
						Join GameJournal to track your gaming journey
					</p>
				</div>

				{/* Error */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
						<p className="text-sm font-medium">{error}</p>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Name */}
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700 mb-2">
							Username
						</label>
						<input
							id="username"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
							autoComplete="name"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
							placeholder="Enter a name"
						/>
					</div>

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
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
							placeholder="you@example.com"
						/>
					</div>

					{/* Password */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								autoComplete="new-password"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
								placeholder="At least 6 characters"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 font-medium">
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Must be at least 6 characters long
						</p>
					</div>

					{/* Confirm password */}
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700 mb-2">
							Confirm password
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								autoComplete="new-password"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
								placeholder="Repeat your password"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 font-medium">
								{showConfirmPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Create account btn */}
					<button
						type="submit"
						disabled={loading || !isFormValid}
						className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
						{loading ? 'Creating Account...' : 'Create Account'}
					</button>
				</form>

				{/* Divider */}
				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">
							Already have an account?
						</span>
					</div>
				</div>

				{/*Link to LoginPage */}
				<div className="text-center">
					<Link
						to="/login"
						className="inline-block w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition">
						Log in instead
					</Link>
				</div>
			</div>
		</div>
	);
};
