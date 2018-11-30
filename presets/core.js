const storefront = require('@storefront/core').default;
const versions = require('./package-versions');

storefront.polyfill = require('./polyfill').default;
storefront.versions = versions;

module.exports = storefront;
