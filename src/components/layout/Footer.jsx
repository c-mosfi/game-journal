// import { Link } from 'react-router-dom';

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-100 border-t border-gray-200 mt-auto">
			<div className="container mx-auto px-4 py-8">
				{/* TODO: Links Section */}
				{/* <div className="flex justify-center items-center gap-8 mb-4">
					<Link
						to="/about"
						className="text-gray-600 hover:text-gray-900 text-sm transition">
						About
					</Link>
					<span className="text-gray-400">|</span>
					<Link
						to="/privacy"
						className="text-gray-600 hover:text-gray-900 text-sm transition">
						Privacy Policy
					</Link>
					<span className="text-gray-400">|</span>
					<Link
						to="/contact"
						className="text-gray-600 hover:text-gray-900 text-sm transition">
						Contact
					</Link>
				</div> */}

				<div className="text-center text-sm text-gray-500 mb-2">
					Powered by{' '}
					<a
						className="text-teal-600 font-bold hover:underline"
						target="_blank"
						rel="noopener noreferrer"
						href="https://rawg.io/apidocs">
						RAWG API
					</a>
				</div>
				<div className="text-center text-sm text-gray-400">
					Copyright © {currentYear}
				</div>
			</div>
		</footer>
	);
};
