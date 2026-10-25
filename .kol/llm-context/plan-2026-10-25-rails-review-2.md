# Plan — rails, his second review

**Raised:** 2026-10-25, his review of `apps/rails` after review 1 (eight screenshots: the patch rail's header against the settings rail's, the cable rows, monitor's Stage parameter panel and its Mark parameters list, the bottom rail, the collapsed nav rail, the expanded nav rail beside the patch and bottom rails). Points verbatim: *"title + close!! then divider!!! thats a fucking standard header!!!"* · *"are we seriously using bullets? can we not show a grided way matrix?"* · *"how wolud we show this … this would get its own tab in H?"* · *"H does not include dark overlay, that is only settings [,] all the other just skip dark overlay"* · *"why do all rails get reset except the Patch rail? will that ship with an opt in?"* · *"bottom rail is terrible, like I said it should OVERLAY the navrail. this is the 2nd time I say this … because then we can use same icon system as collapsed siderail … so just icons for Edit Rack and library, like a siderail in the bottom rail"* · *"the entire padding on the bottom rail and side rail is completely different then the navrail? why dont we unify?"* · *"navrail expanded also gets the same width as we just set"*.
**Status:** W1–W7 built 2026-10-25, for his review — `_tmp/2026-10-25-rail-roles/walk3.mjs` 20/20 (the header at one place on P · H · , and studio-hub's; no scrim on P and H; the matrix in aligned columns; the foot on P; the bottom rail from 0 with RailNav's glyphs under the nav rail's; a rail's title 48 in = the page's 48; the nav rail's open width 380; H's two tabs, five sliders, 25 switches; the phone rule). 6.1: first built on the page's inset (48 on a desk) — *"so you went backwards???? what the fuck is happening with the padding on H????"* — then 20, then 16 on his word (*"MAKE 16!!!"*), on every width. The numbers: the nav rail's label sits 52 in (8 + the 32 glyph box + 12), its glyph 14 in; the page's content 48 in; a side rail's title was 24 in, is 16. The matrix: four dropdowns do not fit the 284 content box, so Add a cable is two rows under the table. Two of review 1's calls are reversed here on his word: the page rail's scrim (1.2 gave H the settings rail's scrim; H has none) and the bottom rail beside the nav rail (2.1 — I read *"bottom rail goes over navrail"* as a fault; it was the requirement). The monitor ticket is corrected the same way.
**Published 2026-10-25:** kol-theme 0.190.0 · kol-framework 0.56.0 · kol-component 0.302.0 (*"ok lets call it, its fine for now"*).
**Shape:** W › phase › list.
**Laws carried:** one header, one inset, one width — a rail never carries its own; the nav rail is the yardstick for the bottom rail's icon column; the Hub's settings rail is the yardstick for the header; visual calls go on the open-questions page; no publish until he reviews.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — The standard header

### 1.1 — Title + close, then the divider, on every rail — ✅ built 2026-10-25 (P: *"title + close!! then divider!!! thats a fucking standard header!!!"*)
- `Rail` draws the header row and the hairline under it for every rail that has a header; `SettingsPanel` stops drawing its own `Divider` first in the body (the one difference between the two screenshots, with the subtitle line). `RailHeader` keeps `subtitle` and `actions` as opt-ins; the reference's patch rail drops its "4 cables" subtitle — the header is the title and the ×.
- Acceptance: in `apps/rails`, P · H · `,` measure the same header row (title baseline, × position) and a 1px hairline at the same y under it; studio-hub's settings rail unchanged to the pixel.

## W2 — The page rail has no scrim (P: *"H does not include dark overlay, that is only settings"*)

### 2.1 — `page` loses the scrim — ✅ built 2026-10-25
- `RAIL_ROLES.page.backdrop` false; everything else the settings shell. Only `settings` dims the page; patch, page and bottom leave it live.
- Acceptance: H opens with no `.kol-overlay-scrim`; `,` still does.

## W3 — The patch table is a matrix (P: *"are we seriously using bullets? can we not show a grided way matrix?"*)

### 3.1 — Columns, not a dotted string — ✅ built 2026-10-25 (the cables; Add a cable as two rows under the table)
- The cable rows as one grid with aligned columns — FROM · OUT · TO · IN · the remove — column heads in the helper voice, the Add row's dropdowns sitting under the same columns. The DS `Table` (compact, no chrome) if it fits 380 clean; else the kit grows `RailTable` (a grid of the kit's rows) rather than a one-off in the app.
- Acceptance: four aligned columns measured (each column's cells share an x); the Add a cable controls align to them.

## W4 — The foot is an opt-in on every rail (P: *"why do all rails get reset except the Patch rail? will that ship with an opt in?"*)

### 4.1 — Yes, and the reference shows it — ✅ built 2026-10-25
- `Rail footer` is the opt-in already (`SettingsFooter onReset` on any rail); the patch rail in `apps/rails` takes it, its reset clearing the table, so the three side rails carry the same foot. Documented as the rail's foot, not the settings rail's.
- Acceptance: P · H · `,` each end in the same pinned foot with the reset glyph; the patch rail's reset empties the rows.

## W5 — The bottom rail overlays the nav rail, with a rail inside it

### 5.1 — Full width again, from the viewport's edge — ✅ built 2026-10-25 (P: *"it should OVERLAY the navrail. this is the 2nd time I say this"*)
- `role="bottom"` runs from 0; the `useBesideShellRail` measurement of review 1 retires to `_tmp/`.
- Acceptance: the bottom rail's x is 0 and its width the viewport's, at 1440 and 390.

### 5.2 — The icon rail inside — ✅ built 2026-10-25 (P: *"same icon system as collapsed siderail … just icons for Edit Rack and library, like a siderail in the bottom rail"*)
- A new kit part, `RailNav`: the collapsed nav rail's column inside a rail — 48 wide, the nav rail's 8px gutter, `Button variant="nav" iconOnly` per view, lit when active, no labels, no chevron — sitting under the nav rail so Edit · Rack · Library's glyphs line up with Stage · Rack · Dev above. The bottom rail's content starts right of it.
- Acceptance: the icon column measures 48 wide with its glyph centres at the nav rail's glyph x; three glyphs, no text.

## W6 — One inset, one width (P: *"the entire padding on the bottom rail and side rail is completely different then the navrail? why dont we unify?"*, *"navrail expanded also gets the same width as we just set"*)

### 6.1 — The rails' inset is the page's — ✅ built 2026-10-25 as 16 after his word on the 48 (*"you went backwards"*) and the 20 (*"MAKE 16!!!"*)
- Measure the three today (the nav rail's label x from its edge, the page's content x, a side rail's title x from its edge) and put the side rails and the bottom rail's content on the one token the page already uses (`--kol-shell-page-pad`), so text inside a rail starts where text on the page starts; the bottom rail's icon column keeps the nav rail's own 8. `--kol-pad-rail-app` reads that token. Decided for review with the numbers in the acceptance.
- Acceptance: the patch rail's title inset equals the page header's inset; the bottom rail's CASE column starts at 48 + that inset — the page content's x.

### 6.2 — The nav rail opens to 380 — ✅ built 2026-10-25
- `--kol-shell-rail-open` 264 · 320 (from 1536) → 380 flat, the rail width; the open nav rail and a side rail are one width.
- Acceptance: the expanded nav rail measures 380 at 1440 and at 1600.

## W7 — The Stage's parameters in H (P: *"how wolud we show this … this would get its own tab in H?"*)

### 7.1 — Yes: H takes tabs, as `,` has them — ✅ built 2026-10-25
- The page rail carries the settings rail's tab row when the page has more than one set: the Stage's H in `apps/rails` shows **Stage** (the sliders — `SettingsSections` grows `type: 'slider'` on the DS `Slider`, with the value readout) and **Marks** (the mark parameters as switch rows grouped by module — Gen Hifi, Dither, Magneto). Monitor's floating parameter panel and its toolbar (camera · list · Modules · gear) fold into H on adoption; its word. Decided for review.
- Acceptance: H on the Stage shows two tabs; Stage's rows are sliders with readouts; Marks' rows are switches under module eyebrows.

## W8 — Docs and the ticket
- `19-rails.md` (the header, the inset, the bottom rail's icon column, H's tabs, 380 for the nav rail), `Rail.mdx` · `SettingsPanel.mdx` · `SettingsSections` docs, changelogs' Unreleased; `RailRolesOnMonitor` corrected now (the bottom rail overlays the nav rail with the icon column; H no scrim; the standard header) and again on the bump.
- Closes into `docs/operations/09-phase-log/` with reviews 1 and the predecessor.
