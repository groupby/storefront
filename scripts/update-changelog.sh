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

[[ -d "$src" ]] || die -c 2 "No source specified."
[[ -n "$release_type" ]] || die -c 2 "No release type specified."
[[ -d "$dest" ]] || die -c 2 "No destination specified."
