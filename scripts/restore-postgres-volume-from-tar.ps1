<#
.SYNOPSIS
  Replace the local Docker Compose Postgres data volume from a .tgz of PGDATA
  (e.g. Fly.io / volume snapshot style backups like postgres-staging-*.tgz).

.DESCRIPTION
  Stops web, directus, and postgres; wipes the compose `postgres_data` volume;
  extracts the tarball into it; fixes ownership for postgres:16-alpine; starts stack.

  Run from the repository root (where docker-compose.yml lives).

  First inspect the archive layout (so -StripComponents is correct):

    tar -tzf "C:\path\to\postgres-staging-hipoe5.tgz" | Select-Object -First 30

  From repo root (recommended: Node/tsx so Windows quoting and file associations are avoided):

    npm run restore:postgres-volume-tar -- "C:\path\to\postgres-staging-hipoe5.tgz"

  Optional PowerShell (same flags as before):

    .\scripts\restore-postgres-volume-from-tar.ps1 -TarPath "C:\path\to.tgz" -StripComponents 1

  - If you see `PG_VERSION` at the top level of paths, use -StripComponents 0 (default).
  - If paths start with `data/PG_VERSION` or similar, use -StripComponents 1 (or more).

  The backup must be from PostgreSQL 16 (or you must change the postgres image in
  compose to match the `PG_VERSION` file inside the archive).

.PARAMETER TarPath
  Absolute path to the .tgz file. Position 0 so `npm run ... -- "C:\path\to.tgz"` works.

.PARAMETER StripComponents
  Passed to tar --strip-components (default 0).

.PARAMETER VolumeName
  Full Docker volume name for Postgres data. If omitted, the script finds the volume
  mounted at /var/lib/postgresql/data on the compose `postgres` service (and runs
  `docker compose up -d postgres` first if needed).
#>
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string] $TarPath,
  [Parameter(Position = 1)]
  [int] $StripComponents = 0,
  [string] $VolumeName = ""
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $TarPath)) {
  throw "Tar not found: $TarPath"
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $repoRoot

try {
  if (-not (Test-Path -LiteralPath "docker-compose.yml")) {
    throw "Run from repo root (docker-compose.yml not found under $repoRoot)."
  }

  $resolvedTar = (Resolve-Path -LiteralPath $TarPath).Path

  function Get-PostgresContainerId {
    return @(
      (cmd /c "docker compose ps -aq postgres") |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ }
    ) | Select-Object -First 1
  }

  function Resolve-PostgresDataVolumeName {
    $cid = Get-PostgresContainerId
    if (-not $cid) {
      Write-Host "No postgres container yet; running: docker compose up -d postgres"
      cmd /c "docker compose up -d postgres"
      $cid = Get-PostgresContainerId
      for ($i = 0; $i -lt 45 -and -not $cid; $i++) {
        Start-Sleep -Seconds 2
        $cid = Get-PostgresContainerId
      }
    }
    if (-not $cid) {
      Write-Host "--- docker compose ps -a ---"
      cmd /c "docker compose ps -a"
      Write-Host "--- docker compose logs postgres (last 80 lines) ---"
      cmd /c "docker compose logs postgres --tail 80"
      throw "Could not get a postgres container id. Fix errors above, then retry."
    }
    $inspectJson = cmd /c "docker inspect $cid"
    $inspectRaw = $inspectJson | ConvertFrom-Json
    $inspect = @($inspectRaw)[0]
    $mount = @($inspect.Mounts) | Where-Object { $_.Type -eq "volume" -and $_.Destination -eq "/var/lib/postgresql/data" } | Select-Object -First 1
    if (-not $mount -or -not $mount.Name) {
      throw "Could not find a named volume at /var/lib/postgresql/data on container $cid (docker inspect mounts)."
    }
    return [string]$mount.Name
  }

  if (-not $VolumeName.Trim()) {
    $VolumeName = Resolve-PostgresDataVolumeName
    Write-Host "Using postgres data volume: $VolumeName"
  }
  else {
    cmd /c ('docker volume inspect "{0}" >nul 2>nul' -f ($VolumeName -replace '"', '""'))
    if ($LASTEXITCODE -ne 0) {
      throw "Volume '$VolumeName' not found. Run: docker volume ls`nOr omit -VolumeName to auto-detect from the postgres service."
    }
  }

  Write-Host "Stopping services..."
  cmd /c "docker compose stop web directus postgres >nul 2>nul"

  Write-Host "Wiping volume $VolumeName and extracting tarball..."
  $strip = [int]$StripComponents
  $sh = "find /var/lib/postgresql/data -mindepth 1 -delete; tar xzf /backup.tgz -C /var/lib/postgresql/data --strip-components=$strip"
  $tarForCmd = ($resolvedTar -replace '"', '""')
  $shForCmd = ($sh -replace '"', '\"')
  cmd /c ('docker run --rm -v {0}:/var/lib/postgresql/data -v "{1}":/backup.tgz:ro alpine:3.20 sh -c "{2}"' -f $VolumeName, $tarForCmd, $shForCmd)

  if ($LASTEXITCODE -ne 0) {
    throw "tar extract failed. Adjust -StripComponents (see script header) or check archive."
  }

  Write-Host "Fixing ownership for postgres:16-alpine..."
  cmd /c ('docker run --rm --user root -v {0}:/var/lib/postgresql/data postgres:16-alpine chown -R postgres:postgres /var/lib/postgresql/data' -f $VolumeName)

  Write-Host "Starting stack..."
  cmd /c "docker compose up -d"

  Write-Host "Done. When Postgres is healthy, open Directus and verify. If Postgres fails to start, PG major version in the backup likely mismatches postgres:16-alpine - check PG_VERSION inside the tar."
}
finally {
  Pop-Location
}
