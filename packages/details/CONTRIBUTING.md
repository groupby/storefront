# Contributing to StoreFront

When contributing to StoreFront, make a branch for your change named
with the ticket number. As part of your change, add an entry to the
changelog that describes your change. When your pull request is merged
into `master`, a release is made based on the changelog entry.

## Modify the CHANGELOG.md

Our CHANGELOG.md follows the [Keep a Changelog](https://keepachangelog.com)
format. Add an "Unreleased" entry to the top of the
changelog in the following format, removing any inapplicable sections:

```md
## [Unreleased] [<release type>]
### Added
- <Describe additions>

### Changed
- <Describe changes>

### Deprecated
- <Describe deprecations>

### Removed
- <Describe removals>

### Fixed
- <Describe fixes>

### Security
- <Describe security fixes>
```

The release type determines how the version number is bumped when the
change is released. It corresponds to the argument to `npm version`.

Supported release types:

- `major`
- `minor`
- `patch`
- `premajor`
- `preminor`
- `prepatch`
- `prerelease`
- `from-git`
