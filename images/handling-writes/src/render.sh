#!/bin/sh
# Renders each SVG in this folder to a 1600x900 PNG with the same name one folder up.
#
# The SVGs are the source for the Write Path diagrams. Edit an SVG, then run:
#   sh images/handling-writes/src/render.sh
#
# Keep the filenames: they are image IDs in @powersync/docs-content
# (packages/docs-content/scripts/build.mjs). Renaming one breaks the package.
#
# Needs Google Chrome. The text uses Helvetica Neue, so render on macOS to get the same output.
set -e
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
for svg in *.svg; do
  png="../${svg%.svg}.png"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1600,900 --screenshot="$PWD/$png" "file://$PWD/$svg" 2>/dev/null
  echo "Rendered $png"
done
