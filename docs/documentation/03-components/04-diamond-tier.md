---
title: Diamond Tier — the battle-tested components
type: reference
status: active
updated: 2026-07-08
verified: 2026-07-08
description: Components with 4+ hours of real build/debug investment — the proven exemplars whose patterns carry the most truth when authoring a new component.
aliases:
  - diamond-tier
  - diamond
tags:
  - domain/design-system
sources:
  - .kol/llm-context/session-log
  - .kol/llm-context/backlog/2026-07-08-button-chrome-audit.md
related:
  - "[[01-inventory|component inventory]]"
  - "[[00-taxonomy|component taxonomy]]"
  - "[[05-control-chrome|control chrome law]]"
---

# Diamond Tier — the battle-tested components

Some components have absorbed hours of real debugging; most have not. When you author a **new** component, copy the patterns from a Diamond-tier one — they carry the most truth, because they were forged against actual bugs, real consumer usage, and live review, not written once and left. This registry names them so nobody reinvents a solved problem from a shallow example.

**The bar: 4+ hours of build/debug work on the component itself.** Not incidental mentions — a component can appear in dozens of session logs purely as *showcase usage* (a demo, a benchmark row, a sidebar entry) without a single hour spent on its own code. Those don't count. See *Methodology* below.

## The registry

| Component | Tier | What earned it | The pattern to copy | Provenance |
|---|---|---|---|---|
| **Button** | atom | The chrome-law origin. Root-caused the "vanishes on hover" bug, rebuilt every state on the `oq` tier, added focus/active/pressed, fixed the dead `selected` prop (F6). | The full state model (rest/hover/active/pressed/focus/disabled) on `oq-*`; two-variant + size-scale contract; `selected` as an alias of `pressed`. | [[05-control-chrome\|chrome law]] · `btn-hover-touch-guard`, `btn-selected-alias-pressed` · audit ledger · 16 logs |
| **Textarea** | atom | The resize-grip saga — three icon iterations, a real 2-axis JS drag handle, `non-scaling-stroke`, the double-padding cascade fix, Firefox grip constraints. | A JS corner-drag handle with native `resize` off; `vector-effect: non-scaling-stroke` on a small icon; control-chrome outline alias. | `icon-resize-grip`, `chrome-law-controls` · 2026-07-08 handoff |
| **Input** | atom | Controlled/uncontrolled fix, ghost→outline fold, chrome law, double-padding. | Controlled-input discipline; `.kol-control` chrome; `ghost`→`outline` alias. | `input-uncontrolled-fix`, `chrome-law-controls` · 7 logs |
| **Dropdown** | molecule | Chrome-law rewrite — trigger emits shared `kol-btn` classes, open state fused with the panel, inline-style chrome deleted, aliases mapped. | Emitting `kol-btn kol-btn-{variant} kol-btn-{size}` from a non-`<button>` trigger; fused open state. | `chrome-law-controls` |
| **SegmentedToggle** | molecule | Chrome + full size alignment to Button (sm/md/lg pixel-matched), sm/md rescale, `radiogroup` a11y. | Padding-driven sizing that pixel-matches the button scale (26/32/40); `radiogroup`/`radio` + arrow keys + focus-visible. | `segmented-toggle-button-sizes`, `segmented-toggle-chrome` · 8 logs |
| **ToggleSwitch** | atom | Full rewrite — bare by default, optional primary/outline shells at button geometry, size prop, track scaling, auto-uppercase removed. | Bare-by-default control with optional variant shells; no-auto-casing on labels. | `chrome-law-controls` · 2026-07-08 handoff |
| **Icon** + loader | loader | The heaviest ecosystem arc — curated `kol-icon-set-v1` (107 icons), a Tier-1 cull, `registerIcons()` BYO, the resolution chain, a published major, an `npx kol-icons audit` bin. | `registerIcons()` bring-your-own; custom → v1 → legacy resolution; the lobby-up promotion loop. | `kol-icon-set-v1-loader-byo-lobby` + ~6 icon logs · `icons-register-byo` |

## Methodology

**How hours are estimated.** Session logs, the button-chrome audit ledger, and the changeset history — not raw log-mention counts. A grep of the session logs ranks `Icon`, `Table`, and `Card` near the top, but most of those hits are the components appearing *inside* showcase demos, the shadcn benchmark, blocks, and sidebar rendering — usage, not build. `Table` and `Card` have **zero** hours of dedicated component work and are **not** Diamond despite 13 and 8 log appearances. Conversely `Textarea`, `Dropdown`, and `ToggleSwitch` are undercounted by grep (2 logs each) because their heavy 2026-07-08 chrome-law rewrite has no session log yet — the audit ledger and the handoff carry it.

**How a component earns Diamond.** 4+ hours of build/debug on its own code — root-causing a bug, a rewrite, a multi-iteration design loop, or sustained multi-session refinement. Showcase demos, benchmark rows, and story backfill never count.

**Watch list — approaching, not yet in.**

| Component | Where it stands |
|---|---|
| **Menu family** (MenuItem/MenuPopover) | floating-ui unification + a standards page; ~3h, close. |
| **Slider** | minimal-only collapse (2026-07-08) fixed the phantom-`minimal` bug + killed two variants; ~2h cumulative. |

## Maintenance

**This doc is maintained on standing user command.** When a component crosses the 4-hour bar — after a bug root-cause, a rewrite, or a sustained refinement arc — add it here in the same turn, with the pattern it now proves and its provenance (logs / ledgers / changesets). Promote from the watch list when it qualifies. Never seed from raw mention counts; weigh actual build/debug work.
