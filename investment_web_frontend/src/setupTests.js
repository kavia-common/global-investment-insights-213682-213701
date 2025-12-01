import '@testing-library/jest-dom';

// Ensure axios is mocked in CRA's default test setup and point to manual mock
jest.mock('axios', () => require('<rootDir>/__mocks__/axios.js'));
