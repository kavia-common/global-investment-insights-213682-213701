/** Jest configuration for React app with axios mock mapping and Babel transform. */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^axios$': '<rootDir>/__mocks__/axios.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Transpile ESM packages that Jest can't run directly; axios is mocked but included here for safety.
  transformIgnorePatterns: ['/node_modules/(?!(axios))/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
