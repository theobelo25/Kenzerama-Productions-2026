#!/usr/bin/env bash
# CI helper: skip apply if snapshot is missing or still a placeholder, then delegate
# to scripts/directus/apply-schema.sh (single implementation of docker vs npx apply).
set -euo pipefail

schema_file="${1:-directus/schema.snapshot.yaml}"

if [[ ! -f "${schema_file}" ]]; then
  echo "Schema snapshot not found at ${schema_file}; skipping apply."
  exit 0
fi

if head -n 1 "${schema_file}" | grep -q "^# Directus schema snapshot placeholder\."; then
  echo "Schema snapshot was not exported from Directus; skipping apply."
  exit 0
fi

export DIRECTUS_DATABASE_URL="${DIRECTUS_DATABASE_URL:-${DATABASE_URL:-}}"

if [[ -z "${DIRECTUS_DATABASE_URL}" ]]; then
  echo "DIRECTUS_DATABASE_URL or DATABASE_URL is required to apply schema."
  exit 1
fi

exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../directus/apply-schema.sh" "${schema_file}"
