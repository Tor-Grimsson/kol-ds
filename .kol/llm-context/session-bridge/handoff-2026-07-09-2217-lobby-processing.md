# Handoff — 2026-07-09 22:17

## Goal of the current arc
Drain the `lobby/` intake queue (components flung in from consumer apps) into the DS — each item gated by a `/claude-kol-ds` orientation, KOL-conformant, and logged to `done/`. This session closed the user-triaged batch + the feasibility set via agent fan-out; the remaining ~40 queue specs await the user's visual triage pass before building.

## Last actions taken (causal trail, newest first)
- **Chart-color bug fixed** — `--kol-palette-*`/`--kol-font-family-heading`/`--kol-status-danger*` resolved nowhere (charts collapsed to accent). Added green + purple ramps + an alias block to `kol-brand-color.css`; framework hit the immutable-version trap (was 0.3.3 on npm) → bumped **0.3.4**, published, tarball-verified; `02-color.md` synced (7-hue table).
- **Debt sweep**: root README package table 8→14; `usage-index.json` dead `kol-component/foundry` subpath ×7 → `@kolkrabbi/kol-foundry`.
- **Foundry move-of-four** (user-approved): TextPressure/TypeSample/TypeSpecCard/ColorLoader → kol-foundry; LoaderOverlay → `loader` slot (`onEnter` dropped); CSS → recreated `kol-components-foundry.css` (framework dupes deleted). Published component **0.8.0** (breaking) · foundry **0.3.0** · theme **0.7.3**, tarball-verified.
- **Feasibility builds** (agents): MediaViewer+MediaTileGallery (viewer merge, direct embla), ColorInputRow (ColorField⊕SwatchRow), SplitToolButton (Button covers the toggle half), ButtonGroup (children API). Placeholder=EmptyState / Ramp=ColorRamp `colors` → duplicates refused/killed.
- **Wayfinding** taxonomy category added; **TailwindContentSource** decided (`@source` contract permanent per §4). Rejects archived (RouteLoader/ChapterNavigation/StudioHero); InteractiveImage parked; TypeScaleSection→recipe.
- Ran the `/claude-kol-ds` orientation gate first (full 7.7k-line CSS read).

## Current state / open decision points
- **npm 14/14 in sync, all content-verified.** Nothing to publish.
- **Everything uncommitted** — working tree is `!98 ?40` (user's commit; no git from the agent).
- **`/components` roster** lags for new builds until `scripts/extract-usage.mjs` reruns (mines ~25 consumer repos) — SplitToolButton has a hand-stub; demos glob-register regardless.
- **Deferred, needs a decision, not urgent:** ShapeDropdown ⇄ SplitToolButton reconciliation (two split-button idioms coexist, cross-referenced JSDoc); TypeScaleSection columns-recipe doc (write when a consumer needs it).

## Next intended action
- **User triages the remaining ~40 lobby specs** (grouped: shell set, CMS/stack/work set, editor set, layout set) at `/lobby` — then fan out builds per his calls, same gated pipeline. Nothing should be built from that queue without his per-item call.

## Working memory not yet in AGENT-CONTEXT
- **Orientation drift table (from the gate):** dangling tokens beyond the ones just fixed — none remain in the palette/font/status set; but `.kol-prose pre/code` are duplicated theme⇄framework (type-sample halves already fixed, prose dupes remain). Chess sheet keeps its pre-conformance exemption (uppercase, >4px radii, raw hexes) — a known specimen carve-out.
- **The immutable-version trap bit 4× today** (theme ×2, framework ×1, and the workshop/brand chain). Reflex for any future package-source edit: bump the version in the same edit; verify `local == npm` before assuming a publish is needed.
- Chart palette lives in `kol-brand-color.css` (framework), so charts only colorize when the brand layer loads — true for the showcase + monorepo, brand-neutral consumers get accent fallback. Intended (chart hues are brand-flavored), not a bug.
- `pnpm install` already run this session (workbench→foundry link live); react-inspector peer warning is known Ladle/React-19 noise.
