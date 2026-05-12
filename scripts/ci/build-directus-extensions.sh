#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
mux_ext="${root}/directus/extensions/tb-mux-video"

if [[ ! -f "${mux_ext}/package.json" ]]; then
  echo "Missing tb-mux-video extension package."
  exit 1
fi

if [[ -f "${mux_ext}/dist/app.js" && -f "${mux_ext}/dist/api.js" ]]; then
  echo "tb-mux-video extension artifacts already present."
  exit 0
fi

echo "Building tb-mux-video extension..."
npm ci --prefix "${mux_ext}"
npm run build --prefix "${mux_ext}"
