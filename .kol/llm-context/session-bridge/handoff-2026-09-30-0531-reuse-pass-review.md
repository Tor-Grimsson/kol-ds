# Handoff — 2026-09-30 05:31

## Goal of the current arc
The showcase build (plan-2026-09-29-phase-log-and-showcase-review) is closed as a milestone; the open arc is the user's **review** of it — the overnight agent decisions and the same-morning reuse pass — and whatever he overrules.

## Last actions taken (causal trail, newest first)
- Reuse pass published: theme 0.159.0 · framework 0.48.0 · workshop 0.33.0 · design-editor 0.19.0. **Registry lag:** at 05:31 npm served theme 0.159.0 but still framework 0.47.0 / workshop 0.32.0 / design-editor 0.18.0; a re-publish of workshop returned E409 "previously staged version 0.33.0" — the publish went through, npm is propagating. Verify with `npm view @kolkrabbi/<pkg> version --prefer-online`; if still stale later, `npm view <pkg> time`.
- Reuse pass: the showcase settings drawer → `SettingsPanel` (media's approved drawer); rail resize → `useDragResize` + `.kol-rail-grab` (new tokens `--kol-shell-{nav,toc}-{snap,step,snap-default,w-collapsed}` in kol-framework.css, `.kol-rail-grab--right` in kol-animation.css); `ResultRow` → `ContentRow` (ResultRow deprecated, on the retirement ledger); asset thumbnails → `AssetGrid` + `MediaTile`; Tags/Packages/set-family/Styles lists → `Tag` / `Table`; one `CompositionDiagram` in Shell & Layout's look (the MDX draws through it).
- Phase log entry `docs/operations/09-phase-log/2026-09-30-showcase-build.md` got a **Corrections** table; Round 3 records that the drawer answer was `SettingsPanel`.
- Overnight: Cards space (18 website cards), editor #12/#14/panels-bool, breakpoint + touch pass, header cluster (GitHub into Settings, hamburger below lg), milestone logged.

## Current state / open decision points
- The user's review surface: Development › Records › Phase log › *Showcase build* (Decisions table — rows marked *agent* are his to overrule) and Open questions **Round 3** (header cluster, rail states) + **Round 4** (redrawn glyphs, old files at `_tmp/2026-09-30-glyph-redraw-before/`).
- Not built on purpose: rail icon strip (no icon per chapter), drag-to-canvas for asset thumbnails (canvas has no drop target).
- `ResultRow` drops at 30 days per the retirement gate (R3) — decide on the iMac (consumer scans are iMac-only).

## Next intended action
- Confirm the four packages are served at their new versions; then wait for the user's review and act only on what he names.

## Working memory not yet in AGENT-CONTEXT
- The failure class this morning: UI built fresh while the DS shipped it. No gate catches reuse — a candidate gate is "a new JSX file in showcase/ or a package that hand-rolls a drawer/row/grid when `SettingsPanel`/`ContentRow`/`AssetGrid` exist", not built. Memory: `find-the-shipped-component-first`.
- `useDragResize` collapse is bridged to the shell's own hide state inside `useRailGrab` (ShellLayout.jsx): the hook's collapse is un-stamped and the width var cleared, so `[` / `]` remain the one source of the rails' visibility.
- `SettingsPanel` in the workshop shell still carries the Keys section — media's drawer has none; if he wants parity, keys live in the `S` sheet only.
