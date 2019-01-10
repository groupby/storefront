module.exports = {
  name: 'StoreFront',
  out: 'docs',
  mode: 'modules',
  // Below is required required b/c typedoc is unable to resolve 'Duplicate Identifier' error associated with TrackerClient within the gb-tracker-client.d.ts file.
  ignoreCompilerErrors: true,
  exclude: ['**/test/**', '**/node_modules/**'],
  'external-modulemap': '.*packages\/(@storefront\/[^\/]*)\/.*'
};
