import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { logout } from '../../services/firebase/authService.js';

export const Navbar = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<nav className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				{/* Logo / App name */}
				<Link
					to="/"
					className="text-2xl font-bold text-gray-900 tracking-tight">
					GameJournal
				</Link>

				{/* Mobile menu btn */}
				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className="text-sm font-medium text-teal-700 hover:text-gray-900 focus:outline-none block md:hidden">
					{menuOpen ? 'Close' : 'Menu'}
				</button>

				{/* Desktop menu */}
				<div className="hidden md:flex items-center space-x-6">
					{isAuthenticated ? (
						<>
							<Link
								to="/home"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Home
							</Link>

							<Link
								to="/collections"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Collections
							</Link>

							<Link
								to="/browse"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Browse
							</Link>

							<Link
								to="/profile"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Profile
							</Link>

							<button
								onClick={handleLogout}
								className="px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition">
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Login
							</Link>

							<Link
								to="/register"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Register
							</Link>
						</>
					)}
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden border-t bg-white shadow-inner">
					<div className="flex flex-col px-4 py-4 space-y-3">
						{isAuthenticated ? (
							<>
								<Link
									to="/home"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Home
								</Link>

								<Link
									to="/collections"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Collections
								</Link>

								<Link
									to="/browse"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Browse
								</Link>

								<Link
									to="/profile"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Profile
								</Link>

								<button
									onClick={() => {
										setMenuOpen(false);
										handleLogout();
									}}
									className="px-3 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition text-left">
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Login
								</Link>

								<Link
									to="/register"
									className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition"
									onClick={() => setMenuOpen(false)}>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};
