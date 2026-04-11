param(
  [string]$DatabaseUrl = "",
  [switch]$SkipMigration
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env"
$dbFile = Join-Path $projectRoot "school.db"
$jwtSecret = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")

if (-not $DatabaseUrl) {
  $DatabaseUrl = Read-Host "Render PostgreSQL DATABASE_URL paste karein"
}

if (-not $DatabaseUrl) {
  throw "DATABASE_URL required hai."
}

$envContent = @(
  "PORT=3000"
  "JWT_SECRET=$jwtSecret"
  "JWT_EXPIRES_IN=never"
  "DATABASE_URL=$DatabaseUrl"
  "PGSSL=false"
  "ADMIN_USERNAME=admin"
  "ADMIN_PASSWORD=change_me_now"
)

Set-Content -Path $envFile -Value $envContent -Encoding ASCII
Write-Host ".env save ho gayi. Desktop app ab cloud database use karega." -ForegroundColor Green

if ((Test-Path $dbFile) -and (-not $SkipMigration)) {
  $reply = Read-Host "Local admissions ko cloud mein copy karna hai? (Y/N)"
  if ($reply -match '^(y|yes)$') {
    Push-Location $projectRoot
    try {
      $env:DATABASE_URL = $DatabaseUrl
      $env:PGSSL = "false"
      & npm run migrate:sqlite-to-postgres
      if ($LASTEXITCODE -ne 0) {
        throw "Migration command fail ho gayi."
      }
    } finally {
      Pop-Location
    }
  }
}

Write-Host ""
Write-Host "Ab 'Start School App.bat' se app chalayein. Naya data mobile/teacher mein same database se ayega." -ForegroundColor Cyan
