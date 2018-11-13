#!/usr/bin/env bash

set -eo pipefail

# Only allow this script to run in package directories
node -e 'process.exit(require("./package.json").private === true)' || die 'Not in a package directory.'

# dist
tsc
rsync -r --exclude='*.ts' --exclude='*.js' src/ dist/

# esnext
tsc -p tsconfig.esnext.json
rsync -r --exclude='*.ts' --exclude='*.js' src/ esnext/
