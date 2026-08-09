---
title: Installing KOL
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: What a consumer app must provide
tags:
  - domain/architecture
  - audience/consumer
related:
  - "[[INDEX|overview]]"
---

# Installing KOL

The four-point consumer contract — what a host app has to give KOL for it to render.

Packages ship **raw source** (`.jsx`/`.css`, no build step) — the consumer must be **Vite + Tailwind v4 + React 18/19**. The four-point contract every consumer follows:

1. **Cascade order is load-bearing:** `tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Never reorder.
2. **`@source` the package sources** — Tailwind skips `node_modules`, so add `@source "../node_modules/@kolkrabbi/kol-*/src"` to your CSS or component-internal utilities never generate. One line per installed UI package (ten ship utility JSX — everything except `kol-theme`); the canonical copy-pasteable block is in the root `README.md`. This contract is permanent by decision (2026-07-09) — packages will **not** compile their own utilities (see ARCHITECTURE §4).
3. **One React** — dedupe react/react-dom (workspace hoisting can leave two copies → hook dispatcher errors).
4. **Fonts are yours to serve** — theme CSS references brand fonts at absolute `/fonts/…`; the packages don't bundle font files.
