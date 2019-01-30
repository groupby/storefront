# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2019-01-30 [YANKED]
A very old version was accidentally released as a new version. Do not use this version.

## [2.2.0] - 2019-01-24
### Changed
- Update `@storefront/core` to 2.2.0.

## [2.1.0] - 2019-01-18
### Changed
- Update `@storefront/core` to 2.1.0.

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/structure` to 2.0.0.
- Update `@storefront/core` to 2.0.0.

## [1.35.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

## [1.34.0] - 2019-01-04
### Removed
- SF-1197: Components `pager`, `pages` and `terminal-pager` have been moved to
  `@storefront/structure`.

### Added
- SF-1197: Added `@storefront/structure` `^1.45.0` as a peer dependency.

### Deprecated
- SF-1197: The static methods `Paging.generateRange` and `Paging.range` have
  been moved to `GenericPaging` in `@storefront/structure` and are deprecated
  in favor of their `GenericPaging` equivalents.
- SF-1197: Importing `Pager`, `Pages` and `TerminalPager` from
  `@storefront/paging` is now deprecated. Import them from
  `@storefront/structure` instead.

## [1.33.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.33.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.32.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.31.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.30.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.29.4] - 2018-10-04
### Changed
- Update `@storefront/core` peer dependency to version 1.47.0.
