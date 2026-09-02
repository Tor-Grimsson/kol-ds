# DashDetailWrapsWithoutLeading — `.dash-detail` is line-height 1 and DashTableCard hands it a wrapping subtitle

**Staged:** 2026-09-01 · from **kol-chess**
**Nature:** type-protocol fault line inside kol-dashboards — one class doing two jobs, one of them illegal.

## Reported — live site, iPhone, 390

User, verbatim: *"im also seeing helper mono used where kol mono should in the
description above the table in the cards."*

Screenshot: `_assets/2026-09-01-chess-mobile-round-2/insights-dash-detail-subtitle-390.png`
— the sentence under each card title wraps to three lines with no leading.

## Measured

`.dash-detail` (`kol-components-dashboards.css:147-159`): mono, 10→12px,
**`line-height: 1`**. `CardHeader` (`cards/_shared/CardHeader.jsx:10`) puts it
on the card **subtitle**; `DashTableCard` also uses it for the **footer**
(`WEAKNESS` / `STRENGTH`).

On kol-chess `/insights` every card subtitle is a full sentence — at 390 it
wraps to 3 lines of leading-less text. The footer is a single-line label and
is fine.

This is exactly the fault line the type protocol splits: line-height-1
helper style is for single-line chrome only; anything that can wrap carries a
line-height-bearing mono (`kol-mono-12` is the shape). kol-chess hit the same
split consumer-side last week and moved its own wrapping helper text to
`kol-mono-12` (`SettingsPage`, 2026-09-01 field review).

## The ask

Split the two jobs: the subtitle gets a leading-bearing style (kol-mono-12 or
a new `.dash-subtitle` with real line-height), the footer keeps `.dash-detail`
as is. Values and naming yours.

Consumer change expected: none — kol-chess passes plain strings to
`DashTableCard`.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.120.0

Split as asked: .dash-subtitle minted — dash-detail's ramp and container step (10 → 12), line-height 1.5 — and CardHeader's subtitle moved onto it (kol-dashboards 0.4.0). Footers, labels, legends, statuses keep .dash-detail; swept the pack's other 19 dash-detail call sites and all are single-line chrome.

**Remainder here:** none — kol-chess bump kol-theme@0.120.0 + kol-dashboards@0.4.0; re-check /insights card subtitles at 390 — three lines WITH leading.

