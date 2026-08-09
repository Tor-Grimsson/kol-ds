# Session: the utilities shelf — "atoms paint" ruled and executed

**Date:** 2026-08-09
**Agent:** Grim (Opus 5 → Fable 5)
**Summary:** A 14-item homepage/components review was triaged into a plan; the deletion-ticket receipt was retired; and the plan's Wave E shipped end-to-end — atoms are VISUAL by law now, 13 purpose-without-a-face components moved to a new `utilities/` tier (one folder, one sidebar group), with a paints-heuristic gate so the shelf can't regrow. All 19 gates clean, all local on HMR.

## Changes Made

### The ruling arc (three corrections before the go)
- First draft measured *consumers* — wrong axis (user: tier is about what a thing IS).
- Second draft routed failures to 8 destinations — rejected ("GROUP THIS TOGETHER"): **one folder, one group**.
- User struck `MenuPopover` (renders a MenuItem — visual) and the `Section`/`LabeledControl` merge flag (group header vs field label — different roles). FullscreenOverlay held on the placement test alone (paints, but only ever worn) — his to overrule.

### Packages (rides the standing UNPUBLISHED component delta)
- **`packages/component/src/utilities/` minted** — 13 files moved verbatim: from atoms `AssetGrid` `Popover` `OverlayGlassPanel` `TiltCard` `AssetPlaceholder` `TransparentX` `ExitPreview` `ProsePreview`; from molecules `ButtonGroup` `FullscreenOverlay` `LoaderOverlay` `ErrorBoundary`; from organisms `EditorShell`. Counts: atoms 37→29 · molecules 36→32 · organisms 20→19.
- **Barrel** — 13 lines repointed; consumer imports unchanged.
- **15 internal imports repointed** (Popover ×7, FullscreenOverlay ×2, AssetPlaceholder ×4 incl. graphics/Graphic, TransparentX in ColorSwatch, AssetPlaceholder in Image).

### Gates + showcase
- `scripts/validate-taxonomy.mjs` — `utilities` in the closed set; utilities may import atoms/hooks/graphics, never molecules/organisms; **check 4: every `atoms/` file must PAINT** (source heuristic; `dangerouslySetInnerHTML` counts as text — the AnimatedTitle false positive taught it).
- `scripts/validate-roster.mjs` — folder set widened.
- `showcase/src/nav/roster.js` + `registry.js` (CATEGORY_ORDER/LABELS after Organisms) + `admitted.js` (`utilities` rides the molecules-organisms gate).

### Docs
- `00-taxonomy.md` — Utility tier row + § *An atom PAINTS, and it stands alone* (both tests, the ladder position, the 13, the two strikes).
- `02-placement.md` — § *The utilities re-file* map.

### Lobby
- `deletion-is-never-authorised` receipt **⚫ retired on the user's call ("outdated")** — graduated to `lobby-history/archive/`, ledger row removed, history line appended. The rm-gate remainder stays humpty's.

## Current State

### Working
- All 19 gates clean. Utilities group renders from the existing derivation chain (roster → registry → admitted).

### Known Issues
- **UNPUBLISHED delta on component + theme** (homepage-review wave + this restructure) — publish only on sign-off.
- Waves A–D of the plan (`plan-2026-08-09-membership-and-preview-contract.md`) are authored, NOT started: preview contract (Card backfill ×174), labelFromSlug wiring (Section Label!), Badge→StatusChip box, helper-mono-on-paragraphs sweep, rails-hidden home, KOL-DS wordmark (blocked: which typeface?), header glyphs md/full-ink.

## Next Steps
1. Wave C — the preview contract (kills the /components mess in one pass).
2. Wave D — `displayName` via labelFromSlug (the SectionLabel space, finally).
3. Waves B + A, then the joint membership pass (Wave E's consumer-count half; `InteractiveImage` retire is still open — 0 consumers anywhere).
