// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config.base');

module.exports = {
  collectCoverage: true,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.{ts,tsx}'],
};
