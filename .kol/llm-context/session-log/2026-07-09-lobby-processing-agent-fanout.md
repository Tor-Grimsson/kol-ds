# Session: Lobby processing via agent fan-out — full task list closed

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M → session ends on a model switch)
**Summary:** Ran the /claude-kol-ds orientation gate (full 7.7k-line theme+framework CSS read, drift table), then processed the entire lobby triage + feasibility backlog through parallel agents with per-item KOL-conformance briefs. All 6 tracked tasks closed. Three packages bumped and UNPUBLISHED at session end.

## Changes Made

### Builds (agents, verified + bookkept serially)
- **MediaViewer + MediaTileGallery** (`component/organisms/`) — ImageLightbox+FullscreenGallery collapsed onto ONE viewer: FullscreenOverlay shell + direct embla (Carousel lacks a controlled-index seam), parent-authoritative `index`/`onIndexChange`, overlay text on the **inverse fg tier** (scrim = surface-inverse), 4px `.kol-embla-btn` chips; GalleryCarousel re-wired off dead `initialIndex`.
- **ColorInputRow** (`component/molecules/`) — ColorField⊕SwatchRow merge; rewrote a narrower pre-existing build; additive slots (`refs` pre-resolved popover / `locked`+`tokenName`); per-keystroke `#UPPER` emission (guard added in `blocks/color-picker.jsx`).
- **SplitToolButton** (`component/molecules/`) — only the new half of ToolButton; Button `quiet`/`pressed` covers the toggle (demo proves it); inline 4px fold-triangle (icon-set candidate). ⚠ Overlaps pre-existing `ShapeDropdown` (two-button idiom) — cross-referenced, future reconciliation.
- **ButtonGroup** (`component/molecules/`) — children API (config array dropped), `sm:${align}` interpolation bug fixed via static class maps, `kol-sans-heading-05` title.
- **RotaryDial⇄Slider marriage** — shared contract `value/min/max/step/onChange/label/size/disabled/formatValue`; 15 call sites unbroken; readout stays formatValue-only (atoms nest no KOL component).

### Foundry move-of-four (user call)
TextPressure, TypeSample, TypeSpecCard, ColorLoader → `packages/foundry/src/` (§3-safe). **LoaderOverlay → `loader` slot** (its spec's "brand → slot"; dead `onEnter` removed). CSS re-homed to recreated `kol-components-foundry.css` (+ theme import restored; framework dupes deleted). Foundry gains `framer-motion` peer. All showcase/workbench consumers repointed; workbench gains foundry dep — **`pnpm install` NOT run (needed)**.

### Decisions & taxonomy
- **TailwindContentSource DECIDED:** `@source` consumer contract is permanent (§4 wins; compilation rejected). Canonical **9-package** block in root README (icons included on evidence — Icon.jsx ships utilities), per-package README sections, 5 system docs + overview INDEX synced. Brief → `status: decided`.
- **Wayfinding** function category added (closed set amended, dated): ContentFilters, DropdownTagFilter, ShellSearchOverlay, ShellDrawer, DocsToc, AsciiCursor (+cross-package WorkViewToggle, ShellHeader, PortalFooter). Registry FUNCTION_MAP remapped ×9; `validate:taxonomy` clean.
- **Duplicates refused/killed:** Placeholder already = `EmptyState`; Ramp already = ColorRamp `colors` prop (wave-1 build deleted same day). Rejects archived with reasons: RouteLoader, ChapterNavigation, StudioHero; InteractiveImage parked; TypeScaleSection → recipe status (doc deferred, YAGNI).

### Orientation drift table (from the gate — future sweeps)
- Dangling tokens: `--kol-palette-*`, `--kol-font-family-heading`, `--kol-status-danger(-muted)` (chess+dashboards sheets) — resolve to nothing.
- Chess sheet pre-conformance (uppercase, >4px radii, raw hexes) — known exemption.
- `.kol-prose pre/code` + type-sample dupes theme⇄framework — type-sample halves now fixed; prose dupes remain.

## Current State

### Working
- Lobby: **82 → 40 queue** · 30 done · 3 archived · 1 parked · INDEX Processed table is the audit trail.
- All 6 session tasks completed; `validate:taxonomy` clean throughout.

### Known Issues
- **⏳ UNPUBLISHED bumps: component 0.8.0 (breaking: 4 exports moved, LoaderOverlay slot API) · foundry 0.3.0 · theme 0.7.3.** Publish together (`pnpm --filter @kolkrabbi/kol-{component,foundry,theme} publish --no-git-checks --access public` — OTP-free) or push→CI. Consumers on component 0.7.0 importing the four must switch to foundry 0.3.0.
- `pnpm install` needed (workbench→foundry link).
- Everything uncommitted; ButtonGroup/new components reach `/components` pages after an `extract-usage.mjs` rerun (SplitToolButton has a hand-stub).
- Stale (flagged, unfixed): 12 old `usage-index.json` entries say `kol-component/foundry`; root README package table lists 8 packages.

## Next Steps
1. `pnpm install`, validate live, publish the three bumps as one batch.
2. ShapeDropdown ⇄ SplitToolButton reconciliation; dangling-token sweep (chess/dashboards).
3. Remaining queue (~40) awaits the next triage pass (shell set, CMS set, editor set, layout set).
