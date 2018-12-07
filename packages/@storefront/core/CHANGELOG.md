# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [<release type>]
### Fixed
- SF-1229: Use the `pastPurchaseSortSelected` selector to build up the `pastPurchase` request.

## [1.54.0] - 2018-12-04
### Changed
- Update `@storefront/flux-capacitor` to 1.66.0.

## [1.53.2] - 2018-12-03
### Fixed
- SF-1205: Add fallback for document.baseURI.
  - Prevents malformed routing tables when StoreFront is running in IE11.

## [1.53.1] - 2018-11-27
### Changed
- Update `@storefront/flux-capacitor` to 1.65.1.

## [1.53.0] - 2018-11-26
### Changed
- Update `@storefront/flux-capacitor` to 1.65.0.

## [1.52.0] - 2018-11-26
### Changed
- Update `@storefront/flux-capacitor` to 1.64.0.

### Added
- SF-1170: Add support for `subscribeWith()` method.
  - Allows components to invoke callbacks after each event in a given collection has been emitted at least once.
  - Automatically unregisters callbacks when the component is unmounted.

## [1.51.5] - 2018-11-14
### Fixed
- SF-1132: Default to an empty array for array methods and pass through the rest of the request.

## [1.51.4] - 2018-11-13
## Changed
- SF-1132: Make properties optional when parsing search state.

## [1.51.3] - 2018-11-08
### Changed
- SF-1181: Set `gb-tracker-client` in package.json to caret.

## [1.51.2] - 2018-11-08
### Fixed
- SF-1168: `mergeSearchNavigationsState` and `mergePastPurchaseNavigationsState` should merge url and store navigations

## [1.51.1] - 2018-11-07
### Changed
- Update `@storefront/flux-capacitor` to 1.63.1

### Fixed
- SF-1159: URL state not being preserved in the store.
  - `refreshState` from the url state when dispatching fetch requests.

## [1.51.0] - 2018-10-26
### Added
- SF-1146: Add pastPurchases and recommendations overrides defaults.

### Changed
- Upgrade `@storefront/flux-capacitor` to version 1.63.0.
