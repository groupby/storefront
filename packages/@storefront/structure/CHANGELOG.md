# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.8.1] - 2019-04-04
### Fixed
- SF-1317: Items now appear in `gb-carousel` on mount.

## [2.8.0] - 2019-02-25
### Changed
- Update `@storefront/core` to 2.8.0.

## [2.7.0] - 2019-02-21
### Changed
- Update `@storefront/core` to 2.7.0.

## [2.6.0] - 2019-02-14
### Changed
- Update `@storefront/core` to 2.6.0.

## [2.5.1] - 2019-02-12
### Added
- SF-1257: Added `onMount` method `gb-infinite-list`.
  - `onMount` will invoke `this.set(true)`.
  - This is a workaround for a [riot.js issue](https://github.com/riot/riot/issues/2655) which prevents components from receiving accurate `props`.

## [2.5.0] - 2019-02-04
### Changed
- Update `@storefront/core` to 2.5.0.

## [2.4.0] - 2019-01-30
### Changed
- Update `@storefront/core` to 2.4.0.
- Reverted v2.3.0.

## [2.3.0] - 2019-01-30 [YANKED]
A very old version was accidentally released as a new version. Do not use this version.

## [2.2.0] - 2019-01-24
### Changed
- Update `@storefront/core` to 2.2.0.

## [2.1.0] - 2019-01-18
### Changed
- Update `@storefront/core` to 2.1.0.

## [2.0.1] - 2019-01-17
### Removed
- SF-1255: Remove redundant invocation of `FilteredList#updateItems()`.
  - This update reduces the number of times the component template is rendered, which should result in an increase in perceived performance.

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/core` to 2.0.0.

## [1.48.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

### Added
- SF-1073: Update `gb-filtered-list` component to have a "Select All" button.
  - `gb-filtered-list` now has a "Select All" button that will select all of the available refinements after an initial filter.

## [1.47.1] - 2019-01-14
### Changed
- SF-1241: Update filtered list component to use table of DOM key strings.

## [1.47.0] - 2019-01-11
### Added
- SF-1133: Add support for selecting last filtered refinement on Enter.
  - In cases where a filter term yields 1x result, hitting the enter key now selects the remaining refinement.
  - If a given refinement matches the filter term, the `gb-matches-term` class is added to the corresponding DOM node.
    - This class may be used to emphasize the matched refinement (eg. when focus is applied to the filter field).

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
