---
component: ParamBindDot — the small dot beside a param row that shows it is bound (modulated) and opens a menu
source: kol-fxr `params/BindDot.jsx`
staged: 2026-10-31
status: draft
deps: []
---

# ParamBindDot

## Purpose
The user, 2026-10-31 (kol-fxr plan 51 W4): *"I mainly want to know what is local o do the audit and report what you find"* · *"I would like things to look the same, so if we can do that and swap for DS then Im good."* fxr audited its 28 rail sections against KOL; this is one of the pieces with no KOL part.

Where it lives today: kol-fxr `params/BindDot.jsx` — a raw `<button>` dot + PopoverPanel menu beside every animatable row.

## Asked
- `bound`, `mode` label, a menu of actions (`items: [{ label, onClick }]`), states at rest / hover / bound (accent), on the control ramp; sits in a SettingsRow's trailing slot.

## Recreation notes
- Acceptance (fxr's): fxr's BindDot renders it; 0 raw `<button>` in `params/`.

## 🟠 BUILT — 2026-10-31 · awaiting publish

`ParamBindDot`, a new molecule on `Menu` (kol-component, unreleased): `bound` (accent fill + ring), `mode` (tooltip "Bound · <mode>" and the accessible name), `items` (every Menu row key — `{ label, onClick, checked }`…), `label`, `tooltip`, `size` (hit box a field's height: xs 22 · sm 26 · md 32), `align`, `minWidth`. Rest: a hollow oq-48 ring; hover and open: oq-80.

Not published (npm blocked this session); kol-component needs a minor publish, then this closes with the version cited.

**Remainder at kol-fxr:** bump kol-component when published; BindDot renders `ParamBindDot` (its entries as `items`, `checked` on the current mode), 0 raw `<button>` in `params/`.


## ✅ RESOLUTION — 2026-10-31

Published in **@kolkrabbi/kol-component@0.330.0** (live on the registry; checked once in the published tarball): `ParamBindDot` (molecule on Menu) exported. Closed on the build above, purpose served.

**Remainder at kol-fxr:** bump kol-component to ≥0.330.0; BindDot renders `ParamBindDot` (its entries as `items`, `checked` on the current mode), 0 raw `<button>` in `params/`.
