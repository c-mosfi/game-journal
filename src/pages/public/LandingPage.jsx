import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage = () => {
	const { isAuthenticated } = useAuth();

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Hero */}
			<header className="bg-white shadow-sm">
				<div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Your Personal Gaming Journal
					</h1>
					<p className="text-lg text-gray-600 mb-8">
						Track your games, document your journey
					</p>
					<nav
						className="flex gap-4 justify-center"
						aria-label="Main navigation">
						{isAuthenticated ? (
							<>
								<Link
									to="/collections"
									className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
									My Collections
								</Link>
								<Link
									to="/browse"
									className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
									Browse Games
								</Link>
							</>
						) : (
							<>
								<Link
									to="/register"
									className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
									Get Started
								</Link>
								<Link
									to="/browse"
									className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
									Browse Games
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>

			{/* Features */}
			<main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<header className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Everything You Need
					</h2>
					<p className="text-lg text-gray-600">
						A comprehensive platform to organize, track, and document your
						gaming experiences
					</p>
				</header>

				{/* Feature cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Collections */}
					<article className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition">
						<div
							className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4"
							aria-hidden="true">
							<svg
								className="w-8 h-8 text-emerald-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Organize Collections
						</h3>
						<p className="text-gray-600">
							Create custom collections to organize your games by genre,
							platform, or any category you choose
						</p>
					</article>

					{/* Journal */}
					<article className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition">
						<div
							className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
							aria-hidden="true">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Journal Your Journey
						</h3>
						<p className="text-gray-600">
							Document your gaming experiences with detailed journal entries,
							tags, and moods
						</p>
					</article>

					{/* Progress */}
					<article className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition">
						<div
							className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4"
							aria-hidden="true">
							<svg
								className="w-8 h-8 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Track Progress
						</h3>
						<p className="text-gray-600">
							Monitor your gaming status, hours played, ratings, and completion
							dates all in one place
						</p>
					</article>
				</div>
			</main>

			{/* CTA Section */}
			{!isAuthenticated && (
				<section className="bg-teal-600 text-white">
					<div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Start Your Gaming Journal?
						</h2>
						<p className="text-lg mb-8 text-teal-100">
							Join now and begin documenting your gaming adventures
						</p>
						<Link
							to="/register"
							className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition font-medium">
							Create Free Account
						</Link>
					</div>
				</section>
			)}
		</div>
	);
};
