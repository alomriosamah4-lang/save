<#
Simple diagnostic script: checks Node/NPM versions and common npm global install issues.
It DOES NOT modify system state; it only prints diagnostics and suggestions.
#>
try {
  Write-Host "Node.js version:" -NoNewline; node -v
} catch {
  Write-Host "Node.js not found on PATH" -ForegroundColor Yellow
}

try {
  Write-Host "npm version:" -NoNewline; npm -v
} catch {
  Write-Host "npm not found or broken on PATH" -ForegroundColor Yellow
}

Write-Host "Checking npm global install location..."
$globalNpm = "$env:APPDATA\npm\node_modules\npm"
if (Test-Path $globalNpm) {
  Write-Host "Found global npm at: $globalNpm"
} else {
  Write-Host "Global npm installation not found at expected path: $globalNpm" -ForegroundColor Yellow
}

Write-Host "If npm is broken, recommended fix: reinstall Node.js LTS from https://nodejs.org or use nvm-windows."
