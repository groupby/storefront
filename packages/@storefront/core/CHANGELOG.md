# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [minor]
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
