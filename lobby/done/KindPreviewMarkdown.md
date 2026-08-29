---
component: KindPreview
source: kol-r2b2 on kol-component 0.100.1
staged: 2026-08-27
status: draft
deps: [KindPreview, ColumnBrowser, CodeBlock]
---

# KindPreview — markdown renders as prose (`.kol-prose`), not a placeholder or code

User: "why is it not rendering in preview using kol-prose?" Screenshot: `_assets/2026-08-27-settings-and-preview/markdown-placeholder.png` — `INDEX.md` in the column preview is an `AssetPlaceholder` reading "MD · markdown".

## Why
kol-r2b2's kind map now has `markdown`, `json`, `yaml` as their own kinds (user ruling 2026-08-27 — "I want md always to show, make it unique"). `KindPreview` knows `text`/`code` and falls to the placeholder for anything else. And even as `text`, markdown came out as a `CodeBlock` — the DS said `ProsePreview` "is a specimen, not a renderer".

## Ask
1. `KindPreview`: kind `markdown` → fetch the file (same 200 KB cap) and render it as HTML inside `.kol-prose` — the theme already ships the prose CSS; the DS owns the parser choice (the same one kol-website's documentation reader uses).
2. Kinds `json` and `yaml` → `CodeBlock` with `language` json / yaml.
3. The DS `mediaKinds` (`kindOf`, `KIND_LABEL`, `KINDS`) take the same three kinds: `md → markdown`, `json → json`, `yaml|yml → yaml`; labels `markdown`, `JSON`, `YAML`; `KINDS` order `audio · video · image · markdown · json · yaml · text · code · playlist · font · archive · other`. Then kol-r2b2 drops its local `lib/media.js` kind map for the package's.

## Consumer state
Stopgap in `FileList.jsx`: `renderPreview` maps those three kinds to `text` so they show as code. Deleted on bump.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.101.0

(1) KindPreview kind markdown fetches the file (200 KB cap) and renders it as HTML inside .kol-prose through the new markdownToHtml utility (exported; escape-first, no dependency — headings, paragraphs, emphasis, code, links, images, lists, blockquotes, fenced code, rules, pipe tables; script tags come out escaped). The workshop's parser emits tokens for its own viewer, which is not .kol-prose, so the DS renders HTML for the prose CSS. (2) json / yaml → CodeBlock with their language. (3) mediaKinds: md → markdown, json → json, yaml|yml → yaml; labels markdown · JSON · YAML; KINDS in your order. Rendered: the KindPreview demo's README shows h1 / strong / list / code in the prose voice; the column preview's README.md renders .kol-prose with Kind 'markdown'.

**Remainder here:** none — kol-r2b2 bump kol-component 0.101.0; delete the renderPreview stopgap and lib/media.js's kind map (kindOf / KIND_LABEL / KINDS from the package).

