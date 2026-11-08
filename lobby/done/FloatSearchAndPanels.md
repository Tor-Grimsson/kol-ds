---
component: FloatSearchAndPanels
source: kol-shell@0.105.0 FloatLayout (PanelsRestore) · kol-component@0.339.0 CommandOverlay — kol-website apps/record/src/App.jsx · components/RecordSearch.jsx
staged: 2026-11-04
status: draft
deps: [FloatLayout, TopControlsBar, PanelsRestore, CommandOverlay, RailTrigger (surface)]
---

# FloatSearchAndPanels — Panels ⌄ opt-out, and search in the float look

## Purpose
record runs on `FloatLayout` (railMode overlay). Two asks from the user, same frame:

## 1. Opt out of Panels ⌄
*"I dont get why this one is up here. I wanted rather an action button … make a ticket to opt out of this panels option"* — Panels ⌄ (PanelsRestore) shows in the bar whenever the rail is hidden; RailTrigger's card now has "Show navigation", so an app may not want both.
- Ask: `FloatLayout panels={false}` (the frame's restore menu off; the card's row and `⇧\` remain the way back). Default unchanged.

## 2. Search in the float style
*"record should also have kol-search. and kol-search should be built in Float style"* — record opens kol-search results in `CommandOverlay` (⌘K, the bar's search glyph, the rail's "Search pages" capsule). CommandOverlay is drawn in the old shell look (mono rows, square card); every other float piece (RailTrigger's card, RailFlyout, the rail) wears the float chrome.
- Ask (the general thing): CommandOverlay takes the float look — `surface` ('solid' | 'glass-dark' | 'glass-light', the same prop RailTrigger and FloatLayout take), the float menu radius, float rows (Inter, the float row height, the float lit state), the float shadow; FloatLayout passes its own `surface` down when it opens search (or exports a `FloatSearch` built on CommandOverlay that apps hand results to). The data side stays the app's (kol-search index → `results`).

## 3. The user, again (2026-11-04, after seeing record's search) — FLOAT STYLE SEARCH
*"tell DS we need FLOAT STYLE SEARCH"* — the search opens as the old card: a pale square panel, a mono field, mono rows (screenshot: record /, ⌘K). He wants it in the float look — the round float field and the float card, like RailTrigger's card and the rail's "Search pages" capsule. This is the part of this ticket he is waiting on.

## Recreation notes
- One release; record bumps, passes `panels={false}` and the surface (or swaps to FloatSearch). No local restyle meanwhile.

## Built

kol-component 0.340.0 · kol-shell 0.106.0 (2026-11-04).
- **`FloatLayout panels={false}`** drops Panels ⌄; the way back is RailTrigger's Show navigation row and `⇧\`. Default `true`, unchanged. (It also drops the inspector's restore — an app hiding the inspector with it off controls `inspectorHidden`.)
- **CommandOverlay `surface`** (`solid` · `glass-dark` · `glass-light`): RailTrigger's card (`kol-more-sheet-float` on `--kol-float-menu-r`, the float surface and shadow), the float SearchInput, float rows (Inter, `--kol-float-row`, the cursor lit fg-16). Unset, drawn as before.
- **Route: pass surface through** — `FloatLayout search={{ open, onClose, results, query, onQueryChange, onSelect, … }}` draws the search modal on the frame's own `surface`; the app keeps the data. No `FloatSearch` export.
- record: bump, pass `panels={false}` and move its CommandOverlay props into `search`.

## ✅ RESOLUTION — 2026-11-04 · kol-component@0.340.0 · kol-shell@0.106.0

FloatLayout panels={false} drops Panels ⌄ (the way back is RailTrigger's Show navigation row and ⇧\; default true unchanged). CommandOverlay surface ('solid' | 'glass-dark' | 'glass-light') draws the search modal in the float look — RailTrigger's card on --kol-float-menu-r with the float surface and shadow, the float SearchInput, float rows (Inter, --kol-float-row, the cursor lit fg-16); unset it is drawn as before. FloatLayout search={{…CommandOverlay props}} draws it on the frame's own surface; the app keeps results.

**Remainder here:** none — kol-website bump kol-component ≥0.340.0 and kol-shell ≥0.106.0; pass panels={false}; move record's CommandOverlay props into FloatLayout's search.

