# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [major]
### Changed
- Bump version to 2.0.0 to match the other components. This release is otherwise the same as 1.7.1.

## [1.7.1] - 2019-01-16
### Changed
- Update `@storefront/structure` to 2.0.0.
- Update `@storefront/core` to 2.0.0.
- SF-1185: Make a history store
  - Use flag to indicate to `replaceState` that it should build and parse the url.

## [1.7.0] - 2019-01-14
### Changed
- Update `@storefront/core` to 1.56.0.

## [1.6.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.6.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.5.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.4.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.3.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.2.3] - 2018-10-26
### Fixed
- SF-1075: Only fetch more products when crossing a threshold.
  - More products are only fetched when the view gets within 50px of the top or bottom of the container.
