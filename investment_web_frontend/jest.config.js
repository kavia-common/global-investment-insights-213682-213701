/** Jest configuration for React app with axios mock mapping and Babel transform. */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Ensure certain ESM packages are transpiled; axios included for safety though we mock it.
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  moduleNameMapper: {
    '^axios$': '<rootDir>/__mocks__/axios.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  // Make sure Jest resolves from project root
  roots: ['<rootDir>/src', '<rootDir>/__mocks__'],
};
