# Session: lobby to zero, quarantine to empty, dropdown chrome made real — and the tier map ruled WRONG

**Date:** 2026-08-08 evening → 2026-08-09 night
**Agent:** Grim (Fable 5)
**Summary:** Three arcs shipped — the lobby queue emptied (table shadow, SideNavGrabResize, RecordManager), the quarantine readmitted 11/11 with the R1 pass run over all 239 exports, and the Dropdown's documented-but-nonexistent chrome finally authored. Session ends on the user's ruling that the component categories are WRONG — noted, not acted on.

## Changes Made

### Arc 1 — the lobby queue, emptied (published)
- **Table shadow** — `.kol-table-wrapper`'s orphaned surface-primary "cover" gradients (left behind when the 2026-07-28 fade ruling deleted the shadow band) rendered as a shadow on any non-primary surface — the brand app's Graphics page clip. Deleted. **theme 0.30.2**.
- **SideNavGrabResize** — grab-edge resize + snap-collapse in SideNav (`useDragResize.js`, mirror prior art); the `data-sidenav="collapsed"` renderer REBUILT deliberately (deleted 2026-07-29); three tokens minted `--kol-sidenav-{grab-w,snap,step}` (in kol-framework.css:37 where the family lives — the brief said kol-theme, wrong); width+state persist, keyboard separator path. **framework 0.14.0**.
- **RecordManager** — organism + **FieldRow** molecule (+ StatusChip), five field types, pointer-sort reorder w/ `.kol-tooltip` drag label, ShellDrawer slide-over, MediaLibrary modal picker (client injected §3), Table gained `rowClassName`. Zero new CSS. **component 0.25.0**.
- Both entries → `done/` with resolutions; kol-website's receipts synced 🟢 with 📌 adoption remainders; ledger queue **0**.

### Arc 2 — quarantine readmission, 11/11 (goal-loop, "go do whats left")
- **R1 membership pass over all 239 exports** — ledger at `02-placement.md § The pass`; 3 flagged (ExitPreview · TagModeGate orphan · AlternativeControlsMock demo-harness), rendered on their pages via `MEMBERSHIP_FLAGS` + notice in ComponentPage (both MDX and generated branches).
- **R4 verified** on all 31 block/set modules; one chrome owner confirmed (CollectionPage → BlockViewer → PreviewCard).
- **Surface rules written** — `docs/operations/03-showcase/04-surface-rules.md` (Docs = living standards pages, vault absorption rejected; Search = page form of ⌘K; References = generated measurement).
- **Icons** admitted; MODE toggle ruled dead (v1 single-voice by design).
- **Sidebar order re-ruled** — `Components · Tools · Documentation · Operations` (user: showcase sections before Documentation) — law at `02-shells.md:138`, rails gate R4b updated (incl. vault-block position marker), ShellChrome flipped, two-doors Components row removed from Tools. Verified live.
- Quarantine page: Admitted 11 · Held 0. Plan file stamped EXECUTED. Nothing published (showcase/scripts/docs only).

### Arc 3 — Dropdown chrome + the chip fold (published)
- **Ghost classes authored** — `.kol-dd-*` was documented (2026-07-08 chrome law) and stamped by Dropdown.jsx but existed in NO stylesheet. Implemented to the documented contract: gap, caret trailing + open flip, open/panel corner fusion, `--grey` = oq-12, outline pair, divider, list padding.
- **States pinned** — `:hover` AND `:active` on the trigger pinned back to rest (2026-07-15 ruling: rest and open only). Both re-called by the user because I authored the comment without the kill rules — two misses, mine.
- **One width** — trigger reserves widest option via hidden ghost-label grid stack; panel pinned to the trigger's EXACT width (Popover matchReferenceWidth min-width → width; sole consumer verified).
- **INDICATOR ladder** — third rung in `glyphLadders.js` (a caret never outweighs its label); Dropdown's private ADJACENT transcription deleted, Table's hand-typed sm value repointed. Exported from the barrel.
- **Width by viewport deleted** — the resize-listener ladder that sized every dropdown by window width is gone; hug default, call site owns width (Input's model).
- **Chip fold, 3 → 1** — `kol-doc-code-inline` vs `kol-table-token` ruled "basically the same style" by the user; ONE recipe now in kol-type-roles.css, and the fold surfaced a THIRD spelling (`.kol-table code`, off-scale size + bare radius literal), folded too. Table rule keeps only cell mechanics.
- **theme 0.31.1** (0.31.0 + the click-state pin) · **component 0.26.0**.

## Current State

### Working
- npm: theme **0.31.1** · framework **0.14.0** · component **0.26.0** — all verified on registry. All 18 gates clean. Ports clear.

### Known Issues
- **⚖️ THE TIER MAP IS RULED WRONG (user, session close, verbatim):** *"categories are completely fucked up atoms molecules etc. ARE FUCKING INCORRECT"* — the component categories the readmitted sidebar now shows (roster folder-derivation for kol-component + the hand-authored `classification.js` TIERS map for flat packages) do not match what he rules correct. **Noted, not acted on** — which components are misfiled is HIS call row by row; do not guess. Governing docs when it runs: `00-taxonomy.md` + `02-placement.md`; memory: every component belongs in the atomic taxonomy.
- kol-website still owes its two 📌 adoption remainders (deck manager + Library onto RecordManager; retire brand SideNav toggle).

## Next Steps
1. **Joint tier-map pass with the user** — walk the sidebar's categories (Atoms 41 · Molecules 30 · Organisms 25 · the per-package tiers) against his rulings; correct roster/classification/placement docs together. Session-log note above is the trigger; his wording is the scope.
2. Publish wave for kol-website adoption once he's ready (install bumps land the shadow fix + grab rail + RecordManager there).
