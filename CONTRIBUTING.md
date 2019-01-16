# Contributing to StoreFront

Thank you for your interest in contributing to StoreFront.

The following is a set of guidelines for contributing to StoreFront.
Make sure to read the [README](README.md) first to get set up with the
project.

## Making a change

StoreFront follows the [GitHub flow][] for branching and merging. All
work is done on feature branches, which fork from and merge into
`master`.

[GitHub flow]: https://help.github.com/articles/github-flow/

Preferably, you should have write access to this repo and will make a
branch directly on it. If you do not, request access or fork the repo.

1. Discuss any non-trivial changes with the StoreFront team before
   committing to any work to ensure that there are no surprises for
   either party.
2. Branch from the tip of `master`. If your change has a Jira ticket
   associated with it (most changes should), name the branch after the
   ticket number (e.g. `SF-1156`); if not, name it something
   descriptive.
3. Make your change. Your change should build correctly and be fully tested.
   - Use `yarn dev` in each package that is being changed. This command
     starts a process that builds the package whenever one of its files
     changes. Note that the process must be restarted if a file in a
     dependency changes (e.g. a change in flux-capacitor will not cause
     core to rebuild).
   - Each package has unit tests in the package's `test` directory. Be
     sure to add unit tests for any new code you write and for any
     existing code you change. There are currently no integration tests,
     end-to-end tests, or tests for HTML templates.
   - While developing, you can use the `yarn tdd` command in the package
     being changed to run the tests whenever a file is saved.
4. Add a changelog entry in each package that was changed. See the
   [Modifying the changelog](#modifying-the-changelog) section below.
5. Push your branch up and make a [pull request](https://help.github.com/articles/creating-a-pull-request/)
   against the `master` branch. Give your pull request a title in this
   format: `SF-####: Descriptive title`, where `SF-####` is the Jira
   ticket number.
   - A body is encouraged, but not required. It may be used as the
     message of the final commit. If a body is present, it should
     explain the general approach, clarify any tricky changes, and point
     out any breaking or incompatible changes.
6. Implement any feedback left by reviewers. If your branch becomes out
   of date from `master`, rebase your branch on to the tip of `master`.
   Do not merge `master` into your branch. It is required for the branch
   to be up to date with `master` to be able to merge the branch.
6. When all feedback has been addressed and the pull request is approved,
   the pull request will be squash-merged into `master` by a team member.
7. Once the branch is merged, delete the branch.
   - If further changes are required after the branch is merged in, make
     them on a new branch. Do not reuse the old branch.

A release will be made automatically when the pull request is merged. It
will take approximately ten to fifteen minutes for the change to be
released.

## Modifying the changelog

Each package has a `CHANGELOG.md` file that describes the changes made
to that package. These changelogs follow the [Keep a Changelog](https://keepachangelog.com)
format.

There is also a `CHANGELOG.md` file at the root of the repo; do not edit
this file. This file is managed automatically and entries will be added
to it at release time.

Use the [`scripts/add-unreleased-section.sh`](scripts/add-unreleased-section.sh)
script to add an "Unreleased" section to the specified package. For
example, to add an "Unreleased" section to the `core` package, run this
at the root of the repo:

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
