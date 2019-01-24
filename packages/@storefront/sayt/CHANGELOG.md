# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2019-01-24
### Changed
- Update `@storefront/core` to 2.2.0.

## [2.1.0] - 2019-01-18
### Changed
- Update `@storefront/core` to 2.1.0.
- SF-948: Update `autocomplete` to support a debounced variation of `updateProducts()`.
  - To apply the debounce, update the `autocomplete` configuration as follows:

    ```js
    ...
    autocomplete: {
      ...
      debounceThreshold: 200, // Milliseconds by which the function should be debounced.
      ...
    },
    ...
    ```

  - If no value is provided, the `updateProducts()` method will not be debounced.

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/core` to 2.0.0.

## [1.41.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

## [1.40.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.40.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.39.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.38.1] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

### Fixed
- SF-1192: Only show sayt if search has finished fetching.
  - While search is fetching, set sayt to inactive.
  - Addresses the bug of sayt remaining open when a search is submitted before autocomplete products have returned.

## [1.38.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.37.7] - 2018-10-04
### Changed
- Update @storefront/core peer dependency to version 1.47.0.
