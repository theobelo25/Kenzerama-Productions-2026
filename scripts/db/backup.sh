#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <db_url> <output_file>"
  exit 1
fi

db_url="$1"
output_file="$2"

echo "Creating DB backup: ${output_file}"
pg_dump "${db_url}" -Fc -f "${output_file}"
echo "Backup complete: ${output_file}"
