import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';
import { gameService } from '../../services/firebase/gameService';
import { journalService } from '../../services/firebase/journalService';
import { JournalEditor } from '../../components/journal/JournalEditor';

const TAG_COLORS = {
	none: 'bg-gray-100 text-gray-700',
	progress: 'bg-green-100 text-green-700',
	theory: 'bg-blue-100 text-blue-700',
	mission: 'bg-purple-100 text-purple-700',
	reminder: 'bg-yellow-100 text-yellow-700',
	final_review: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = [
	{ value: 'Not Started', color: 'bg-gray-100 text-gray-700' },
	{ value: 'Playing', color: 'bg-blue-100 text-blue-700' },
	{ value: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
	{ value: 'Completed', color: 'bg-green-100 text-green-700' },
	{ value: 'Dropped', color: 'bg-red-100 text-red-700' },
];

export const GameInCollectionPage = () => {
	const { collectionId, gameId } = useParams();
	const navigate = useNavigate();

	const [game, setGame] = useState(null);
	const [journalEntries, setJournalEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showEditor, setShowEditor] = useState(false);
	const [editingEntry, setEditingEntry] = useState(null);

	// Metadata state
	const [status, setStatus] = useState('Not Started');
	const [personalRating, setPersonalRating] = useState(0);
	const [hoursPlayed, setHoursPlayed] = useState('');
	const [startDate, setStartDate] = useState('');
	const [completionDate, setCompletionDate] = useState('');

	const [expandedEntries, setExpandedEntries] = useState(new Set());

	const toggleExpanded = (entryId) => {
		setExpandedEntries((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(entryId)) {
				newSet.delete(entryId);
			} else {
				newSet.add(entryId);
			}
			return newSet;
		});
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionId, gameId]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch collection info (just to verify it exists)
			const collectionRef = doc(db, 'collections', collectionId);
			const collectionSnap = await getDoc(collectionRef);

			if (!collectionSnap.exists()) {
				setError('Collection not found');
				return;
			}

			// Fetch game info from collection
			const gameRef = doc(db, 'collections', collectionId, 'games', gameId);
			const gameSnap = await getDoc(gameRef);

			if (!gameSnap.exists()) {
				setError('Game not found in collection');
				return;
			}

			const gameData = { id: gameSnap.id, ...gameSnap.data() };
			setGame(gameData);

			// Set metadata state
			setStatus(gameData.status || 'Not Started');
			setPersonalRating(gameData.personalRating || 0);
			setHoursPlayed(gameData.hoursPlayed || '');
			setStartDate(gameData.startDate || '');
			setCompletionDate(gameData.completionDate || '');

			// Fetch journal entries
			const entries = await journalService.getEntries(collectionId, gameId);
			setJournalEntries(entries);
		} catch (err) {
			console.error('Error fetching data:', err);
			setError('Failed to load game data');
		} finally {
			setLoading(false);
		}
	};

	const handleSaveEntry = async (entryData) => {
		try {
			if (editingEntry) {
				await journalService.updateEntry(
					collectionId,
					gameId,
					editingEntry.id,
					entryData
				);
			} else {
				await journalService.createEntry(collectionId, gameId, entryData);
			}
			await fetchData();
			setShowEditor(false);
			setEditingEntry(null);
		} catch (error) {
			console.error('Error saving entry:', error);
			throw error;
		}
	};

	// CRUD operations
	const handleDeleteEntry = async (entryId) => {
		if (!window.confirm('Delete this journal entry?')) {
			return;
		}

		try {
			await journalService.deleteEntry(collectionId, gameId, entryId);
			await fetchData();
		} catch (error) {
			console.error('Error deleting entry:', error);
			alert('Failed to delete entry');
		}
	};

	const handleUpdateMetadata = async () => {
		try {
			await gameService.updateGameMetadata(collectionId, gameId, {
				status,
				personalRating: personalRating || null,
				hoursPlayed: hoursPlayed ? Number(hoursPlayed) : null,
				startDate: startDate || null,
				completionDate: completionDate || null,
			});
			alert('Metadata updated successfully!');
		} catch (error) {
			console.error('Error updating metadata:', error);
			alert('Failed to update metadata');
		}
	};

	const handleRemoveFromCollection = async () => {
		if (
			!window.confirm(
				'Remove this game from the collection? This will delete all journal entries.'
			)
		) {
			return;
		}

		try {
			await gameService.removeGameFromCollection(collectionId, gameId);
			navigate(`/collections/${collectionId}`);
		} catch (error) {
			console.error('Error removing game:', error);
			alert('Failed to remove game');
		}
	};

	const formatDate = (timestamp) => {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-500" role="status">
					Loading...
				</p>
			</div>
		);
	}

	if (error || !game) {
		return (
			<div className="min-h-screen bg-gray-100">
				<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
					<div
						role="alert"
						className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
						{error || 'Game not found'}
					</div>
					<button
						onClick={() => navigate(`/collections/${collectionId}`)}
						className="cursor-pointer mt-4 text-teal-600 hover:text-teal-700 font-medium">
						← Back to Collection
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* Back btn */}
				<nav>
					<button
						onClick={() => navigate(`/collections/${collectionId}`)}
						className="cursor-pointer text-teal-600 hover:text-teal-700 font-medium mb-4 inline-flex items-center">
						← Back to Collection
					</button>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left grid: Game info */}
					<aside className="lg:col-span-1 space-y-6">
						{/* Game card */}
						{/* TODO: Make this a component. Then use this game card for all other game cards (browse results, collection detail ) */}
						<article className="bg-white rounded-xl shadow-sm overflow-hidden">
							{game.coverUrl && (
								<div
									className="h-48 bg-cover bg-center"
									style={{ backgroundImage: `url(${game.coverUrl})` }}
									role="img"
									aria-label={`${game.title} cover`}
								/>
							)}
							<div className="p-4">
								<h1 className="text-xl font-bold text-gray-900 mb-2">
									{game.title}
								</h1>

								{/* Genres */}
								{game.genre && game.genre.length > 0 && (
									<section className="mb-3">
										<h2 className="text-sm font-semibold text-gray-600 mb-1">
											Genres
										</h2>
										<div className="flex flex-wrap gap-1">
											{game.genre.slice(0, 3).map((g, idx) => (
												<span
													key={idx}
													className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
													{g}
												</span>
											))}
										</div>
									</section>
								)}

								{/* Platforms */}
								{game.platform && game.platform.length > 0 && (
									<section className="mb-3">
										<h2 className="text-sm font-semibold text-gray-600 mb-1">
											Available On
										</h2>
										<p className="text-sm text-gray-700">
											{game.platform.slice(0, 3).join(', ')}
										</p>
									</section>
								)}

								{/* API Rating */}
								{game.ratingAPI && (
									<div className="flex items-center text-sm">
										<span className="text-yellow-500 mr-1" aria-hidden="true">
											★
										</span>
										<span className="font-medium">{game.ratingAPI}</span>
										<span className="text-gray-500 ml-1">API Rating</span>
									</div>
								)}
							</div>
						</article>

						{/* Metadata card: input data from the user */}
						<section
							className="bg-white rounded-xl shadow-sm p-4"
							aria-labelledby="game-progress-heading">
							<h2
								id="game-progress-heading"
								className="text-lg font-semibold text-gray-900 mb-4">
								Game Progress
							</h2>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleUpdateMetadata();
								}}>
								{/* Status */}
								<div className="mb-4">
									<label
										htmlFor="game-status"
										className="block text-sm font-medium text-gray-700 mb-2">
										Status
									</label>
									<select
										id="game-status"
										value={status}
										onChange={(e) => setStatus(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
										{STATUS_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.value}
											</option>
										))}
									</select>
								</div>

								{/* Personal rating */}
								<fieldset className="mb-4">
									<legend className="block text-sm font-medium text-gray-700 mb-2">
										Your Rating
									</legend>
									<div
										className="flex gap-1"
										role="group"
										aria-label="Rate game from 1 to 5 stars">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => setPersonalRating(star)}
												aria-label={`${star} star${star !== 1 ? 's' : ''}`}
												aria-pressed={star === personalRating}
												className="cursor-pointer text-2xl transition">
												<span
													className={
														star <= personalRating
															? 'text-yellow-400'
															: 'text-gray-300'
													}>
													★
												</span>
											</button>
										))}
									</div>
								</fieldset>

								{/* Hours */}
								<div className="mb-4">
									<label
										htmlFor="hours-played"
										className="block text-sm font-medium text-gray-700 mb-2">
										Hours Played
									</label>
									<input
										id="hours-played"
										type="number"
										value={hoursPlayed}
										onChange={(e) => setHoursPlayed(e.target.value)}
										min="0"
										step="0.5"
										placeholder="12.5"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
									/>
								</div>

								{/* Start date */}
								<div className="mb-4">
									<label
										htmlFor="start-date"
										className="block text-sm font-medium text-gray-700 mb-2">
										Started Playing
									</label>
									<input
										id="start-date"
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
									/>
								</div>

								{/* Completion date */}
								<div className="mb-4">
									<label
										htmlFor="completion-date"
										className="block text-sm font-medium text-gray-700 mb-2">
										Completion Date
									</label>
									<input
										id="completion-date"
										type="date"
										value={completionDate}
										onChange={(e) => setCompletionDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
									/>
								</div>

								<button
									type="submit"
									className="cursor-pointer w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
									Save Changes
								</button>
							</form>
						</section>

						{/* Remove btn */}
						<button
							onClick={handleRemoveFromCollection}
							className="cursor-pointer w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
							Remove Game from Collection
						</button>
					</aside>

					{/* Right grid: Journal timeline */}
					{/* TODO: Make this a component */}
					<section
						className="lg:col-span-2"
						aria-labelledby="journal-timeline-heading">
						<header className="flex items-center justify-between mb-4">
							<h2
								id="journal-timeline-heading"
								className="text-2xl font-bold text-gray-900">
								Journal Timeline
							</h2>
							<button
								onClick={() => {
									setEditingEntry(null);
									setShowEditor(true);
								}}
								className="cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
								Add Entry
							</button>
						</header>

						{/* Editor */}
						{showEditor && (
							<div className="mb-6">
								<JournalEditor
									onSave={handleSaveEntry}
									onCancel={() => {
										setShowEditor(false);
										setEditingEntry(null);
									}}
									initialData={editingEntry}
								/>
							</div>
						)}

						{/* Entries */}
						{journalEntries.length === 0 ? (
							<div className="bg-white rounded-lg shadow-sm p-12 text-center">
								<p className="text-gray-500 mb-4">No journal entries yet</p>
								<button
									onClick={() => setShowEditor(true)}
									className="cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
									Write Your First Entry
								</button>
							</div>
						) : (
							<div className="space-y-4">
								{journalEntries.map((entry) => (
									<article
										key={entry.id}
										className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
										<header className="flex items-start justify-between mb-2">
											<div className="flex items-center gap-2">
												<time className="text-sm text-gray-500">
													{formatDate(entry.createdAt)}
												</time>
												{entry.mood && (
													<span
														className="text-xl"
														role="img"
														aria-label={`Mood: ${entry.mood}`}>
														{entry.mood}
													</span>
												)}
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => {
														setEditingEntry(entry);
														setShowEditor(true);
													}}
													aria-label="Edit entry"
													className="cursor-pointer text-gray-400 hover:text-teal-600 p-1">
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
														/>
													</svg>
												</button>
												<button
													onClick={() => handleDeleteEntry(entry.id)}
													aria-label="Delete entry"
													className="cursor-pointer text-gray-400 hover:text-red-600 p-1">
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
												</button>
											</div>
										</header>

										{entry.tag && entry.tag !== 'none' && (
											<div className="mb-2">
												<span
													className={`inline-block px-2 py-1 text-xs font-medium rounded ${
														TAG_COLORS[entry.tag]
													}`}>
													{entry.tag}
												</span>
											</div>
										)}

										<div>
											<p
												className={`text-gray-700 whitespace-pre-line wrap-break-word ${
													expandedEntries.has(entry.id) ? '' : 'line-clamp-3'
												}`}>
												{entry.text}
											</p>
											{entry.text.length > 150 && (
												<button
													onClick={() => toggleExpanded(entry.id)}
													aria-expanded={expandedEntries.has(entry.id)}
													className="cursor-pointer text-teal-600 hover:text-teal-700 text-sm mt-2 font-medium">
													{expandedEntries.has(entry.id)
														? 'Show less'
														: 'See more'}
												</button>
											)}
										</div>
									</article>
								))}
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
};
