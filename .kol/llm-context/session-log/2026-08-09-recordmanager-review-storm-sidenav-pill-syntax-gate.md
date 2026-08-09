# Session: the RecordManager review storm, the SideNav pill, and the 19th gate

**Date:** 2026-08-09 (continued session — follows `2026-08-09-dropdown-align-frontmatter-collapse-copybutton-unify.md`)
**Agent:** Grim (Fable 5)
**Summary:** A live design-review storm drove RecordManager/FieldRow/StatusChip to the Framer reference frame by frame; SideNav was ported from the brand elder and evolved to the pill-handle single control across six framework releases; a broken publish (component 0.28.0) birthed the syntax gate and the workspace:^ pin protocol. Heavy cross-session traffic with the kol-website agent throughout.

## Changes Made

### Showcase surfaces
- **Card walls** — Home bento + Components waterfall: `columns: 4 20rem` (count from the wall's own width, never viewport); law added to `05-layout-systems.md`.
- **Variants/sizes pickers** — `sizes` export mirrors `variants` (registry → DemoStage → PreviewCard); AxisPicker (SegmentedToggle ≤4, Dropdown above); 9 demos wired; size arrays run sm→md→lg (user ruling).
- **Demos born**: RecordManager · FieldRow · StatusChip. **Set born**: `record-manager-cms` (collections rail + full surface; rail becomes a top chip strip below md).
- **L1 eyebrows toggle both ways** (workshop 0.20.0) — label-door repealed at L1; law in `02-shells.md`.

### RecordManager / FieldRow / StatusChip (component 0.28→0.32.2, theme 0.32.x)
- **StatusChip**: rebuilt twice on user frames — final: Dropdown-sm metrics (py-1 px-2, mono-12) as a pill, OPAQUE tone fills (`color-mix(tone 15%, surface)`, `--ui-*` ladder), caret a direct flex child, panel = current chip + hairline + check-column rows. Options accept `{value, label, tone}`.
- **Row anatomy**: grip + checkbox share ONE leading cell at matched sizes; grip rest-visible; title cell carries the boxed `toggle-overlay` button at the cell's end (hover-revealed).
- **Toolbar**: bare glyphs (no Button chrome) — rest body ink, hover full ink + Tooltip, PRESSED gets a snug box (`sortActive`/`filterActive` props); search is an icon expanding into a compact w-56 field.
- **Panel**: ShellDrawer gained `closeSide="start"` (× leads, actions cluster right); empty media = framed + slot, empty file = Choose-file control (render disabled without a picker); `kol-tag--data` renders filenames verbatim (the chip-uppercase exception documented as label-only); FieldRow text inputs sm; rows py-4.
- **Table**: `compact` density prop (cells 0.5/0.75rem).
- **Dropdown width saga**: exact→floor→max-content→**exact restored** — the fused one-piece width is back; truncation solved at the trigger (`.kol-dd-ghost` reserves 1rem check-column slack). Root-caused: a floating panel with auto width sizes against available space, not content.

### Icons (0.12.1)
- Minted: `drag-handle` (⠿ 2×3), `arrows-vertical` (↑↓), `filter-lines` (≡), `toggle-overlay` (from user frames). `more` dots now solid fills (stroke rendered as halo). Inventory doc updated.

### SideNav (framework 0.15.0 → 0.17.0)
- **0.15.0** — REPLICATED from the brand elder (user mandate): two-level disclosure model, `background` prop, chip + grab edge on one contract (`toggleCollapsed` seam). **0.15.1** — `useDragResize` barrel export (peer's edit shipped). **0.15.2** — the layer defect (peer-found): rail box moved INTO rules (utilities in the components layer outrank file rules on the same element); caret on a plain wrapper span; `onCloseDrawer` wired. **0.16.0** — collapsed rail: no chip, any row click expands (+discloses its category). **0.16.1** — repack for the pin fix. **0.17.0** — THE PILL: grab edge is the single control (chip deleted both states), click-toggle with 3px slop, snap-to-default (`--kol-sidenav-snap-default`), 8px hit area, dblclick reset removed, Enter/Space toggle; hook logic lifted from the user-approved brand proto.

### Release infrastructure (born from the 0.28.0 breakage)
- **component 0.28.0 shipped unparseable** (JSX comment at expression position) — fixed in 0.28.1, 0.28.0 deprecated on the registry.
- **Gate #19: syntax** — `validate-syntax.mjs` esbuild-transforms all 278 package source files; first in `pnpm validate`; esbuild added as root devDep.
- **workspace:\* → workspace:^** across all inter-package deps — framework 0.16.0's tarball had frozen EXACT pins (broken component 0.28.0 + icons 0.10.0) for every consumer; ranges let patches flow.
- **Registry smoke harness**: fresh registry-only consumer app (scratchpad) — vite build (2016 modules) + headless runtime console read; used to hand the brand breakage back to kol-website with a clean verdict.

## Current State

### Working
- npm end-state, all verified: theme **0.32.3** · component **0.32.2** · framework **0.17.0** · icons **0.12.1** · workshop **0.20.1**. All **19** gates clean. kol-website adopted the full wave (both apps), retired its SideNav proto and its 0.28.0 patch.

### Known Issues
- **⚖️ The tier re-sort still awaits the user's row-by-row review** (`02-placement.md § Re-sort map`).
- **RecordManager surface is under LIVE review** — frames were landing to the last minute; expect more (row density, panel proportions, chip metrics are the hot zones).
- Brand's "next boot" verdict pending on the kol-website side — if still red, the peer brings the first console line.
- LLM_RULES symlink discussion parked (dotfiles BULLETIN ticket 🔵).

## Next Steps
1. Keep answering the live review — frame in, fix out, publish per wave.
2. Tier-map review when the user turns to it.
3. If brand boots red: first console line → dig from evidence, not theory.
