module.exports = {
  name: 'StoreFront',
  out: 'docs',
  mode: 'modules',
  exclude: ['**/test/**', '**/node_modules/**'],
  'external-modulemap': '.*packages\/(@storefront\/[^\/]*)\/.*'
};
