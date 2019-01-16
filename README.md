# StoreFront

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront)

StoreFront (SF) is an e-commerce UI component library that is fully integrated with the GroupBy ecosystem/services.

## Getting Started

### Prerequisites

 - yarn


## Setup

Use the `./scripts/setup.sh` script from the root of the project monorepo in order to build all of the StoreFront packages.

```sh
  ./scripts/setup.sh
```

## Commands

Use the following commands from individual packages contained within the StoreFront monorepo. The individual packages can be within the [packages/@storefront](packages/@storefront) directory.

### Building Packages

Individual packages can be built on their own.

```sh
yarn build
```

Packages can also be build continuously during development.

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
Packages can be linted.

```sh
yarn lint
```

Packages can also be programmatically linted.

```sh
yarn lint:fix
```

## Contributing
Read our [contributing](CONTRIBUTING.md) documentation to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](LICENSE).
