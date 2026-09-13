$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$p = Join-Path $root "prd.html"
$utf8 = New-Object System.Text.UTF8Encoding $false
$c = [IO.File]::ReadAllText($p, $utf8)

$pattern = '(?s)async function loadPrd\(\) \{.*?loadPrd\(\);'
$replacement = @'
async function renderMarkdown(md) {
      const status = document.getElementById("status");
      const content = document.getElementById("content");
      const nav = document.getElementById("toc-nav");
      marked.setOptions({ gfm: true, breaks: false });
      content.innerHTML = marked.parse(md);
      content.querySelectorAll("h1, h2, h3, h4").forEach(function (h) {
        if (!h.id) h.id = slugify(h.textContent);
      });
      buildToc(content, nav);
      status.hidden = true;
      content.hidden = false;
      document.getElementById("footer-note").hidden = false;
      await renderMermaid(content);
    }

    async function loadPrd() {
      const status = document.getElementById("status");
      const nav = document.getElementById("toc-nav");
      const embedded = document.getElementById("prd-src");
      try {
        if (location.protocol === "file:" && embedded && embedded.value.trim()) {
          await renderMarkdown(embedded.value);
          return;
        }
        const res = await fetch("./prd.md", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        await renderMarkdown(await res.text());
      } catch (err) {
        if (embedded && embedded.value.trim()) {
          try {
            await renderMarkdown(embedded.value);
            return;
          } catch (e2) {
            err = e2;
          }
        }
        status.className = "status error";
        status.textContent = "PRD load failed: " + (err && err.message ? err.message : String(err));
        nav.innerHTML = '<p style="font-size:12px;color:#94a3b8;padding:0 10px;">load failed</p>';
      }
    }

    loadPrd();
'@

if ($c -notmatch 'async function loadPrd') { throw "loadPrd not found" }
$c2 = [regex]::Replace($c, $pattern, $replacement, 1)
if ($c2 -eq $c) { throw "regex replace failed" }
if ($c2 -notmatch 'id="prd-src"') { throw "prd-src missing" }

[IO.File]::WriteAllText($p, $c2, $utf8)
Write-Output "OK patched loader"
