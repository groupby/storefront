# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2019-01-18
### Changed
- SF-1264: Add an `if` to hide the navigation display component when state is inactive.
  - Modify `gb-navigation-header` to trigger icon image update on prop changes.

## [2.1.0] - 2019-01-18
### Changed
- Update `@storefront/core` to 2.1.0.

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/structure` to 2.0.0.
- Update `@storefront/core` to 2.0.0.

## [1.45.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

### Added
- SF-1073: Added `selectMatchedRefinements` to `gb-filter-refinement-controls`.
  - `selectMatchedRefinements` will create and dispatch a `selectMultipleRefinements` or a `selectMultiplePastPurchaseRefinements` action when a user interacts with the "Select All" button within `gb-filtered-list`.
  - Only "orable" navigations will have the "Select All" button available.
  - The `enableSelectAll` property within `gb-filter-refinement-controls` is false by default, so the "Select All" button will be disabled.
  - The `enableSelectAll` property will be configurable in a future release, but at this time will remain disabled.

## [1.44.0] - 2019-01-03
### Changed
- SF-1197: Restored the "more" button on `gb-filter-refinement-controls`.
- SF-1197: `gb-filtered-refinement-list` is paginated when there are no more refinements
  to fetch for that navigation.
- SF-1197: `FilteredRefinementList` now consumes `filterControls`.

## [1.43.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.43.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.
- SF-1230: Improve support for past purchase features.
  - Navigation components can now be configured to fetch and display 'more' past purchase refinements.

## [1.42.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.41.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.40.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.39.0] - 2018-10-10
### Added
- SF-1112: Add pastPurchases storeSection support.

### Changed
- Update @storefront/core peer dependency to version 1.47.0.

### Fixed
- SF-1104: Export NavigationHeader.
