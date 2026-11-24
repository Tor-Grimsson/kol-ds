# Plan — The icon set: from the iconset file to code

**Raised:** 2026-11-21, his words: "ok why are we still on the same plan? can we close this plan and open an new one?" This plan takes over the open part of W21 in `plan-2026-11-20-kolbox-everything-left.md` (phases 21.3d, 21.3e, 21.4, 21.5, 21.6). That file is closed and is now the record of how each item was raised, with his words. Nothing is built from it any more.
**Status:** CLOSED 2026-11-21. The open work moved to `plan-2026-11-21-icon-forms.md`; nothing is built from this file any more. It stays as the record of what was built and of his words.
**Shape:** W › phase › list.
**Where it runs:** Figma file `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`): pages `　　↳　Bases` (10:5236), `　　↳　Icons` (66:9317). Code: `packages/icons/`. Library: `❖ library--kol-ds-ui` (`n48kE2bJtrFjl7wxst30xH`), Iconset page.
**Laws carried:**
- The base system lives in the iconset file only. Code and the library get flat finished icons.
- One base is one component, never a variant set: real parts, each shown or hidden by a toggle of its name. Nothing baked, nothing stretched.
- Real size only: 24, and 12 for the small glyphs. A bigger look for my own check is temporary and removed; he is never pointed at one.
- 24 and 12 are two bases with the same parts. A glyph nested in another shape is the 12 base at real size with the 24 stroke.
- The keyline is the one local set `Base/keyline` (36:5649) nested in every base.
- Variables: `icon-stroke` (24, 12) and `icon-corner` (sharp, soft, round, bubble, full). No color variable.
- Dashes are drawn by hand as they come. A solid never merges parts that should read apart.
- An icon is named for what it draws; what it is used for is a keyword.
- Doc parts come from `❖ library--util`. Pages follow the kol-figma § 5a checklist.
- Every base and icon is looked at for the right shape before it is called done, not only measured.
- I build this myself, no agents. Nothing is deleted: `_trash` with `_` in Figma, `_tmp/<date>-<what>/` in the repo. Figma publishing and npm publish are his.
**How a phase closes:** its acceptance line, a number or a yes/no, read once; then looked at.

| W | Subject |
|---|---|
| W1 | Bases page: each base beside its 12 twin |
| W2 | A Review page for his deletes |
| W3 | His deletes, read back and applied |
| W4 | Every icon built on its base |
| W5 | Flat icons out to code and the library |
| W6 | Results, shown by family |
| W7 | The Bases page as a flow chart: raw, base, built, category |
| W8 | Forms built from components: part, form, base, output, category |

---

## W1 — Bases page: each base beside its 12 twin

### 1.1 — A base and its 12 twin sit in two rows, so they do not read as one pair — ✅ built 2026-11-21 (5 pair rows on Bases: line (his own, 65:8593), triangle, chevron, badge, dots, each a 24 block and its 12 block side by side, built like his; 0 `-12` blocks outside a pair row)
- His words, with his own example (65:8593): "I dont thin this should be 2 rows, rather one row so they are grouped together visually".
- Each pair is one row: one frame holding the 24 block on the left and the 12 block on the right. All five pairs: line, triangle, chevron, badge, dots.
- Acceptance: 5 pair rows on `　　↳　Bases`, each holding exactly a `Base/<name>` block and its `Base/<name>-12` block at the same y; 0 `-12` blocks outside a pair row.

## W2 — A Review page for his deletes

### 2.1 — He has nowhere to review the set: the grids are alphabetical, so look-alikes are apart — ✅ built 2026-11-21 (page `　　↳　Review` 74:10, section 74:1902: 1037 instances for 1037 icon components on Icons, 0 components of its own; 107 labelled rows: 87 families holding 917 icons, 20 "Other in <category>" rows holding 120; an icon in several families sits in the first one only; 14 survey names are not in the file (the approved duplicates and flags). Looked at the nodes family: 50 icons, names under each)
- His words: "ok but I still have left to delete right? where should I do that?"; "yeah but nothing is grouped for review?"; "cant you just make a new page for this? leave icons as they are ?".
- A new page `　　↳　Review`, after `　　↳　Icons`. It holds a linked copy (an instance) of every icon on Icons, each with its name under it, at real size.
- Grouped by family from the survey (`docs/documentation/02-icons/06-survey.md`), not by alphabet: one labelled row per family (all files, all folders, all databases, the pens, the links, the git and hierarchy icons), same-shape icons next to each other. A family that spans categories is one row in one place. Icons in no family sit in a last row per category.
- The Icons page is not touched by this phase.
- Acceptance: Review holds one instance per icon component on Icons (the two counts are equal) and 0 components of its own; every instance sits in a row that carries a family or category label.

### 2.2 — The rows he had not reached were still grouped by name — ✅ built 2026-11-21 (954 copies before and after, 0 deleted; 118 moved by form into his own groups: contained squares such as calendar, mobile, tablet, film, chip and watch into "shape with Base/line", plain marks into line, circles into the circle groups; 22 subject rows split into the base and "<name> modifier" like his file, folder and cloud rows; 13 emptied rows removed)
- His words: "its not enough to only look at the name , fyi"; "some things are contained … and some are modifiers so you have to read my groupings as well"; "my grouping was based on form mainly, the categories dont neccessarily group the same as shape".
- Form decides the group, his label words are the scheme, a category is never a reason to sit together.

## W3 — His deletes, read back and applied — waits for his "done"

### 3.1 — What he removed on Review leaves the set
- He deletes copies on the Review page. When he says he is done, a script lists every icon on Icons with no copy left on Review.
- Each listed icon leaves: its cell on Icons to `_trash`, its file in `packages/icons/` to `_tmp/`, its name resolving to a keeper only where he left one, its word a keyword of that keeper, its component in the library to the library's `_trash`.
- The 13 duplicates he approved on the sheets (`_screenshots/02-icon-duplicates/`) are applied in code in the same pass; they are already out of the iconset file.
- Acceptance: the script's list equals the icons removed from Icons, code and the library; names lost 0 (a removed name either resolves to a keeper or is on the list he made); `validate:icon-duplicates`, `icon-fills` and `icon-tags` pass.

## W4 — Every icon built on its base

**Raised 2026-11-21, his words:** "next we build the rest of the base, and see how much we fit in those base? and that process should consolidate things like similar barrels and cylinders for example? and it will make obvious those shapes that dont fit, since they will require totally differnt unusable shapes by other in the group. right?"; "ok now lets plan the base builder shapes?". W3 no longer gates this: the fit run is what shows him what to delete.

**State it starts from:** Review holds 951 icons in about 150 labelled groups (his groups plus the base and modifier split). Bases holds 53 bases; the five small ones exist at 12 (line, triangle, chevron, badge, dots).

**Rules for every phase here:**
- A part earns its place in a base only when at least 2 icons use it. An icon that needs a part nobody else uses stays drawn and goes on that group's "does not fit" list.
- Two icons that come out as the same base with the same settings are look-alikes: they go on the group's "same drawing" list, and he picks the name that keeps it.
- A base that ends with fewer than 2 icons built from it is not a base: it is removed and its icon stays drawn.
- Built means looked at beside the old drawing, not only measured.

**Built so far, 2026-11-21 (running state, numbers read from the file):**
- 190-odd icons on Icons are now a base with settings (198 before the two-icon rule put 29 back to their own drawing; barrel added on the cylinder base beside database). About 760 of the 951 on Review are still their own drawing.
- Marks section `Bases, marks` (89:2717): arrow-12, magnifier-12, pencil-12, pulse-12, text-lines-12 kept (2 or more icons each); gear-12, lock-12, bars-12, heart-12, code-12, triangle-12 went to `_trash` under the rule; clock-12 still to go. badge-12, line-12, chevron-12 (now with up, down, left, right) and dots-12 carry the rest.
- Hosts with a `mark` slot (show toggle plus swap): File, Folder, Cloud, Calendar, Clipboard, Shield, Heart (category bases on Icons), Base/screen, Base/circle (also got real clock `hands`), Base/shape, Base/window. The `corner` and `off` slots were NOT built: each host had only one icon needing one, so the rule drops them and those icons stay drawn (calendar-plus, mail-plus, folder-cog, cloud-gear, eye-off, camera-off, bolt-off, video-off).
- Base/shape got the dividers: halves and thirds across and down, the four dashed thirds, four part-lines. 31 panel, grid, table and sidebar icons are built on it.
- 99 icons already built on the shared bases were carried to the Icons page; ring got its dot; mode-toggle-02, toggle-oval, toggle-square, shape-cube, disc, donut-ring, square-slash and grad-lin did not match and are back to their own drawing.
- Under the rule 31 shared and mark bases and 29 category bases that carried fewer than two icons went to `_trash` (`_bases with one icon 2026-11-21`). Kept on his word or his notes: his atlas forms, Eye, Link, bell.
- Every old drawing replaced is kept on `_trash` in `_old icons 2026-11-21`.
- **His correction 2026-11-21:** "why arent you making bases page like we set it up? you just make bases marks but skip the 'examples' which should hold the build … thats the only way for me to review"; "not just examples, it should show every icon built with base". Done: every base block on Bases now lists every icon built from it as a named linked copy, and a new section `Bases, hosts` (102:14364) does the same for the category hosts. From now a build is not built until it is in that column.
- Same drawing found so far: grid-2x2 and line-grid; gen-gradient and rack-h; columns and rack-v; panel-top and layout; database and barrel; view-list and text-justify-all.
- 4.6 built 2026-11-21: every group on Review carries up to three tags with counts. Page totals: built on the base 141, same drawing 22 (10 sets of twins), does not fit 788; 951 in all. To be re-run after each further build.
- **His word 2026-11-21, the funnel:** "Im not switching pages, I want to trace the path from raw icon > base > example/output > category. thats the funnel right?" Built: every base block on Bases (43 blocks in `Bases, shared`, `Bases, marks`, `Bases, hosts` 107:11954) now reads left to right as Raw drawings (214 old drawings), the base, every icon built from it, and under each built icon the category it lands in.
- His notes built: eye-off and unlink (new icon, beside link in Actions and on Review) through an `off` slash with a real cut on the Eye and Link bases; the smaller bell and its waves as parts of Base/bell (bell-ringing built on it); the file page redrawn with its corner radius tied to `icon-corner` (reads 2 at soft; not yet checked that it follows the other corner sets).
- 4.4: flatten, resize-auto-h and resize-auto-w built from the arrow base (flatten and resize-auto-h are the same drawing as download). The other icons in the arrow, triangle and circle combination groups are tagged does not fit.
- 4.5: closed by the rule, not by drawing new bases. The stroke-for-stroke measurement found rows whose icons share one outline (notebook, pencil, pointer, chess, logic gates, git nodes, hierarchy, the eight file-type icons, the eight clr icons), but each icon adds a stroke nobody else uses, so no part earns its place and they stay drawn.
- Review after the last run: built on the base 145, same drawing 25 (11 sets of twins), does not fit 782; 952 with unlink.
- Loose end: Base/clock-12 is unused and still on Bases.
- Was open before this line: the rest of 4.4 and 4.5, his notes (eye-off, unlink, smaller bell, file live corners), clock-12 to `_trash`.

### 4.1 — A modifier is drawn again inside every icon that carries one (ruled 2026-11-21: the swap slot)
- About 110 icons in the modifier groups are a host with a small mark: plus, minus, x, check, arrow, gear, magnifier, pen, play, code, bars, pulse, heart, star, lock, clock hands, text lines, an off-slash.
- Marks become 12 bases at real size with the 24 stroke (his law for anything nested). Existing: line-12 (minus, plus, x, dashed), triangle-12 (play), chevron-12 (code), dots-12, badge-12. To build: arrow-12, check-12, gear-12, magnifier-12, pencil-12, bars-12, pulse-12, heart-12, star-12, lock-12, clock-12, text-lines-12.
- **His ruling 2026-11-21:** a host gets one `mark` slot that swaps between the 12 bases, instead of one on/off switch per mark in every host. One switch per mark is 12 marks × 15 hosts drawn 180 times; the slot is 12 marks drawn once.
- Acceptance: every mark used by 2 or more icons on Review exists once as a 12 base; 0 marks drawn inside a host.

### 4.2 — Hosts have nowhere to carry a mark
- Each host base gets three places: `mark` in the centre, `corner` at the bottom right with its cut-out (mail-plus, calendar-plus, filter-x), `off` as the slash (eye-off, camera-off, bolt-off, video-off).
- Hosts, in order of icons covered: square and rectangle (shape), circle, file, screen, folder, cloud, cylinder, clipboard, calendar, shield, envelope, speech, notebook, heart, map-pin.
- file is built with live corners (his note); bell gets its smaller bell; eye gets eye-off; link gets unlink.
- Acceptance: each of the 15 hosts is one component with `mark`, `corner` and `off`; every icon in its modifier group is that host with settings, or is on the does-not-fit list.

### 4.3 — The contained group (74 icons) repeats one square with different dividers
- Panels, tables, grids, sidebars, calendars and devices are a square or rectangle with lines inside. One base: the shape plus divider parts (half and third, across and down, solid and dashed) and a filled region per side.
- Acceptance: the icons in "shape with Base/line" (74) and "layout" (13) are this base with settings or on the does-not-fit list; the two lists add up to 87.

### 4.4 — Arrows, triangles and circles have their base but not their combinations
- arrow (24) is built; arrow+line (7), arrow+shape (5), arrow+text (5) and the circling arrows with a mark (14) take the arrow base plus a line, a shape or the `mark` slot.
- triangle+line (8) takes triangle plus the line part; chevron (14) takes the second chevron and the line.
- circle+shape (35), circle-line (5), circle-modifier (6) take circle plus an inner shape, a stand line or the `mark` slot. "circle, other" (30) is tried last and is expected to be mostly does-not-fit.
- Acceptance: every icon in these groups is a base with settings or on a list; counts add up per group.

### 4.5 — Subject rows are one drawing each, so look-alikes hide
- For every subject row with 2 or more icons (cylinder, box, notebook, book, shield, pencil, pen-nib, pointer, wave, graph, bars, pie, nodes, tree, dots, text-lines, slider, corner, cube, chess-piece, logic-gate and the rest), one base is drawn from the row's first icon and each other icon is tried on it.
- This is where barrels and cylinders meet: database, barrel and shape-cyl on one cylinder base.
- Rows of 1 (gear, link, eraser, plug, bulb, printer, camera) get no base; the icon stays drawn.
- Acceptance: every row of 2 or more has a base with at least 2 icons built from it, or no base and all its icons on the drawn list.

### 4.6 — He cannot see what fitted
- On Review each group is re-laid in three labelled parts: built on the base, same drawing (pairs side by side), does not fit. Counts in the label.
- One page of totals outside Figma is W6; this phase is only the Review page.
- Acceptance: every icon on Review sits under exactly one of the three labels; the three counts add up to the page total.

### 4.7 — About 950 icons sit on no base
- The icons on Icons are replaced by the built ones, family by family, as 4.2 to 4.5 close. The names do not change. His notes on single families stand as written in the closed plan's 21.4 (link and unlink horizontal, `slider-02` is the slider, `flip-frame` redrawn, `hash-02` with more slant, `clock` takes `clock-03`, `gear` takes `settings-01`, the align family on one cap, the booleans as stroke with fill).
- **His notes left on the Review page's row labels, 2026-11-21** (each is a thing to build here): file: "this base with live corners"; bell: "bell needs smaller bell"; corner: "fix radius"; eye: "add eye off"; link: "add unlink". He also merged rows by shape: line, shape and letters into one row; arrows, chevrons, triangles and the circling arrows into one `arrow` row; all charts into one `chart` row; screens and devices into one row.
- **Grouping is by the drawing, not the name** (his word 2026-11-21: "its not enough to only look at the name, fyi"). The survey's families were built from names; before a family is built on a base, its icons are looked at and sorted by what they draw.
- An icon nothing repeats in stays drawn, and is listed as such.
- Acceptance: every icon on Icons is an instance of a base with settings, or is on the drawn list; 0 bases with a single icon built from them unless the base is his atlas form; each finished family was looked at.

## W5 — Flat icons out to code and the library — after W4

### 5.1 — The finished icons are only in the iconset file — ✅ built 2026-11-21 (code: 171 files written by `scripts/import-figma-icons.mjs`, 2 already equal, `unlink` new in actions with tags and its inventory row; old files in `_tmp/2026-11-21-icons-flat-export/before/`; `validate:icon-tags`, `icon-fills`, `icon-duplicates` pass; `validate:icon-ink` fails on 6 lines in components and apps that this work did not touch. Duplicates baseline: 49 turned or mirrored pairs recorded as allowed, 13 pairs recorded as still to settle. Library: 167 Iconset masters redrawn with the same flat icons, stroke, weight and fill tied to the library variables, `unlink` added beside `link`, old drawings on the library `_trash`; 6 names have no master in the library: flatten, tr-left and the four corner icons. Step written down: `docs/operations/10-figma/04-icon-export.md`. Nothing published.)
- Each icon is exported flat (24 grid, 1.5 stroke live where it is a line drawing, corners and caps baked at the soft corner set) into `packages/icons/` under its name; every existing name keeps loading.
- The same flat icons update the library's Iconset components in place, so masters and Code Connect follow.
- The export is written down as a repeatable step in `docs/operations/10-figma/`.
- Acceptance: for every icon the code's drawing and the library's component equal the iconset file's export; names lost 0; the four icon checks pass; the catalog shows 0 broken tiles.

## W6 — Results, shown by family — after W5

### 6.1 — He has no single place to see what changed — ✅ built 2026-11-21 (https://claude.ai/artifact/AvBYofT4XGanbeXCZ4xCDq: bases and what each carries, 11 sets that are one drawing, his notes old beside new, all 170 changed drawings old beside new; generator `build-results.mjs` in the session scratchpad, data `_tmp/2026-11-21-icons-flat-export/lanes.json`)
- One page outside Figma: the bases and their families first, then his single corrections, then every icon whose drawing or name changed, old beside new. No questions on it.
- Acceptance: each family appears once; the page lists every icon whose drawing or name changed.

## W7 — The Bases page as a flow chart — ✅ built 2026-11-21 (section `Bases, flow` 111:17279 on Bases: 4 columns named once, 42 lanes in three bands, every lane on the same column positions (1 pattern), 160 arrows, raw and built in the same order (0 mismatches), one line per category; flow 1,952 wide. The three old sections are on `_trash` as `_bases page before the flow 2026-11-21`, with the unused clock-12. Looked at small and at 100% on the line and shape lanes: `_screenshots/07-bases-flow/`. The base and its two arrows sit at the top of a lane, not centred.)

**Raised 2026-11-21, his words:** "Im not switching pages, I want to trace the path from raw icon > base > example/output > category. thats the funnel right?"; on seeing the page at 10%: "what am i looking at? do you know what a flow chart is?"; "fold into /p a solution and explain how you will make this readable".

**What is wrong now (measured on the page):** three sections side by side (shared 4,734 wide, marks, hosts); 43 blocks that each hug their own content, so the raw, base and built columns start at a different x in every row; the same three purple tags repeated on all 43 rows; no arrow anywhere; raw and built icons in different order, so nothing shows which raw drawing became which icon; the category is a grey line under each icon.

### 7.1 — The steps have no fixed place, so the eye cannot follow one
- One section, `Bases, flow`, replaces the three. Four columns at the same x for every row: RAW, BASE, BUILT, CATEGORY. Each column is named once, at the top, in a size that reads at 10% zoom (library-util Section label). The per-row purple tags go.
- One lane per base, full width, a hairline between lanes, the base's name once at the left of the lane.
- Whole flow at most 2,000 wide, so it is one vertical scroll and never a sideways one.
- Acceptance: 1 section; 4 column x positions and every lane's columns start on them (0 off); 0 repeated column tags inside lanes; width 2,000 or less.

### 7.2 — Nothing joins one step to the next
- Arrows, drawn left to right: raw to base, base to built, built to category. One arrow per lane between raw, base and built; one arrow per category the lane feeds. Not one per icon: 214 arrows would be noise.
- Acceptance: every lane has exactly 2 arrows plus 1 per category line; 0 lanes without.

### 7.3 — A raw drawing cannot be matched to its icon
- Raw and built use the same grid and the same order, so raw number 3 sits on the same line as built number 3, straight across the base.
- An icon with no raw drawing (unlink) leaves its raw place empty.
- Acceptance: for every lane, raw i and built i carry the same name, or raw i is empty; 0 mismatches.

### 7.4 — The category is a footnote instead of the end of the flow
- Inside a lane the built icons sit on one line per category, and that category's name stands in the CATEGORY column at the end of the line, with its arrow.
- Acceptance: every built icon sits on a line that ends in exactly one category name; the names equal the icon's category frame on Icons.

### 7.5 — Lanes are in no order
- Order top to bottom: keyline; the drawn primitives (line, shape, circle, triangle, chevron, arrow, dots, text lines, the rest); the hosts; then the marks as their own band, because a mark feeds a host, not a category. A 12 twin is a lane directly under its 24.
- Acceptance: lane order equals this list; each 12 base sits directly under its 24.

### 7.6 — How it closes
- Looked at twice before he sees it: at 10% (column names and lane names read, arrows visible) and at 100% on three lanes (icons at real size, raw and built aligned). Saved to `_screenshots/07-bases-flow/`.
- The refresh step after any later build re-lays the lanes; a build is not done until its lane shows it.

## W8 — Forms built from components — planned 2026-11-21

**Raised 2026-11-21, his words:** "this is gross … completely disgusting div layers structure. I have said it MULTIPLE TIMES.. you MAKE A COMPONENT FOR THE LAYERS YOU ARE HIDING.. the only thing in that component should be 1. Base/keyline 2. the mark 3. the container"; "you didnt even use any other components, liek PLUS, vertical line … thats why we defined them!!! if we were gonna use loose forms then WHY would we be doing this whole thing"; "CREATE base/line from line components so you get this layer structure IN COMPONENTS >> then you create this using that component and show/hide componets layers. at that point you are not even making component for the categories, you are still just creating the group export from the FORM BASE. >>> THEN >>> and only then can you take the output of the FORM BASE and nest those in their rightful categories. that is the only way to maintain the shared FORM heritage"; "they should already be an instance before they go in with the keyline … KEYLINE + lines + container [if contained]"; "either make a component set [not ideal] or better yet create a new component and SET THE SHOW HIDE PROPS on the layers".

**What is wrong now (the cause, one for every phase):** a base holds its options as loose layers, most of them hidden, so every icon built on it drags the whole pile along; and I drew new loose vectors (the dividers in Base/shape) where a defined component already draws that line or plus. Nothing ties an icon back to its form.

**The rule, for every form:**
- A drawn part is a component. A form is one component holding a copy of each of its parts, each on a show/hide switch.
- A base holds only: `Base/keyline`, the form (one copy), and the container if the icon is contained. Never a loose vector, never a pile of hidden layers.
- An icon is the base with switches set. If a line, plus, chevron or dot is in the picture, it is that form, never a fresh drawing.
- The form's icons are made first, as a group with no category. Only then does a category hold nested copies of them.

**State it starts from:** the six lines are components (`Line/horizontal`, `Line/vertical`, `Line/diagonal-down`, `Line/diagonal-up`, `Line/horizontal-dashed`, `Line/vertical-dashed`) in the PARTS column of the line lane; `Base/line` holds the keyline and six loose copies of them, which is one step short.

### 8.1 — Base/line holds six layers where it should hold one form — ✅ built 2026-11-21 (`Line` 120:10976 in the PARTS column: 6 instances, 6 switches; `Base/line` 25:5338: 2 layers, keyline and `Line`, the copy exposed so its switches show on the base; 0 loose vectors in either; the base's six old switches removed)
- New component `Line`, 24 by 24, in the PARTS column: one copy of each of the six line components, each on a switch of its name.
- `Base/line` becomes two layers: `Base/keyline` and one copy of `Line`, its six switches shown on the base, the keyline switch kept.
- The PARTS column shows the six lines, then `Line`, in that order.
- Acceptance: `Base/line` has exactly 2 layers; `Line` has exactly 6, all instances, 6 switches; 0 vectors directly inside `Base/line` or `Line`.

### 8.2 — The line form's icons are not its output — ✅ built 2026-11-21 (minus, plus, x, ascii-pipe, cap-butt, cap-round, cap-square re-set on the `Line` switches; each exports the same paths as before the change, caps at 6 with their ends; lane looked at: `_screenshots/07-bases-flow/07-lane-line-form.png`)
- `minus`, `plus`, `x`, `ascii-pipe`, `cap-butt`, `cap-round`, `cap-square` are `Base/line` with switches set, sitting together as the line form's output, no category on them.
- Acceptance: each of the 7 is one instance of `Base/line`; each draws the same as before (the caps keep their 6 weight and their end); opening any of them shows keyline and `Line`, nothing else.

### 8.3 — The other forms are built the old way
- Same three steps for each: part components, the form with switches, the base as keyline plus form plus container, then its output group. Order: shape (container), circle (container), triangle, chevron, arrow, dots, text lines, then the rest.
- `Base/shape` loses its 14 loose dividers: a divided square is the square container plus the `Line` form (`grid-2x2` is the square with the plus, `columns` the square with the vertical line twice). What `Line` cannot give at the right place (thirds, part-lines, dashes) is added to `Line` as line components, never drawn in the square.
- The marks at 12 follow the same rule: their vectors become part components inside a form.
- Acceptance, per form: 0 vectors directly inside a base or an icon; every base has at most 3 layers; every icon is one instance of a base.

### 8.4 — Categories hold drawings, not form outputs
- Each category icon is a nested copy of the form output of the same name, so `plus` in Actions is the line form's `plus`.
- Acceptance: every built icon on the Icons page is one instance of its form output; 0 built icons that are a base instance set up a second time.

### 8.5 — What was written from the old builds
- The 171 files in `packages/icons` and the 167 library masters came from the loose builds. After 8.3 they are exported again from the new outputs with `scripts/import-figma-icons.mjs`; the drawings should come out the same, and any that differ are listed.
- The loose dividers and anything else drawn as fresh vectors leave the bases only on his word. Ruled 2026-11-21: nothing goes to `_trash` unless he says so; old bases stay where they are while the new rows are built beside them.
- Acceptance: export after 8.3 against today's files: the count that differ is stated, each one looked at.

### 8.6 — It is written down so it is not lost again — ✅ built 2026-11-21 (`docs/operations/10-figma/05-icon-forms.md`, linked from the Figma index and from 03 and 04; one line in the kol-icon skill points to it. His ruling: it stays out of the kol-figma skill, it is about this one file)
- A chapter in `docs/operations/10-figma/`: the rule above with one diagram of the nesting (part, form, base, output, category), and the kol-figma skill gets the same rule in its icon section.
- Acceptance: the doc exists and is linked from the index; the skill names the three layers.

### 8.7 — Built since, in the order he gave it — ✅ built 2026-11-21
- The flow has six columns: RAW, PARTS, FORM, BASE, BUILD OUTPUT, CATEGORY. A new step is its own column, never the bottom of the one before.
- Line: `Line/output` (124:5688), a set with a variant per icon, in the BUILD OUTPUT cell in the same rows as RAW. Its seven icon components sit in the `Categories` section (131:5068, a grid three columns wide, one cell per category, his layout), each holding one layer, its output variant.
- New row `line-12` (139:5518) between line and the old line-12 row: RAW the six bare marks, PARTS and FORM empty because `Line` is reused, BASE a new `Base/line-12` (139:5552: small keyline plus `Line` at 12, lines 9 long at 1.25), BUILD OUTPUT `Line-12/output` (140:5341: back, dash, pipe, plus, slash, x). No category: they are marks. The parts inside `Line` are set to scale.
- New row `shape-rectangle` (142:5259): parts `Shape-rectangle/square`, `/rectangle`, `/square-turned` (the three rectangle layers of the old `Base/shape`, bindings kept), form `Shape-rectangle` (142:5334, three switches), base `Base/shape-rectangle` (142:5341), output `Shape-rectangle/output` (142:5383) with one variant, `square`, same path as the `square` on Icons.
- The old `Base/line-12` and `Base/shape` are untouched.

### 8.8 — A form's outputs were cut down to the icons that already match — ✅ built 2026-11-21 (`Shape-rectangle/output` has 3 variants; `square` exports the same path as before; RAW shows the three, the two new ones drawn from the old `Base/shape`)
- `Shape-rectangle/output` gets all three shapes as variants: `square`, `rectangle`, `square-turned`. An output is the form's own result; whether a code icon matches it yet is settled when that icon is reached.
- His notes on where they are used, to check as the rows are reached: the toggle uses the rectangle; the turned square is in `shape-octa` and the cube; dashed versions turn up in `maximize`, `corner-independent`, `camera-scan` and more.
- Acceptance: the set has 3 variants; `square` still exports the same path as before; RAW shows the three across from their outputs.

### 8.9 — A stage does not say what it is or what is inside it — ✅ built 2026-11-21 (line, the new line-12 and shape-rectangle rows: an `Annotation` from the utility library on RAW, PARTS, FORM, BASE and BUILD OUTPUT; the nested lists under form, base and output are read from the component. Two departures: PARTS carries one annotation for the group and the parts keep their own names, because a tag per part does not fit the cell; RAW got a `Raw` annotation so every cell starts at the same height and outputs stay level with their raw drawings. Looked at: `_screenshots/07-bases-flow/18` and `19`)
- Every component in PARTS, FORM, BASE and BUILD OUTPUT gets an `Annotation` from the utility library naming the stage and the component: `Form | Shape-rectangle`, `Base | Base/shape-rectangle`.
- The text under it lists what is nested, one name per line under `Nested:` (the base: `Base/keyline`, `Shape-rectangle`; the form: its three parts). A part has nothing nested, so it carries the annotation only.
- Acceptance: 0 stage components without an annotation in the three built rows; each nested list equals the component's own layer list read from the file.

### 8.10 — The names frame sits on top of the set it labels — ✅ built 2026-11-21 (in all three rows the cell reads Annotation, the set, Names, nested)
- In every BUILD OUTPUT cell the component set is above `Names` in the layer list.
- Acceptance: in each of the three built rows the cell's first layer is the set.

### 8.11 — Text lines are drawn apart from the line form
- His note 2026-11-21: `text-lines` (15 on Review: 6 built on the old base, 2 the same drawing, 7 that did not fit, plus 5 modifiers) is made of lines, so it is built from `Line` parts when its row is reached, not from its own drawings.
- Acceptance: set when the row is planned.

### 8.12 — Built since 8.10 — ✅ built 2026-11-21
- Shape outputs read `square`, `rectangle`, `diamond`; RAW shows the code's own `rectangle` and `diamond`. Interface / Shapes is lit in the Categories grid (column 2, bottom row) with the three icon components.
- Row `container-square` (145:9557): base `Base/container-square` (145:9591) is keyline, `Shape-rectangle`, and a `Line-12/output` mark; output `Container-square/output` (145:10099) is the six squared ascii icons, each the same as the existing icon (square, mark points, 1.5 stroke). The mark's stroke weight is set on each output, because picking another mark swaps the layer the setting sits on.
- `shape-rectangle` has the green edge and a green arrow to its category cell (148:5490, his to adjust); his three arrows for `line` are named by where they go.
- On `_trash` in `_flow rows replaced by the new builds 2026-11-21`: the old squared `line-12` row with the old `Base/line-12`, and from the old shape row's Build output the six ascii cells (ascii-dot-02 stays) and the square cell.
- Held on his word: the ascii icons are not in the Categories grid yet, more icons share that output.

### 8.13 — The squared row's name hides that its mark is the 12 line
- Row, base and output are renamed `container-square-line-12`, `Base/container-square-line-12`, `Container-square-line-12/output`. Nothing else in the row changes.
- Acceptance: the three names read so in the file; the six outputs still export the same as before the rename.

### 8.14 — The layout icons draw their dividers as loose lines in the square
- Scope (his ruling 2026-11-21: only what the line set can take; the eight with a chevron wait for the chevron set): 21 names, 7 drawings. One third line: `panel-top`, `layout`, `panel-bottom`, `panel-left`, `panel-right`. Dashed third: the four `panel-*-dashed`. Two thirds: `rack-h`, `gen-gradient`, `rack-v`, `columns`. Halves cross: `grid-2x2`, `line-grid`. Half line: `split`. T split: the four `panels-*`. Full grid: `grid-3x3`.
- `Line` gets the parts it lacks, as line components on switches, never drawn in the square: a line on the third, its dashed version, a part-length line. The half lines are already there (`Line/horizontal` and `Line/vertical` span the square).
- New row `container-square-line` under the squared row: PARTS shows the new line parts, FORM is empty (`Line` is reused), BASE `Base/container-square-line` is keyline, `Shape-rectangle`, `Line` at full size; BUILD OUTPUT `Container-square-line/output` has the 21 as variants, laid out across from RAW.
- Same drawings share one variant only on his word; until then every name is its own variant, and the same-drawing pairs (`layout` and `panel-top`, `rack-h` and `gen-gradient`, `rack-v` and `columns`, `grid-2x2` and `line-grid`) are listed.
- Annotations, nested lists and layer order as in 8.9 and 8.10. No category placing until he says.
- Acceptance: the base has exactly 3 layers; 0 vectors directly in the base or an output; each of the 21 outputs compared with the existing icon of its name, the count that differ stated and each one looked at.

---

## W9 — Fourteen more forms, built the same way — planned 2026-11-21

**Raised 2026-11-21, his words:** "also plan a few shapes: circle, triangle, chevron, chevron-12, arrow, arrow-turn, arrow-circle, polygon, star, cube, cylinder, Shield, Heart and File using the system we have created."

**What is wrong now (the cause, one for every phase):** each of these still has an old base that holds its options as loose and hidden layers, and its icons are set up on that base instead of coming out of a form.

**The recipe, the same for every row** (`docs/operations/10-figma/05-icon-forms.md`):
- A new row in the flow beside the old one. RAW: the icons the old base carries. PARTS: each drawn layer of the old base as a component, bindings kept. FORM: one component, the parts on switches. BASE: keyline plus the form, plus the container or mark where there is one. BUILD OUTPUT: one set, a variant per icon name, across from RAW.
- A part that another form already draws is that form, never a new drawing. A row that only reuses leaves PARTS and FORM empty.
- A setting that is not a drawing (fill for the solid ones, a turn, a mirror) is set on the output, not made a part.
- Annotations, nested lists and the set above `Names`, as in 8.9 and 8.10.
- The old base and old row are not touched; they go to `_trash` only on his word. Nothing is placed in the Categories grid until he says.
- **Acceptance, every row:** the base has at most 3 layers; 0 vectors directly in a base or an output; every output compared with the existing icon of its name, the count that differ stated and each one looked at.

### 9.1 — The plain forms have no parts of their own
- `circle` (6): circle, ring, search-circle, more-circle, clock, check-circle. Parts from the old `Base/circle`: circle, inner, dot, half, hands. The outputs with a mark (search-circle, more-circle, check-circle) are a container row, `container-circle-*`, after the mark forms exist.
- `triangle` (11): play, play-solid, fast-forward, rewind, skip-end, skip-start, tr-left, the four carets. Solid is the fill setting. The skip bar is `Line/vertical`.
- `chevron` (8): the four chevrons and the four double chevrons.
- `polygon` (3): hex-nut, octagon, polygon. `star` (2): star, star-solid. `cube` (2): 3d-axes, 3d-cube. `cylinder` (2): database, barrel.

### 9.2 — The 12 chevron is drawn apart from the chevron form
- `chevron-12`: the `chevron` form at 12 on the small keyline, as `line-12` was made. PARTS and FORM empty. Outputs are bare marks, no category.
- It unlocks the eight layout icons that wait in 8.14 (the `-close`, `-open` and `sidebar-` ones): a row holding the square, a third line and this mark.

### 9.3 — Arrows are drawn whole, though they are a line and a chevron
- `arrow` (13): the eight directions, download, upload, resize-auto-h, resize-auto-w, flatten. The shaft is a `Line` part and the head is a `chevron` part; the base bar in download and upload is `Line/horizontal`. What does not sit where those parts are is added to `Line` or `chevron` as a part, never drawn in the arrow.
- `arrow-turn` (3): redo, undo, corner-down-left. Bent shaft as a part, head from `chevron`.
- `arrow-circle` (3): rotate-left, rotate-right, refresh. Arc as a part, head from `chevron`.

### 9.4 — Hosts carry their mark as a loose slot
- `Shield` (2): shield, shield-check. `Heart` (2): heart, heart-pulse. `File` (8): file, file-check, file-pen, file-plus, file-pulse, file-search, file-star, file-text.
- First the host alone: part, form, base, and one output (shield, heart, file).
- The outputs with a mark are a row of host as container plus the mark's output, like `container-square-line-12`. They wait for the mark forms, which are not in this list: badge-12 (check, plus, star), pencil-12, pulse-12, magnifier-12, text-lines-12.

### 9.5 — Order
- circle, triangle, chevron, chevron-12, then the chevron layout row from 8.14, arrow, arrow-turn, arrow-circle, polygon, star, cube, cylinder, Shield, Heart, File.
- One row at a time, each shown before the next starts.

---

## On his word only

- Publishing the library; npm publish of `kol-icons`.
- Setting the iconset file's thumbnail (the `Cover` frame 70:10 is placed).
