Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Checking Camping Botusel static website..."

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is required to run the Playwright checks."
}

if (-not (Test-Path "node_modules")) {
  npm install
}

npm test
