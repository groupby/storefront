# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.38.1] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

### Fixed
- SF-1192: Only show sayt if search has finished fetching.
  - While search is fetching, set sayt to inactive.
  - Addresses the bug of sayt remaining open when a search is submitted before autocomplete products have returned.

## [1.38.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.37.7] - 2018-10-04
### Changed
- Update @storefront/core peer dependency to version 1.47.0.
