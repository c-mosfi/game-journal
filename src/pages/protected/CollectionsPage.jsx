import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../../services/firebase/collectionService';
import { useAuth } from '../../hooks/useAuth';

export const CollectionsPage = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const { user } = useAuth();
	const userId = user?.uid;

	const fetchCollections = useCallback(async () => {
		if (!userId) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await collectionService.getUserCollections(userId);
			setCollections(data);
		} catch (error) {
			setError('Failed to load collections');
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		if (userId) {
			fetchCollections();
		} else {
			setLoading(false);
		}
	}, [userId, fetchCollections]);

	const handleCreateCollection = async (e) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			return;
		}

		try {
			setSubmitting(true);
			await collectionService.create(userId, formData);
			setFormData({ name: '', description: '' });
			setShowModal(false);
			await fetchCollections();
		} catch (error) {
			setError('Failed to create collection');
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteCollection = async (collectionId) => {
		if (!window.confirm('Are you sure you want to delete this collection?')) {
			navigate('/collections');
			return;
		}

		try {
			await collectionService.delete(collectionId);
			await fetchCollections();
		} catch (error) {
			setError('Failed to delete collection');
			console.error(error);
		}
	};

	const formatDate = (timestamp) => {
		if (!timestamp) return 'Just now';
		const date = timestamp.toDate();
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						My Collections
					</h1>
					<button
						onClick={() => setShowModal(true)}
						className="cursor-pointer w-full sm:w-auto px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition">
						Create Collection
					</button>
				</header>

				{error && (
					<div
						role="alert"
						className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
						{error}
					</div>
				)}

				{loading ? (
					<div className="text-center py-12">
						<p className="text-gray-500" role="status">
							Loading collections...
						</p>
					</div>
				) : collections.length === 0 ? (
					<section className="bg-white rounded-xl shadow-sm p-12 text-center">
						<div className="text-gray-400 mb-4">
							<p className="text-lg">No collections yet</p>
							<p className="text-sm mt-2">
								Create your first collection to organize your games
							</p>
						</div>
						<button
							onClick={() => setShowModal(true)}
							className="cursor-pointer px-6 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition">
							Create Your First Collection
						</button>
					</section>
				) : (
					<section aria-label="Collections list">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
							{collections.map((col) => (
								<article
									key={col.id}
									className="relative bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
									{/* Card body */}
									<div
										onClick={() => navigate(`/collections/${col.id}`)}
										className="cursor-pointer">
										<header className="flex items-start justify-between mb-3">
											<h2 className="text-lg font-semibold text-gray-900 flex-1 pr-2 whitespace-pre-line wrap-break-word line-clamp-3">
												{col.name}
											</h2>
										</header>

										{col.description && (
											<p className="text-gray-600 text-sm mb-3 whitespace-pre-line wrap-break-word line-clamp-3">
												{col.description}
											</p>
										)}

										<p className="text-xs text-gray-400">
											Created {formatDate(col.createdAt)}
										</p>
									</div>

									{/* Delete btn */}
									<button
										onClick={() => {
											handleDeleteCollection(col.id);
										}}
										aria-label={`Delete ${col.name} collection`}
										className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-red-500 transition p-1 text-lg"
										title="Delete collection">
										×
									</button>
								</article>
							))}
						</div>
					</section>
				)}
			</main>
			{/* Modal */}
			{showModal && (
				// TODO: Make this a component.
				<div
					className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title">
					<div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
						<header className="flex items-center justify-between mb-4">
							<h2 id="modal-title" className="text-xl font-bold text-gray-900">
								Create New Collection
							</h2>
							<button
								onClick={() => setShowModal(false)}
								aria-label="Close dialog"
								className="cursor-pointer text-gray-400 hover:text-gray-600 text-2xl leading-none">
								×
							</button>
						</header>

						<form onSubmit={handleCreateCollection}>
							<div className="mb-4">
								<label
									htmlFor="collection-name"
									className="block text-sm font-medium text-gray-700 mb-2">
									Collection Name *
								</label>
								<input
									id="collection-name"
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									placeholder="e.g., Favorites, To Play, Completed"
									required
									maxLength={50}
								/>
							</div>

							<div className="mb-6">
								<label
									htmlFor="collection-description"
									className="block text-sm font-medium text-gray-700 mb-2">
									Description (optional)
								</label>
								<textarea
									id="collection-description"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
									placeholder="Brief description of this collection"
									rows={3}
									maxLength={200}
								/>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
									Cancel
								</button>
								<button
									type="submit"
									disabled={submitting || !formData.name.trim()}
									aria-busy={submitting}
									className="cursor-pointer flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
									{submitting ? 'Creating...' : 'Create'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
