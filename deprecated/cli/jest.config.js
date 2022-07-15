// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');

const config = {
  ...baseConfig,
  modulePathIgnorePatterns: [
    'tmp',
    'test/sample-project/clarigen',
    'test/clarinet-project/clarigen',
  ],
};

module.exports = config;
