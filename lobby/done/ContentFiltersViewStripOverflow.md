# ContentFiltersViewStripOverflow — the view strip has no narrow rung

**Staged:** 2026-09-02 · from **kol-mirror**
**Nature:** a gap. `layoutStrip` (LIST / GRID) has a placement and drops to its own line below 768; `viewModeOptions` (the RECENT / SAVED family) has none and overflows the page.
**Version seen:** kol-component **0.162.0**, kol-shell **0.40.0**

## What happened

kol-mirror's Library split into five views — VARIANTS · MODULES · PATCHES ·
EFFECTS · EXPRESSIONS — on monitor's `LibraryPage` shape (kinds as views, each
feeding its own items and filter groups). At 390 the strip is 440px wide inside
a 390px page: `PATCHES` is cut mid-word, EFFECTS and EXPRESSIONS are off-screen
and unreachable, and the `ALL VARIANTS` title beside it wraps to two lines.
Measured in WebKit, `isMobile`, 390×844.

The strip is `ContentFilters.jsx:429` — `<div className="flex items-center
gap-4">` of spans, inside the header's right group (`flex items-center gap-6`).
Nothing in the row wraps, scrolls or re-places it; `PageShell` is
`overflow: hidden` so the page does not scroll sideways either. Two views fit
(monitor has two). Three might. Five do not.

## The ask

Give `viewModeOptions` what `layoutStrip` already has: a placement, defaulting
to the **second line below 768** — the line LIST / GRID already takes — so the
title row keeps its title and the view family gets the full width. Same family,
same rung, same strip.

## Meanwhile, in the filing repo

`src/styles/mirror-overrides.css` carries one scoped cascade rule under
`.library-catalog` that wraps the header's right group at narrow so the strip
drops to its own line. It reaches into DS utility classes and is the wrong
mechanism — recorded as such, and retired on the bump.

## ✅ RESOLUTION — 2026-09-02 · kol-component@0.163.0

viewPlacement, in the idiom layoutPlacement already had: auto (default) rides the header row from md and takes its OWN line under the divider below it — full width and WRAPPING, because five views on their own line at 390 still measure past the page, so the line wraps rather than clips; header always the header; below always its own line. One node, two homes — hidden md:flex in the header, md:hidden on the line — so nothing is duplicated in behaviour, only placed. Two views at desktop render exactly as before. Verified in a real render on the app-shell set: at 390 the header strip is display none and the own-line strip sits under the title row (title stays one line), wraps, spans the content width, and SAVED still switches; at 1280 the strip is back on the title row and the own line is gone. Tarball checked. Retire the .library-catalog cascade rule on the bump.

**Remainder here:** none — kol-mirror bump kol-component@0.163.0; delete the .library-catalog rule in mirror-overrides.css; re-check Library at 390 — five views on their own line under the divider, wrapping, all reachable.

