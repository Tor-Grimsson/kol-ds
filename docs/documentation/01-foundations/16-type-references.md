---
title: Type references
type: reference
status: draft
created: 2026-11-14
updated: 2026-11-14
description: How Material, Atlassian, Tailwind and Carbon build their type scales, next to KOL's ramp
aliases:
  - type-references
covers:
  - each system's roles, sizes, line heights and tracking
  - the practices they share
  - what KOL takes from them
sources:
  - https://material-web.dev/theming/typography
  - https://atlassian.design/foundations/typography
  - https://tailwindcss.com/docs/font-size
  - https://carbondesignsystem.com/elements/typography/type-sets/
tags:
  - domain/tokens
related:
  - "[[15-type-ramp|type ramp]]"
---

# Type references

Gathered 2026-11-14 from a quick web search. Some values came from secondary sources (noted); check the official pages
before any value becomes a token.

| System | Roles | Range | Line height | Tracking | Notes |
|---|---|---|---|---|---|
| Material 3 | Display, Headline, Title, Body, Label, each Large / Medium / Small (15 styles, plus 15 emphasized) | 11 to 57 | per style, e.g. label medium 12/16, body large 16/24, display large 57/64 | per style: +0.5px on small labels and body, −0.25px on display large | weight lives in the style, not separate |
| Atlassian | Heading xxsmall to xlarge, Body small to large | 12 to 28 for headings (secondary source) | equals size + 4 to 8 at heading sizes, e.g. 28/32, 16/20 | — | rem, 16px base; headings no larger than twice the body size; 16px minimum for long reading |
| Tailwind | text-xs to text-9xl | 12 to 128 | 16/12 (133%) at xs, falling to exactly 1 (100%) from text-5xl (48px) up | none in the scale | each size carries its own line-height token (v4); no fluid sizing by default; mobile-first breakpoint prefixes |
| Carbon (IBM) | productive set (product UI) and expressive set (marketing, editorial) | from 12, one recursive formula: 12, 14, 16 … | e.g. body-01 14/20, heading-06 42/50 | — | productive base 14px, fixed headings; expressive base 16px, headings change by breakpoint (fluid) |

## Shared practice

- **Line height falls as size rises.** About 130–150% at text sizes, down to 100% or just under at display (Tailwind
  sets 1 from 48px up).
- **Tracking:** slightly positive at small sizes, negative at large ones (Material +0.5px on small, −0.25px on display).
- **rem on a 16px base** for sizes and line heights (Atlassian, Tailwind).
- **Two sets from one scale:** a compact set for product UI and a roomier set for reading and marketing (Carbon's
  productive and expressive) — the same split as KOL's UI set and website/blog sets.
- **Fixed scale, breakpoint switching:** Tailwind and Carbon's productive set do not scale fluidly; a style picks a
  different size per breakpoint.

## What KOL takes

- The ramp holds size, line height and tracking only; weight stays in the style. Material bakes weight into the style
  too, so this matches.
- Line height and tracking as percentages of size (the curves in [[15-type-ramp|the type ramp]]'s formulas), shown in
  px, % and rem.
- The upper range to 128 (Tailwind's text-9xl) and a 6px floor below everyone's smallest (11–12px): the ramp covers
  everything, use is the style's call.
