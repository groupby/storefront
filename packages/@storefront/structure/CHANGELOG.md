# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.46.0] - 2019-01-03
### Changed
- SF-1197: `gb-filtered-list` now uses a `gb-paged-list` instead of a `gb-list`.
  - The list is paginated to prevent large lists from locking up the display.
  - **Potentially breaking:** Stylesheets relying on `gb-list` being a direct
    child of `gb-filtered-list` (i.e. `gb-filtered-list > gb-list`) will need
    to be changed.
  - Pagination is enabled by default. To disable it, set the `paginated` prop
    on `gb-filtered-list` to `false`.

### Added
- SF-1197: `Pager`, `Pages` and `TerminalPager` components from `@storefront/paging`
  have been moved into this package.
- SF-1197: A new `GenericPaging` component was added as a generic version of
  `Paging` in `@storefront/paging` that does not rely on the store.
- SF-1197: A new `PagedList` component was added to display a paginated list of items.
- SF-1197: `FilteredList` learned the `paginated` prop to enable or disable pagination.
  - It is `true` by default to enable pagination.

## [1.45.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.45.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.44.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.43.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.42.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.41.1] - 2018-11-14
### Changed
- Update `@storefront/core` to 1.51.5.

## [1.41.0] - 2018-10-17
### Fixed
- SF-1067: Add `filtered-list` enter key selection on term match.
