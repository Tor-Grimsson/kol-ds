---
component: ItemList — a reorderable list of rows: number · swatch · eye · name · inline control · actions, one row selected
source: kol-fxr `compose/inspectors/LayerRow.jsx`
staged: 2026-10-31
status: draft
deps: []
---

# ItemList

## Purpose
The user, 2026-10-31 (kol-fxr plan 51 W4): *"I mainly want to know what is local o do the audit and report what you find"* · *"I would like things to look the same, so if we can do that and swap for DS then Im good."* fxr audited its 28 rail sections against KOL; this is one of the pieces with no KOL part.

Where it lives today: kol-fxr `compose/inspectors/LayerRow.jsx` — the stopgap both Layers sections use (Soft forms' forms, Penrose's colour roles), ruled by the user 2026-10-31: *"I would like things to look the same, so if we can do that and swap for DS then Im good."* KOL's `LayerStack` is the editor's document-layers panel (types, blend, groups), too heavy here.

## Asked
- `items`, `selectedId`, `onSelect`; per row optional `swatch`, `shown` + `onToggleShown`, a `children` slot for an inline control, `actions: [{ icon, label, onClick, hidden }]` (a hidden action keeps its slot, never shows disabled); reorder by actions or drag; the control ramp's sizes.

## Recreation notes
- Acceptance (fxr's): both Layers sections import it; LayerRow retires to `_tmp/`.

## 🟠 BUILT — 2026-10-31 · awaiting publish

No new component: `StepList` (the numbered, hand-ordered list fxr's Morph tab already uses) is the shipped part, extended — rows take optional `swatch`, `shown` (an eye; `onToggleShown(i)`), `control` (an inline node after the name; the name narrows to w-20) and `actions` (`[{ icon, label, onClick, hidden }]`, a hidden one keeps its slot, never shows disabled). The whole row selects; reorder by grab, arrows or actions; `size` rides the control ramp. A plain list renders as before. Decided for review: extend over a second numbered list; the selection stays `activeIndex` (index, not id).

Not published (npm blocked this session); kol-component needs a minor publish, then this closes with the version cited.

**Remainder at kol-fxr:** bump kol-component when published; Soft forms' and Penrose's Layers sections render `StepList` with the row slots (`activeIndex = items.findIndex(id)`), LayerRow retires to `_tmp/`.


## ✅ RESOLUTION — 2026-10-31

Published in **@kolkrabbi/kol-component@0.330.0** (live on the registry; checked once in the published tarball): `StepList` row slots (`swatch` · `shown`/`onToggleShown` · `control` · `actions`). Closed on the build above, purpose served.

**Remainder at kol-fxr:** bump kol-component to ≥0.330.0; Soft forms' and Penrose's Layers sections render `StepList` with the row slots (`activeIndex = items.findIndex(id)`), LayerRow retires to `_tmp/`.
