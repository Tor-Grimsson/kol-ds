---
component: HubHome walkthrough (kol-shell)
source: kol-fxr / at 1600 (AppHub's HubHome, kol-shell 0.62.0) — `walkthrough={WALKTHROUGH(enter)}`
staged: 2026-10-09
status: draft
deps: [HubHome, FullscreenOverlay]
---

# HubWalkthroughEscape — the Hub's walkthrough carousel ignores Escape

## Purpose
kol-fxr's global audit (plan 21 § A, finding A5, re-checked with a real key press 2026-10-09): Home → *Walkthrough* opens the carousel (`1. Pick a chrome`, ‹ › arrows, ×, `1 / 2`); **Escape does nothing** — it closes only on its × or the footer's *Close*. Meanwhile the page behind it stays live (the rail expands, filters toggle, the search focuses — all under the carousel), so it looks modal and is not.

## Anatomy
```
HubHome
└─ walkthrough carousel (panel · ‹ › · × · page counter)   ← no key handling
```

## Variants
None.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | behaviour, no prop |

## Styling
Unchanged.

## States & interactions
Open → Escape closes (the same `onClose` the × calls); ← → page while open. If the carousel is meant to sit over a live page, the scrim should say so (none today) — otherwise it is a modal and should take the DS modal's Escape and scrim-tap.

## Dependencies
`HubHome` (kol-shell); the carousel is the Hub's own.

## Recreation notes
A kol-shell patch: a window `keydown` Escape → close while open (+ ← → paging). kol-fxr passes only the steps and needs nothing but the bump.


---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-shell@0.63.0`** (+ `kol-component@0.246.0`, which exports the overlay layer
stack — `pushLayer` · `popLayer` · `isTopLayer` — so a layer in another package joins the same one).
`WalkthroughPanel`: Escape calls `onClose`, ← → page; it joins the layer stack, so a sheet opened
above it takes the Escape first, and keys typed into a field are left alone. Kept non-modal: it is
an intro card over the catalog, not a dialog, so no scrim and the page stays live — say if that
should change. Walked on `apps/editor-hub` Home at 1600: open → → ← page, Escape closes, no errors.

For fxr: bump kol-shell to ^0.63.0 (it peers kol-component ≥0.246.0); nothing else.
