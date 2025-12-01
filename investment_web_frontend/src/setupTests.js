import '@testing-library/jest-dom';

// Ensure axios is mocked in CRA's default test setup and point to manual mock
jest.mock('axios', () => require('../__mocks__/axios.js'));

// Reset mocks between tests for determinism
afterEach(() => {
  jest.clearAllMocks();
});
