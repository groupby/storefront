# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.36.0] - 2018-11-26
### Changed
- Update `@storefront/core` to 1.52.0.

## [1.35.9] - 2018-10-05
### Fixed
- SF-1119: Register search box with the autocomplete service.
  - The `search-box` component accepts a new prop `register`, which is used to determine if the search box should register itself with the autocomplete service. The `query` component sets this to the value of `props.showSayt`.
