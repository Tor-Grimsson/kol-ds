# Session: kol-hardware — five groups, the signal engine, apps/curves

**Date:** 2026-09-27
**Agent:** kol-ds-ui (Claude Opus 5.5), MBP
**Summary:** kol-controls is now `@kolkrabbi/kol-hardware`, in five groups including frames (the §3 ruling). It also carries one signal engine that replaces four drifted expression compilers, plus monitor's ADSR. `apps/curves` is the reviewable envelope generator.

## Changes Made

- **kol-hardware 0.1.0 (published):**
  - `packages/controls` → `packages/hardware`, with `src/` grouped value · switches · indicators · panel · frames.
  - Frames: `ModuleFrame` · `ChannelStrip` · `FlipCard`.
  - `./signal`: `compileExpression` · `fitRange` · `isExpression` · `envelopeAt` · `createEnvelope` · reference data, with `src/signal/signal.test.mjs`.
  - Components: `SignalScope` · `SignalReference` (tabs | popover | sheet) · `EnvelopeGenerator` (equation | ADSR).
- **kol-controls 0.4.0 (published, npm-deprecated):** `export * from '@kolkrabbi/kol-hardware'`.
- **kol-theme 0.152.0 (published):** `kol-sources.css` lists kol-hardware (it never listed kol-controls).
- **apps/curves (:5182):** new. **apps/controls:** on kol-hardware; its compositions render from the shipped frames (with a working flip); new EnvelopeGenerator specimen.
- **showcase:** demos repointed; 6 new demos; classification entries.
- **Docs:**
  - ARCHITECTURE §3 amended: the rename, five groups, frames in, signal engine; "do not grow frames into wired modules".
  - `04-compositions/13-controls-system.md` is now the hardware system doc.
  - Package topology, shipped-packages, the 07-apps-tier INDEX, and the plan.
  - Consumer adoption notes go in `backlog/2026-09-26-consumer-findings-from-reference-clones.md` (for the iMac).

## Current State

### Working
- 28 gates clean; the full deploy build is clean (9 apps); the signal test passes.
- Checked live: curves (equation, ADSR, picks, EX popover, 390px) and controls (frames, flip).

### Follow-up the same session (kol-hardware 0.2.0, published)
- The retired type classes are fixed (JackSocket 8, RockerSwitch 8; a t-shirt `labelSize` falls back to 8).
- EnvelopeGenerator saves (`onSave`); apps/curves keeps both Saved lists in the fake D1 (`tool_settings`, `curves`).
- ADSR corners drag on the scope; the knobs follow and the window holds.

## Next Steps
1. Your review: `pnpm curves`, `pnpm controls`.
2. The editor DS-vs-inline audit (`backlog/2026-09-27-editor-review-findings.md`).
3. Consumer moves from the iMac (backlog notes above).
