module.exports = {
  name: 'Clarigen',
  out: 'doc',
  theme: 'default',
  exclude: '*.test.ts',
  'external-modulemap': '.*packages/([^/]+)/.*',
  excludeExternals: false,
  entryPoints: [
    'packages/cli/src/index.ts',
    'packages/test/src/index.ts',
    'packages/core/src/index.ts',
    'packages/web/src/index.ts',
  ],
};
