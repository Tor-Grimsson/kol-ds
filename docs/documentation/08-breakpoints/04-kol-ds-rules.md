---
title: Breakpoints — KOL-DS rules
type: reference
status: active
updated: 2026-07-31
description: The responsive laws with teeth — ONE shell frame, four width tokens, one padding rhythm, one chrome reveal — plus the exemption list for verbatim-ported specimens.
aliases:
  - breakpoint rules
  - layout law
sources:
  - packages/theme/kol-theme.css
  - docs/documentation/01-foundations/04-layout-breakpoints.md
tags:
  - domain/design-system
  - domain/layout
related:
  - "[[INDEX|breakpoints]]"
  - "[[01-breakpoints|breakpoint values]]"
  - "[[../01-foundations/04-layout-breakpoints|layout law (foundations)]]"
  - "[[../01-foundations/05-layout-systems|layout systems registry]]"
---

# Breakpoints — KOL-DS rules

The laws. Born from the 2026-07-07 showcase audit (six competing page caps,
four staggered chrome reveals, three parallel breakpoint systems — never again).

| # | Law | Teeth |
|---|---|---|
| 1 | **ONE frame** — `--kol-content-shell` (1800) is THE outer container on every page; content left-anchored; rails outside the frame | no page invents a width; a new cap is a token PR, not a class |
| 2 | **Five width tokens only** — shell / **canvas** / panel / column / measure (`panel` added 2026-07-30 for tables/code/framed panels; `canvas` added 2026-07-31 for the page body inside the shell's main column); `page` + `wide` were killed at theme 0.11.22 and stay dead | width is content, not page identity — `canvas` names a content kind (a field of items), not a page identity |
| 3 | **Tailwind scale, min-width only** — sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536 | no custom px queries, no `max-width` queries in showcase-owned code |
| 4 | **One padding rhythm** — the framework ramp tokens (`--kol-pad-section-*`: x 20/32/48 · y 48/64/80) | no Tailwind padding steps on page containers |
| 5 | **One chrome reveal** — NavDrawer below `lg`, rails at `lg+`; TOC may enhance at `xl` | nothing chrome-critical reveals at `sm`/`md` |
| 6 | **Grid collapse is canonical** — first break `sm`; masonry 1/2/3/4; fixed-N only for tiny cells | see [[01-breakpoints\|values]] for the full table |
| 7 | **Measure 65ch, rails 256px** | no forks |

## Exemptions

`showcase/src/workshop/**` (shell, chess, dashboards) keep their internal
geometry (1800 shell cap, chess `max-width:1024` queries, `@container` steps).
They are specimens, not showcase chrome — do not conform them, do not copy
their patterns out.

## Enforcement

| Surface | Mechanism |
|---|---|
| Page containers | `max-w-[var(--kol-content-shell)]` + ramp padding |
| Doc pages | `DocLayout` `width="column"` (the `wide` boolean is a legacy alias) |
| Chrome CSS | `max-width: var(--kol-content-*)` in `packages/theme/*.css` |
| Embedded pages | `?embed=1` → chrome hosts unmount both rails (`showcase/src/lib/useEmbed.js`); the shell cap + padding ramp still apply. See [[../04-compositions/02-shells\|shells → embed mode]] |
