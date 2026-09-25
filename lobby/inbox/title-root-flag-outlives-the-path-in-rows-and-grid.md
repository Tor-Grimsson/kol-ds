# Rows and grid pick a file at the title root and the breadcrumb never shows the path

**Staged:** 2026-09-23 · from a kol-client-olina session
**Change:** one derived condition in `MediaLibraryPages.jsx`, plus the bucket step in rows and grid; no new props

---

## The problem, in one repro

kol-component 0.219.0, `apps/media`, `bucketLevel` on, rows view. Reproduced live, twice:

1. Open `#brand/logos/` in rows (crumb: `OLINA MEDIA / R2 · OLINA-MEDIA / BRAND / LOGOS`).
2. Go up to the title root — click the `OLINA MEDIA` crumb, or ⌘↑ at the bucket's top. Crumb: `OLINA MEDIA`.
3. Expand `brand` → `logos` with the chevrons and click `olina-wordmark.svg`.
4. The URL becomes `#brand/logos/`. **The crumb still reads `OLINA MEDIA`.** The file's location is
   nowhere on screen. The user: *"nor does it show correct path when I press the file … how hard is
   it to have some failsafe on when you click a file it can know its location and make sure its
   displayed in breadcrumbs?"*

It is the same state the user first hit in grid (`#projects/dolce-madonna/` with the crumb at the
title alone). Columns never does it.

## Why

"At the title root" is stored as its own boolean, `appRoot` (`:859`), separate from `prefix` and
the picked item. The crumb hides the whole path while it is true (`:1763-1789`, `!appRoot && …`;
`fullPath` `:1459` the same). Only the columns' `onPrefix` (`:1500-1504`) and `jumpTo` (`:1724`)
ever clear it. Everything the rows and grid do moves `prefix` without touching it:

- `rowPickFile` / `rowPickFolder` → `moveHereKeepingOpen(dirOf(…))` (`:884-885`)
- `goFolder` (`:1129`), which the grid's folder tiles and ⌘↓ use

So `appRoot` stays `true` while `prefix` is `brand/logos/` and a file is picked. Two sources of
truth for one location, and one of them is only kept honest by one view.

## The second bug, same cause

At the title root, rows and grid list **the bucket's contents** (`brand`, `projects`) instead of
the bucket. The rows count line even says the title-root thing (`2 folders · 0 files · 0 B ·
bucket: 303 files · 605.7 MB`) over the bucket-top list. Columns draw the right thing: column 0 is
the title, column 1 the bucket row, then its folders. The user, at the grid's title root: *"it
doesn't show the bucket folder OR the shared root MEDIA folder … only column view does it."*

## The fix

1. **Derive it, don't store it.** Wherever the render reads `appRoot`, read
   `atTitleRoot = appRoot && !prefix && !pickedFile && !pickedFolder` instead. Anything picked lives
   inside the bucket, so a pick can never leave the crumb at the title. That is the failsafe: a
   stale flag can no longer hide a path. (Optionally also `setAppRoot(false)` in the one funnel,
   `setPrefix` `:858`, when `v` is non-empty — but the derived form covers a pick at the bucket's top
   level, where `prefix` stays `''`.)
2. **At the title root, rows and grid list the bucket(s)**, one row / tile per bucket
   (`R2 · OLINA-MEDIA`), and opening one is `setAppRoot(false); setPrefix('')` — the same step the
   columns' column 1 is. The root count line then matches what is drawn.

## Definition of done

- [ ] The repro above ends with the crumb `OLINA MEDIA / R2 · OLINA-MEDIA / BRAND / LOGOS / OLINA-WORDMARK.SVG`.
- [ ] Same in grid: go up to the title root, open `brand` → `logos`, click a file; the crumb carries the whole path.
- [ ] At the title root, rows and grid show the bucket as the one row / tile, not `brand` and `projects`; opening it shows them.
- [ ] Clicking a file in any view, from any state, leaves the crumb showing that file's real location.
- [ ] ⌘↑ from a file in each view still ends at the title root, and there nothing is picked.
- [ ] Columns unchanged.

Not asked: a new prop, or a change to one-bucket consumers without `bucketLevel`.

## ADDRESSED — 2026-09-25 · kol-component@0.220.0 + kol-theme@0.148.0

Both bugs, in `MediaLibraryPages.jsx`. **The flag is derived**: `atTitleRoot = appRoot && !prefix && !pickedFile && !pickedFolder`; `setPrefix`, `pickFile` and `pickFolder` clear `appRoot`, and every read goes through the derivation. **Rows and grid list the buckets** at the title root, one row / tile each; and **one level above it** holds the title as a single folder (the columns' column 0), reached by ⌘↑, ⇧Enter or the title crumb. A picked file OR folder ends the crumb in every view (it was the columns' alone). Buckets behave as folders — click highlights, double-click / Enter opens — and preview their totals.

Proved live in `apps/media` at 1400: the ticket's repro ends with the full path crumb in rows and grid; ⌘↑ from a file ends at the top with the title selected; columns unchanged.
