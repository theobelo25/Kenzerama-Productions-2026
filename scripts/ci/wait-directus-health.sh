#!/usr/bin/env bash
set -euo pipefail

base_url="${DIRECTUS_URL:-http://127.0.0.1:8055}"
base_url="${base_url%/}"
health_url="${base_url}/server/health"
max_attempts="${DIRECTUS_HEALTH_MAX_ATTEMPTS:-60}"
sleep_seconds="${DIRECTUS_HEALTH_SLEEP_SECONDS:-2}"

for ((attempt = 1; attempt <= max_attempts; attempt++)); do
  if curl --fail --silent --show-error "${health_url}" >/dev/null; then
    echo "Directus is healthy at ${health_url}"
    exit 0
  fi

  echo "Waiting for Directus (${attempt}/${max_attempts})..."
  sleep "${sleep_seconds}"
done

echo "Timed out waiting for Directus at ${health_url}"
exit 1
