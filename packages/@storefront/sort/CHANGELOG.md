# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [patch]
### Changed
- SF-1256: Sort component will now extract label information from the store.
  - The component has been configured to read in sort labels that are available within the store, but will yield to labels provided to the component via props.

### Added
- SF-1256: Sort component now has an `onUpdate` method.
  - The `onUpdate` method is used to spread new `props` back into the component state whenever it re-renders.

## [2.1.0] - 2019-01-18
### Changed
- Update `@storefront/core` to 2.1.0.

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/core` to 2.0.0.

## [1.36.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

## [1.35.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.35.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.34.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.33.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.32.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.31.0] - 2018-10-09
### Added
- SF-1110: Add pastPurchasesLabels
