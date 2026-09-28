---
title: Tokens
type: reference
status: active
created: 2026-06-15
updated: 2026-09-12
description: Custom properties the theme defines
tags:
  - domain/tokens
  - domain/design-system
---

# Tokens

Tokens are CSS custom properties on `:root`, prefixed `--fx-`.

## Colour tokens

| Token | Light | Dark |
|---|---|---|
| `--fx-surface` | `#ffffff` | `#111114` |
| `--fx-ink` | `#111114` | `#f2f2f2` |
| `--fx-accent` | `#e5b800` | `#ffd400` |

## Spacing tokens

A 4px ladder: `--fx-space-1` is 4px, `--fx-space-6` is 24px.

## Rules

- A component reads tokens, never raw values.
- A new token needs a doc row **before** it reaches code.
