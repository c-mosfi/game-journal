import { useState } from 'react';
import { loginEmailPassword } from '../../services/firebase/authService.js';

// TODO: check comments and add router/navigation/links
// import { useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
	// const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
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
		setLoading(true);

		try {
			await loginEmailPassword(formData.email, formData.password);
			// navigate('/home');
		} catch (err) {
			if (err.code == 'auth/wrong-password') {
				setError('Incorrect password. Please try again.');
			} else if (err.code == 'auth/user-not-found') {
				setError('No account found with this email.');
			} else setError('Failed to log in');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
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

					<div className="mb-6">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
							placeholder="Your password"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
						{loading ? 'Logging in...' : 'Log In'}
					</button>
				</form>

				<p className="mt-4 text-center text-gray-600">
					Don't have an account?
					{/* <Link to="/register" className="text-teal-600 hover:underline">
						Sign up
					</Link> */}
				</p>
			</div>
		</div>
	);
};
