$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mdPath = Join-Path $root "prd.md"
$htmlPath = Join-Path $root "prd.html"
$utf8 = New-Object System.Text.UTF8Encoding $false

$md = [IO.File]::ReadAllText($mdPath, $utf8)
$mdSafe = $md.Replace("</textarea>", "&lt;/textarea&gt;")

$html = [IO.File]::ReadAllText($htmlPath, $utf8)
$html = [regex]::Replace($html, '(?s)\s*<textarea id="prd-src"[^>]*>.*?</textarea>\s*', "`r`n")

$embed = "<textarea id=`"prd-src`" hidden>`r`n$mdSafe`r`n</textarea>`r`n"
# Place embed BEFORE the main script so DOM has it when script may run
if ($html -match '(?s)(<script>\s*mermaid\.initialize)') {
  $html = $html -replace '(?s)(<script>\s*mermaid\.initialize)', ($embed + '$1')
} else {
  $html = $html.Replace("</body>", $embed + "</body>")
}

if ($html -notmatch "DOMContentLoaded") {
  $html = $html.Replace("loadPrd();", "document.addEventListener('DOMContentLoaded', loadPrd);")
}

[IO.File]::WriteAllText($htmlPath, $html, $utf8)
Write-Output "OK re-synced embed ($($md.Length) chars)"
