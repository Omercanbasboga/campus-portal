#!/usr/bin/env bash
# Build all three apps into one static tree, the way GitHub Pages serves them:
#   $BASE/            host
#   $BASE/remotes/analytics/  analytics remote
#   $BASE/remotes/records/    records remote
# The remotes sit under remotes/ so they don't shadow the host's own
# /analytics and /records routes when a page is reloaded.
set -euo pipefail
BASE="${BASE:-/campus-portal}"
OUT="${OUT:-dist}"
cd "$(dirname "$0")/.."
rm -rf "$OUT"

PUBLIC_URL="$BASE/remotes/analytics" npm run build -w analytics
PUBLIC_URL="$BASE/remotes/records" npm run build -w records
PUBLIC_URL="$BASE" \
  REACT_APP_ANALYTICS_URL="$BASE/remotes/analytics" \
  REACT_APP_RECORDS_URL="$BASE/remotes/records" \
  npm run build -w host

mkdir -p "$OUT"
cp -r host/build/. "$OUT/"
mkdir -p "$OUT/remotes"
cp -r analytics/build "$OUT/remotes/analytics"
cp -r records/build "$OUT/remotes/records"
# Pages has no rewrites: serve the app for unknown paths via 404.html
cp "$OUT/index.html" "$OUT/404.html"
touch "$OUT/.nojekyll"
echo "built into $OUT (base $BASE)"
