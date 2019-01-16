# StoreFront collections

StoreFront `<gb-collections>` component

[![npm (scoped with tag)](https://img.shields.io/npm/v/@storefront/collections.svg?style=flat-square)](https://www.npmjs.com/package/@storefront/collections)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront-collections/)

## Getting Started

This module requires [`@storefront/core`](https://www.npmjs.com/package/@storefront/core) for the component to render
and receive data from GroupBy microservices.

### Prerequisites

This module is meant to be used in a `node` environment which is bundled for use in the browser.

### Installing

Use `npm` or `yarn` to install in a `node` project that uses `webpack`, `browserify` or similar.

```sh
npm install --save @storefront/collections
# or
yarn add @storefront/collections
```

## Usage

This module provides the `<gb-collections>` component for use with StoreFront.

### Mount tag

```html
<!-- index.html -->
<body>
  <gb-collections></gb-collections>
</body>
```

```js
// index.js
storefront.mount('gb-collections');
```

### Building the Package

This package can be built on their own.

```sh
yarn build
```

This package can also be build continuously during development.

```sh
yarn dev
```

### Running Tests

Tests can be run individually within a package.

```sh
yarn test
```

Tests can also be run continuously during development.

```sh
yarn tdd
```

### Linting
This packages can be linted.

```sh
yarn lint
```

This package can also be programmatically linted.

```sh
yarn lint:fix
```

## Contributing
Read our [contributing](../../../CONTRIBUTING.md) documentation to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](../../../LICENSE).
