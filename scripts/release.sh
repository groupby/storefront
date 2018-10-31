#!/usr/bin/env bash

set -eo pipefail

new_version=

die() {
  local exit_code=1
  local OPTIND=1
  local opt

  while getopts "c:" opt; do
    case "$opt" in
      c)
        exit_code="$OPTARG"
        ;;
    esac
  done

  shift $((OPTIND - 1))

  echo "ERROR:" "$@" >&2
  exit $exit_code
}

info() {
  echo "===>" "$@"
}

print_usage() {
  cat <<EOF
Usage: ${0##*/}
       ${0##*/} -h
Creates a release.

This performs the following steps:
1. Generates the documentation
2. Bumps the version number in package.json
3. Finalizes the release in CHANGELOG.md
4. Creates a git tag

EXIT CODES:
- 0: Success
- 1: General error
- 2: Usage error
- 3: Unsupported release type
EOF
}

git_push() {
  info "Pushing..."
  git push --no-verify origin HEAD "$@"
}

# Only allow this script to run in package directories
node -e 'process.exit(require("./package.json").private === true)' || die 'Not in a package directory.'

while getopts "h" opt; do
  case "$opt" in
    h)
      print_usage
      exit 0
      ;;
  esac
done

shift $((OPTIND - 1))

info "Generating docs..."
yarn docs
git add ./docs

release() {
  info "Determining the release type..."
  local release_type="$(sed -n '/## \[Unreleased\] \[\(.*\)\]/ s//\1/p' CHANGELOG.md)"
  case "$release_type" in
    major | minor | patch | premajor | preminor | prepatch | prerelease | from-git)
      : # valid; do nothing
      ;;
    '')
      info "Could not detect potential release in the CHANGELOG."
      return
      ;;
    *)
      die -c 3 "Unsupported release type: ${release_type}."
      ;;
  esac

  info "Bumping version in package.json..."
  new_version="$(npm version "$release_type" --no-git-tag-version)"
  info "New version: ${new_version}"

  info "Updating changelog..."
  ed -s CHANGELOG.md <<EOF
H
/\[Unreleased\].*/ s//[${new_version#v}] - $(date +%F)/
w
q
EOF

  git add package.json CHANGELOG.md
}
release

# Commit based on what has been added
if [[ -n "$new_version" ]]; then
  info "Committing release changes..."
  git commit -m "[Auto] Release version ${new_version}" ${CI:+'-m' "[ci skip]"}

  info "Tagging commit..."
  sed -n '/## \[/,//p' CHANGELOG.md | sed -e '$d' -e 's/^##* *//' -e $'1a\\\n\\\n' |
  git tag -a "$new_version" -F -

  git_push "$new_version"

  info "Done."
elif git status --porcelain | grep -q "^M  $(git rev-parse --show-prefix)docs"; then
  info "Committing docs changes..."
  git commit -m "[Auto] Generate docs" ${CI:+'-m' "[ci skip]"}

  git_push

  info "Done."
else
  info "Nothing to commit."
fi
