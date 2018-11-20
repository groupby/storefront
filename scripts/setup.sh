#!/usr/bin/env bash

set -eo pipefail

cd "${BASH_SOURCE%/*}/.."

yarn
yarn workspaces run build
