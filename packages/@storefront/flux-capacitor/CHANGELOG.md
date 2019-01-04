# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.67.2] - 2019-01-04
### Fixed
- SF-1243: Remove unnecessary default values in query reducer.

## [1.67.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.67.0] - 2018-12-19
### Changed
- SF-1230: Add support for fetching more past purchase refinements.
  - Implementations can now fetch and ingest additional refinements for past purchase-type navigations.

## [1.66.0] - 2018-12-04
### Added
- SF-1196: Added support for `toggle` type navigations.
  - The result is that `toggle` type navigations generate refinement crumbs that display the navigation name.
  - `toggle` type navigations can be specified under the new top-level configuration object `navigations`.

## [1.65.1] - 2018-11-27
### Changed
- SF-1199: Update `groupby-api` version to `2.5.7`.

## [1.65.0] - 2018-11-26
### Changed
- SF-1192: Update `fetchProductDetails` action to include redirect parameter.
  - Set `search` property of `isFetching` state slice within the store to `false` when a single result redirect is triggered.

### Added
- SF-1192: Create `isFetching` selector
  - Selector is needed in order to retrieve `isFetching` portion of the store.

## [1.64.0] - 2018-11-26
### Added
- SF-1170: Update `FluxCapacitor` class to expose `all()` and `allOff()` instance methods.
  - `all()` invokes a callback after each event in a given collection has been emitted at least once.
  - `allOff()` removes a callback associated with a given collection of events.

## [1.63.1] - 2018-11-07
### Fixed
- SF-1167: Call `replaceState` at the end of the details request.
  - Don't call `replaceState` in the products saga before the `fetchProductDetails` action on a single results redirect page

## [1.63.0] - 2018-10-26
### Added
- SF-1146: Add pastPurchases and recommendations overrides.
  - Overrides accept either an object or function, like all the other overrides.
