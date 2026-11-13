# Installs the 2d-motion skill for every agent harness found on this machine (or the ones you name).
# Usage: .\install.ps1                      -> all harnesses whose config folder exists
#        .\install.ps1 claude codex antigravity gemini
$src = Join-Path $PSScriptRoot "skills\2d-motion"
$named = $args.Count -gt 0
$targets = if ($named) { $args } else { @("claude", "codex", "antigravity", "gemini") }
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$map = @{
  claude      = @((Join-Path $HOME ".claude"), (Join-Path $HOME ".claude\skills"))
  codex       = @($codexHome, (Join-Path $codexHome "skills"))
  antigravity = @((Join-Path $HOME ".gemini"), (Join-Path $HOME ".gemini\config\skills"))
  gemini      = @((Join-Path $HOME ".gemini"), (Join-Path $HOME ".gemini\skills"))
}
foreach ($t in $targets) {
  if (-not $map.ContainsKey($t)) { Write-Host "unknown harness: $t"; continue }
  $base, $dir = $map[$t]
  if (-not $named -and -not (Test-Path $base)) { continue }
  New-Item -ItemType Directory -Force $dir | Out-Null
  $dest = Join-Path $dir "2d-motion"
  if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
  Copy-Item -Recurse $src $dest
  Write-Host "installed for $t -> $dest"
}
