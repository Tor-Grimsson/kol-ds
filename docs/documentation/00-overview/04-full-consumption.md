---
title: Full consumption
type: reference
status: active
created: 2026-08-27
updated: 2026-08-27
description: The six greps for full KOL consumption
aliases:
  - full-consumption
  - consuming-the-ds
tags:
  - domain/architecture
  - audience/consumer
related:
  - "[[03-install|install]]"
  - "[[01-package-topology|package topology]]"
  - "[[../01-foundations/01-tokens|tokens]]"
  - "[[../01-foundations/03-typography|type classes]]"
---

# Full consumption — how a repo knows it is on KOL

Six checks (FullConsumptionContract, kol-monitor 2026-08-27 — user: *"then DS can say … those who are fully consuming"*; it is a checklist, not a certificate). Run them from the consumer's root; **a repo is fully consuming when every one comes back empty.** Anything that comes back is the list of what is left.

| # | The check | The grep |
|---|---|---|
| 1 | **The app tier is installed and nothing more** — theme (`/core` unless a domain pack renders) · component · icons · framework / shell as the app needs; no domain pack (chess · workshop · foundry · dashboards · styleguide · content · store) the app does not render | `grep -E '"@kolkrabbi/kol-(chess\|workshop\|foundry\|dashboards\|styleguide\|content\|store)"' package.json` — every hit must be a pack the app renders |
| 2 | **Classes over tokens in JSX** — `var(--kol-*)` in JSX/TSX is a finding when a class exists (`bg-fg-12` · `text-fg-48` · `bg-oq-08` · `bg-surface-*` · `text-auto`); tokens belong in CSS rules (pseudo-elements, descendant selectors, gradients, animations) — `kol-opacity.css`'s own header | `grep -rn 'var(--kol-' src --include='*.jsx' --include='*.tsx'` |
| 3 | **`:root` bindings are the exception** — binding `--kol-accent-primary`, `--kol-media-focus`, `--kol-link`, `--kol-shell-page-wash` at the root is consuming correctly | `grep -rn ':root' src --include='*.css'` — these are fine; not a finding |
| 4 | **No local duplicate of a shipped component** — a thin seam is fine (a wrapper adding an `iconComponent`), a fork is not | `ls src/components/ui 2>/dev/null; grep -rln 'export default function \(Button\|Tag\|Dropdown\|Input\|Slider\|TiltCard\|BentoCard\|MediaCard\|ContentFilters\|ColumnBrowser\)' src` — every hit is a fork to retire onto the package |
| 5 | **No hand-rolled chrome the DS ships** — scrims, overlays, drawers, cards, filter rows, settings sections | `grep -rn 'rgba(0, *0, *0\|bg-black/\|z-\[[0-9]' src --include='*.jsx' --include='*.css'` — a scrim is `.kol-overlay-scrim`, an overlay is `FullscreenOverlay`, a z is on the `--kol-z-*` ladder |
| 6 | **Type on the fault line** — every string on a `kol-mono-*` / `kol-helper-*` / `kol-sans-*` class; no freestyle sizing | `grep -rn 'text-\(xs\|sm\|base\|lg\|xl\|2xl\|\[[0-9]*px\]\)\|font-\(sans\|serif\|mono\)' src --include='*.jsx'` |

Local CSS is the tell for 4 and 5 together: `wc -l src/**/*.css` — a consumer on KOL has imports and `:root` bindings, little else (kol-fxr's `index.css` is imports-only by its own rule; kol-monitor's rack tier carried 996 lines and 175 `var()` reads, and that is the list it works).

**Where a repo records it:** one line in its own `lobby/INDEX.md` history — *"full-consumption greps clean, YYYY-MM-DD"* — or the numbered leftovers as a ticket to itself. The DS keeps no roster.

**This repo runs it as a gate.** The showcase is a consumer too, and until 2026-09-02 it failed its own checks (a hand-rolled filter row on the Components catalog, a local SegGroup, inline `var(--kol-oq-08)`, a raw `z-[1]`, Tailwind's `font-mono`). `pnpm validate:consumption` (gate 26) runs checks 2 · 5 · 6 over `showcase/src/{pages,lib,nav}` on every `pnpm validate`; `demos/`, `sets/`, `blocks/` and `usage/` are exempt because showing raw code is their job. The clean run is recorded in `lobby/INDEX.md` history, 2026-09-02.
