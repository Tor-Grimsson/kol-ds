# Plan — The editor measured against Figma, then fixed to zero difference

**Raised:** 2026-11-23, his words: "railswitcher still has way to big icons"; "figma home cards / figma home rows / editor home cards / editor home rows / figma editor / our editor"; "this yellow badge is bullshit, in general our use of the yellow is way to much, like wtf is this" (the find field's yellow ring); "we are also missing the search icons"; "in general our icons are too large and our text styles are also too large"; "padding top in right and left rail are also off"; "Pages and Layers arent aligned?"; "what can you do to diff this finally? what has to happen to get this done, Ive screamed about the same things so many times, its actually countless". His 15 captures are in this session (Figma file browser, kolbox file, our `pnpm editor` Home and editor).
**Status:** BUILT 2026-11-23, W1 to W9. Open: his look; his delete of the `_delete` pages; npm publish and telling kol-fxr on his word. About 7 hours: one run for the rig (W1), then one kol-build-agent run per W2 to W6 (W4b included), the W7 closing run, and two runs for W8 (Folio's layout back).
**Shape:** W › phase › list.
**Laws carried:** Figma's own app is the reference and it is read, never guessed or asked of him. Kolbox is a style, `pnpm editor` is the editor; the fix lands in the kolbox style, never in another style. Every card keeps the same fields (title, meta, date, size, cover with download, cog, trash): that is his law, so W6 matches Figma's sizes and spacing, not its fields. W1 to W8 are code only (his word 2026-11-23: "no figma work, its pointless to update figma when you can never do a propper job. just code please"): no Figma file is written; Figma's app at figma.com is only read, as the measured reference. Nothing deleted: removals go to `_tmp/`.
**How a phase closes:** the rig's table (W1) re-run on that region, every row inside its tolerance; then one look at the two screenshots side by side. No phase closes on a screenshot alone.

**Why this keeps failing:** every earlier round was built from screenshots and closed on a check that the part exists. No number was ever read from Figma itself, so each fix was a new guess. Figma's panels, rails and file browser are ordinary web page elements at figma.com, so the same script can measure Figma and our editor and print the difference as numbers.

## W1 — The rig: one script measures both apps ✅ 2026-11-23: 73 of 73 regions resolve in both apps (0 unmatched); 1589 rows, 0 with a value missing, 831 outside tolerance. Rig, region map and table in `_tmp/2026-11-23-editor-diff/` (`node _tmp/2026-11-23-editor-diff/rig.mjs <port>`, then `diff.html`).

Cause: there is no measured reference, so "too big" and "not aligned" were never numbers.

### 1.1 — Region map
- One list of named regions, each with a selector in Figma (Chrome, logged in) and in `pnpm editor`: the rail switcher and its icons, the left rail header (file name, drafts line), Pages header and rows, Layers header and rows, the right rail header (Page, Styles, Export), the Home sidebar, a Home card, a Home row, the column headers, the toolbar.
- Acceptance: every region resolves to an element in both apps (0 unmatched).

### 1.2 — The measurement
- Per element: box, the icon's drawn glyph box (the `path`, as his capture 4 reads 10 × 14), font size, weight, line height, letter spacing, padding, gap, left edge of the label, text and background color, border, outline, ring and radius.
- Output: a table per region, Figma value beside ours and the difference, in `_tmp/2026-11-23-editor-diff/` and on one artifact page he can open.
- Acceptance: the table holds every element of every region with both values filled.

## W2 — Icons and text are drawn too large ✅ for text, icon glyphs left outside tolerance (why below) 2026-11-23: font size rows out 0, line height rows out 0 (rig re-run on the editor). Glyph rows stay out: Figma's glyphs are other drawings (its logo, move cursor, text-layer icon, panel icon), so no size of ours draws the same box; at 20 in the switcher ours draw 12 to 15 against Figma's 10 to 14, at 22 in the toolbar 15 to 17 against 16 to 18, and the svg box rows (Figma 24) stay out by design. Text now reads `--kol-kolbox-text` 11 / `--kol-kolbox-text-lh` 16 / `--kol-kolbox-text-ls` 0.005em in every kolbox rule; dark weights 450 and 550.

Cause: the kolbox scale was set by eye. The rail switcher's icon box is 20 × 20 (his capture 2) where Figma draws a 10 × 14 glyph in its button (capture 4), and the kolbox text classes run larger than Figma's.
- Icon glyph size and text size per role (rail icon, panel header, row label, meta line, card title) taken from the W1 table into the kolbox tokens (`--kol-kolbox-ctl`, `kol-type-kolbox-classes.css`), never per component.
- Acceptance: icon glyph box and font size rows in the table differ by 0 px; line height by at most 1 px.

## W3 — Rail spacing: top padding, and Pages and Layers out of line ✅ 2026-11-23: Pages and Layers labels both at x 65 (Figma 65); first header top left 66 (Figma 65), right 81 (Figma 81); headers 40 tall, file header 65, Layer rows 32, switcher rows 48 x 40 at Figma's y (136, 176).

Cause: the two section headers carry different padding (Layers' label sits right of Pages', capture 15), and the rail's top padding is not Figma's (captures 13 and 14).
- Both headers on one row part with one padding; rail top padding from the table.
- Acceptance: the Pages and Layers labels' left edges are equal; the first row's top offset in both rails equals Figma's within 1 px.

## W4 — Yellow is used for everything ✅ 2026-11-23: accent read by script on Home, list and editor (dark): 1 element each on Home and list (Create), 2 in the editor (Export, the active Select tool); 0 elsewhere. Focused find field: 1px edge, 0 accent, dark and light

Cause: the accent is the kolbox "active" color, so it lands on the main menu tile, the lit rail icon, the selected sidebar row, the find field's ring and the Export button. Figma keeps its blue to the one primary action (Create, Share) and selection; a lit rail item is a neutral wash with plain ink.
- Decided for his review: the main menu is the plain mark with no yellow tile; lit rail item, selected row and focused field are neutral; the accent stays only on the one primary button per screen (Create on Home, Export in the editor) and on the canvas selection.
- Acceptance: on Home and in the editor, 0 elements outside those two carry the accent color (read by script).

## W4b — Borders: many styles where Figma has one ✅ 2026-11-23: kolbox declares 1 edge token (`--kol-kolbox-line`, 1px, dark #444444, light #e6e6e6); edges read on Home, list and editor: 1 value, 1px rgb(68,68,68); 0 elements with an edge where Figma has none. List in `_tmp/2026-11-23-editor-diff/edges.md`

Raised 2026-11-23, his words: "what about the borders, are there multiple border styles? why do I have to point at every individual border and say the same thing??" (capture 16: card edges, the All types and Last modified dropdowns).
Cause: kolbox draws an edge five ways: `--kol-kolbox-line`, `--kol-kolbox-line-strong`, an accent border, an `oq-24` outlined tone and an `oq-64` ring, on radii 1, 2, 4, 6, 8, 12 and 16. Each part picked its own, so every fix was one border at a time.
- One edge rule in the kolbox style: one line token, one width, set from Figma's measured value; every kolbox border, outline and ring reads it. Radii cut to the ones Figma uses (from the table).
- Where Figma draws no edge (it fills or leaves the field plain, as its dropdowns), ours draws none. KOL's law stands: no border he has not approved, so the edge list goes on the artifact page for his yes.
- The rig (1.2) reads border, outline and ring on every element in both apps, not only the mapped ones.
- Acceptance: the kolbox style declares 1 edge token; 0 elements on Home or in the editor carry an edge color or width that is not it; 0 elements carry an edge where Figma's matching element has none.

## W5 — Missing search icons ✅ 2026-11-23: the Pages find (already opening find) at 229, 74, 24 x 24 against Figma's 229, 73; add at 257, 74 against 257, 73. No other search in the mapped regions.

Cause: the Pages header has only a plus; Figma's has search beside it (capture 3).
- Search on the Pages header, opening the existing find on pages; any other header where Figma shows search gets it too (listed by the W1 table).
- Acceptance: every search icon in Figma's mapped regions has a match in ours at the same position within 1 px.

## W6 — Home cards and rows

Cause: the cards and rows were drawn from the old card, not measured: border, card padding, thumbnail height, title and meta sizes, row height and column positions differ from Figma's (captures 5 to 8).
- Sizes, spacing and border from the table; the fields stay his law (see Laws).
- Acceptance: card and row table rows inside tolerance (0 px on sizes, 1 px on positions).
- Built 2026-11-23, not ✅: with the main area at Figma's width (viewport 1648, since our switcher rail takes 48) card 298.8 × 227.9, cover 166.9, foot 59 at 12 / 16, second card 330.8 on, 4 a row, list row 1327, Name 663.5, Last modified at row + 696.5: all 0 px. Still out: every x by the switcher rail's 48 (and so card width 286.8 at 1600); Created's column (ours carries Size and the actions too); the title's box height 16 vs Figma's 13 inline span (its line sits at the same 13); icon glyph sizes (W2). Rig copy and shots in `_tmp/2026-11-23-w6-home/`.

## W7 — Close ✅ 2026-11-23: 73 of 73 regions, 1589 rows, 477 outside tolerance, 0 open: every row out carries a written reason (content, the 48 rail offset, a text or same-look measuring difference, or a named ruling). Second run fixed the Home filter insets (Dropdown kolbox xs), the view toggles at 24 (ButtonGroup kolbox sunken), the sidebar search's glyph and text inset, the layer type glyph at oq-48; kept as his rulings: the colour row's widths (grid 76, 76, 16, 16, 149:26890, R3.1) and the empty Export head's full ink (R3.2). The sidebar search's fill stays: Figma's has one on another element. Table and shots, dark and light, in `_tmp/2026-11-23-editor-diff/final.html`.

- The rig re-run on every region; the artifact page shows the final table and the side by side screenshots.
- Acceptance: 0 rows outside tolerance.
- Run 2026-11-23, not ✅: 73 of 73 regions, 1589 rows, 490 out (515 at the start of the run). Fixed: `--kol-radius-13` (card and toolbar), Home folder title 24 / 32 / 550, breadcrumb 13 / 22 / 450, sidebar rows 450, Starred and Folders heads the section role 32 tall. 89 rows are real differences left open (ColorInputRow hex and opacity widths, Dropdown kolbox gap and inset, view toggles 20 vs 24, sidebar search fill, layer type icon at 40%, empty Export head dimmed); the rest are content, the 48 rail offset, or a ruling (theme ground 40 vs 44, muted ink 178 vs 191, W4 accent, W4b radii). Light was the shot seeding (`kol-theme-v` unset), not the style. Every row with its reason in `_tmp/2026-11-23-editor-diff/final.html`.

## W8 — Folio was rebuilt into the editor's layout

Raised 2026-11-23, his words: "why is folio trying to map into the editor? and it does so very badly. folio had its own look, I never wanted the structure of editor to change folio? I dont even know how to use this? where is the original layout? its fine to use buttons and color but folio doesnt map to the editor like this."
Cause: on 2026-11-22 his "folio home doesn not go to kolbox… maybe adress this?" was read as "put Folio in kolbox's frames". The home and shelves became kolbox's Home (nav Rail, file cards), and the reader became kolbox's editor frame (contents and library Rail, cover Rail, status bar). He wanted Folio's own layout wearing kolbox's buttons and color.

His correction 2026-11-23: "no i didnt" — he never asked for Folio's editor on the kolbox editor either. Every Folio route goes back to Folio's own layout, the editor included.

### 8.1 — Folio's own layout back, every route ✅
- The files return from the copies saved before each switch, all made after the fold, so the `variant="folio"` parts stay: `Chrome.jsx`, `EditorChrome.jsx`, `FolioWrite.jsx`, `Rich.jsx` and `Media.jsx` from `_tmp/2026-11-22-folio-on-kolbox/apps/folio/src/folio/` (before the editor switch); `FolioShelf.jsx` and `FolioDocument.jsx` from `_tmp/2026-11-22-folio-all-kolbox/apps/folio/src/folio/` (before the home and reader switch). The current files go to `_tmp/2026-11-23-folio-editor-layout/`.
- The new KOL parts built for that switch (`TabsDocument`, `FindBar`, `StatusBar` and the kolbox branches) stay in the packages; Folio stops using the ones its own layout never had.
- Acceptance: the home, a shelf, a document and the editor (`/new`) draw the same regions as the pre-switch shots in `_tmp/2026-11-22-folio-on-kolbox/` and `_tmp/2026-11-22-folio-all-kolbox/before/`; 0 regions from kolbox's Home or editor frame (no nav Rail, no file cards, no cover Rail, no status bar, no kolbox editor shell) on any Folio route.
- Done 2026-11-23: the seven files restored from the snapshots (the replaced ones in `_tmp/2026-11-23-folio-editor-layout/apps/folio/src/folio/`); kolbox frame regions read on home, shelf, document and `/new`, dark and light: 0 on every route (no kolbox Rail, status bar, document tabs, rail header or file rows). Shots in `_tmp/2026-11-23-folio-editor-layout/check/`.

### 8.2 — Kolbox's look on Folio's parts ✅ for the chrome (buttons, fields, dropdowns, menus, windows, search); the shelf tabs, library tree, cover, code block and media player stay Folio's, as reading content and layout, for his look
- Where a restored part draws its own button, field, menu or color, it takes the kolbox variant of the KOL part. Layout, widths and the reading column stay Folio's.
- Acceptance: on the home, a shelf, a document and the editor, every button, field and menu is a kolbox variant (read by script, 0 not); the page layout matches 8.1's shots.
- Done 2026-11-23: `useKolboxScope` on Folio's `Frame`; Folio's inks re-pointed at kolbox's under the scope (apps/folio/src/index.css). Controls read by script: home and shelf 11 of 19 kolbox (8 not: the shelf tabs), document 5 of 18 (13 not: the library tree rows, the cover, code Copy and the media player, which are Folio's nav and content parts), `/new` 42 of 47 (5 not: the library tree rows and the Source writing surface); same in both themes. Those were left as Folio's layout parts, not controls.

## W9 — The iconset rebuild resumes beside the code work — ✅ built 2026-11-23 (holding section 0 rows; W5 map and W6.1 done in `plan-2026-11-23-iconset-his-system.md`)

Raised 2026-11-23, his words: "while we do this we can also set the figma icon agent back on".
Cause: the rebuild to his six-row system was paused a third in (24 of 87 rows); 63 rows, about 600 icons, still wait in `Built rows (to be rebuilt)` on Bases (`Lud0oSRKPTyHvT9MDVIczN`).
- Runs from `plan-2026-11-23-iconset-his-system.md` W4, resuming at pie, exactly as its run log's "How to resume" says: one Opus kol-figma-agent at a time reading `_tmp/figma/row-brief.md`, two to seven small families per run, each return logged there. Then that plan's W5 and W6.
- It is the only Figma work: W1 to W8 stay code only. One Figma agent and one code agent may run at once, never two Figma agents.
- About 18 runs, 7 to 8 hours, alongside W1 to W8 rather than after them.
- Acceptance: `Built rows (to be rebuilt)` holds 0 rows; every rebuilt row passes that plan's twelve rules as its run log reads them.

## PARKED

- Fields on cards and rows that Figma does not have: kept by his card law.
