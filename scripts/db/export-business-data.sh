#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <source_db_url> <output_sql_file>"
  exit 1
fi

source_db_url="$1"
output_sql_file="$2"

if [[ -z "${BUSINESS_TABLES:-}" ]]; then
  echo "BUSINESS_TABLES is required (comma-separated, e.g. public.posts,public.films)"
  exit 1
fi

IFS=',' read -r -a tables <<< "${BUSINESS_TABLES}"

table_args=()
for table in "${tables[@]}"; do
  trimmed="$(echo "${table}" | xargs)"
  if [[ -z "${trimmed}" ]]; then
    continue
  fi
  table_args+=("-t" "${trimmed}")
done

if [[ ${#table_args[@]} -eq 0 ]]; then
  echo "No valid tables resolved from BUSINESS_TABLES."
  exit 1
fi

echo "Exporting business data for tables: ${BUSINESS_TABLES}"
pg_dump "${source_db_url}" \
  --data-only \
  --column-inserts \
  --disable-triggers \
  "${table_args[@]}" \
  > "${output_sql_file}"
echo "Business data export complete: ${output_sql_file}"
