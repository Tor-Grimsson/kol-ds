---
title: Breakpoint practices
type: reference
status: active
created: 2026-07-29
updated: 2026-08-01
description: Writing responsive code without inventing numbers
aliases:
  - responsive best practices
sources:
  - packages/theme/kol-theme.css
tags:
  - domain/layout
  - audience/consumer
related:
  - "[[INDEX|breakpoints]]"
  - "[[../../operations/06-workflows/07-device-testing|testing methods]]"
---

# Breakpoints — best practices

| # | Practice | Why |
|---|---|---|
| 1 | **Mobile-first, `min-width` only** — style the narrow case bare, add breakpoints upward | desktop-first `max-width` forks invert the cascade and breed overrides |
| 2 | **Never invent a width number** — every cap is a `--kol-content-*` token or nothing | six competing page caps is how the 2026-07-07 audit found the showcase |
| 3 | **Padding comes from the ramp tokens**, not Tailwind steps, on page containers | the token carries the responsive ramp; `p-4 md:p-8` forks it per page |
| 4 | **First grid break is `sm`**, never `md` | one canonical collapse point; `md`-first grids stay single-column too long |
| 5 | **Chrome reveals at `lg`, once** — nothing chrome-critical at `sm`/`md` | staggered reveals (the audit found four) make mid-widths incoherent |
| 6 | **Text measure is `65ch`, everywhere** | 52/58/60ch forks are the same drift in type clothing |
| 7 | **Full-bleed is a decision, not a default** — chess stage, block previews; everything else rides the shell | uncapped surfaces are where horizontal scroll bugs breed |
| 8 | **`@container` only for embedded product UI** (dashboard cards), with the ancestor declared | container queries without `container-type` silently never fire |
| 9 | **Don't copy workshop/** geometry into showcase code | those are verbatim-ported specimens with their own internal laws |
| 10 | **Verify at the breakpoints, not between them** — 640/768/1024/1280 + one mid-width sanity | bugs live at the seams; see [[../../operations/06-workflows/07-device-testing\|methods]] for the rig |
