import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
	const navigate = useNavigate();
	const handleReturn = () => navigate('/');

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
				<div className="text-center mb-6">
					<h2 className="text-3xl font-bold text-gray-900 mb-3">
						404 - Page Not Found
					</h2>
					<p className="text-gray-600 text-sm">
						The page you're looking for doesn't exist or has been removed.
					</p>
				</div>

				<button
					onClick={handleReturn}
					type="button"
					className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium
					hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500
					disabled:bg-gray-400 transition">
					Return
				</button>
			</div>
		</div>
	);
};
