---
component: SettingsPanel, ColumnBrowser
source: kol-r2b2 on kol-component 0.97.3 / kol-theme 0.65.0
staged: 2026-08-27
status: draft
deps: [SettingsPanel, ShellDrawer, SettingsChipRow, ColumnBrowser, HlsVideo, AudioPlayer, CodeBlock, ProsePreview, AssetPlaceholder]
---

# SettingsPanel chrome + ColumnBrowser preview seam

Two things the user flagged in one pass; both are the DS's.

## 1 · `SettingsPanel` (drawer) — wrong left border, wrong type
User, verbatim: "fix this. wrong border left. and all wrong font styles." Screenshot: `_assets/2026-08-27-settings-and-preview/settings-drawer-border-and-type.png`.
- The drawer edge: the `ShellDrawer` left border as shipped is not the one ruled for this surface (the user's call — align it with the rest of the collection's hairlines, `oq-08`).
- Type: the panel's title / section labels / row labels / hints / chip labels are not on the app's ramp. The reference is the collection beside it — `kol-mono-12` rows (`ColumnBrowser`, `ContentRow`), `kol-helper-12` uppercase strips, `kol-helper-14` uppercase titles — one register. The DS decides the exact mapping; the user will rule on the result.
- The kind chips (`SettingsChipRow`, `show-kinds-chips.png`) are part of the same pass — the user calls it "the tag ticket": same chrome as the DS `Tag`/`.kol-control` chips everywhere else, not a third look.

## 2 · `ColumnBrowser` — a `renderPreview` seam
The preview column renders an `<img>` for images and a kind label for everything else, so video, audio, code, JSON and markdown show a grey box that says "text" (`column-preview-json-no-viewer.png`). The consumer already has a renderer for every kind — `KindPreview({ o, poster })` in kol-r2b2 — built on the DS: `HlsVideo` (video, poster from the sibling image), `AudioPlayer`, `CodeBlock` (code/json, language by extension), `ProsePreview` (markdown — "the article prose set"), `AssetPlaceholder` (the rest). Text previews cap at 200 KB.

Ask: `renderPreview?: (file) => ReactNode` on `ColumnBrowser`. When passed, the preview column's media frame renders its result instead of the built-in `<img>` / label; the facts list (Kind · Type · Size · Dimensions · Date) stays the organism's. Dimensions still come from a loaded `<img>` when there is one — expose `onDimensions` or read them from an `<img>` inside the rendered node.

Better still: promote `KindPreview` itself into the collection as the default preview (it is all DS atoms + a kind map), so no consumer has to pass one.

## Recreation notes
1 is theme + `SettingsPanel` chrome; 2 is one prop on `ColumnBrowser` (and optionally a new `KindPreview` molecule). Consumer wiring on publish: `renderPreview={(o) => <KindPreview o={o} poster={posterFor(o.key, keySet)} />}`.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.98.0

(1) SettingsPanel on the app register — title kol-helper-14 uppercase text-emphasis, subtitle / intro / hints / footer kol-mono-12 text-meta, row labels kol-mono-12 text-emphasis, no mono-10 left; SettingsChipRow renders the DS Tag (md · inverse when on · secondary when off) — the tag ticket; ShellDrawer's edge is oq-08. Measured on the drawer demo. (2) ColumnBrowser renderPreview(file) replaces the preview column's media frame (facts stay); without it images keep the organism's img (dimensions measured 1200 × 800) and everything else renders the new KindPreview molecule — your KindPreview promoted: HLS → HlsVideo, audio → AudioPlayer, text/code → CodeBlock by extension, the rest → AssetPlaceholder; markdown renders as code (ProsePreview is a specimen, not a renderer — it never took markdown). The DS media kinds (kindOf, extOf, isSystemFile, KINDS, KIND_LABEL — your lib/media kinds) ship from kol-component and are ColumnBrowser's defaults. Dimensions also come off any img a custom preview loads. Measured: notes.txt → a CodeBlock in the preview column; the KindPreview demo renders JSON as code and a TTF placeholder.

**Remainder here:** none — kol-r2b2 bump kol-component 0.98.0; drop src/KindPreview.jsx for the DS one (renderPreview={(o) => <KindPreview o={o} urlOf={(x) => publicUrl(x.key)} poster={posterFor(...) ? publicUrl(posterFor(...)) : undefined} />} or pass nothing and let the default run with urlOf); kindOf / KIND_LABEL can come from the package; the user rules on the register.

