---
title: Foundations — the token system
type: reference
status: active
updated: 2026-07-15
description: The token foundation every KOL component is built from — the 14-stop opacity scale (the signature), semantic foregrounds, surface tiers, radii, and shadows.
aliases:
  - foundations
  - tokens
sources:
  - packages/theme/kol-opacity.css
  - packages/theme/kol-color.css
  - showcase/src/lib/tokens.js
tags:
  - domain/design-system
  - domain/color
related:
  - "[[02-color|color]]"
  - "[[03-typography|typography]]"
  - "[[04-layout-breakpoints|layout & breakpoints]]"
---

# Foundations — the token system

KOL's foundation is **translucent ink over surfaces**, not flat fg/bg pairs. Everything below renders live on the showcase's `/foundations` page — that page reads the installed theme at runtime and is always the truth; this doc is the portable summary.

## The opacity scale (the signature)

A 14-stop translucent foreground scale — `--kol-fg-01 … --kol-fg-96` — ink at increasing opacity over whatever surface it sits on. Both themes contrast-flip automatically because every consumer of `fg-*` derives from the surface ink.

```
01 02 04 08 12 16 24 32 40 48 64 80 88 96
```

Used everywhere: borders (`border-fg-08`), dividers, washes, dimmed text. Utilities: `text-fg-*`, `bg-fg-*`, `border-fg-*`. The `fg-absolute-*` variants are theme-invariant black — for overlays that must read on any thumbnail.

**Opaque neutrals (`--kol-oq-*`)** are the married solid mirror of the same 14 stops (`kol-opaque.css`) — ink mixed into the surface instead of into transparent, plus an `oq-inverse-*` twin. Since 2026-07-08 the rule is: **interactive fills (button/tag/switch states, anything that can sit over media) use `oq`; decoration that always sits on a panel (dividers, table washes) keeps `fg`.** `--kol-accent-primary-strong` is likewise an opaque accent mix now, not a transparency.

## Semantic foregrounds

| Token | Role |
|---|---|
| `--kol-fg-emphasis` | Highest-contrast text (headings, active states) |
| `--kol-fg-strong` | Strong values, filled text |
| `--kol-fg-body` | Body copy |
| `--kol-fg-meta` | Secondary/metadata text |
| `--kol-fg-subtle` | Least-emphasis text |

## Surface tiers

| Token | Dark | Light |
|---|---|---|
| `--kol-surface-primary` | `#121215` | `#FAFAFA` |
| `--kol-surface-secondary` | `#19191D` | — |
| `--kol-surface-tertiary` | `#0E0E11` | — |
| `--kol-surface-inverse` | `#FCFBF8` | `#0E0E11` |

Each tier pairs with an `--kol-surface-on-*` ink. Theme switching is `data-theme` on `<html>`; **light is the boot default** on the showcase.

## Radius & shadow scales

- Radii: `--kol-radius-{none,sm,md,lg,xl,2xl,full}` — components reference these, never hardcoded corners.
- Shadows: `--kol-shadow-{sm,md,lg,xl,inner}`.

## UI state colors

`--ui-error` / `--ui-warning` / `--ui-info` / `--ui-success` — theme-tuned pairs (dark and light values differ; see `kol-color.css`).

## Hyperlinks (2026-07-15)

`--kol-link` / `--kol-link-hover` — the one text role with its own color, theme-tuned (blue-600/700 light · blue-400/300 dark, same family as `--ui-info`). A base `a {}` rule in `kol-color.css` applies it to unstyled anchors; it sits in the components layer, so utilities and later chrome sheets (framework, brand) always win. `.kol-table a` consumes the same tokens. Added for the chess consumer audit (finding 3: links rendered as body ink — no token, no rule, and `--kol-accent-primary` resolves to ink in the neutral theme).
