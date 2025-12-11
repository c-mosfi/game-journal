import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

// Mock Firebase
vi.mock('../src/services/firebase/firebaseConfig', () => ({
	auth: {},
	db: {},
}));

// Mock navigate from react-router-dom by default
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});
