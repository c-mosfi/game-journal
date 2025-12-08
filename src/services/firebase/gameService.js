import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	deleteDoc,
	serverTimestamp,
	query,
	orderBy,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const gameService = {
	async addGameToCollection(collectionId, gameData) {
		try {
			// Check if game already exists in collection
			const gameRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				String(gameData.id)
			);
			const gameSnap = await getDoc(gameRef);

			if (gameSnap.exists()) {
				throw new Error('Game already exists in this collection');
			}

			// Prepare game document
			const gameDoc = {
				gameId: gameData.id,
				title: gameData.name || 'Unknown Title',
				coverUrl: gameData.background_image || '',
				ratingAPI: gameData.rating || null,
				genre: gameData.genres?.map((g) => g.name) || [],
				platform: gameData.platforms?.map((p) => p.platform.name) || [],
				addedAt: serverTimestamp(),
				// Default metadata
				status: 'Not Started',
				personalRating: null,
				startDate: null,
				completionDate: null,
				hoursPlayed: null,
			};

			// Add to Firestore
			await setDoc(gameRef, gameDoc);

			return { id: String(gameData.id), ...gameDoc };
		} catch (error) {
			console.error('Error adding game to collection:', error);
			throw error;
		}
	},

	async getGamesInCollection(collectionId) {
		try {
			const gamesRef = collection(db, 'collections', collectionId, 'games');
			const q = query(gamesRef, orderBy('addedAt', 'desc'));
			const querySnapshot = await getDocs(q);

			const games = [];
			querySnapshot.forEach((doc) => {
				games.push({
					id: doc.id,
					...doc.data(),
				});
			});

			return games;
		} catch (error) {
			console.error('Error fetching games in collection:', error);
			throw new Error('Failed to fetch games');
		}
	},

	async isGameInCollection(collectionId, gameId) {
		try {
			const gameRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				String(gameId)
			);
			const gameSnap = await getDoc(gameRef);
			return gameSnap.exists();
		} catch (error) {
			console.error('Error checking if game exists:', error);
			return false;
		}
	},

	async updateGameMetadata(collectionId, gameId, metadata) {
		try {
			const gameRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				String(gameId)
			);

			const updateData = {};
			if (metadata.status !== undefined) updateData.status = metadata.status;
			if (metadata.personalRating !== undefined)
				updateData.personalRating = metadata.personalRating;
			if (metadata.startDate !== undefined)
				updateData.startDate = metadata.startDate;
			if (metadata.completionDate !== undefined)
				updateData.completionDate = metadata.completionDate;
			if (metadata.hoursPlayed !== undefined)
				updateData.hoursPlayed = metadata.hoursPlayed;

			await setDoc(gameRef, updateData, { merge: true });
		} catch (error) {
			console.error('Error updating game metadata:', error);
			throw new Error('Failed to update game metadata');
		}
	},

	async removeGameFromCollection(collectionId, gameId) {
		try {
			const gameRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				String(gameId)
			);
			await deleteDoc(gameRef);
		} catch (error) {
			console.error('Error removing game from collection:', error);
			throw new Error('Failed to remove game');
		}
	},
};
