#!/usr/bin/env bash
set -euo pipefail

schema_file="${1:-directus/schema.snapshot.yaml}"
database_url="${DIRECTUS_DATABASE_URL:-${DATABASE_URL:-}}"

if [[ ! -f "${schema_file}" ]]; then
  echo "Schema snapshot not found at ${schema_file}; skipping apply."
  exit 0
fi

if head -n 1 "${schema_file}" | grep -q "^# Directus schema snapshot placeholder\."; then
  echo "Schema snapshot was not exported from Directus; skipping apply."
  exit 0
fi

if [[ -z "${database_url}" ]]; then
  echo "DIRECTUS_DATABASE_URL or DATABASE_URL is required to apply schema."
  exit 1
fi

echo "Applying Directus schema from ${schema_file}"

if [[ "${GITHUB_ACTIONS:-}" == "true" ]] && command -v docker >/dev/null 2>&1; then
  schema_abs="$(cd "$(dirname "${schema_file}")" && pwd)/$(basename "${schema_file}")"
  docker run --rm --network host \
    -e DB_CLIENT=pg \
    -e DB_CONNECTION_STRING="${database_url}" \
    -v "${schema_abs}:/snapshot.yaml:ro" \
    directus/directus:11 \
    npx directus schema apply /snapshot.yaml --yes
else
  export DB_CLIENT=pg
  export DB_CONNECTION_STRING="${database_url}"
  export NPM_CONFIG_LOGLEVEL="${NPM_CONFIG_LOGLEVEL:-error}"
  npx --yes directus@11 schema apply "${schema_file}" --yes
fi

echo "Directus schema apply completed"
