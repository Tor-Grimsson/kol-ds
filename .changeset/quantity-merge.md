---
"@kolkrabbi/kol-component": minor
---

Merge QuantityStepper into QuantityInput (taxonomy audit, Phase 4). The two were near-identical (same responsive sizing, same `(value) => onChange` contract) and differed only in button layout. QuantityInput gains a `controls` prop:

- `controls="chevron"` (default) — the existing look; value + a stacked up/down chevron pair. Existing QuantityInput call-sites are unaffected.
- `controls="split"` — the former QuantityStepper: a `− value +` pill.

**Breaking (0.x):** the `QuantityStepper` export is removed — replace `<QuantityStepper … />` with `<QuantityInput controls="split" … />`. There were no non-demo consumers.
