#!/usr/bin/env bash

set -eo pipefail

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
Publishes a minified bundle to the CDN, using the version number from
package.json.

The bundle will be pushed to the master branch if the CI environment variable
is present, otherwise it will be pushed to storefront/<version>.

OPTIONS
EOF
  sed -n '/^[[:space:]]*###/ s//   /p' "$BASH_SOURCE"
}

copy_artifact() {
  local version="$1"
  local artifact="${tmpdir}/cdn/static/javascript/storefront-${version}.js"

  cp bundle/storefront.js "$artifact"

  # Inject the package versions as a comment and point to the proper sourcemap file
  ed -s "$artifact" <<EOF
H
\$s/storefront/&-${version}/
i
/* StoreFront package version:
*/
.
-r ${tmpdir}/versions
w
q
EOF

  cp bundle/storefront.map.js "${artifact%.js}.map.js"
}

cleanup() {
  rm -rf -- "$tmpdir"
}

# Process arguments
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

# Change to the root of the repo
cd "${BASH_SOURCE%/*}/.."

tmpdir=$(mktemp -d)
trap 'cleanup' EXIT

# Clone the CDN repo into a temporary directory
git -C "$tmpdir" clone --depth=1 https://github.com/groupby/cdn || die "Could not clone CDN repo."

# Extract the version from package.json
version=$(node -p 'require("./package.json").version')

# Ensure that there is no artifact with the current version on the CDN
[[ ! -f "${tmpdir}/cdn/static/javascript/storefront-${version}.js" ]] || die -c 4 "Version ${version} already exists on the CDN."

# Create bundle
npm run bundle:prod || die "Could not create bundle."

versions_file="${tmpdir}/versions"
./scripts/print-package-versions.sh >"$versions_file"

# Copy bundle
copy_artifact "$version"
#copy_artifact 'canary'

# Commit and push bundle
if [[ -n "$CI" ]]; then
  branch="master"
else
  branch="storefront/${version}"
fi

cd "${tmpdir}/cdn"
git checkout -b "$branch" || git checkout "$branch"
git add static/javascript
git commit -m "Release storefront ${version}"
git push -u origin HEAD

info "Done."
