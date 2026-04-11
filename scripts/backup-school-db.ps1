$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$dbPath = Join-Path $projectRoot "school.db"
$backupDir = Join-Path $projectRoot "backups"

if (-not (Test-Path $dbPath)) {
  Write-Error "Database file not found: $dbPath"
}

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $backupDir "school-$timestamp.db"

Copy-Item -Force -Path $dbPath -Destination $backupPath

# Keep only the latest 30 backups
$backups = Get-ChildItem -Path $backupDir -Filter "school-*.db" | Sort-Object LastWriteTime -Descending
if ($backups.Count -gt 30) {
  $backups | Select-Object -Skip 30 | Remove-Item -Force
}

Write-Output "Backup created: $backupPath"
