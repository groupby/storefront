# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [minor]
### Changed
- Update `@storefront/core` to 2.8.0.

## [2.8.0] - 2019-02-21
### Changed
- Update `@storefront/core` to 2.7.0.

## [2.7.0] - 2019-02-15
### Changed
- Update `@storefront/core` to 2.6.0.

## [2.6.0] - 2019-02-07
### Added
- SF-1248: Created `updateSelectedNavigations` and `getSelectedNavigations` methods in order to generate the new `selectedNavigations` prop.
- SF-1248: `refinement-crumbs` receives the new `selectedNavigations` prop and uses that to generate its state.

### Changed
- SF-1248: `refinement-crumbs` now assigns `shouldUpdate` to itself as function that returns `true` if `selectedNavigations` prop is not available.

### Deprecated
- SF-1248: Marking the following methods and properties from the `breadcrumbs` component for deprecation:
  -  Methods deprecated: 
    - `updateFields`
    - `getFields`
  - Properties deprecated: 
    - `field`

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

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/core` to 2.0.0.

## [1.34.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

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
- SF-1196: Update `gb-refinement-crumbs` to pass down navigationLabel and boolean properties.
  - `gb-refinement-crumb` displays a label based on the refinement type of range, boolean, or value.

## [1.31.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.30.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.29.2] - 2018-10-29
### Fixed
- SF-1157: Update `gb-refinement-crumbs` state on update.
