# StoreFront structure

StoreFront structural components, building blocks for high-level components

[![npm (scoped with tag)](https://img.shields.io/npm/v/@storefront/structure.svg?style=flat-square)](https://www.npmjs.com/package/@storefront/structure)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront/modules/_storefront_structure.html)

## Getting Started

This module requires [`@storefront/core`](https://www.npmjs.com/package/@storefront/core) for the components to render.

### Prerequisites

This module is meant to be used in a `node` environment which is bundled for use in the browser.

### Installing

Use `npm` or `yarn` to install in a `node` project that uses `webpack`, `browserify` or similar.

```sh
npm install --save @storefront/structure
# or
yarn add @storefront/structure
```

## Usage

This module provides a number of structural components for use with StoreFront.

### Building the package
To build an individual package, run the following command:
```sh
yarn build
```

To build an individual package in response to changes within the `src` directory, run the following command:
```sh
yarn dev
```

### Running tests
To test an individual packages, run the following command:
```sh
yarn test
```

To test an individual package in response to changes within the `src` and `test` directories, run the following command:
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

## Components
*   `<gb-badge>`
*   `<gb-button>`
*   `<gb-container>`
*   `<gb-custom-select>`
*   `<gb-icon>`
*   `<gb-link>`
*   `<gb-list>`
*   `<gb-list-item>`
*   `<gb-native-select>`
*   `<gb-raw>`
*   `<gb-select>`
*   `<gb-select-option>`
*   `<gb-toggle>`

## Contributing
Read the [contributing](../../../CONTRIBUTING.md) file to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](../../../LICENSE).

