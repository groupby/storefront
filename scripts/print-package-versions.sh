#!/usr/bin/env bash

# Change to the root of the repo
cd "${BASH_SOURCE%/*}/.."

# Create a Markdown list of all the package versions
node -p 'JSON.stringify(require("./presets/package-versions"), null, 2)' |
tr -d '",' |
sed '1d; $d; s/^ */- /; s#@storefront/[a-z-]*#`&`#' |
sort
