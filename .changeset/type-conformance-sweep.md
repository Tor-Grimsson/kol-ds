---
"@kolkrabbi/kol-component": patch
"@kolkrabbi/kol-framework": patch
---

Type-conformance sweep: freestyle Tailwind text sizing replaced with kol type classes throughout component source (rule: helper scale for single-line chrome, line-height-bearing sets for anything that wraps — see docs/typography/01-type-classes.md). Avatar initials now ride the helper scale (`xl` drops 30→20px, the largest helper stop); ToggleCheckbox/ToggleSwitch hints → `kol-helper-10`; Accordion chevron → `kol-helper-16`; SideNav collapse glyph → `kol-helper-14`; AssetPlaceholder note → `kol-helper-12`, its wrappable label → `kol-mono-12`.
