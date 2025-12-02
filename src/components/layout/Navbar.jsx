import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { logout } from '../../services/firebase/authService.js';

export const Navbar = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<nav className="bg-teal-600 text-white shadow-lg">
			<div className="container mx-auto">
				<div className="flex items-center justify-between py-4">
					<Link to="/" className="text-xl font-bold">
						GameJournal
					</Link>

					{/* Nav Links */}
					<ul className="flex items-center gap-6">
						{isAuthenticated ? (
							<>
								{/* Authenticated users */}
								<li>
									<Link to="/home" className="hover:underline">
										Home
									</Link>
								</li>
								<li>
									<Link to="/collections" className="hover:underline">
										Collections
									</Link>
								</li>
								<li>
									<Link to="/browse" className="hover:underline">
										Browse
									</Link>
								</li>
								<li>
									<Link to="/profile" className="hover:underline">
										Profile
									</Link>
								</li>
								<li>
									<button
										onClick={handleLogout}
										className="px-4 py-1 rounded-lg bg-teal-800 text-white cursor-pointer hover:bg-teal-900">
										Logout
									</button>
								</li>
							</>
						) : (
							<>
								{/* Non-authenticated users */}
								<li>
									<Link to="/login" className="hover:underline">
										Login
									</Link>
								</li>
								<li>
									<Link to="/register" className="hover:underline">
										Register
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
