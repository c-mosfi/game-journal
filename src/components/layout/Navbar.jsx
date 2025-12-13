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
			navigate('/');
		} catch (error) {
			console.error('Error logging out:', error);
			alert('Failed to logout');
		}
	};

	return (
		<nav className="bg-white shadow-sm" aria-label="Main navigation">
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
					aria-expanded={menuOpen}
					aria-controls="mobile-menu"
					aria-label="Toggle navigation menu"
					className="text-sm font-medium text-teal-700 hover:text-gray-900 focus:outline-none block md:hidden">
					{menuOpen ? 'Close' : 'Menu'}
				</button>

				{/* Desktop menu */}
				<div className="hidden md:flex items-center space-x-6">
					{isAuthenticated ? (
						<>
							<Link
								to="/"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Home
							</Link>
							<Link
								to="/browse"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Browse
							</Link>
							<Link
								to="/collections"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Collections
							</Link>

							<Link
								to="/profile"
								className="px-3 py-2 text-teal-700 font-medium rounded-md hover:bg-gray-100 transition">
								Profile
							</Link>

							<button
								onClick={handleLogout}
								className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 font-medium rounded-md hover:bg-gray-200 transition">
								Logout
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
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
				<div
					id="mobile-menu"
					className="md:hidden border-t bg-white shadow-inner">
					<nav
						className="flex flex-col px-4 py-4 space-y-3"
						aria-label="Mobile navigation">
						{isAuthenticated ? (
							<>
								<Link
									to="/"
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
									className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 font-medium rounded-md hover:bg-gray-200 transition text-left">
									Logout
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
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
					</nav>
				</div>
			)}
		</nav>
	);
};
