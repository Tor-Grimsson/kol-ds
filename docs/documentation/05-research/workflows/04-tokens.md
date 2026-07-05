---
title: The token layer
type: reference
status: active
updated: 2026-06-26
description: Where design values live and what consumes them — Tailwind config vs. a separate token source of truth (W3C Design Tokens, Tokens Studio) transformed by Style Dictionary into many targets.
tags:
  - domain/design-system
  - domain/workflow
  - domain/tokens
aliases:
  - tokens
  - token-layer
related:
  - "[[INDEX|workflows]]"
---

# The token layer

**Design tokens** = the named design values — colors, spacing, radii, type scale, opacity. The workflow question is **where they live** and **what consumes them**.

## Two models

### A — values in the Tailwind config (the hand-rolled default)

Values live directly in `tailwind.config.js` (`theme.extend`), or, in **Tailwind v4**, in CSS via `@theme { --color-… }`. One source, one consumer: Tailwind.

- **Simplest.** No build step, no extra tooling.
- **Limit:** the values are **trapped inside the Tailwind setup**. Anything that isn't Tailwind — a Figma file, an iOS app, a docs site, raw CSS variables — can't read them without duplication.

Tailwind v4's CSS-first `@theme` softens this: tokens become **real CSS custom properties**, so anything that reads CSS variables can consume them natively. For a CSS-only / web-only system that's often enough.

### B — a separate token source of truth (the multi-target model)

Tokens live in their **own source**, independent of any framework, and a transform step generates each target.

```
tokens (JSON)  ──Style Dictionary──▶  tailwind config
                                  ├─▶  CSS variables
                                  ├─▶  iOS / Android
                                  └─▶  docs / Figma
```

- **One source feeds many targets** — the values aren't owned by Tailwind.
- Cost: a real pipeline (authoring format + transform + generated outputs to wire into the build).
- Worth it when you ship to **more than one platform** or want **design-tool ↔ code** parity. Overkill for a single web target.

## The pieces (model B)

| Piece | What it is |
|---|---|
| **W3C Design Tokens format** | The interoperable standard — tokens as JSON (`{ "color": { "brand": { "$value": "#…" } } }`), from the Design Tokens Community Group. The neutral source format. |
| **Tokens Studio** | Figma plugin — authors/edits tokens **inside Figma**, exports the JSON. Keeps design and code reading the same values. |
| **Style Dictionary** | The transform engine (originally Amazon). Reads token JSON → emits **platform-specific outputs**: CSS vars, Tailwind config/theme, SCSS, iOS, Android, JS. The "one source → many targets" workhorse. |

## How to read which model a system uses

- Values only in `tailwind.config` / `@theme`, web-only → **model A**. Fine until a second consumer appears.
- A `tokens/` folder of JSON + a `style-dictionary` build step + generated config → **model B**. Look for a `build:tokens` script and a *generated* (not hand-edited) Tailwind config.
