# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.63.1] - 2018-11-07
### Fixed
- SF-1167: Call `replaceState` at the end of the details request.
  - Don't call `replaceState` in the products saga before the `fetchProductDetails` action on a single results redirect page

## [1.63.0] - 2018-10-26
### Added
- SF-1146: Add pastPurchases and recommendations overrides.
  - Overrides accept either an object or function, like all the other overrides.

