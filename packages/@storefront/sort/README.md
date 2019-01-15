# StoreFront sort

StoreFront `<gb-sort>` component

[![npm (scoped with tag)](https://img.shields.io/npm/v/@storefront/sort.svg?style=flat-square)](https://www.npmjs.com/package/@storefront/sort)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront-sort/)

## Getting Started

This module requires [`@storefront/core`](https://www.npmjs.com/package/@storefront/core) for the component to render
and receive data from GroupBy microservices.

### Prerequisites

This module is meant to be used in a `node` environment which is bundled for use in the browser.

### Installing

Use `npm` or `yarn` to install in a `node` project that uses `webpack`, `browserify` or similar.

```sh
npm install --save @storefront/sort
# or
yarn add @storefront/sort
```

## Usage

This module provides the `<gb-sort>` component for use with StoreFront.

### Mount tag

```html
<!-- index.html -->
<body>
  <gb-sort></gb-sort>
</body>
```

```js
// index.js
storefront.mount('gb-sort');
```

## Running the tests

Tests can be run to generate coverage information.
Once run, open `coverage/index.html` in your browser to view coverage breakdown.

```sh
npm start coverage
# or
yarn start coverage
```

Tests can be run continuously for development

```sh
npm run tdd
# or
yarn tdd
```

Tests can also be run alone

```sh
npm test
# or
yarn test
```
