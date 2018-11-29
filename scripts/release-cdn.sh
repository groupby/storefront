#!/usr/bin/env bash

set -eo pipefail

changelog_sections=(
  Changed
  Removed
  Added
  Fixed
  Deprecated
  Security
)

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
Usage: ${0##*/} [OPTIONS] <commit>
       ${0##*/} -h
Creates a CDN release.

This performs the following steps:
1. Bumps the version number in the top-level package.json
2. Combines the release notes for all packages that have changed since <commit>
3. Creates a git tag

OPTIONS
EOF
  sed -n '/^[[:space:]]*###/ s//   /p' "$BASH_SOURCE"

  cat <<EOF

EXIT CODES:
- 0: Success
- 1: General error
- 2: Usage error
- 3: Unsupported release type
- 4: No release detected
EOF
}

# Change to the root of the repo
cd "${BASH_SOURCE%/*}/.."

while getopts ":h" opt; do
  case "$opt" in
    ### -h	Show this help
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

base_commit="$1"

# Ensure that the given commit exists
git rev-list --quiet "${base_commit}^..HEAD" || die "Invalid commit: ${base_commit}"

tmpdir="$(mktemp -d)"
changelog_entry_file="${tmpdir}/changelog-entry"
package_release_types_file="${tmpdir}/package-release-types"
versions_file="${tmpdir}/versions"
# TODO cleanup trap

# TODO get all versions into a temporary file

# Collect all release types into a file
git log -p "${base_commit}^..HEAD" '**/CHANGELOG.md' |
sed -n 's/^.## \[Unreleased\] \[\(.*\)\]/\1/p' |
sort -u >"$package_release_types_file"

# Use the highest release type across all released packages
#
# Use the collected release types to select lines in the ordered listing
# using grep; the first one that matches any of the release types is the
# highest release type.
release_type="$(
  grep -F -m 1 -f "$package_release_types_file" <<EOF
major
premajor
minor
preminor
patch
prepatch
prerelease
from-git
EOF
)"

[[ -n "$release_type" ]] || die -c 4 "Could not detect potential release."

# TODO bump version

# for each changelog that has changed since the base commit...
for changelog in $(git diff --name-only "${base_commit}^..HEAD" '**/CHANGELOG.md'); do
  package_name="${changelog%/CHANGELOG.md}"
  package_name="${package_name##*/}"

  # extract the latest entry and split it into sections. Append each
  # section to their respective temporary collector files
  unset section
  unset collected_section_file
  while IFS= read -r line; do
    if grep -q '^### ' <<<"$line"; then # start of new section
      section="${line#\### }"
      collected_section_file="${tmpdir}/${section}"

      echo "#### ${package_name}" >>"$collected_section_file"
    elif [[ -n "$section" ]]; then # section content
      echo "$line" >>"$collected_section_file"
    fi
  done < <(ed -s "$changelog" <<<$'1;/^## \\[/;//-p')
done

# combine changelog sections
{
echo "## [${version}] - $(date +%F)"
echo
cat "${tmpdir}/versions"
echo
for section in "${changelog_sections[@]}"; do
  if [[ -s "${tmpdir}/${section}" ]]; then
    echo "### ${section}"
    cat "${tmpdir}/${section}"
  fi
done
} >"$changelog_entry_file"
