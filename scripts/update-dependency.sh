#!/usr/bin/env bash

set -eo pipefail

src="$1"
release_type="$2"
target="$3"

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
Usage: ${0##*/} <src> <release_type> <target>
       ${0##*/} -h
Updates the CHANGELOG.md and package.json for the target package based on the source.

src           The name of the source package.
release_type  The semver release type.
target        The name of the target package.
EOF
}

while getopts "h" opt; do
  case "$opt" in
    h)
      print_usage
      exit 0
      ;;
  esac
done

shift $((OPTIND - 1))

cd "${BASH_SOURCE%/*}/../packages/@storefront"


# Validate inputs
if (( $# != 3 )); then
  print_usage >&2
  exit 2
fi

[[ -d "$src" ]] || die -c 3 "Source does not exist: ${src}"
[[ -d "$target" ]] || die -c 3 "Target does not exist: ${target}"

case "$release_type" in
  major | minor | patch | premajor | preminor | prepatch | prerelease | from-git)
    : # valid; do nothing
    ;;
  *)
    die -c 3 "Unsupported release type: ${release_type}."
    ;;
esac


version="$(node -p 'require("./'"$src"'/package.json").version')"

cd "$target"

# Update source package version
ed -s package.json <<EOF
H
/@storefront\/${src}/s/[0-9]*\.[0-9]*\.[0-9]*\(-[^"]*\)\{0,1\}/${version}/
w
q
EOF

source_release_type="$(sed -n '/## \[Unreleased\] \[\(.*\)\]/ s//\1/p' CHANGELOG.md)"

# Add Unreleased section if necessary
if [[ -z "$source_release_type" ]]; then
  ed -s CHANGELOG.md <<EOF
H
/^## \\[/i
## [Unreleased] [${release_type}]
.
w
q
EOF
else
  hierarchy='from-git
prerelease
prepatch
patch
preminor
minor
premajor
major'

  if ! sed "/^${release_type}\$/q" <<<"$hierarchy" | grep -q "^${source_release_type}\$"; then
    release_type="$source_release_type"
  fi

  ed -s CHANGELOG.md <<EOF
H
/^## \\[Unreleased/c
## [Unreleased] [${release_type}]
EOF
fi

# Add Changed section if necessary
if ! sed -n '/## \[/,//p' CHANGELOG.md | sed '$d' | grep -q '^### Changed'; then
  ed -s CHANGELOG.md <<EOF
H
/^## \\[Unreleased/a
### Changed

.
w
q
EOF
fi

# Add the dependency update entry
ed -s CHANGELOG.md <<EOF
H
/^### Changed/a
- Update \`@storefront/${src}\` to ${version}.
.
w
q
EOF
