# @kolkrabbi/kol-tuner

## 0.1.0 — 2026-11-18

- **First release, the engine tier's fifth package** (W27.2, the LogoShapes ticket from kol-branding). The structure half of
  the Line Swell canvas's `line-swell.js` (copied 2026-11-18), carried verbatim and split by tool: `harmonies.js`,
  `guides.js`, `construct.js`, `system.js`, `tuner.js`, `util.js`.
- No colour: the canvas's ink, ground and palette outputs are dropped; `systemSeeds` returns `grey` for its fill and `keylines`
  returns `light` in place of its two colours.
- `test/`: check-system and check-comb as functions of an engine, the 50-set parity, and the four Tuner pages run in Chrome
  on this package and on the reference.
