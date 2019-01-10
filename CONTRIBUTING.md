# Contributing to StoreFront

When contributing to StoreFront, make a branch for your change named
with the ticket number. As part of your change, add an entry to the
changelog that describes your change. When your pull request is merged
into `master`, a release is made based on the changelog entry.

## Modify the CHANGELOG.md

Each package has a `CHANGELOG.md` file that describes the changes made
to that package. These changelogs follow the [Keep a Changelog](https://keepachangelog.com)
format.

Use the `./scripts/add-unreleased-section.sh` script to add an
"Unreleased" section to the specified package. For example, to add an
"Unreleased" section to the `core` package, run this at the root of the
repo:

```sh
./scripts/add-unreleased-section.sh core
```

The script will add a section to the changelog of the specified package
in the following format:

```md
## [Unreleased] [<release type>]
### Changed
- <Describe changes>

### Removed
- <Describe removals>

### Added
- <Describe additions>

### Fixed
- <Describe fixes>

### Deprecated
- <Describe deprecations>

### Security
- <Describe security fixes>
```

Choose a release type according to [SemVer](https://semver.org/), fill
in the appropriate sections, and remove any sections that do not apply.

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
