# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [patch]
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
