param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl,

  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"
$resolvedRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupDirectory = Join-Path -Path $resolvedRoot -ChildPath "ydf-supabase-$stamp"

New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$files = @{
  Roles = Join-Path $backupDirectory "roles.sql"
  Schema = Join-Path $backupDirectory "schema.sql"
  PublicData = Join-Path $backupDirectory "public-data.sql"
  AuthSchema = Join-Path $backupDirectory "auth-schema.sql"
  AuthData = Join-Path $backupDirectory "auth-data.sql"
}

npx.cmd supabase db dump --db-url $DatabaseUrl -f $files.Roles --role-only
npx.cmd supabase db dump --db-url $DatabaseUrl -f $files.Schema
npx.cmd supabase db dump --db-url $DatabaseUrl -f $files.PublicData --data-only --use-copy --schema public
npx.cmd supabase db dump --db-url $DatabaseUrl -f $files.AuthSchema --schema auth
npx.cmd supabase db dump --db-url $DatabaseUrl -f $files.AuthData --data-only --use-copy --schema auth

$manifest = Get-ChildItem -LiteralPath $backupDirectory -File | ForEach-Object {
  [PSCustomObject]@{
    File = $_.Name
    Bytes = $_.Length
    Sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
  }
}

$manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $backupDirectory "manifest.json")

Write-Output "Backup created at: $backupDirectory"
Write-Output "The auth dump contains sensitive password hashes and identity data."
Write-Output "Encrypt this entire directory before copying it to Google Drive."
