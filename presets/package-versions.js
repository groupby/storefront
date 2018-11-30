module.exports = [
  'breadcrumbs',
  'collections',
  'core',
  'details',
  'did-you-mean',
  'flux-capacitor',
  'infinite-scroll',
  'navigation',
  'page-size',
  'paging',
  'products',
  'query',
  'recommendations',
  'record-count',
  'related-queries',
  'sayt',
  'sort',
  'structure',
  'template',
].reduce((versions, package) =>
  Object.assign(versions, {
    ['@storefront/' + package]: require(`@storefront/${package}/package.json`).version
  }), {});
