/**
 * Jest setup for React Testing Library and global mocks.
 * CRA automatically picks up this file name (src/setupTests.js).
 */
import '@testing-library/jest-dom';

// Mock axios globally to avoid real HTTP calls in tests and provide stable shapes
jest.mock('axios', () => require('../__mocks__/axios.js'));

// Reset mocks between tests for determinism
afterEach(() => {
  jest.clearAllMocks();
});
