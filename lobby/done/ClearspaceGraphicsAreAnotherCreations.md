# `clearspace-*` graphics — the x layer is Another Creation's signature

**Staged:** 2026-10-14 · from a kol-website session (the brand pass)
**Change:** kol-component `GRAPHIC_RAW` — the `clearspace-logomark` / `-wordmark` / `-lockup-hori` / `-lockup-vert` graphics (`layers.grid` · `layers.x` · `layers.logo`), consumed by brand's `ClearspaceDiagram`

---

## The problem

brand.kolkrabbi.io `/brand#logos-types` showed Another Creation's signature over every Kolkrabbi
lockup (the user, 2026-10-09: "Logomark, wordmark and both lockups render Another Creation"). The
marks are fine — `KolLogo` renders `@kolkrabbi/kol-brand`'s SVGs. The ghost is the diagram's **`x`
layer**: a single path at `opacity="0.3"` (`M142.407 239.269C…` in the 288×288 logomark graphic,
`M188.407 207.269C…` in the 656×256 lockup) — a client's signature baked into the design system's
clearspace graphics.

kol-website turned `clearspace` off on the four lockup cards (`pages/brand/Lockups.jsx`) so the
page is Kolkrabbi again; the clearspace diagram is gone with it.

## Ask

The clearspace graphics carry the KOL marks (logomark · wordmark · the two lockups from kol-brand)
in the `logo` layer and an `x` layer that is the clearspace measure (the logomark's height, per
kol-brand's rule) — not a signature. Then brand turns `clearspace` back on.

## Nothing to decide

## CLOSED — 2026-10-14 · kol-component@0.260.0

The twelve `structure/diagram-{grid,x,logo}-{logomark,wordmark,lockup-hori,lockup-vert}` layers are Kolkrabbi's. `logo` is the mark from `@kolkrabbi/kol-brand`, verbatim, inside its clearspace. `x` is the unit — the logomark, ghosted at 0.3, filling each corner square — per kol-brand's rule that clearspace equals the logomark height on all sides (in the lockups the logomark is 128 tall, so the lockups scale by 64/128 and the wordmark alone by its size inside lockup-hori). `grid` is the frame, the margin lines and the four unit squares, stroked `currentColor`. All three layers of a variant share one viewBox; names unchanged, so `ClearspaceDiagram` needs no change. Verified stacked on dark and light (`_tmp/2026-10-14-clearspace-check/`). The old layers sit in `_tmp/2026-10-14-clearspace-another-creation/`.

Note: kol-brand's `kol-lockup-vert.svg` is a wide KOL · mark · KRABBI lockup (420×128, mark in the secondary red), not a vertical one; taken verbatim.
