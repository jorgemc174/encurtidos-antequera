$ErrorActionPreference = 'Stop'
$taskTools = Join-Path $PSScriptRoot '../.tools'
New-Item -ItemType Directory -Force -Path $taskTools | Out-Null
$checksums = (Invoke-WebRequest -UseBasicParsing 'https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt').Content
$entry = ($checksums -split "`n" | Where-Object { $_ -match 'node-v22\.[0-9]+\.[0-9]+-win-x64.zip$' } | Select-Object -First 1).Trim()
if (-not $entry) { throw 'No se ha encontrado Node para Windows.' }
$parts = $entry -split '\s+'
$archive = Join-Path $taskTools $parts[1]
Invoke-WebRequest -UseBasicParsing ('https://nodejs.org/dist/latest-v22.x/' + $parts[1]) -OutFile $archive
if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLower() -ne $parts[0]) { throw 'La descarga no coincide con el hash oficial.' }
Expand-Archive -LiteralPath $archive -DestinationPath $taskTools -Force
Write-Output (Join-Path $taskTools ($parts[1] -replace '.zip$', ''))
