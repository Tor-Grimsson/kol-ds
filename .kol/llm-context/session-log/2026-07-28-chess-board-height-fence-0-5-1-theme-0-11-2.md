# Session: chess board height fence — chess 0.5.1 + theme 0.11.2

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** Consumer-reported (kol-chess app, iframe-embedded): on desktop the board sat small (~630px) inside a wide viewport with dead space below and beside — the theme's fluid board carried a hard `max-width: 760px`, and the lg stage had no height awareness at all (`lg:max-w-none`, width-driven only; the dvh caps only ever applied to the stacked mobile layout). Fixed in both layers, verified in /demo via playwright, published.

## Changes Made

### Files Modified
- `packages/theme/kol-components-chess.css` — `.chess-board--fluid`: dropped the hard `max-width: 760px`; the height fence is now `min(100%, calc(100dvh - var(--chess-stage-reserve, 200px)))` — same knob the stage reads. Mobile media query (380px reserve) untouched.
- `packages/chess/src/apparatus/ChessBoardWithControls.jsx` — at lg the stage now caps its own width off viewport height (`lg:max-w-[calc(100dvh_-_var(--chess-stage-reserve,200px)_+_472px)]`, panel variant budgets −106px more) and centers itself (`lg:mx-auto`). Keeps board+rail married and adjacent when the consumer shell goes fluid — without it the pinned rail drifts to the far right of a wide container.
- `showcase/src/pages/Demo.jsx` + `showcase/src/sets/chess-apparatus.jsx` — consumer mirrors updated 1:1: shell wrapper drops `mx-auto max-w-[1232px]`, keeps gutters only.
- `packages/chess/package.json` 0.5.0 → **0.5.1** · `packages/theme/package.json` 0.11.1 → **0.11.2** · `docs/operations/SHIPPED-PACKAGES.md` both rows bumped.

### Features Added/Removed
- New consumer knob: `--chess-stage-reserve` (default 200px) = vertical chrome the consumer keeps above+below the stage. Set it on the shell wrapper to tune board size; both the board CSS and the stage cap read the same variable.

## Current State

### Working
- Verified in /demo at 1920×1200: board 1000×1000 (was 760 hard-capped), rail flush at the 32px gap, stage centered, zero page scroll. At 1440×900: board 700 (= dvh − 200), still no scroll. Layout now scales with resolution.
- Published: `+ @kolkrabbi/kol-theme@0.11.2` · `+ @kolkrabbi/kol-chess@0.5.1`. **git push = user's (pinged).**

### Known Issues
- The stacked (<lg) reserves stay hardcoded (380/470) — not var-wired; fine until a consumer needs a mobile knob.

## Next Steps
1. Consumer side (kol-chess app, same session): bump chess ^0.5.1 + theme ^0.11.2, drop the shell's `max-w-[1232px]`, optionally tune `--chess-stage-reserve` (~100px matches its py-12 chrome).
2. Two-repo mandate honored — change landed here directly, no `_tmp` ledger.
