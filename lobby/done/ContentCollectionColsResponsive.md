---
component: ContentCollectionColsResponsive
source: kol-website/apps/web/src/routes/Stack.jsx#L78-L108
staged: 2026-08-27
status: draft
deps: [ContentCollection]
---

# ContentCollectionColsResponsive — `cols` per breakpoint

## Purpose

`cols={N}` (0.87.0) is one number: one column below `md`, N from `md`. On
the container ladder the `/stack` cards grew — three across a 1600/1800
container is wider than three across the old 1400. User, 2026-08-27: *"can
we make it 4 in the biggest breakpoint?"*

## Ask

`cols` also takes a breakpoint map: `cols={{ md: 3, xl: 4 }}` → one below
`md`, three from `md`, four from `xl` (literal classes per rung, same as the
single-number form). Number form unchanged.

## Consumer state

`/stack` passes `cols={3}` today; `cols={{ md: 3, xl: 4 }}` on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.89.0

cols takes a breakpoint map: cols={{ md: 3, xl: 4 }} → one column below md, three from md, four from xl (sm · md · lg · xl · 2xl, counts 1-6, literal classes per rung). Number form unchanged. Measured on the demo: 4 tracks at 1400, 3 at 1279 and 900, 1 at 390.

**Remainder here:** none — kol-website bump kol-component 0.89.0; /stack passes cols={{ md: 3, xl: 4 }}.

