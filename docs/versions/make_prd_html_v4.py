# -*- coding: utf-8 -*-
"""Generate docs/versions/v4.0.0/prd.html from v2 shell + v4 prd.md."""
from pathlib import Path
import re
import shutil

root = Path(__file__).resolve().parent
v2_html = root / "v2.0.0" / "prd.html"
v4_dir = root / "v4.0.0"
v4_html = v4_dir / "prd.html"
v4_md = v4_dir / "prd.md"

shell = v2_html.read_text(encoding="utf-8")
shell = re.sub(r'(?s)\s*<textarea id="prd-src"[^>]*>.*?</textarea>\s*', "\n", shell)
shell = shell.replace("经营管理系统 · V2.0.0 PRD 阅读页", "经营管理系统 · V4.0.0 PRD 阅读页")
shell = shell.replace("BMS · v1.0.0", "BMS · v4.0.0")
shell = shell.replace("BMS · v2.0.0", "BMS · v4.0.0")

md = v4_md.read_text(encoding="utf-8")
md_safe = md.replace("</textarea>", "&lt;/textarea&gt;")
embed = f'<textarea id="prd-src" hidden>\n{md_safe}\n</textarea>\n'

if re.search(r"(?s)<script>\s*mermaid\.initialize", shell):
    html = re.sub(r"(?s)(<script>\s*mermaid\.initialize)", embed + r"\1", shell, count=1)
else:
    html = shell.replace("</body>", embed + "</body>")

if "DOMContentLoaded" not in html:
    html = html.replace("loadPrd();", "document.addEventListener('DOMContentLoaded', loadPrd);")

# Ensure content centering (remaining viewport after TOC)
if "--content-max" not in html:
    html = html.replace(":root {", ":root {\n      --content-max: 940px;")
if "max-width: var(--content-max)" not in html and ".main {" in html:
    html = html.replace(
        ".main {",
        ".main {\n      max-width: var(--content-max);\n      margin: 0 auto;",
        1,
    )

v4_html.write_text(html, encoding="utf-8")
print("OK v4 prd.html md_chars=%s html_chars=%s" % (len(md), len(html)))

src_ps1 = root / "v2.0.0" / "sync-prd-embed.ps1"
if src_ps1.exists():
    shutil.copy2(src_ps1, v4_dir / "sync-prd-embed.ps1")
    print("OK sync-prd-embed.ps1")
