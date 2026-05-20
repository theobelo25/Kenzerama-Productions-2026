#!/usr/bin/env bash
# Apply committed schema: Directus 11 CLI against DIRECTUS_DATABASE_URL or
# DIRECTUS_SCHEMA_APPLY_CMD.
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <schema_snapshot_file>"
  exit 1
fi

schema_file="$1"

if [[ ! -f "${schema_file}" ]]; then
  echo "Schema snapshot file not found: ${schema_file}"
  exit 1
fi

if head -n 1 "${schema_file}" | grep -q "^# Directus schema snapshot placeholder\."; then
  echo "Schema snapshot was not exported from Directus."
  exit 1
fi

if [[ -n "${DIRECTUS_SCHEMA_APPLY_CMD:-}" ]]; then
  echo "Running custom schema apply command from DIRECTUS_SCHEMA_APPLY_CMD"
  bash -lc "${DIRECTUS_SCHEMA_APPLY_CMD}"
  exit 0
fi

if [[ -z "${DIRECTUS_DATABASE_URL:-}" ]]; then
  echo "DIRECTUS_DATABASE_URL is required when DIRECTUS_SCHEMA_APPLY_CMD is not set."
  exit 1
fi

echo "Applying schema with directus CLI using DIRECTUS_DATABASE_URL"

if [[ "${GITHUB_ACTIONS:-}" == "true" ]] && command -v docker >/dev/null 2>&1; then
  schema_abs="$(cd "$(dirname "${schema_file}")" && pwd)/$(basename "${schema_file}")"
  docker run --rm --network host \
    -e DB_CLIENT=pg \
    -e DB_CONNECTION_STRING="${DIRECTUS_DATABASE_URL}" \
    -v "${schema_abs}:/snapshot.yaml:ro" \
    directus/directus:11 \
    npx directus schema apply /snapshot.yaml --yes
else
  export DB_CLIENT=pg
  export DB_CONNECTION_STRING="${DIRECTUS_DATABASE_URL}"
  export NPM_CONFIG_LOGLEVEL="${NPM_CONFIG_LOGLEVEL:-error}"
  npx --yes directus@11 schema apply "${schema_file}" --yes
fi

echo "Schema apply completed"
