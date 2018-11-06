#!/usr/bin/env bash

set -eo pipefail

src="$1"
release_type="$2"
dest="$3"

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

cd "${BASH_SOURCE%*/}/../packages/@storefront"


# Validate inputs

[[ -d "$src" ]] || die -c 2 "No source specified."
[[ -d "$dest" ]] || die -c 2 "No destination specified."

case "$release_type" in
  major | minor | patch | premajor | preminor | prepatch | prerelease | from-git)
    : # valid; do nothing
    ;;
  '')
    die -c 2 "No release type specified."
    ;;
  *)
    die -c 3 "Unsupported release type: ${release_type}."
    ;;
esac


