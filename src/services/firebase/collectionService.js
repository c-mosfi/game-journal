import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
	serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTIONS_COLLECTION = 'collections';

export const collectionService = {
	// Create a new collection
	async create(userId, collectionData) {
		try {
			const docRef = await addDoc(collection(db, COLLECTIONS_COLLECTION), {
				userId,
				name: collectionData.name,
				description: collectionData.description || '',
				createdAt: serverTimestamp(),
			});
			return { id: docRef.id, ...collectionData };
		} catch (error) {
			console.error('Error creating collection:', error);
			throw new Error('Failed to create collection');
		}
	},

	// Get all collections for a user
	async getUserCollections(userId) {
		try {
			const q = query(
				collection(db, COLLECTIONS_COLLECTION),
				where('userId', '==', userId)
			);
			const querySnapshot = await getDocs(q);

			const collections = [];
			querySnapshot.forEach((doc) => {
				collections.push({
					id: doc.id,
					...doc.data(),
				});
			});

			// Sort
			collections.sort((a, b) => {
				const aTime = a.createdAt?.toMillis() || 0;
				const bTime = b.createdAt?.toMillis() || 0;
				return bTime - aTime;
			});

			return collections;
		} catch (error) {
			console.error('Error fetching collections:', error);
			throw new Error('Failed to fetch collections');
		}
	},

	// Delete a collection
	async delete(collectionId) {
		try {
			await deleteDoc(doc(db, COLLECTIONS_COLLECTION, collectionId));
		} catch (error) {
			console.error('Error deleting collection:', error);
			throw new Error('Failed to delete collection');
		}
	},
};
