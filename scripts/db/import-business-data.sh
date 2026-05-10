#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <target_db_url> <input_sql_file>"
  exit 1
fi

target_db_url="$1"
input_sql_file="$2"

if [[ ! -f "${input_sql_file}" ]]; then
  echo "Input SQL file not found: ${input_sql_file}"
  exit 1
fi

echo "Importing business data: ${input_sql_file}"
psql "${target_db_url}" -f "${input_sql_file}"
echo "Business data import complete"
