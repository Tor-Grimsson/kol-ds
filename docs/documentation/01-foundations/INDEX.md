---
title: Foundations
type: index
status: active
created: 2026-08-01
updated: 2026-09-03
description: The values every component is built from
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[../INDEX|KOL documentation]]"
---

# Foundations

The layer everything else cites — tokens, colour, type, layout. If a component improvises a value, this is the chapter it failed to read.

Pages come in pairs where a subject has one: the **page** explains, the
**lookup** is the table of values you scan. Lookups are generated from the theme
CSS (`pnpm lookups`) — never hand-edit one.

| Page | Lookup | What it holds |
|---|---|---|
| [[01-tokens\|Tokens]] | — | Surfaces, widths, radius, the z ladder |
| [[02-color\|Color]] | [[11-color-lookup\|Color lookup]] | Identity anchors, ramps, and every surface value |
| [[03-typography\|Type classes]] | [[12-typography-lookup\|Type lookup]] | The two families, and every class's real values |
| [[04-layout-breakpoints\|Layout & breakpoints]] | — | One shell frame, three inner caps, one rhythm |
| [[05-layout-systems\|Layout systems registry]] | — | Which system owns which width, and where |
| [[06-code-surface\|Code surface]] | — | Every surface that renders code, in one place |
| [[07-doc-card-sets\|Doc & card sets]] | — | Two theme-level type-role sets, one system |
| [[08-motion\|Motion]] | — | One sheet for every keyframe and motion class |
| [[09-sizes\|Sizes]] | [[09-size-lookup\|Size lookup]] | One height per size, and every family hits it |
| [[10-opacity\|Opacity]] | [[10-opacity-lookup\|Opacity lookup]] | Ink ladders, the eight roles, scrims |
| [[../03-components/05-control-chrome\|Control chrome · Tone]] | [[13-tone-lookup\|Tone lookup]] | The seven control tones, ordered by depth |
