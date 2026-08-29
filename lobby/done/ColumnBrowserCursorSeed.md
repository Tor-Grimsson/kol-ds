---
component: ColumnBrowser
source: kol-r2b2 — the shipped organism (kol-component 0.97.1)
staged: 2026-08-27
status: draft
deps: [ColumnBrowser]
---

# ColumnBrowser — the cursor must start on the deepest open folder, and an arrow that doesn't move must not land

## Purpose
Two defects seen with a virtual root (`r2b2` → buckets → tree), both in the shipped organism:

1. **Start position.** The cursor initialises at `{ col: 0, idx: 0 }` whatever `prefix` is. With `prefix` three levels deep the first ↓ acts in column 0 — a single-row column — so the user's "standard folder navigation" does nothing useful. Finder starts on the selected item of the deepest open column. Ruling: the cursor's initial (and on-external-`prefix`-change) position is the open folder of the deepest column that has one — `{ col: levels.length - 2, idx: indexOf(openFolder) }`.
2. **Re-landing.** ↑/↓ clamp `idx` and then `land()` even when `idx` did not change. Landing on an already-open folder calls `onPrefix(level + folder)` again — in kol-r2b2 that collapses the deeper columns (the consumer treats the root re-pick as "go to root"). Ruling: if the arrow did not move the cursor, do nothing.

The consumer currently seeds the cursor by programmatically clicking the open bucket row after mount (a click seeds it) — a workaround to delete on publish.

## Recreation notes
Both are inside `onKeyDown` + the cursor `useState`. No API change.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.97.3

The cursor seeds on the open folder of the deepest column that has one (Finder's start), re-seeded when prefix changes from outside; internal moves land on the same spot. ↑/↓ that clamp without moving do nothing — no re-land, no onPrefix. Driven on the demo with prefix type/specimen/: at rest 3 columns and 0 onPrefix calls; ArrowUp at the seeded row → nothing (still 0 calls); ArrowRight → the deepest column's first file; ArrowDown → the next file.

**Remainder here:** none — kol-r2b2 bump kol-component 0.97.3; delete the programmatic-click seed.

