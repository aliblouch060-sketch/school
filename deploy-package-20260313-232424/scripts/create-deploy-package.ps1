$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputDir = Join-Path $projectRoot "deploy-package-$timestamp"
$zipPath = "$outputDir.zip"

New-Item -ItemType Directory -Path $outputDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $outputDir "public") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $outputDir "scripts") | Out-Null

$rootFiles = @(
  ".env.example",
  ".gitignore",
  "db.js",
  "package-lock.json",
  "package.json",
  "README.md",
  "render.yaml",
  "server.js"
)

foreach ($file in $rootFiles) {
  Copy-Item -Path (Join-Path $projectRoot $file) -Destination (Join-Path $outputDir $file) -Force
}

Copy-Item -Path (Join-Path $projectRoot "public\*") -Destination (Join-Path $outputDir "public") -Recurse -Force
Copy-Item -Path (Join-Path $projectRoot "scripts\*") -Destination (Join-Path $outputDir "scripts") -Recurse -Force

Compress-Archive -Path (Join-Path $outputDir "*") -DestinationPath $zipPath -Force

Write-Host "Deploy package ready:"
Write-Host $outputDir
Write-Host $zipPath
