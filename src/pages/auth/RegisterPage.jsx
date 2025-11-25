import { useState } from 'react';
import { registerEmailPassword } from '../../services/firebase/authService';
// TODO: check comments and add router/navigation/links
// import { useNavigate, Link } from 'react-router-dom';

export const RegisterPage = () => {
	// const navigate = useNavigate();
	const [formData, setFormData] = useState({
		displayName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}
		setLoading(true);

		try {
			await registerEmailPassword(
				formData.email,
				formData.password,
				formData.displayName
			);
			// navigate('/home'); 
		} catch (err) {
			setError(err.message || 'Failed to register');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Display Name</label>
						<input
							type="text"
							name="displayName"
							value={formData.displayName}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
							placeholder="Your name"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
							placeholder="you@example.com"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
							placeholder="At least 6 characters"
						/>
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 mb-2">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
							placeholder="Repeat password"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
						{loading ? 'Creating Account...' : 'Create Account'}
					</button>
				</form>

				<p className="mt-4 text-center text-gray-600">
					Already have an account?{' '}
					{/* <Link to="/login" className="text-teal-600 hover:underline">
						Log in
					</Link> */}
				</p>
			</div>
		</div>
	);
};
