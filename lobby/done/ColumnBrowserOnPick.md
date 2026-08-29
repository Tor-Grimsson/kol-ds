---
component: ColumnBrowser
source: kol-r2b2 — the shipped organism (kol-component 0.97.1)
staged: 2026-08-27
status: draft
deps: [ColumnBrowser]
---

# ColumnBrowser — `onPick` seam (the picked file, for a Finder-style breadcrumb)

## Purpose
The user wants Finder's breadcrumb: a selection path whose last segment is the picked FILE, un-clickable, with the folder before it dropping to rest ink. The organism keeps `picked` internal (`useState` at L151) and only surfaces it through `onQuickLook` on space — so the consumer cannot render the crumb.

## Ask
`onPick?: (file | null) => void` — fired whenever the picked file changes: a file row click / ↑↓ landing on a file → the object; a folder pick or a prefix change from outside → `null`. Nothing else changes. The consumer already passes it (ignored until it ships) and renders `/ FILENAME` as the last crumb at `text-oq-96`.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.97.2

onPick(file | null) fires whenever the picked file changes — a file row click or ↑/↓ landing on a file → the object, a folder pick or an outside prefix change → null. Driven on the demo: click a file → its key, ArrowUp → the previous file, click a folder → null.

**Remainder here:** none — kol-r2b2 bump kol-component 0.97.2; the crumb wiring you already pass lights up.

