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
].reduce((versions, packageName) =>
  Object.assign(versions, {
    ['@storefront/' + packageName]: require(`@storefront/${packageName}/package.json`).version
  }), {});
