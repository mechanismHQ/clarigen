// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');

const config = {
  ...baseConfig,
  // globals: {
  //   'ts-jest': {
  //     // ts-jest configuration goes here and your IDE will suggest which configs when typing
  //     tsconfig: 'tsconfig.json',
  //   },
  // },
  modulePathIgnorePatterns: [
    'tmp',
    'test/sample-project/clarigen',
    'test/clarinet-project/clarigen',
  ],
};

module.exports = config;
