import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
	serverTimestamp,
	query,
	orderBy,
	updateDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * FIRESTORE STRUCTURE:
 *
 * collections/{collectionId}/games/{gameId}/journal/ (subcollection)
 *   └─ {entryId}/ (document)
 *       ├─ text: string (max 5000 chars)
 *       ├─ tag: string (progress/theory/mission/reminder/final_review/none)
 *       ├─ mood: string (emoji)
 *       ├─ createdAt: timestamp
 *       └─ updatedAt: timestamp
 */

export const journalService = {
	async createEntry(collectionId, gameId, entryData) {
		try {
			const journalRef = collection(
				db,
				'collections',
				collectionId,
				'games',
				gameId,
				'journal'
			);

			const entryDoc = {
				text: entryData.text || '',
				tag: entryData.tag || 'none',
				mood: entryData.mood || '',
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			};

			const docRef = await addDoc(journalRef, entryDoc);

			return { id: docRef.id, ...entryDoc };
		} catch (error) {
			console.error('Error creating journal entry:', error);
			throw new Error('Failed to create journal entry');
		}
	},

	async getEntries(collectionId, gameId) {
		try {
			const journalRef = collection(
				db,
				'collections',
				collectionId,
				'games',
				gameId,
				'journal'
			);
			const q = query(journalRef, orderBy('createdAt', 'desc'));
			const querySnapshot = await getDocs(q);

			const entries = [];
			querySnapshot.forEach((doc) => {
				entries.push({
					id: doc.id,
					...doc.data(),
				});
			});

			return entries;
		} catch (error) {
			console.error('Error fetching journal entries:', error);
			throw new Error('Failed to fetch journal entries');
		}
	},

	async updateEntry(collectionId, gameId, entryId, entryData) {
		try {
			const entryRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				gameId,
				'journal',
				entryId
			);

			const updateData = {
				...entryData,
				updatedAt: serverTimestamp(),
			};

			await updateDoc(entryRef, updateData);
		} catch (error) {
			console.error('Error updating journal entry:', error);
			throw new Error('Failed to update journal entry');
		}
	},

	async deleteEntry(collectionId, gameId, entryId) {
		try {
			const entryRef = doc(
				db,
				'collections',
				collectionId,
				'games',
				gameId,
				'journal',
				entryId
			);
			await deleteDoc(entryRef);
		} catch (error) {
			console.error('Error deleting journal entry:', error);
			throw new Error('Failed to delete journal entry');
		}
	},
};
