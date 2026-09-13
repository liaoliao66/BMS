# -*- coding: utf-8 -*-
from pathlib import Path
import re
import shutil

root = Path(__file__).resolve().parent
v1_html = root / "v1.0.0" / "prd.html"
v2_dir = root / "v2.0.0"
v2_html = v2_dir / "prd.html"
v2_md = v2_dir / "prd.md"

shutil.copy2(v1_html, v2_html)
html = v2_html.read_text(encoding="utf-8")
html = html.replace("经营管理系统 · PRD 阅读页", "经营管理系统 · V2.0.0 PRD 阅读页")
html = re.sub(r'(?s)\s*<textarea id="prd-src"[^>]*>.*?</textarea>\s*', "\n", html)

md = v2_md.read_text(encoding="utf-8")
md_safe = md.replace("</textarea>", "&lt;/textarea&gt;")
embed = f'<textarea id="prd-src" hidden>\n{md_safe}\n</textarea>\n'

if re.search(r"(?s)<script>\s*mermaid\.initialize", html):
    html = re.sub(
        r"(?s)(<script>\s*mermaid\.initialize)",
        embed + r"\1",
        html,
        count=1,
    )
else:
    html = html.replace("</body>", embed + "</body>")

if "DOMContentLoaded" not in html:
    html = html.replace("loadPrd();", "document.addEventListener('DOMContentLoaded', loadPrd);")

v2_html.write_text(html, encoding="utf-8")
print(f"OK v2 prd.html ({len(md)} md chars)")

# also re-sync v1 briefly via same logic for consistency
v1_md = root / "v1.0.0" / "prd.md"
v1h = v1_html.read_text(encoding="utf-8")
v1h = re.sub(r'(?s)\s*<textarea id="prd-src"[^>]*>.*?</textarea>\s*', "\n", v1h)
md1 = v1_md.read_text(encoding="utf-8")
embed1 = f'<textarea id="prd-src" hidden>\n{md1.replace("</textarea>", "&lt;/textarea&gt;")}\n</textarea>\n'
if re.search(r"(?s)<script>\s*mermaid\.initialize", v1h):
    v1h = re.sub(r"(?s)(<script>\s*mermaid\.initialize)", embed1 + r"\1", v1h, count=1)
else:
    v1h = v1h.replace("</body>", embed1 + "</body>")
v1_html.write_text(v1h, encoding="utf-8")
print(f"OK v1 prd.html ({len(md1)} md chars)")

# copy sync script for v2
src = (root / "v1.0.0" / "sync-prd-embed.ps1").read_text(encoding="utf-8")
(v2_dir / "sync-prd-embed.ps1").write_text(src, encoding="utf-8")
print("OK v2 sync-prd-embed.ps1")
