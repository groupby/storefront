# StoreFront record-count

StoreFront `<gb-record-count>` component

[![npm (scoped with tag)](https://img.shields.io/npm/v/@storefront/record-count.svg?style=flat-square)](https://www.npmjs.com/package/@storefront/record-count)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront/modules/_storefront_record_count.html)

## Getting Started

This module requires [`@storefront/core`](https://www.npmjs.com/package/@storefront/core) for the component to render
and receive data from GroupBy microservices.

### Prerequisites

This module is meant to be used in a `node` environment which is bundled for use in the browser.

### Installing

Use `npm` or `yarn` to install in a `node` project that uses `webpack`, `browserify` or similar.

```sh
npm install --save @storefront/record-count
# or
yarn add @storefront/record-count
```

## Usage

This module provides the `<gb-record-count>` component for use with StoreFront.

### Mount tag

```html
<!-- index.html -->
<body>
  <gb-record-count></gb-record-count>
</body>
```

```js
// index.js
storefront.mount('gb-record-count');
```

### Building the package
To build an individual package, run the following command:
```sh
yarn build
```

To build an individual package in response to changes within the src/ directory, run the following command:
```sh
yarn dev
```

### Running tests
To test an individual packages, run the following command:
```sh
yarn test
```

To test an individual package in response to changes within the src/ directory, run the following command:
```sh
yarn tdd
```

### Linting
To lint a package, run the following command:
```sh
yarn lint
```

To programmatically fix lint errors within a package, run the following command:
```sh
yarn lint:fix
```

## Contributing
Read the [contributing](../../../CONTRIBUTING.md) file to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](../../../LICENSE).
