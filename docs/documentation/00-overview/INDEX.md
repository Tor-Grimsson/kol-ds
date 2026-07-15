---
title: KOL design system — overview
type: reference
status: active
updated: 2026-07-10
description: What KOL is — the tiers, the eleven UI packages (full map in the package topology), how consumers install it, and the four-point consumer contract. Start here.
aliases:
  - overview
  - kol-overview
tags:
  - domain/design-system
related:
  - "[[../../operations/SHIPPED-PACKAGES|shipped packages]]"
  - "[[01-package-topology|package topology]]"
  - "[architecture decisions](../../../.kol/llm-context/ARCHITECTURE.md)"
  - "[[../03-components/01-inventory|components]]"
  - "[[../../operations/01-release-pipeline|release pipeline]]"
---

# KOL design system — overview

**KOL (Kolkrabbi)** is a source-available React design system for design-tool UI — inspectors, color/transparency controls, icon and graphic loaders, and an opacity-token foundation. This repo **maintains** it, **hosts** it on npm, and **showcases** it (the localhost docs site). These markdown docs are the written mirror of the showcase.

## The tiers

| Tier | Packages | Job |
|---|---|---|
| **UI** (11) | foundation `kol-theme` · `kol-icons`; core `kol-component` · `kol-framework`; + 7 domain packages (workshop · dashboards · chess · content · foundry · store · styleguide) | see [[01-package-topology]] |
| **Clients** | `kol-media-client` | Headless service SDKs — one package per service contract |
| **Brand kit** | `kol-brand-template` · `kol-brand` | The brand-manifest schema + conforming data packages |
| **Tools** | `kol-scrape` | CLIs (presence/catalog scraper) |

The UI dependency arrow only points left — no reverse deps, ever. Clients/brand/tools have no deps on or from the UI packages.

## The packages

**The full 15-package list with current versions lives at [[../../operations/SHIPPED-PACKAGES|SHIPPED PACKAGES]]** — the one canonical table. The seven standalone **domain** packages (workshop, dashboards, chess, content, foundry, store, styleguide) are mapped in [[01-package-topology]]. The foundation, core, and non-UI packages:

| Package | What it is |
|---|---|
| `@kolkrabbi/kol-theme` | CSS only: tokens, typography classes, component chrome (`.kol-btn*`, `.kol-seg*`, `.kol-prose`) |
| `@kolkrabbi/kol-icons` | `<Icon>` (stroke + solid cuts, async data chunk) + keys-only inventories |
| `@kolkrabbi/kol-component` | The components — atoms → molecules → organisms + `<Graphic>` |
| `@kolkrabbi/kol-framework` | App shell: `AppShell`, `SideNav`, `Layout`, heroes, footer, `ThemeToggle` |
| `@kolkrabbi/kol-media-client` | Read-only client for the kol-media CDN |
| `@kolkrabbi/kol-brand-template` | Brand manifest schema + house defaults + CSS generator + placeholder slate + scrape adapter |
| `@kolkrabbi/kol-brand` | Kolkrabbi's own brand manifest (ramps, type, the four logo SVGs) |
| `@kolkrabbi/kol-scrape` | Zero-dep scraper CLI — presence records + Squarespace catalog mode |

## Install & the consumer contract

Packages ship **raw source** (`.jsx`/`.css`, no build step) — the consumer must be **Vite + Tailwind v4 + React 18/19**. The four-point contract every consumer follows:

1. **Cascade order is load-bearing:** `tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Never reorder.
2. **`@source` the package sources** — Tailwind skips `node_modules`, so add `@source "../node_modules/@kolkrabbi/kol-*/src"` to your CSS or component-internal utilities never generate. One line per installed UI package (ten ship utility JSX — everything except `kol-theme`); the canonical copy-pasteable block is in the root `README.md`. This contract is permanent by decision (2026-07-09) — packages will **not** compile their own utilities (see ARCHITECTURE §4).
3. **One React** — dedupe react/react-dom (workspace hoisting can leave two copies → hook dispatcher errors).
4. **Fonts are yours to serve** — theme CSS references brand fonts at absolute `/fonts/…`; the packages don't bundle font files.

## Seeing it

- **Showcase** (`pnpm dev` in `showcase/`) — the docs site: Foundations, Icons, Components, Blocks, Sets.
- **Workbench** (`pnpm workbench`) — Ladle app, every component × every state in isolation. See [[../../operations/02-workbench|using the workbench]].
