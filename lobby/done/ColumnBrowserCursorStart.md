---
component: ColumnBrowser
source: kol-r2b2 — the shipped organism (kol-component 0.96.0) on the bucket root column
staged: 2026-08-27
status: draft
deps: [ColumnBrowser]
---

# ColumnBrowser — the keyboard cursor starts on row 0 and reads as a second selection

## Purpose
Defect in the shipped `ColumnBrowser` (0.96.0). The keyboard cursor initialises at `{ col: 0, idx: 0 }`, and cursor and selected rows both draw `bg-fg-04` (ruled). With the vault open, row 0 (R2) shows the cursor fill and row 2 (vault) the selected fill — two highlighted folders in one column, and the user reads it as two selections.

## Fix
Either (the DS's call):
- the cursor starts on the **open folder of column 0** (derive `{ col: levels.length - 2, idx: indexOfOpenFolder }` from `prefix` on mount / when `prefix` changes from outside), or
- the cursor is **not drawn until a key is pressed** (`cursorActive` flips on the first arrow), and clicks seed it.

Either way: at rest, exactly one row per column is highlighted — the open folder, or the picked file.

## Recreation notes
Consumer context: kol-r2b2 now feeds a virtual key space — root column = `kol-r2b2` with the three buckets as folders (`<bucket label>/<key>`), a custom `partition` for level `''`, `urlOf`/`onQuickLook` translating keys at the seams. Stepping into a bucket is the app's bucket switch (the `Dropdown` follows). That wiring is consumer-side and stays; only the cursor default is the DS's.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.97.1

The cursor is not drawn until the keyboard is used: arrows arm it, a click seeds it. Measured on the demo: at rest only the open folder is lit in column 0 and nothing in column 1; ArrowDown lights the cursor row (and opens it, Finder's move).

**Remainder here:** none — kol-r2b2 bump kol-component 0.97.1; no consumer change.

