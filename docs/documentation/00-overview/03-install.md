---
title: Installing KOL
type: reference
status: active
created: 2026-08-01
updated: 2026-10-01
description: What a consumer app must provide
tags:
  - domain/architecture
  - domain/app-shell
related:
  - "[[INDEX|overview]]"
---

# Installing KOL

The install lines, then the four-point consumer contract — what a host app has to give KOL for it to render.

## Install

The base every consumer takes: the theme, the icons and the components.

```bash
pnpm add @kolkrabbi/kol-theme @kolkrabbi/kol-icons @kolkrabbi/kol-component
```

```bash
npm install @kolkrabbi/kol-theme @kolkrabbi/kol-icons @kolkrabbi/kol-component
```

```bash
yarn add @kolkrabbi/kol-theme @kolkrabbi/kol-icons @kolkrabbi/kol-component
```

```bash
bun add @kolkrabbi/kol-theme @kolkrabbi/kol-icons @kolkrabbi/kol-component
```

Every other package installs the same way by its own name — each package's page carries its line.

## The contract

Packages ship **raw source** (`.jsx`/`.css`, no build step) — the consumer must be **Vite + Tailwind v4 + React 18/19**. The four-point contract every consumer follows:

1. **Cascade order is load-bearing:** `tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Never reorder. **Two theme entries** (theme ≥0.77.0, FullConsumptionContract): `@kolkrabbi/kol-theme` is the umbrella, every pack; `@kolkrabbi/kol-theme/core` is the app tier alone (tokens → type → utilities → atoms → molecules → organisms → shell) — an app that renders no chessboard, docs shell, specimen, dashboard or brand guide takes `/core` and drops 23 % of the theme; a domain pack it does render imports after it, `layer(components)`. (`kol-framework.css` was required by the shell for 0.13–0.15, while its rail was a `SideNav`; from **shell 0.16.0** the rail is flat again and the theme alone is enough. A site-register app still imports the framework sheet.)
2. **`@source` the package sources** — Tailwind skips `node_modules`, so add `@source "../node_modules/@kolkrabbi/kol-*/src"` to your CSS or component-internal utilities never generate. One line per installed UI package (ten ship utility JSX — everything except `kol-theme`); the canonical copy-pasteable block is in the root `README.md`. This contract is permanent by decision (2026-07-09) — packages will **not** compile their own utilities (see ARCHITECTURE §4).
3. **One React** — dedupe react/react-dom (workspace hoisting can leave two copies → hook dispatcher errors).
4. **Fonts are yours to serve** — theme CSS references brand fonts at absolute `/fonts/…`; the packages don't bundle font files.
