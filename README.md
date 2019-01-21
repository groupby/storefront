# StoreFront

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront/index.html)

StoreFront (SF) is an e-commerce UI component library that is fully integrated with the GroupBy ecosystem/services.

This is the StoreFront monorepo that contains the following npm packages:

- [@storefront/breadcrumbs](https://www.npmjs.com/package/@storefront/breadcrumbs)
- [@storefront/collections](https://www.npmjs.com/package/@storefront/collections)
- [@storefront/core](https://www.npmjs.com/package/@storefront/core)
- [@storefront/details](https://www.npmjs.com/package/@storefront/details)
- [@storefront/did-you-mean](https://www.npmjs.com/package/@storefront/did-you-mean)
- [@storefront/flux-capacitor](https://www.npmjs.com/package/@storefront/flux-capacitor)
- [@storefront/infinite-scroll](https://www.npmjs.com/package/@storefront/infinite-scroll)
- [@storefront/navigation](https://www.npmjs.com/package/@storefront/navigation)
- [@storefront/page-size](https://www.npmjs.com/package/@storefront/page-size)
- [@storefront/paging](https://www.npmjs.com/package/@storefront/paging)
- [@storefront/products](https://www.npmjs.com/package/@storefront/products)
- [@storefront/query](https://www.npmjs.com/package/@storefront/query)
- [@storefront/recommendations](https://www.npmjs.com/package/@storefront/recommendations)
- [@storefront/record-count](https://www.npmjs.com/package/@storefront/record-count)
- [@storefront/related-queries](https://www.npmjs.com/package/@storefront/related-queries)
- [@storefront/sayt](https://www.npmjs.com/package/@storefront/sayt)
- [@storefront/sort](https://www.npmjs.com/package/@storefront/sort)
- [@storefront/structure](https://www.npmjs.com/package/@storefront/structure)
- [@storefront/template](https://www.npmjs.com/package/@storefront/template)

## Getting Started

### Prerequisites
 - [yarn](https://yarnpkg.com/en/)
 - [node](https://nodejs.org/en/)

## Setup
Run the `./scripts/setup.sh` script from the root of the monorepo to build all of the StoreFront packages.
```sh
  ./scripts/setup.sh
```

## Commands
The following commands are run in the context of an individual package contained within the StoreFront monorepo. The individual packages can be found within the [`packages/@storefront`](packages/@storefront) directory.

### Building packages
To build an individual package, run the following command:
```sh
yarn build
```

To build an individual package in response to changes within the `src` directory, run the following command:
```sh
yarn dev
```

### Running tests
To test an individual package, run the following command:
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

## Contributing
Read the [CONTRIBUTING.md](CONTRIBUTING.md) file to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](LICENSE).
