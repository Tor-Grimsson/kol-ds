# Plan — The iconset's icons into the code

**Raised:** 2026-11-23, the user. Points verbatim: "I need the icons to the code. how are we doing that?", "ok whats the plan then".
**Status:** Editor set done 2026-11-23: in Figma the keyline was switched off in 112 output variants on Bases and clip turned on for the 178 Editor icons, then all 178 exported at 24 and written to `packages/icons/src/kol-icon-set-editor` (old files in `_tmp/2026-11-23-icons-flat-export/before/`); tags, fills and duplicates clean (heading-2/heading-3 allowed); review https://claude.ai/artifact/8c8HchrAsqTq7YA2bC82nX. 32 code-only Editor files untouched. Open: Interface and Signal, his look, publish.
**Shape:** W › phase › list.
**Laws carried:** the recipe is `docs/operations/10-figma/04-icon-export.md`, followed step for step; Figma is read only, nothing in the iconset file changes; names stay as they are; a removed file goes to `_tmp/`, never deleted; nothing publishes without his word; one check at the end.
**How a phase closes:** measurable acceptance line first, then the icon gates green, then the changed icons seen at 24, old beside new, in an artifact.

## W1 — Export, write, check

### 1.1 — Export the Icons page (step 1 and 2 of the doc)

- One plugin read of the `Icons` page in `Lud0oSRKPTyHvT9MDVIczN`: every icon component whose children are all base instances, `exportAsync({ format: 'SVG_STRING' })`, one `name=<svg body>` line each, in the doc's short format.
- Saved to `_tmp/2026-11-23-icons-flat-export/figma-export.txt`. Icons whose children are not all base instances are listed by name, not exported.
- Keyline: before exporting, the same read lists every icon whose `Base/keyline` is visible anywhere in its tree (barrel had it on once). Any hit stops the run and goes to him; Figma is not edited from here. Each exported SVG keeps the 24×24 viewBox the keyline sets.

**Acceptance:** 0 icons with a visible `Base/keyline`, or the run stops; every exported line has `viewBox="0 0 24 24"`; 0 exported lines contain the keyline's drawing; the file has one line per exported icon; the exported count plus the listed count equals the number of icon components on the page (about 955: Interface 659, Signal 117, Editor 179).

### 1.2 — Dry run, then write (step 3)

- `node scripts/import-figma-icons.mjs <file> --dry` first: it reports which names have a file, which have none, and which would change.
- Then the real run. Old files are copied to `_tmp/2026-11-23-icons-flat-export/before/` by the script. Names with no file are skipped and listed for him; none is placed with `--new` without his word.

**Acceptance:** written count + skipped count = exported count; every written file has a copy in `before/`; 0 files deleted.

### 1.3 — Gates and the look (step 4)

- `pnpm validate:icon-tags`, `pnpm validate:icon-fills`, `pnpm validate:icon-duplicates`, `pnpm validate:icon-ink`.
- Whatever the gates flag is settled as the doc's "What to settle after a run" says (baseline `allowed` with the reason, `pairs` for two names that came out as one drawing). Nothing renamed.
- One artifact: every changed icon at 24, old (from `before/`) beside new, light and dark.

**Acceptance:** the four gates exit 0; the artifact shows every changed icon, and I have looked at all of it before he sees it.

### 1.4 — Publish — TALK

- `kol-icons` bump and npm publish, on his word only.

## Time

About an hour of work, one run, no agents: export, dry run, write, gates, the artifact.

## W2 — Editor review fixes — ✅ built 2026-11-23 (his points 2026-11-23, on the review page)

Points verbatim: a-framed "too tight", broom "line issue", fold-indicator "dont understand frame", quill-signature "bug", square-pen "too small and wrong thickness". Each fix is made in Figma at the part or output the icon comes from (never in the SVG file), then only these five are re-exported and written. The old drawing (`before/`) is the reference for size and position.

### 2.1 — a-framed: A too tight in its frame

- The A almost touches the frame. Give it the old file's room: A smaller inside the 16 frame, same gap on all sides as the old drawing.

**Acceptance:** the gap between the A and the frame's inner edge is equal on left, right, top and bottom and matches the old file to 0.5.

### 2.2 — broom: line issue

- The bristle and binding lines run into the body outline where the old ones stopped at it. Lines end on the outline, as in the old file.

**Acceptance:** no bristle or binding stroke crosses the body outline (0 intersections past an end).

### 2.3 — fold-indicator leaves the icon set (his ruling 2026-11-23: "it seems like an icon that isnt part of an icon set")

- It is the 4px corner marker of `SplitToolButton`, its only user. The button draws it itself (inline SVG, currentColor); the set file goes to `_tmp/`, its tags, cut and inventory rows go; in Figma the Icons page copy moves to `_trash` with a `_` name.

**Acceptance:** 0 files named fold-indicator in `packages/icons/src`; `SplitToolButton` renders the same corner marker without IconLoader; the icon checks clean.

### 2.4 — quill-signature: bug

- The quill's shaft stroke runs past the feather outline (the stray mark at the tip). The shaft ends inside the feather, as in the old file.

**Acceptance:** the shaft path ends inside the feather outline; nothing draws outside it.

### 2.5 — square-pen: pen too small, wrong thickness (his ruling: fix the shared mark)

- The pen came in as the 12 mark at 1.25 stroke, about 8 long. It goes back to the old pen: 1.5 stroke, old length and position across the square's corner.

**Acceptance:** every stroke in the icon is 1.5; the pen's length and position match the old file to 0.5.

### 2.6 — Re-export and write

- Export the five, write them with the script (`--set editor`, `--skip` nothing else), run the icon checks, republish the review page with these five on top.

**Acceptance:** five files written, 0 others changed; the icon checks clean.

## Time (W2)

About 45 minutes, me, no agents. Go given 2026-11-23.

**W2 run (2026-11-23):** broom handle, ferrule and body and the quill feather redrawn to the old geometry in their parts (used by nothing else); the a-framed A parts scaled to 80 percent about the centre; the shared Pencil-12 pen mark grown to 9.25 at 1.5 (line at 1.5); fold-indicator out of the set (file in `_tmp/2026-11-23-fold-indicator-out/`, drawn in `SplitToolButton`, Figma copy on `_trash`). Five Editor files written (a-framed, broom, quill-signature, square-pen, edit-selection); icon checks clean. Open: the pen mark also changed edit-square, edit-square-02, file-pen, notebook-pen and clipboard-pen-line in Figma; their code files update with the Interface run.

**W2 follow-up (his points 2026-11-23: spray-can "missing 'sprey'", wand-sparkles "name is magic-* so it sits with other wands"):** new part `Design/spray` (six instances of `Circle-small/point` at the old spray positions) in the Design form on its own `spray` switch, on only in spray-can; spray-can written. wand-sparkles renamed magic-wand-sparkles in Figma (icon, cell label, `Sparkle/output` variant) and code (file renamed, old name aliased in `aliases.json`, tags, cuts, inventory). Icon checks clean.

## W3 — Solid twins and an Editor page (his points 2026-11-23: "some are solid like boolean and bold, other should have solid counterpart like align", "I want a new page in figma only with the editor imports both solid and outline")

Rule (proposed, agreed "sure"): line is the default; icons that are fills by nature (booleans, bold) stay single; a `-solid` twin exists only where the interface needs an on state. First twins: the six align icons, which AlignmentGrid and SlideInspector use for the selected cell (the aliases to the outline icons, set earlier today, lost that state).

### 3.1 — Six align solid twins — ✅ built 2026-11-23

- In Figma, in the align row on Bases: filled parts for the align bars (one part per drawing, reused, never numbered copies), on their own switches; six new output variants `align-*-solid`; six icon components in the Editor section beside their outline twins.
- Export the six, write them to `kol-icon-set-editor/design/`, remove their six aliases from `aliases.json`, tags and cuts rows (cut `solid`), inventory.

**Acceptance:** 6 output variants, each 1 base instance, 0 loose vectors; each exports at 24×24 with 0 keyline paths and its bars filled; 6 files written; 0 `align-*-solid` entries in `aliases.json`; AlignmentGrid's selected cell draws the solid icon (a check reads the resolved name); icon checks clean.

### 3.2 — Page `Editor` in the iconset file — ✅ built 2026-11-23 (page 609:348; his simplification: icons as in code, solid beside its outline where a twin exists, no gap labels)

- New page `　　↳　Editor` after Icons, canvas #1E1E1E: one section, the Editor set exactly as it is in code (175 icons), grouped by its two folders (design, typography), in name order.
- Each icon is one cell: the outline icon and, beside it, its solid twin. An icon that is solid by nature sits in the solid column with the outline place left as a labelled gap; an icon with no twin leaves the solid place as a labelled gap. Every icon is an instance of its Icons-page component, never a copy; labels are ❖ library--util parts; no loose text.

**Acceptance:** the page holds 1 section; instance count = code's Editor file count (175 + 6 solid); every instance's main component is on the Icons page; every name label equals a file name in `kol-icon-set-editor`; 0 detached or loose vectors; every other page's node count unchanged.

### 3.3 — Renames — TALK

- The 20 renames and the flip family on the name list wait for his word; when applied, the Editor page labels follow (they read the component names).

## Time (W3)

3.1 about 45 minutes, 3.2 about 30 minutes, me, one look-check at the end of each.

**W3 run (2026-11-23):** Editor page built, 175 icons as instances of the Icons-page components plus the six solids beside their outlines. Solid twins = six new `Align/output` variants (`align-*-solid`) that reuse the outline parts with their bars filled by an override (no new drawings); six icon components beside their outline cells on Icons; six files written to `kol-icon-set-editor/design/`, their aliases removed, tags and cuts (solid) and inventory rows added. frequency moved to Signal as wave-pulse. Icon checks clean.

**W4 run (2026-11-23, his word: "whatever you need to do sure"):** the whole sorting table applied, Figma and code together. 18 renames (icon, cell, label, output variant; files renamed, old names aliased, tags, cuts and duplicate baseline carried). 5 merges (flip-transform → flip-frame, magnet-02 → magnet, ruler-02 → ruler, text-box → text-frame, color-palette → palette): icons and Editor-page cells to `_trash`, files to `_tmp/2026-11-23-icons-flat-export-r5/merged/`, old names aliased. paint-noise moved to Signal `pattern` (Figma pattern grid and code). Six more solid twins (space-evenly-horizontal and -vertical, pointer, pointer-outline, pointer-selector, warp): output variants with filled closed shapes, icons beside their outlines, files written; the Warp/warp part's region fill was cleared so the override shows. Editor page: 169 cells, 181 icons. Editor set in code: 181. Icon checks clean; every alias resolves.

**W5 run (2026-11-23):** outline and solid twins only where he named them (his correction: "why did you make a solid version for all?? thats not what i wanted" — a pass that made 64 unasked solids and 7 unasked outlines was rolled back the same turn). Solid twins added: quote, pucker-bloat, pushpin. Outline twins added (the filled originals renamed `-solid`): bold, mask, keyframe and the four booleans; `type` is now the old `aa` line drawing (aa aliased to type), the filled one `type-solid`. select-cursor uses select-frame's dashed square (one part); rgb-circles redrawn as three whole circles. Five look-alike pairs recorded in the duplicate baseline (rgb-circles is now the same figure as interface's venn-circles). Figma Editor section, Editor page and code all hold the same 191 icons.

## Editor set — ✅ CLOSED 2026-11-23 (his word: "lets close this as the editor set")
- 198 icons, Figma = code. Outline/solid pairs are one component set each with `solid` true/false (32 sets); code keeps `x` / `x-solid`.
- Late fixes: B redrawn, brush-wide, valign trio on Text-lines (new part line-3-center), 9 new solids, transparency solid keeps the back circle open, shadow-inner corner radius 0.5, pointer-outline → pointer-node (alias kept).
- Editor app: every Node select entry uses `pointer-node` (ToolStrip, ModalSearchHost, FloatCompose ×2, ToolDockEditor).
- Next: Interface and Signal runs, export-doc runs table.

## Icon set notes (his points, 2026-11-23)
- folder: Figma's sidebar folder is a solid folder with a cut line across the lower half (his screenshot of "kol-ds-ui [library files]"); ours is a stroke folder. Make a `folder-solid` in that shape for the iconset (Interface set, files) and use it for folder rows.
