module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc-node/jest', { sourcemap: 'inline', dynamicImport: true }],
  },
  testEnvironment: 'node',
};
