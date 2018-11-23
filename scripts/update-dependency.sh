#!/usr/bin/env bash

set -eo pipefail

version=

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
Usage: ${0##*/} [OPTIONS] <src> <release_type> <target>
       ${0##*/} -h
Updates the CHANGELOG.md and package.json for the target package based on the source.

src           The name of the source package.
release_type  The semver release type.
target        The name of the target package.

OPTIONS
EOF
  sed -n '/^[[:space:]]*###/ s//   /p' "$BASH_SOURCE"
  cat <<EOF

EXIT CODES:
- 0: Success
- 1: General error
- 2: Usage error
- 3: Directories provided do not exist
- 4: Unsupported release type
EOF
}

while getopts ":n:h" opt; do
  case "$opt" in
    ### -n version	The version number to bump to.
    n)
      version="$OPTARG"
      ;;
    ### -h	Print this help.
    h)
      print_usage
      exit 0
      ;;
    \?)
      die -c 2 "Invalid option: -${OPTARG}"
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

src="$1"
release_type="$2"
target="$3"

[[ -d "$src" ]] || die -c 3 "Source does not exist: ${src}"
[[ -d "$target" ]] || die -c 3 "Target does not exist: ${target}"

case "$release_type" in
  major | minor | patch | premajor | preminor | prepatch | prerelease | from-git)
    : # valid; do nothing
    ;;
  *)
    die -c 4 "Unsupported release type: ${release_type}."
    ;;
esac


# Default to the version in the source's package.json
: ${version:="$(node -p 'require("./'"$src"'/package.json").version')"}

cd "$target"

version_range="$({ grep -F "@storefront/${src}" package.json || true; } | cut -d \" -f 4)"

if [[ -z "$version_range" ]]; then
  echo "Nothing to bump: ${target} does not depend on ${src}."
  exit 0
elif npx semver -p -r "${version_range}" "${version}" > /dev/null; then
  echo "Version to bump (${version}) is within acceptable range ${version_range}. Exiting without bumping."
  exit 0
fi

# Update version of source dependency in target package.json
ed -s package.json <<EOF
H
/@storefront\/${src}/ s/[0-9]*\.[0-9]*\.[0-9]*\(-[^"]*\)\{0,1\}/${version}/
w
q
EOF

source_release_type="$(sed -n '/^## \[Unreleased\] \[\(.*\)\]/ s//\1/p' CHANGELOG.md)"

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
  # Hierarchy below is from least to most significant
  hierarchy='from-git
prerelease
prepatch
patch
preminor
minor
premajor
major'

  # If the $source_release_type is of greater significance than $release_type,
  # it will not be found between the top of the hierarchy and $release_type.
  # Keep the release type with the greater significance.
  #
  # grep: Redirect to /dev/null instead of using the -q flag to avoid a SIGPIPE.
  if ! sed "/^${release_type}\$/q" <<<"$hierarchy" | grep "^${source_release_type}\$" >/dev/null; then
    release_type="$source_release_type"
  fi

  ed -s CHANGELOG.md <<EOF
H
/^## \\[Unreleased/c
## [Unreleased] [${release_type}]
EOF
fi

# Add Changed section if necessary
#
# grep: Redirect to /dev/null instead of using the -q flag to avoid a SIGPIPE.
if ! ed -s CHANGELOG.md <<<$'1;/^## \\[/;//-p' | grep '^### Changed' >/dev/null; then
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
