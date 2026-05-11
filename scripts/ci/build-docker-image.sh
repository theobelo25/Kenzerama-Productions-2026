#!/usr/bin/env bash
set -euo pipefail

image_tag="${1:-kenzerama-web:ci}"
directus_url="${DIRECTUS_URL:-http://127.0.0.1:8055}"
public_directus_url="${NEXT_PUBLIC_DIRECTUS_URL:-${directus_url}}"

if [[ -z "${DIRECTUS_TOKEN:-}" ]]; then
  echo "DIRECTUS_TOKEN is required to build the production image with CMS-backed prerender."
  exit 1
fi

docker build \
  --network=host \
  --build-arg "DIRECTUS_URL=${directus_url}" \
  --build-arg "DIRECTUS_TOKEN=${DIRECTUS_TOKEN}" \
  --build-arg "NEXT_PUBLIC_DIRECTUS_URL=${public_directus_url}" \
  --build-arg "NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL:-http://localhost:3000}" \
  -t "${image_tag}" \
  .

echo "Built ${image_tag}"
