export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-100 border-t border-gray-200 mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center text-sm text-gray-500 mb-2">
					Powered by{' '}
					<a
						href="https://rawg.io/apidocs"
						target="_blank"
						rel="noopener noreferrer"
						className="text-teal-600 font-semibold hover:underline">
						RAWG API
					</a>
				</div>

				<div className="text-center text-sm text-gray-500 mb-2">
					Source code available on{' '}
					<a
						href="https://github.com/c-mosfi"
						target="_blank"
						rel="noopener noreferrer"
						className="text-teal-600 font-semibold hover:underline">
						GitHub
					</a>
				</div>

				<div className="text-center text-xs text-gray-400 leading-relaxed">
					This work is licensed under a{' '}
					<a
						href="https://creativecommons.org/licenses/by-nc-nd/3.0/"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline">
						Creative Commons Attribution–NonCommercial–NoDerivs 3.0 License
					</a>
					.
				</div>

				<div className="text-center text-xs text-gray-400 mt-2">
					© {currentYear}
				</div>
			</div>
		</footer>
	);
};
