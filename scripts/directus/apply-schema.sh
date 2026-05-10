#!/usr/bin/env bash
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
export DB_CLIENT=pg
export DB_CONNECTION_STRING="${DIRECTUS_DATABASE_URL}"
npx --yes directus@11 schema apply "${schema_file}" --yes
echo "Schema apply completed"
