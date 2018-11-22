const storefront = require('@storefront/core').default;

storefront.polyfill = require('./polyfill').default;

module.exports = storefront;
