# Plan — finish the Typography page

**Raised:** 2026-11-15, him. Points verbatim: "I need a big plan that FINISHES this paragraphs page.. so we can leave this"; "aim for 1 ramp per set, closed footer and closed width. those are extra features, not default views"; "also deal with UI set and convert seections to autolayotu like I did here" (`font-sets` 2264:37848); "'Reading sets' rename to markdown-something? what does the .md files say?"; "I dont know what this is [02 Typography 1430:1490] but I trust you resolve it also"; "I dont care, you can also just disconnect the frames, lets just move past it.. you figure it out"; "theres little to decide really.. why are you createing blockers?"; "use agents … send opus not fable … dont be afraight of 2-3 agents together if you manage it".
**Status:** W1 to W6 built 2026-11-15, nothing published. Open: his library publish; 6.5 sans held; none on the page.
**Shape:** W › phase › list.
**Laws carried:** never delete (content to the `_trash` page, `_` prefix); his `font-sets` frame layout is his, not changed back; never publish the library; KOL Figma LAW (instances keep names, no loose text in sections, no wrapper frames); no questions to him, the fonts and styles are already designed in code and in Folio.
**How a phase closes:** the acceptance line read by a script, then one look at each changed frame.

File: library `n48kE2bJtrFjl7wxst30xH`, page `↳ Typography` 1453:66452.

Facts measured before building:
- "closed width" is `show weights = false` on `SpecimenSpread` (2200 wide; open is 5280). "closed footer" is `show footer = false` on the sheet inside it. The four font sets are already closed.
- Each of the seven sets in `Reading sets` and `UI set` holds two ramps (a `SpecimenSheet` ramp 2200 and an open `SpecimenSpread` 5280), a `tables` frame of two sheets and a `fonts` frame of three.
- `02 Typography` holds two old doc frames, `Roles` and `ui-font`, that list styles since renamed or folded (`sans/display-01`, `helper/12`, `ui/*`).

## W1 — The page is three auto-layout frames

### 1.1 — Names — ✅ built 2026-11-15
- `font-sets` (his), `markdown-sets` (was `Reading sets`; the docs call these `MarkdownPage`'s variants), `ui-sets` (was `UI set`).
- Acceptance: the page's top level holds exactly these three frames, 0 sections.

### 1.2 — `markdown-sets` and `ui-sets` built like `font-sets` — ✅ built 2026-11-15 (`markdown-sets` 2267:36474, `ui-sets` 2267:36480; 7 set frames of 3 children; the sections were empty and removed)
- Parent frame: horizontal, gap 512, padding 256, hug, fill white at 8%, as `font-sets`.
- Each set a frame named for the set (`article`, `site`, `research`, `folio`, `workshop`; `card`, `float`): horizontal, gap 128, holding `fonts`, the one ramp, `tables`, in that order.
- The type mode each section carried moves to the frame that replaces it.
- The emptied sections go to `_trash` as `_Reading sets old 2026-11-15` and `_UI set old 2026-11-15`.
- Acceptance: 7 set frames, each with exactly 3 children; 0 sections under either parent; 0 layers named `Frame 1`.

### 1.3 — One ramp per set, closed — ✅ built 2026-11-15 (11 spreads, all 2200; the set's own style carried onto the steps it uses: article 15, site 8, research 12, folio 14, workshop 5, card 3, float 5; seven second ramp sheets in `_trash` section `_markdown and ui sets old 2026-11-15` 2267:36492)
- The `SpecimenSpread` stays, `show weights = false`, inner `show footer = false`. The second ramp sheet goes to `_trash`; anything it shows that the spread does not is carried into the spread first.
- The spread's rows carry the set's own styles where the set uses the step.
- Acceptance: per set 1 `SpecimenSpread`, width 2200, 0 other ramp sheets; 11 spreads on the page, all closed.

## W2 — The font sets, finished

### 2.1 — The third sheet follows the set — ✅ built 2026-11-15
- The second face column fixed to Inter is hidden in the four font sets: a font set has one font.
- Acceptance: 0 text reading "Inter" in the `sans`, `mono`, `serif` frames.

### 2.2 — Styles on the font card — ✅ closed 2026-11-15 at 23 of 48 rows (H1 to H6 on the set's style; mono H6 spilled and stays on the card's own; the B and L rows are the card's own small sizes from `SpecimenFontCard.jsx`, no ramp step is that size, left as they are on his word "lets just move past it")
- The H1 to L3 rows on the second sheet take `<set>/<step>` styles as instance overrides. The big sample and the alphabet stay on the font variable (no ramp step fits them).
- Acceptance: 4 cards, every step row on a style of its own set.

### 2.3 — One look at `mono` and `ui` — ✅ 2026-11-15, neither name cut
- The wrapped font name is not cut on either card.

## W3 — `02 Typography` resolved

### 3.1 — `Roles` — ✅ 2026-11-15, in `_trash` as `_Roles old 2026-11-15`
- Superseded by the sets (every row names an old style). To `_trash` as `_Roles old 2026-11-15`.

### 3.2 — `ui-font` — ✅ 2026-11-15: the collection is still bound (10 layers on Molecules, 2 on Organisms, the `_ui-old` styles), so the frame stays, top level, 512 above `font-sets`; its `ui ramp` block in `_trash`; section 1430:1490 removed
- If the `ui-font` collection still has bound layers in the library, the frame stays, without its `ui ramp` block (that shows `_ui-old`), as a frame beside the three parents named `ui-font`. If nothing binds it, to `_trash`.
- Acceptance: section 1430:1490 gone from the page (to `_trash`, `_`-prefixed).

## W4 — The styles, accounted for

### 4.1 — Old named styles beside the ramp — ✅ closed 2026-11-15, corrected: 17 styles only trash used are now `_old/*`; 30 stay under their names because component masters use them (11 under `sans/`, 19 under `mono/`), see W6
- `sans/display-01` and its siblings, `mono/utility/*`, `mono/label/*`, `serif/work-row`: every layer in the library on one of them moves to the ramp step of the same size and nearest line height; the style is renamed `_old/<name>` (ids kept, so other files keep their link until they move).
- Acceptance: under `sans/`, `mono/`, `serif/`, `ui/` exactly 48 styles each.

### 4.2 — The unfolded `prose` and `sheet` styles — ✅ built 2026-11-15 (0 left: `prose/h1`, `display`, `title`, `display-upper`, `code` renamed into `article/`, ids and values kept; `sheet/th` → `research/th`; `sheet/td` folded into `research/mono-table-and-its-head`, line height 16.8 → 16, the newer one now `_dup/`)
- `prose/h1`, `display`, `title`, `display-upper`, `code` and `sheet/th`, `td`: layers move to the `article` and `research` style of the same role; the old style is renamed `_old/<name>`.
- Acceptance: 0 styles under `prose/` and `sheet/`.

### 4.3 — Every family has a home — ✅ 2026-11-15 (article 32 of 32, site 10, research 28, folio 22, workshop 12, card 7, float 16; 6 rows added to the article and research style tables; no family without a set)
- Every local text style family not prefixed `_` is shown in one set on the page, or is listed here with the reason it is not.
- Acceptance: the list of families against the eleven sets, 0 unplaced.

### 4.4 — Tracking — ✅ 2026-11-15 (the ramp in `kol-typography.css` carries no tracking: "tracking and weights belong to the font")
- Special Gothic, JetBrains Mono and Malromur stay at 0: the code sets none for them. Checked against `packages/theme/kol-typography.css`.

## W5 — Records

### 5.1 — Docs and the earlier plan — ✅ 2026-11-15
- `docs/documentation/01-foundations/17-type-sets.md` names the three tiers (font sets, markdown sets, ui sets).
- `plan-2026-11-14-type-ramp.md`: 6.25 and 6.26 closed with what was done here.

### 5.2 — His publish
- One line to him when the library is ready to publish, with what changes for files that use it.

## W6 — The components take the ramp (P: "why? seems lazy.. seems like we are just creating a problem for later?")

Measured 2026-11-15. The 30 old styles still in use are 19 mono and 11 sans. Code's component classes (`.kol-mono-*`, `.kol-helper-*` in `packages/theme/kol-type-mono-classes.css`) are not on the ramp either, and Figma follows code, so both move together.

Map, old style → ramp style (weight mode on the text layer where the old style is Medium):

| Old | New | Weight | Change |
|---|---|---|---|
| `mono/label/8` 8/12 | `mono/T10` | Regular | none |
| `mono/label/10` 10/14 | `mono/L8` 10/13 | Regular | lh −1 |
| `mono/label/12` 12/16 | `mono/L6` | Regular | none |
| `mono/label/14` 14/18 | `mono/L5` | Regular | none |
| `mono/label/16` 16/22 | `mono/L4` 16/21 | Regular | lh −1 |
| `mono/label/heading-03` 32/35.2 | `mono/H5` 32/36 | Medium | lh +0.8 |
| `mono/label/14-upper` | `mono/upper/L5` | Regular | none |
| `mono/utility/10` 10/10 | `mono/U8` | Medium | none |
| `mono/utility/12` 12/12 | `mono/U6` | Medium | none |
| `mono/utility/14` 14/14 | `mono/U5` | Medium | none |
| `mono/utility/16` 16/16 | `mono/U4` | Medium | none |
| `mono/utility/20` 20/20 | `mono/U2` | Medium | none |
| `mono/utility/12-upper` | `mono/upper/U6` | Medium | none |
| `mono/utility/14-upper` | `mono/upper/U5` | Medium | none |
| `mono/utility/cell-title` 12/15.6 | `mono/L6` 12/16 | Regular | lh +0.4 |
| `mono/utility/cell-text` 12/16.8 | `mono/L6` 12/16 | Regular | lh −0.8 |

Stay under their own names, off the ramp, listed: `mono/utility/28` (28/28, no U step), `mono/label/shell-header-tab` and `mono/utility/12-upper-menu` (their own tracking).

### 6.1 — The mono set carries what code's classes carry — ✅ built 2026-11-15
- U steps in all four sets: leading trim off (code trims only where `.text-trim` is asked for). `mono/U*` tracking 6%, 10% at 10 and under, as `.kol-helper-*`.
- Case cannot sit on top of a style in Figma (it unlinks the style), so three uppercase styles exist: `mono/upper/L5`, `U5`, `U6`.

### 6.2 — Code: the mono and helper classes point at the ramp — ✅ built 2026-11-15 (15 of 15 classes compute to their step; mono-10 lh 14 → 13, mono-16 22 → 21, table cells to 16; kol-theme CHANGELOG Unreleased entry; unpublished; the table cells' 480px rule `font-size: 0.65rem` left as it was)
- `.kol-mono-8` T10, `-10` L8, `-12` L6, `-14` L5, `-16` L4, `-20` L2; `.kol-helper-8` U10, `-10` U8, `-12` U6, `-14` U5, `-16` U4, `-20` U2; the table cell classes to L6. Weight, tracking and family stay.
- Acceptance: 0 raw px size or line height in those rules; computed size and line height read in the showcase equal the ramp step for each class. Unpublished.

### 6.3 — Figma: every master off the old mono styles — ✅ built 2026-11-15 (0 layers left on all 18 live pages, read by one script; no width changed; 19 components in Organisms and Styleguide got 2 to 10px shorter, all holding L8, L4 or L6 rows; `_trash` and `_stash` untouched)
- Every text layer in a master (and every style override inside an instance) on an old mono style in the map moves to its new style; Medium ones get the `weight` mode Medium on the layer.
- Acceptance: 0 layers outside `_trash` and `_stash` on a mapped old style; every touched master's width and height within 1px of before, except those holding a row whose line height the map changes (listed).

### 6.4 — The old mono names leave — ✅ built 2026-11-15 (16 renamed `_old/*`; under `mono/`: 48 steps, 3 `mono/upper/*`, and `shell-header-tab`, `utility/28`, `12-upper-menu`)
- The 16 mapped styles become `_old/<name>` once 6.3 reads 0. Other files' own text on them keeps its look and loses the link at his publish.
- Acceptance: under `mono/` only the 48 steps, `mono/upper/*` and the three listed.

### 6.5 — Sans — HELD: it is the default-font change he is holding (7.3 in plan-2026-11-14-type-ramp.md)
- The 11 old sans styles follow the file's font mode; `sans/*` is always Special Gothic. Moving the masters is the same act as changing the default font for every file.

## W7 — `card` and `float` join `ui` (P: "why dont these just join as ui-font? its all inter? … seems logical?")

### 7.1 — One `ui` set — ✅ built 2026-11-15
- The `ui` frame 2261:37819 holds `fonts`, `SpecimenSpread`, `card`, `float` (the two style tables, 7 and 16 rows). `ui-sets` with its own ramps and font sheets is in `_trash` section `_ui-sets old 2026-11-15` 2281:17811.
- Acceptance met: page top level is `ui-font`, `font-sets`, `markdown-sets`; `markdown-sets` 512 below `font-sets`.

## W8 — The `ui-font` switch retires (P: "whats the pooint of this? just hanging?"; "yes")

### 8.1 — Readers moved, frame and collection out — ✅ built 2026-11-15
- 4 master text layers (SettingsGroup note, SettingsFieldMap right, two `_ModalDialogSection` labels; 10/12 Inter Regular) took `ui/L8`. The two fixed-width captions were set to hug width so they stay on one line; component sizes unchanged.
- Doc frame in `_trash` as `_ui-font old 2026-11-15`; collection renamed `_ui-font`; 0 bindings, 0 modes, 0 `_ui-old/*` users outside `_trash` and `_stash`. The page's top level is `font-sets` and `markdown-sets`.
