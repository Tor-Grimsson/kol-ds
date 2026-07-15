---
title: Type classes — the two families and when to use which
type: reference
status: active
updated: 2026-07-15
description: The kol type-class inventory split by its real fault line — line-height-bearing sets for anything that can wrap vs the line-height-1 helper scale for single-line chrome — with the full class table and the 2026-07-02 conformance conversions as worked examples.
aliases:
  - type-classes
sources:
  - packages/theme/kol-type-mono-classes.css
  - packages/theme/kol-typography.css
tags:
  - domain/design-system
  - domain/typography
related:
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[../03-components/02-placement|component placement]]"
---

# Type classes — the two families and when to use which

Every piece of text in a KOL component uses a `kol-*` type class — never freestyle Tailwind sizing (`text-sm`, `text-[13px]`). The inventory splits on one fault line: **does the class carry a line-height?**

## The fault line

| Family | Line-height | Use for |
|---|---|---|
| **Helper scale** `kol-helper-*` | `1` (none) | **Single-line chrome only**: menu rows, labels, chips, badges, value readouts, chevrons/affordance glyphs, label/value pairs. Text that wraps in a `line-height: 1` class sets solid — never give a helper class to anything that *can* wrap. |
| **Line-height-bearing sets** `kol-mono-*`, `kol-sans-body-*`, `kol-sans-heading-*`, `kol-sans-display-*` | 12–26px / 100–160% | Anything that can run to more than one line: paragraphs, descriptions, notes, multi-word labels in narrow containers — and all headings/display type. |

The quick test: *can this string ever wrap?* Yes → line-height set. No (structurally single-line) → helper.

## Inventory

### Helper scale — mono, weight 500, `line-height: 1`, letter-spaced

| Class | Size | Letter-spacing |
|---|---|---|
| `kol-helper-8` | 8px | 0.10em |
| `kol-helper-10` | 10px | 0.10em |
| `kol-helper-12` | 12px | 0.06em |
| `kol-helper-14` | 14px | 0.06em |
| `kol-helper-16` | 16px | 0.06em |
| `kol-helper-20` | 20px | 0.06em |

Beyond the missing leading, helpers differ from mono in **weight (500 vs 400)** and **letter-spacing** — they're labels, not copy.

### Mono scale — mono, weight 400, with leading

| Class | Size / LH |
|---|---|
| `kol-mono-8` | 8 / 12px |
| `kol-mono-10` | 10 / 14px |
| `kol-mono-12` | 12 / 16px |
| `kol-mono-14` | 14 / 18px |
| `kol-mono-16` | 16 / 22px |
| `kol-mono-20` | 20 / 26px |

### Sans sets — tokens, with leading

| Class | Size (desktop base) | LH | Family / weight |
|---|---|---|---|
| `kol-sans-display-01/02` | 56 / 44px | 100% | sans-narrow 600 |
| `kol-sans-heading-01` | 48px | 110% | sans-narrow 500 |
| `kol-sans-heading-02/03/04/05` | 40 / 32 / 24 / 20px | 110/120/100/125% | sans-compact 500 |
| `kol-sans-body-01/02/03` | 16 / 14 / 12px | 160/160/150% | sans 400 |

(`display-03`, `heading-06` tokens exist; classes deferred until a consumer needs them. Sizes step up at the responsive breakpoint — see `kol-typography.css`.)

## Worked examples — the 2026-07-02 conformance sweep

| Component | Was | Now | Call |
|---|---|---|---|
| Avatar initials | `text-xs/sm/base/3xl` | `kol-helper-12/14/16/20` | Single glyph = single-line → helper. **`xl` dropped 30→20px** (largest helper stop). |
| ToggleCheckbox / ToggleSwitch hint | `text-[10px]` | `kol-helper-10` | Inline single-line hint; keeps its `tracking-normal` de-emphasis override. |
| Accordion chevron | `font-mono text-[18px]` | `kol-helper-16` | Affordance glyph; 18px sits between stops, took the tighter one. |
| SideNav collapse button | `text-[14px] leading-none` | `kol-helper-14` | `leading-none` was hand-rolling what helper already is. |
| AssetPlaceholder note | `text-[12px]` | `kol-helper-12` | "missing" — structurally single-line. |
| AssetPlaceholder label | `text-[12px]` | `kol-mono-12` | `category · name` **can wrap** in a narrow tile → the wrapping side of the fault line. |

## Enforcement

`pnpm extract:docs` reports any component source using freestyle Tailwind type utilities (`text-xs…xl`, `text-[Npx]`, `font-sans/serif`) — currently clean. Each component page also lists its type classes in the **Type styles** row, mined from source.

## Prose color contract (2026-07-15)

`.kol-prose` maps onto the kol-opacity **text roles**, not raw `fg-*` stops — body copy at `--kol-fg-body` (64), `em` climbs to `--kol-fg-strong` (80, italic), `strong` and all headings land on `--kol-fg-emphasis` (full ink); captions/cites sit at `--kol-fg-meta` (48). Edit the role token, every prose consumer follows. Raw stops remain only where a role has no business meaning (blockquote border `fg-32`, code wash `fg-04`).
