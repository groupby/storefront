# StoreFront

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![API Reference](https://img.shields.io/badge/API_reference-latest-blue.svg?style=flat-square)](https://groupby.github.io/storefront/index.html)

StoreFront (SF) is an e-commerce UI component library that is fully integrated with the GroupBy ecosystem/services.

## Getting Started

### Prerequisites
 - [yarn](https://yarnpkg.com/en/)

## Setup
Run the `./scripts/setup.sh` script from the root of the project monorepo in order to build all of the StoreFront packages.
```sh
  ./scripts/setup.sh
```

## Commands
The following commands are in the context of an individual package contained within the StoreFront monorepo. The individual packages can be found within the [packages/@storefront](packages/@storefront) directory.

### Building packages
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
Read the [CONTRIBUTING.md](CONTRIBUTING.md) file to learn about how to contribute to the StoreFront project.

## License
StoreFront and its related packages are [MIT licensed](LICENSE).
