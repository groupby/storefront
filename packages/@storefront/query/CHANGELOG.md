# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [patch]
### Changed
- SF-1241: Update search box component to use table of DOM key strings.

### Fixed
- SF-1241: Fix Chrome-specific issue where `&` character cannot be inserted into search box.

## [1.39.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.39.0] - 2018-12-19
### Changed
- Update `@storefront/core` to 1.55.0.

## [1.38.0] - 2018-12-04
### Changed
- Update `@storefront/core` to 1.54.0.

## [1.37.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.53.0.

## [1.36.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.35.9] - 2018-10-05
### Fixed
- SF-1119: Register search box with the autocomplete service.
  - The `search-box` component accepts a new prop `register`, which is used to determine if the search box should register itself with the autocomplete service. The `query` component sets this to the value of `props.showSayt`.
