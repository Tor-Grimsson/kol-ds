# @kolkrabbi/kol-icons

## 0.66.0 — 2026-11-05

- **New interface group `games`** (18): the twelve solid and outlined chess pieces from the Figma library (node 437:5529) as `chess-<piece>-black` and `chess-<piece>-white` for pawn, rook, bishop, knight, king and queen, beside the six outline `chess-*` moved out of `people`. The twelve are solid drawings (fill `currentColor`, outlines as even-odd cut-outs), fitted to the keyline (20, kings and queens 18) and centred; each black and white pair shares its fit.
- Tags for all 18 (chess, game, board, piece, strategy, plus the piece).

## 0.64.0 — 2026-11-04

- **Import batch: 71 icons** from the Figma import frame, each fitted to the keyline (18 near-square, 20 otherwise, centred), stroke 1.5, one path, `currentColor`, round caps and joins. Added by group:
  - `files` (16 new + 2 redrawn): `book-copy` · `book-dashed` · `file-sliders` · `file-terminal` · `file-type` · `file-type-offset` · `folder-cog` · `folder-git` · `notebook` · `notebook-pen` · `notebook-tabs` · `notebook-text` · `notepad-text` · `notepad-text-dashed` · `scroll` · `scroll-text`; `files` and `notes` redrawn.
  - `typography` (12): `arrow-down-z-a` · `arrow-up-z-a` · `heading` · `heading-1` to `heading-5` · `letter-text` · `ligature` · `pilcrow-left` · `pilcrow-right`.
  - `design` (9): `circles-overlap` · `contrast` · `feather` · `flip-triangles-horizontal` · `flip-triangles-vertical` · `lasso` · `mirror-frame-horizontal` · `mirror-frame-vertical` · `sparkle`.
  - `places` (6): `anchor` · `flask-conical` · `flask-round` · `map-folded` · `traffic-cone` · `train-track`.
  - `media` (5): `album` · `captions` · `cassette-tape` · `headphones` · `keyboard-music`.
  - `actions` (3): `copy` (redrawn) · `copy-check` · `filter-x`.
  - `code` (3): `codepen` · `equal` · `equal-not`.
  - `layout` (3): `blinds` · `fold-horizontal` · `fold-vertical`.
  - `devices` (2): `airplay` · `circuit-board`. `flow` (2): `iteration-ccw` · `iteration-cw`. `people` (2): `mail-plus` · `mails`. `planning` (2): `calendar-plus` · `clipboard-copy`. `shapes` (2): `grip-horizontal` · `grip-vertical`. `charts`: `activity`. `navigation`: `message-circle-more`.
- **Redrawn in place** (the user's picks; old files in `_tmp/2026-11-04-plurals-handdrawn/` and `_tmp/2026-11-04-copy-handdrawn/`): `files/files` (two sheets, folded back corner), `files/notes` (the same two sheets, plain corner, two text lines), `actions/copy` (now a stroke drawing; it was solid).
- **Skipped as duplicates: 12** (the set already draws them): `heading-6` · `pilcrow` · `sparkles` · `folder` · `lasso-select` · `mail-open` · `mail` · `grip` · `ellipsis-vertical` · `filter` · `alarm-clock` · `eraser`. Two more were left out as retired today: `clipboard-pen` and `ellipsis`.
- Renamed where a name was taken by a different drawing: `circles-overlap` (not `blend`), `map-folded` (not `map`), `mirror-frame-horizontal` and `-vertical` (not `flip-*`), plus `flip-triangles-*`, `file-type-offset` and `folder-git` to avoid `-2` suffixes.
- Corner radii are as drawn in the import; the corner rule was not re-applied to these 71.
- **New `typography/bold`** (Figma 91RgXQdroY01wN96lAiOv1, node 237:21006): the text-bold B, a solid letterform like `typography/type`, fill `currentColor`, fitted to the 20 keyline and centred.
- `design/overlap` renamed `design/transparency` (the user's naming); `overlap` stays as an alias in RENAMED_ICONS so existing code keeps working.

## 0.63.2 — 2026-11-04

- Keyline fit: 31 icons scaled to the 18/20 keyline, drawn extent incl. stroke, stroke kept at 1.5 (actions/filter-lines, redo, undo; charts/dot-plot-03, dot-plot-04; code/hash-01, hash-02, terminal; design/frequency, pointer, slider-01, slider-02; direction/download, upload; layout/atomic-atomic-01, atomic-atomic-02, atomic-molecule-04, foundation, view-list; media/speaker; typography/font-01, letter-spacing, line-height, text-align-center, text-align-left, text-align-right, text-justify-all, text-justify-center, text-justify-left, text-justify-right, underline). Compact marks and the set's 18-ink icons are left as drawn. Originals are in `_tmp/2026-11-04-icons-pre-fit/`.
- `design/notepad-pen` — the pen is now the set's rounded pencil (actions/pencil), scaled into the pad; library master redrawn.
- Retired `direction/chevron-up-short` (a duplicate of `chevron-up`; the float fold buttons use `chevron-up` in an icon-only Button).
- Retired `navigation/dots-three-fine` (a duplicate of `more`; the float option buttons use `more` in an icon-only Button).

## 0.63.1 — 2026-11-04

- `design/notepad-pen` scaled up to the keyline (15.75 × 16.5 → 18 tall), one path at 1.5; the float "notes" tile maps to it.

- **New plural icons** `files/files` and `files/notes`, drawn like `folders` and `images`: two stacked sheets, the back one offset up and right and cut where the front covers it. `files` has the folded corner on the back sheet; `notes` has two text lines on the front sheet.
- **Retired** (duplicates, the user's ruling: one of each): `design/clipboard-pen`, `design/pen-nib-02`, `design/pen-nib-03`, `design/pen-nib-straight`.

## 0.63.0 — 2026-11-04

- **Corner rule:** a rounded corner's radius follows the shorter side of the shape it rounds, measured on the stroke centre-line in the 24 grid: ≥ 16 → r 3.5, 10–16 → 2, 3–10 → 1, < 3 → 0.5 (± 0.15; sharp stays; shapes with a shared edge, like `layout/split`, count as one frame). Shapes (`shapes/*`), organic drawings and dashed strokes are exempt and keep their own radii. About 120 stroke icons were re-rounded; inner strokes were re-ended to meet the new corner curve and each icon's strokes are one path with round caps. Originals are in `_tmp/2026-11-04-icons-pre-corner/`. Hand redraws to the rule: `devices/sd-card`, `files/folder-minus`, `media/video-off`.
- **kol-icon batch** (Figma 91RgXQdroY01wN96lAiOv1): 33 new icons — `layout/panel-top` · `panel-top-open` · `panel-top-close` · `panel-top-dashed` · `panel-bottom` (+ `-open` · `-close` · `-dashed`) · `panel-left-dashed` · `panel-right-open` · `panel-right-close` · `panel-right-dashed` · `panels-left-bottom` · `panels-right-bottom` · `panels-top-right` · `table-columns` · `table-grid` · `toggle-left` · `toggle-right` · `layout-carousel` · `layout-sidebar-dots`, `devices/monitor-circle` · `mouse-capsule` · `screen-rotate` · `webcam`, `media/speaker-box`, `status/radar-sweep`, `shapes/cube`, `commerce/dessert`, `people/crown-royal` (+ `-solid`), `charts/bars-baseline-solid` · `bars-descending-solid`. `charts/bars-baseline` and `bars-descending` take the batch drawing.

- **Align pairs, outline + solid (the set's convention, `rocket` / `rocket-solid`):** the six `design/align-*` names now draw the new outlines; the filled drawings moved to `align-*-solid`. The `-outline` names never shipped. A consumer that wants the old filled look uses `align-*-solid` or `<Icon variant="solid">`; kol-component's `AlignmentGrid` and kol-deck's `SlideInspector` were moved to `-solid` so they look unchanged. Library: each pair is one set, `variant=outline|solid`.

- **Retired (to `_tmp/2026-11-04-icons-retired/`, the user's ruling on the float review):** `shapes/diamond-plus` (the float "brand" glyph now maps to `shapes/ball`), `places/compass` (`compass-04` wins), `places/compass-03`, `planning/calendar-03` (the user: ugly), `devices/camera-02` (a second camera; `camera` stays), `design/pen-nib-straight` (duplicate — the user: one of each), `design/pen-nib-03` (duplicate — the user: one of each), `design/pen-nib-02` (duplicate — the user: one of each), `design/clipboard-pen` (duplicate — the user: one of each), `design/colour-swatches` (another swatch fan; one stays), `people/syringe-solid` (the filled twin of the retired syringe), `people/syringe` (too small to read; syringe-02 stays), `design/swatch-book` (a duplicate of a swatch fan already in the set), `devices/robot` (too dense to read small; `people/robot-head` stays), `layout/container` (the same clipboard as `clipboard`, which now takes `clipboard-check`'s drawing without the check), `actions/pill-knob` (the float "toggle" is the shipped `actions/toggle-oval-02`, the same switch in its on state). Code that imports these names must move: `diamond-plus` → `ball`, `compass` → `compass-04`.
- `shapes/bin-lid` — the gap where the body met the lid closed: lid, body and handle are one path, round caps, so the joins paint once.
- `shapes/ring` — the centre is a filled dot (r 4), as the exploration draws record.

- **The float exploration's own glyphs, redrawn from the exploration** (float-everything, `/lobby-icon`; gap map W2.13, Figma XY6adCImPaxDuHDO6OdUw9 node 51:2365): 20 new interface icons, named by shape. `charts/bars-baseline` (metrics) · `charts/bars-descending` (founder) · `layout/sidebar-collapse` (collapse) · `layout/sidebar-expand` (expand sidebar) · `layout/panels-top-left` (index) · `direction/chevron-up-short` (fold todos) · `navigation/dots-three-fine` (inspector options AND todo options: the same drawing, one icon) · `typography/letter-a` (logo) · `status/eye-almond` (look) · `design/pencil-ferrule` (notes) · `shapes/dot-matrix-3x3` (pattern) · `design/sliders-rows` (props) · `planning/list-checks` (tasks) · `files/page-two-lines` (unread).
- **Eight 0.61/0.62 promotions were wrong redraws and are replaced in place** (old files in `_tmp/2026-11-04-float-icons-replaced/`): `shapes/ring` is now a circle with a centre ring (record), `shapes/bin-lid` (lid and body share one edge, no double stroke), `navigation/lines-three` (18 wide), `media/film-strip`, `shapes/diamond-plus`, `files/inbox`, `design/highlighter`, `typography/lockup` — each at the exploration's own size (the 0.61/0.62 files had been shrunk to 15 and 18 px), 1.5 stroke, on the 18 keyline.
- **Chess set completed:** `people/chess-bishop` · `chess-knight` · `chess-queen` · `chess-king`, on the same plinth, weight and 2–22 height as `chess-pawn` and `chess-rook`.
- **Outline aligns:** `design/align-* (outline)` — real 1.5 strokes drawn from the flattened outlines in library--kol-icon (91RgXQdroY01wN96lAiOv1, node 223:20783); the filled `align-*` stay.
- **Fixed:** `flow/tree` (the trunk path carried a stray fill and sat over the branch rules; now a trunk, an elbow and two stubs between four boxes) and `typography/line-height` (the A's crossbar no longer overlaps the legs; the arrow shaft stops short of the heads).
- **No two strokes overlap in any of these:** a rule that meets another stroke ends flat on its edge (butt cap) instead of running through it. Dots in `dots-three-fine` and the knight's eye are solid `currentColor`.

## 0.62.0 — 2026-11-04

- **Four more glyphs from the float exploration join kol-icon-set-interface** (float-everything, `/lobby-icon`; gap map W2.13 in kol-float--style): `shapes/bin-lid` (a tapered bin under a lid), `shapes/ring` (a plain circle outline, 18 across), `navigation/lines-three` (three rules, 16 wide) and `media/film-strip` (a frame with sprocket ticks). Each redrawn from the exploration's stroke 2 to stroke 1.5, `currentColor`, no refit (all sit on the 18 keyline or inside).
- **Near-duplicates, placed as asked:** `lines-three` is the same three rules as `hamburger` (4–20 vs 3.2–20.8); `ring` is `circle` drawn 1 px larger.
- `brand` was already promoted as `diamond-plus` in 0.61.0; no new file.

## 0.61.1 — 2026-11-04

- **A CSS size draws the glyph** (float-everything W6): `<Icon size="var(--kol-float-ic)">` — every float Button's glyph — wrote the var onto the `<svg>`'s `width`/`height` attributes, which no browser reads, so the glyph drew blank in a box of the right size. The span keeps the CSS size; the svg fills it (`100%`). A number or a px length still lands on the svg as before.

## 0.61.0 — 2026-11-04

- **Four glyphs from the float exploration join kol-icon-set-interface** (float-everything W13, `/lobby-icon`; the gap map's W2.13 board in kol-float--style): `files/inbox` (a tray), `design/highlighter` (a marker), `shapes/diamond-plus`, `typography/lockup` (a mark beside lines). Each carried from its 18 or 15 px drawing into the 24 grid at its own size, stroke 1.5, `currentColor`. `lockup` sits on a 15 keyline — smaller than the set's 18–20; flagged, not rescaled.
- The other 38 "missing" glyphs on that board were existing drawings under role names (chevrons, dots, the hamburger, the pencil, the bookmark, `home-01`, `list-bullet`, `checklist`, `table`, `film`, `adjust-sliders`, `speaker`, `file-text`, `color-palette`, `book-open`, `trash`, `circle`, `eye-on`, `bar-chart`, `info`) — no new files; five are near matches marked "check" on the board (`panel-left` · `panel-right` · `circles-grid` · `bento-grid` · `font-01`).

## 0.60.0 — 2026-11-01

- **`<Icon variant="solid">`** (user 2026-11-01: *"ONE cloud storm component with said variants"*): the outline name plus `variant="solid"` renders its drawn `-solid` twin (72 pairs). A name with no twin renders the outline. The `-solid` names still resolve, so nothing breaks. Default `variant="outline"`. In the Figma library each pair is one component set.

## 0.59.0 — 2026-10-31

- **The batch is in: 559 icons join kol-icon-set-interface** (plan-2026-10-31-icon-categories 2.3; user 2026-10-31: put them in). Atlas 164, website 143 and the Claude list 252, as the treated copies in `lobby/archive/_assets/IconTreatment/treated/` (stroke 1.5, 24 box, keyline, `currentColor`), each in the category the plan placed it: `flow` and `commerce` open as folders, the interface set is 814 icons in 18 groups.
- **Every drawing kept.** A name already taken (in any set, or by an earlier drawing in the batch) got the next free number, so nothing was overwritten: hierarchy → hierarchy-04, network → network-02, orbit → orbit-02, database → database-02, line-chart → line-chart-02, edit-square → edit-square-02, pen-nib → pen-nib-02, eraser → eraser-02, pen-nib → pen-nib-03, eraser → eraser-03, crop → crop-02, ruler → ruler-02, layers → layers-02, layers → layers-03, pen → pen-03, brush → brush-02, layers → layers-04, pen-tool → pen-tool-02, paint-bucket → paint-bucket-02, paint-roller → paint-roller-02, swatch-book → swatch-book-02, package-open → package-open-02, bell → bell-02, search → search-02, podium → podium-02, link → link-03, medal → medal-02, trophy → trophy-02, calendar → calendar-02, calendar → calendar-03, clock → clock-02, clock → clock-03, calendar → calendar-04, stopwatch → stopwatch-02, clock → clock-04, alarm-clock → alarm-clock-02, hourglass → hourglass-02, scale → scale-02, hourglass → hourglass-03, send → send-02, skull → skull-02, book-open → book-open-02, brain → brain-02, syringe → syringe-02, camera → camera-02, idea-bulb → idea-bulb-02, chrome → chrome-02, compass → compass-02, compass → compass-03, compass → compass-04. Duplicates are there to be culled, not decided here.
- Drawings the treatment flagged for a redraw ship as they are; the flags are in `lobby/archive/_assets/IconTreatment/report.md`.

## 0.58.0 — 2026-10-31

- **kol-icon-set-interface is foldered by the user's categories** (plan-2026-10-31-icon-categories, user: *"I like your categories"*, *"go on both"*). The 25 groups become 16: `direction` 25, `actions` 20, `navigation` 12, `status` 9, `layout` 36, `files` 17, `charts` 3, `design` 40, `shapes` 24, `typography` 21, `media` 17, `devices` 9, `code` 8, `people` 9, `places` 1, `planning` 4. The other two of the eighteen, `flow` and `commerce`, have no shipped icon yet and arrive with the parked batch. `misc` and `singletons` are gone.
- **No name changed**: all 255 names resolve as before (diffed before and after the move). Only the keys of `KOL_ICON_SET_INTERFACE` change: a consumer reading a group by its old folder name (`.nav`, `.playback`, …) reads the new one.
- Solid stays a variant, not a category: an icon's cut (`getCut`: stroke · solid) is the filter.

## 0.57.0 — 2026-10-31

- **`social` moves from interface to external** (user 2026-10-31: *"move social then"*): the ten `social-*` marks (behance · dribbble · facebook · github · instagram · instagram-2 · linkedin · tiktok · twitter · youtube) are third-party brand marks, so they sit beside `brands` and `flags`. Names are unchanged and `<Icon name="social-github" />` still resolves; it now loads the external chunk instead of the interface one. A consumer reading `KOL_ICON_SET_INTERFACE.social` finds it under `KOL_ICON_SET_EXTERNAL.social`.

## 0.56.1 — 2026-10-31

- **`kol-ds-wordmark`** in the identity set (`identity/kol-ds/`) — KOL DESIGN SYSTEM in Right Grotesk Tight Light, one line, tracking 0.4 %, the font's own kerning, set as type in `currentColor` on the family's wordmark geometry (cap 11.14, 24 high). The user's pick from his Figma; KDS stays the mark for the small sizes. The showcase's loader and share card use it.

## 0.56.0 — 2026-10-31

- **Removed: 306 of the 307 interface glyphs that shipped in 0.55.0 by mistake.** Two drops landed in the set unlogged and were meant to stay parked: 164 at 12:24 from kol-atlas's `more-icons-refs` session (Figma 174:25332) and 143 at 12:34 from kol-website's `super-icon-kol24` session (Figma 160:20415), with six new groups (`chart` · `commerce` · `control` · `flow` · `place-time` · `transport`). They are out of the set again and parked, unapproved, with the Claude list as one treatment project: `lobby/archive/IconTreatment.md`. A consumer that picked one of them up from 0.55.0 renders nothing for it now. **Kept: `calendar`** in `misc`, because `MenuDatePicker` (kol-component) names it as its default `icon`.
- **Export junk stripped** off `social-behance` and `stopwatch-solid`: Figma's `clip-rule="evenodd"`, meaningless outside a clip path. No geometry touched. `cuts.json` regenerated (433 glyphs).
- **`record`** in the identity set — record.kolkrabbi.io's mark from kol-website — shipped unlogged on 2026-10-28; logged here and in the inventory.

## 0.55.0 — 2026-10-31

- **`more-vertical`** in `nav` — the ⋮: `more`'s three dots stacked on the same 24 grid (r 2.5 at 5 · 12 · 19), solid. Menus used `more` turned 90° (user 2026-10-31: *"just make a vertical version"*).

## 0.54.0 — 2026-10-31

- **`kol-icon-set-external`, a fourth set** (IconSetExternal, 2026-10-31): marks drawn by others — `flags` (39 round `flag-<iso>`) and `brands` (20: browsers, OS, socials, services). Colour, never recoloured; the solid brands (`apple` · `github` · `openai` · `windows`) ink `currentColor`. Its own chunk (`./sets/external.js`); `setOf` resolves interface → signal → identity → external. New exports `KOL_ICON_SET_EXTERNAL` · `_NAMES` · `_META`, folded into `KOL_ICON_META`. `cuts.json` records the set: a new cut, `color`, for a glyph that keeps its own fills.
- **`device` gains `laptop` · `laptop-solid` · `vr-headset`** (the metric dashboard's device column).

## 0.53.5 — 2026-10-30

- **The harmony set on Adobe's constructions, his approval 2026-10-30** (https://claude.ai/artifact/1jPWD2qGPmzxf5xCSAFstu): `clr-mono` three dots on one radius; `clr-shd` the radius with one dot at the edge; `clr-cmpd` the Y with its lower dots 25° either side; `clr-tet` a square with corner dots; `clr-anl` three dots at the top on spokes; `clr-split` the Y at 40°. `clr-tri` · `clr-comp` · `clr-rnd` unchanged. The 0.53.4 files are in `_tmp/2026-10-30-harmony-before/`.
- **`color-wheel` · `color-palette` · `color-swatch`** into `tools`, from the Figma library (kol-icon, node 148:7702), brought onto the set's treatment: the wheel and palette from fills to 1.5 strokes on the 2–22 keyline, the swatch from stroke 2 to 1.5. `color-wheel` is the Color Lab's Wheel tab.

## 0.53.4 — 2026-10-30

- **`shuffle` redrawn, his approval 2026-10-30** (https://claude.ai/artifact/4uXUHPA7ummwnXahfvuZ5U): Adobe's construction — two S-curves crossing at the centre, 3 to 22 on the wide keyline, the heads at the right with their tips at 22 — in place of the straight diagonals drawn on 2026-10-29. The Color Lab's Randomise button wears it by name. The 0.53.3 file is in `_tmp/2026-10-30-shuffle-before/`.

## 0.53.3 — 2026-10-30

- **`lock` and `unlock` redrawn as a pair, his approval 2026-10-30** (the lock-pair round, https://claude.ai/artifact/DmzGBep2pcarV98PoB8nj4): the shipped drawing scaled to the inner keyline square (0.9 about the centre, 4.8–19.2 by 3–21), the body 0.95 of that height on its base (10.74–21), stroke 1.5. Nothing moves between states but the shackle: in `unlock` it is lifted to the tall keyline's top at 2, its left leg still in the body, the right leg cut at the arc's shoulder at 4.7, a six-unit bite to the body — the two read apart at 16. The 0.53.2 files are in `_tmp/2026-10-30-lock-pair-before/`.
- **`unlock` is the original again** — 0.53.2 overwrote the user's icon in place with a redraw instead of adding a version beside it (the user: *"you just OVERWROTE A CRUCIAL icon that I OWN"*). The set's file is byte-for-byte 0.52.0's; the redraw is parked at `_tmp/2026-10-30-unlock-redraw/unlock-v2.svg`, out of the set, for his ruling. `expand` was new in 0.53.2, not an overwrite, and stays.

## 0.53.2 — 2026-10-29

- **`unlock` and `expand` redrawn on the keyline plate** (review 8 — *"did you even take it through keylines?!"*; the plate: `_tmp/2026-10-29-lab-window/glyphs.html`, candidates beside Adobe's). `unlock`: the body 5–16 and the shackle hinged inside it, swung to 20 with its free leg lifted — the mass centred on the keyline, the opening unmistakable at 16. `expand`: a 17 shaft from 6,18 to 18,6 with 5-long heads (the shipped 0.53.1 heads were 43% of a short shaft and blurred into it). Both CANDIDATES for his review.

## 0.53.1 — 2026-10-29

- **`unlock` redrawn, CANDIDATE for the user's review:** the shackle swung open — its free leg outside the body with a gap, the body narrowed to 4–15 so the two read apart at 16px (review 7, Adobe's pair — the user: *"Locked and unlocked in our kol-icons is so similar its almost impossible to see the difference"*). `lock` is untouched.

## 0.53.0 — 2026-10-29

- **New, CANDIDATES for the user's review:** the file-type family in `files` (OverviewTocAndLibraryIcons, kol-website 2026-10-29 — user: *"file type and language, can use icons? the table is deadboring like this"*) — `file-pdf` (a P) · `file-doc` (a paragraph: a short head line over two full ones) · `file-image` (a ridge under a sun, `image`'s mark at file size) · `file-svg` (a vector node: square anchor, two handles, the curve through it) · `file-video` (play) · `file-audio` (a note) · `file-zip` (a zipper down the spine and its pull) · `file-md` (the Markdown mark, M↓) · `file-text` (a T). Each is `file`'s outline and fold verbatim plus one mark inside the body (x 7.5–16.5, y 10.5–18.5, clear of the fold), the 1.5 stroke, `currentColor`, round caps and joins. kol-styleguide's `DocumentLibrary assetsView="icon"` draws them. Not yet seen by him: a redraw or a cull is his call.

- **New, CANDIDATES for the user's review:** three harmony glyphs in the signal set's `color` group, drawn to the existing `clr-anl` · `clr-comp` · `clr-mono` · `clr-tri` (BrandLabToolWindow review 3, 2026-10-29 — the user: *"I know we have some icons for this in DS"*): `clr-split` (split complementary: a Y from the top dot to two at 150° and 210°), `clr-tet` (tetradic: a square through four dots) and `clr-rnd` (custom: three scattered dots), all with the 8.5 ring, 1.5 stroke and 1.5 dots. Color Lab's harmony tiles draw them. Two more after review 5 (Adobe's set): `clr-cmpd` (compound: the top dot and a lopsided Y to 150° and 195°) and `clr-shd` (shades: a radius from the centre dot to one at 90°).
- **New, CANDIDATES for the user's review (review 6, 2026-10-29):** `expand` in `arrow-diagonal` — the diagonal with a head at each end, `arrow-upright`'s family (Adobe's Maximize, the user: *"wrong maximize icon, should look like this"*); `shuffle` in `playback` — two crossing paths, each ending in its head (Adobe's shuffle, for the Color Lab's Randomise).

## 0.52.0 — 2026-10-28

- **`favicon.ico` and `favicon-96.png` in every identity folder** (IdentityFaviconIcoAnd96, kol-website): the two files a host asks for by name — any browser's `/favicon.ico`, Sanity Studio's `static/favicon.ico` and `static/favicon-96.png` — rendered by `pnpm identity:render` from the dark app icon, as studio's hand-made pair was (pixel-identical to it). The .ico is one 32 × 32 PNG in an ICO wrapper.

## 0.51.0 — 2026-10-28

- **`-tile` → `-app-icon`** (user 2026-10-28: *"if apple uses app icon, why dont we? why are we reinventing a class?"*). The home-screen icon in each identity folder is `<id>-app-icon.svg` and `<id>-app-icon-light.svg`, Apple's word; "tile" came from the `/app-icon` skill's vocabulary and named nothing Apple or the web calls it. `<id>.svg` stays the keyline icon `<Icon>` renders, so the two never share a name. The `-tile` files are written beside the new ones until **2026-11-27**, then drop. The PNGs, favicon, logomark and `og.png` are unchanged.

## 0.50.0 — 2026-10-28

- **One folder per identity** (plan-2026-10-28-identity, kol-mirror's `AppIdentitySet` ticket — user: *"would it be a space?"*, *"the file named like the folder is the icon; every other file is an asset by role"*). `kol-icon-set-identity/<id>/` — `kolkrabbi` · `kol-ds` · `fxr` · `mirror` · `monitor` · `metric` · `r2b2` · `studio` · `brand` · `workshop` — replaces the `kolkrabbi/` and `apps/` sub-folders. **`<id>/<id>.svg` is the icon** (the keyline glyph `<Icon name="<id>">` renders) and the only file the Icon map takes; everything else in the folder is an asset by role suffix, read by path through the new **`./identity/*` export** (`@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-wordmark.svg?raw`): `<id>-logomark.svg` (the raw mark in its own box) · `-wordmark` · `-lockup-h` · `-lockup-v` · `-favicon` (the tab icon) · `-tile` (the touch icon on its ground) and, from 0.51.0, the rendered PNGs and OG card. The gallery's two groups (`kolkrabbi` for the brand's own, `apps` for the rest) are kept by `KOL_ICON_SET_IDENTITY`, from the set's own map now, not the folder.
- **The brand's marks arrive from kol-brand** (user: *"the only thing about kolkrabbi I want DS to own is the identity system"*): `kolkrabbi/` gains `kolkrabbi-logomark` · `-wordmark` · `-lockup-h` · `-lockup-v` · `-favicon`; `kol-ds/` gains `kol-ds-favicon`; `metric/` gains `metric-favicon`; `workshop/` holds `workshop-wordmark` (no icon). kol-brand 0.2.0 points at them and keeps copies until 2026-11-27.
- **`metrics` → `metric`** (today's bulletin: one word, singular — `apps/metric`, metric.kolkrabbi.io). `<Icon name="metrics">` still resolves through `RENAMED_ICONS`; `user-interface` chains to `metric` too. **`mirror-mir` leaves the Icon map** — it is `mirror/mirror-alt-mir.svg`, the alternate for the Mirror round on `apps/identity`, an asset by path.
- **Paths into the files change (BREAKING for a `loaderApp({ graphic })` path):** `…/kol-icon-set-identity/kolkrabbi/kol-ds.svg` → `…/kol-ds/kol-ds.svg`; `…/apps/<app>.svg` → `…/<app>/<app>.svg`; `apps/metrics.svg` → `metric/metric.svg`. The showcase's own loader path followed.

## 0.49.0 — 2026-10-28

- **`kol-icon-set-identity`, the third set** (user 2026-10-28, on the showcase rail: *"missing is identity, identity should be separate from signal and interface"*). Interface's `identity` group moves out into its own folder with its own index — `KOL_ICON_SET_IDENTITY`, `_NAMES`, `_META`, joined into `KOL_ICON_META` — in two groups, decided for his review: `kolkrabbi` (kolkrabbi, kol-ds — the studio's own marks) and `apps` (fxr, metrics, mirror, mirror-mir, monitor, r2b2, studio, brand — each app's). Every name resolves as before (`Icon name="monitor"`); the resolver reads the three sets. A consumer reading `KOL_ICON_SET_INTERFACE.identity` reads `KOL_ICON_SET_IDENTITY` now, and a path into the files (`loaderApp({ graphic: '…/kol-icon-set-interface/identity/kol-ds.svg' })`) becomes `…/kol-icon-set-identity/kolkrabbi/kol-ds.svg` (`apps/` for an app's mark).
- **New:** `brand` in `identity/apps` (kol-website's `IdentityBrand` ticket, 2026-10-28) — brand.kolkrabbi.io's B (Right Grotesk Wide Dark, the user's pick `b-widedark`), `currentColor` on the identity keyline, the ticket's file as filed.

## 0.48.0 — 2026-10-28

- **New:** `studio` in `identity` (kol-website's `IdentityStudio` ticket, 2026-10-28) — the Sanity studio's app-icon S (Right Grotesk Wide Dark, the user's pick `s-widedark` in kol-website's app-icon round), filled `currentColor` on the identity keyline (`translate(3 3) scale(0.75)`) like `fxr`, `monitor` and `mirror`. The file is the ticket's attachment as filed.

## 0.47.0 — 2026-10-27

- **New:** `stopwatch-solid` in `playback` (TransportPill, kol-fxr 2026-10-27) — the loop-length slot of the phone transport, filled like `play` and `stop` so the transport row reads as one set. The outline `misc/stopwatch` stays for its own uses.

## 0.46.0 — 2026-10-26

- **`mirror` redrawn, `mirror-mir` new** in `identity` (kol-mirror's app-icon round, 2026-10-26). `mirror` is the user's pick: the same MR-over-reflection mark, stretched as one group to FXR's box so it reads the size of `fxr` and `monitor`. `mirror-mir` is the alternate he keeps: MIR as one tall row, cut and slid ±1, drawn like FXR and MON. Both filled `currentColor` on the identity keyline (`translate(3 3) scale(0.75)`), clip ids namespaced. The old `mirror` is in `_tmp/2026-10-26-mirror-identity-glyph/`.

## 0.45.0 — 2026-10-24

- **A registered glyph never overrides a DS name** (user 2026-10-24: kol-mirror's `registerIcons` of its own set put its `refresh` into the settings rail's reset — *"whats the point of standardizing if we let this slip so easily"*). The packaged sets resolve first for every name they ship; a consumer's glyph resolves only for names the DS has none for, and dev warns once per collision. Until now a registration won over the set — a repo could redraw any DS glyph app-wide without a word.

## 0.44.0 — 2026-10-23

- **New:** `rabbit` in `misc` — kol-mirror's last local glyph. Its filled outline is Lucide's `rabbit` (ISC) expanded at 1.5-wide walls, so the centerline is Lucide's own path: a 1.5 `currentColor` stroke, round caps and joins, scaled 0.9 about the centre onto 3–21 to sit on the set's keyline (the outline reached 1.2–22.75).

## 0.43.0 — 2026-10-23

- **New:** `wave` in `shape-forms` — kol-mirror's three waves at the set's 1.5 `currentColor` stroke. Mirror's outline reached x 1.3–22.7; the centerlines are scaled horizontally onto 3–21 (mirror's call), the vertical untouched.

## 0.42.0 — 2026-10-23

- **New:** `undo` · `redo` in `tools` and `atomic-molecule-04` in `atomic` — kol-mirror's last local glyphs. Mirror's copies were expanded outlines (undo / redo at 2px); these are the set's 1.5 `currentColor` strokes, round caps and joins, drawn on the centerlines of mirror's outlines.

## 0.39.0 — 2026-10-17

- **New:** `monitor` in `identity` — Monitor's mark (M O N as FXR draws F X R, Right Grotesk Tall Dark, the M a quarter wider, the row cut at its middle and slid ±1), on the set keyline beside `kol-ds`, `fxr`, `r2b2`, `mirror`, `currentColor`.

## 0.38.0 — 2026-10-15

- **New:** `mirror` in `identity` — Mirror's mark (M R over its reflection, Right Grotesk Wide Dark, the reflected row cut ±1), on the set keyline beside `kol-ds`, `fxr`, `r2b2`, `currentColor`.

## 0.37.0 — 2026-10-09

- **New:** `r2b2` in `identity` — the media app's mark (R 2 / B 2, Right Grotesk Wide Dark), on the set keyline beside `kol-ds` and `fxr`, `currentColor`.

## 0.36.0 — 2026-10-09

- **New:** `fxr` in `identity` — kol-fxr's glitch-split lettering, on the set keyline beside `kol-ds`, `currentColor`.

## 0.35.0 — 2026-10-09

- **Redrawn** (the user's review of the Styles › Icons page): `cable-unlock` (an open shackle — it drew as `cable-lock`) · `cable-trans` (two clear gaps) · `clr-anl` (dots on the ring) · `clr-mono` (the circle keyline) · `curve-exp` / `curve-log` (exact mirrors) · `dith-cross` (a gap to its frame) · `dith-diamond` · `dith-flower` (fill the box; petals clear of the centre) · `logic-or` · `logic-nor` · `logic-not` · `logic-nand` (no overlapping strokes) · `grad-lin` · `gen-wave` (meet or clear the frame) · `tr-inf` (one round line) · `rotate-left` / `rotate-right` (one arc, the head on the curve) · `rack` (rails meet the frame) · `globe` (equal thirds).
- **New:** `rack-h`.
- **Changed:** `kol-ds` and `kolkrabbi` scaled onto the 18 keyline square (they ran edge to edge).
- **Renamed:** `customize` → `nav-settings` (one sliders mark, not two) `user-interface` → `metrics` and `rack` → `rack-v` (beside `rack-h`). The old names still resolve (`RENAMED_ICONS`); `hasIcon` answers for them.
- **Changed:** the `kolkrabbi` group is `identity` (`kol-ds`, `kolkrabbi`, `metrics`) — group names only; icon names are unchanged.

## 0.33.1 — 2026-10-05

- **Fixed:** an `<Icon>` that rendered before the icon chunk landed could stay blank for good. The chunk arriving between the render and the effect that subscribes to it reached nobody — under a Suspense boundary that gap is as long as the lazy route takes. Found on kol-fxr's rail at `/editor` and `/randomiser`, rehearsed in `apps/editor-hub`.

## 0.33.0 — 2026-10-02

- **New:** `text-justify-left` · `-center` · `-right` · `-all`, `text-align-toward-spine` · `text-align-away-spine`, `space-evenly-horizontal` · `space-evenly-vertical`.
- **Redrawn:** `rotate-left` · `rotate-right` (an open arc, a clear gap before the arrowhead) and `corner-down-left` (a smaller head).

## 0.32.0 — 2026-10-01

- **Renamed:** `kol-icon-set-v1` is `kol-icon-set-interface` (user: "icons v1 is a terrible icon set name"). `KOL_ICON_SET_INTERFACE`, `KOL_ICON_SET_INTERFACE_NAMES` and `KOL_ICON_SET_INTERFACE_META` replace the V1 exports, which stay as deprecated aliases on the retirement ledger. Icon names are unchanged, so `<Icon name="…">` needs nothing. `getSet(name)` returns `'interface'` where it returned `'v1'`.

## 0.31.0 — 2026-09-30

- **New:** `corner-down-left` (arrow) and `command` (code) — the key-cap glyphs the palette footer and the ⌘K hint typed as characters. 1.5 stroke, 24 grid.

## 0.30.0 — 2026-09-30

**The align / rotate / flip glyphs, redrawn** (the names audit built — plan-2026-09-29-phase-log-and-showcase-review, second goal).

- `align-horizontal-{left,center,right}` · `align-vertical-{top,center,bottom}` · `flip-horizontal` · `flip-vertical` · `rotate-left` · `rotate-right` (editor-chrome-review #14): bars 5 tall and wider, a solid axis that never crosses a bar, a dashed flip axis visible at 16px (was a 0.1 dot pattern), triangles enlarged, rotate arrowheads doubled. Same names, same 24 grid, same 1.5 stroke. The previous drawings are kept at `_tmp/2026-09-30-glyph-redraw-before/` in the repo.

## 0.29.1 — 2026-09-30

- Comments only: one spelling, `color`.

## 0.29.0 — 2026-09-27

- **New in v1:** `typography/text-valign-top|middle|bottom` — a text box's vertical alignment (the
  frame edge and two text lines). The design editor's text row borrowed the OBJECT-align glyphs.

## 0.28.0 — 2026-09-27

- **`Icon` is never the click target** (`pointer-events: none` on the glyph). The markup is injected
  as HTML; when an icon re-rendered between press and release, the `<path>` under the press was
  replaced and the browser dropped the click — the design editor's settings drawer would not close
  on its X. Presses now land on the button around the glyph.
- **New in v1** (the design editor's own set, folded in): `tools/crop` · `tools/flip-horizontal` ·
  `tools/flip-vertical` (the mirror line's dots now land on both ends) · `tools/rotate-left` ·
  `tools/rotate-right` · `shape-primitives/line` · `typography/text-align-left|center|right`.



## 0.18.0 — 2026-08-15

- **`filter.svg` corrected to the set keyline.** It was drawn 17.0 × 15.5 with
  a 4.5 top inset while the set sits on ~3 (`search.svg` is 17.8 × 17.8 at 3.3)
  — so at the same nominal size it rendered visibly smaller than the glyph
  beside it. Scaled 1.047 about its own centre and recentred: 17.8 × 16.2,
  symmetric insets. Same path, same 1.5 keyline, no shape change.

## 0.17.0 — 2026-08-15

### Minor Changes

- **The kol-shell rail batch — `rack` minted, the other two names map.** kol-shell
  adopters carried a local Icon component just to feed the rail, because three of
  its glyph names didn't resolve. Taken from kol-monitor's local shelf (the source
  of the report), prefixes dropped per the set convention:

  - **`rack`** minted into `device/` — kol-monitor's drawing verbatim (bordered
    box + two dividers; already currentColor, 1.5 stroke). Inventory **199 · 27**.
  - **`nav-library` → `library`** — NOT minted: the shipped `files/library`
    drawing is the same glyph (three spines + one leaning).
  - **`nav-settings` → `settings-01`** — NOT minted: the set's settings glyph.
    Consumers swap the names in their nav data and delete the local Icon shelf.

## 0.16.0 — 2026-08-14

- Four glyphs promoted from the retired shelves under plain names (DashboardIconCoverage,
  approved frame-by-frame): `crown` · `trophy` · `stopwatch` (misc) + `users` (nav).
  Inventory 198 icons · 27 groups.
- Three dashboard names deliberately NOT minted — shipped drawings cover them; consumers
  swap the name: `dashboard-bookmark`→`bookmark` · `dashboard-roadmap`→`roadmap` ·
  `trending`→`trending-up`.

## 0.5.0

### Minor Changes

- 8b4c850: Add `resize-grip` to kol-icon-set-v1 (misc) — the native-resizer look (three 45° strokes into the corner), set-conform: 24-grid, stroke 1.5, currentColor. Consumed by Textarea's resize affordance. The legacy `resize-corner` (svg/00-kol, off-norm stroke 2.5) is now consumer-less — cull candidate for the tier-2 pass.

## 0.4.0

### Minor Changes

- 8448e47: Stroke inventory normalized to a single 1.5 weight on the 24-grid: `stroke-width` 2 / 1.12497 / 1.125 / 0.99997 → 1.5 across 293 SVGs (525 attributes) in `src/stroke/`. Geometry untouched — attribute-only rewrite. Deliberate exceptions kept: the stroke-cap diagram glyphs' thick elements (`6`) and `hash-italic-bold` (`2.5`). Kills the visible weight fork where 28% of icons rendered chunky (2.0) and 32 machine-scaled imports rendered anemic (1.125) next to the 1.5 majority.
- 8448e47: Icon inventory Tier-1 cull: removed 361 legacy `src/svg/` files that could never render (name-shadowed by `stroke/`/`solid/`, which resolve first) and 8 byte-identical same-name duplicates. Every icon name resolves exactly as before — zero render change; the inventory drops from 2,104 SVGs to 1,735 (stroke 880 · solid 849 · svg 6). Ledger: `.kol/llm-context/backlog/2026-07-08-icon-cull-ledger.md`.
- 8448e47: Add `registerIcons()` — bring-your-own-icons. A consumer app can register its own SVG folder so `<Icon name>` resolves app-specific icons that never ship in the package:

  ```js
  import { registerIcons } from "@kolkrabbi/kol-icons";
  registerIcons(
    import.meta.glob("./icons/**/*.svg", {
      eager: true,
      query: "?raw",
      import: "default",
    })
  );
  ```

  Registered icons win over the packaged set (so a repo can add _or_ override), resolve synchronously (no wait on the packaged chunk), and let each repo carry only the icons it needs instead of pulling the whole set. `import.meta.glob` is a compile-time, path-relative macro, so the glob must run in the consumer's own source. Non-breaking: the packaged set is unchanged when nothing is registered.

- 8448e47: kol-icon-set-v1 now ships in the package. The curated set (107 icons, single stroke cut, `currentColor`) lives at `src/kol-icon-set-v1/` and **resolves first** — `<Icon name>` returns the v1 version when a name is in the set, falling back to the legacy stroke/solid/svg trees otherwise.

  Falling through to the legacy set now emits a one-time `console.warn` naming the icon — it isn't in v1, so `registerIcons()` it locally or migrate to a v1 name before the legacy set is dropped (a future major).

  New exports: `KOL_ICON_SET_V1` (grouped `{ group: names[] }`) and `KOL_ICON_SET_V1_NAMES` (flat, sorted) — so consumers and audits can tell curated names from legacy. Non-breaking: legacy still ships alongside; every existing name still resolves.

  Migration tooling: **`npx kol-icons audit`** scans a repo's `<Icon name>` usage and reports in-v1 / legacy-only / not-in-package, so you can see exactly which icons to migrate or `registerIcons` before the legacy set is dropped.

- 8448e47: Renamed the icon package `@kolkrabbi/kol-loader` → `@kolkrabbi/kol-icons`. The name now describes the domain (icons) rather than the load mechanism, matching the `theme`/`component`/`framework` convention. The public API is unchanged (`Icon`, `ICONS`, `ICON_ENTRIES`, `SOLID_ICON_ENTRIES`, `ICON_INDEX`, `ALL_ICONS`, `hasIcon`, `getCategory`).

  Consumers must update the import specifier and the Tailwind `@source` glob to `@kolkrabbi/kol-icons`. `component` and `framework` retarget their internal dependency to the new name (patch).

## 0.3.0

### Minor Changes

- c750436: Add device icons `tablet` and `smartphone` (system category, stroke + solid) — the set had `monitor`/`desktop` and a telephone-handset `phone`, but nothing for viewport/breakpoint UI. Also add `refresh-cw` (actions, stroke): a clean single-flow circular refresh; the existing `refresh` double-arc reads muddy at small sizes.
- c750436: Move the ~2,000 raw SVG strings off the critical path (port of kol-labs-single's 2026-06-19 entry-chunk fix). `Icon` now pulls its maps from `iconData.js` via one dynamic `import()` — the SVG text becomes its own async chunk that streams in parallel with boot instead of bloating the consumer's entry chunk (measured −66% entry gzip in the origin app). API unchanged; on a cold first paint an icon may render as a same-sized empty box for a frame before the chunk lands. Also removes the dead `SVG_ENTRIES` export (zero consumers) — it eager-inlined the entire legacy `svg/` tree into every barrel import; use `ICON_ENTRIES` (keys-only) for galleries.
- fa8ce05: Add `social-github` and `social-instagram` to the social icon set (user category, stroke + solid). GitHub ships the canonical fill-native mark in both cuts.
- c750436: Add `SOLID_ICON_ENTRIES` — keys-only inventory of the solid cut (parallel to `ICON_ENTRIES`), so gallery pages can diff the two cuts and surface mirror gaps (stroke-only / solid-only) without loading any SVG content.

## 0.2.0

### Minor Changes

- de4c33f: Icon inventory now derived from the on-disk stroke set. Adds `ICON_ENTRIES` (flat `{ name, folder }` list) and `ICON_INDEX` (grouped by folder), globbed from the 862 canonical stroke SVGs. `ICONS` is now an alias of `ICON_INDEX` — the hand-maintained 341-name registry that had drifted is removed. `ALL_ICONS`, `hasIcon`, and `getCategory` now reflect the full set.

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
