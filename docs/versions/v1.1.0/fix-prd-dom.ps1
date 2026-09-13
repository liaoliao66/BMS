$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlPath = Join-Path $root "prd.html"
$utf8 = New-Object System.Text.UTF8Encoding $false
$content = [IO.File]::ReadAllText($htmlPath, $utf8)
$content = $content.Replace("loadPrd();", "document.addEventListener('DOMContentLoaded', loadPrd);")
[IO.File]::WriteAllText($htmlPath, $content, $utf8)
Write-Output "OK deferred to DOMContentLoaded"
