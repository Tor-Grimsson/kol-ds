---
title: Type ramp
type: reference
status: draft
created: 2026-11-14
updated: 2026-11-14
description: The size ramp, the styles built on it, and the reading styles that use them
aliases:
  - type-ramp
  - size-ramp
covers:
  - the five rows and their steps
  - size and line height per step
  - tracking and weights, which belong to the font
  - ramp, style and set, defined
  - the three reading styles (MarkdownPage variants) the sets serve
sources:
  - packages/framework/src/MarkdownPage.jsx
  - packages/framework/src/markdownVariants.js
  - "Figma: ○ type--kol-ds-ui mmBE8t8EcxSdN7g4bUeHok, frame 1:3828 (UI font options)"
tags:
  - domain/tokens
related:
  - "[[03-typography|type classes]]"
  - "[[12-typography-lookup|type lookup]]"
  - "[[16-type-references|type references]]"
  - "[[17-type-sets|type sets]]"
---

# Type ramp

Draft 2 (2026-11-14). A ramp is the ordered list of steps, and each step is a **size and a line height**. Nothing else:
tracking, weight, font and case are not in the ramp. Tracking and the weight set belong to the **font** (each font carries
its own tracking per size and offers its own weights; switch the font and both follow). A text style is one step plus one
weight and one font, paired by each purpose set (article, site, research, and UI later).

Text, Utility and Label share one list of 12 sizes and differ only in line height: Text reads (about 140–150%), Utility
sits at 100% with vertical trim cap height to baseline (CSS `text-box: trim-both cap alphabetic`) and stays on one line,
Label runs about 130%. Display and Heading fall toward and below 100% as they grow.

| Row | Step | Size px | Size rem | Line height px | Line height % |
|---|---|---|---|---|---|
| Display | D1 | 128 | 8 | 116 | 91% |
| Display | D2 | 112 | 7 | 104 | 93% |
| Display | D3 | 96 | 6 | 90 | 94% |
| Display | D4 | 80 | 5 | 76 | 95% |
| Display | D5 | 72 | 4.5 | 70 | 97% |
| Display | D6 | 64 | 4 | 64 | 100% |
| Heading | H1 | 56 | 3.5 | 56 | 100% |
| Heading | H2 | 48 | 3 | 50 | 104% |
| Heading | H3 | 40 | 2.5 | 44 | 110% |
| Heading | H4 | 36 | 2.25 | 40 | 111% |
| Heading | H5 | 32 | 2 | 36 | 112% |
| Heading | H6 | 28 | 1.75 | 32 | 114% |
| Text | T1 | 24 | 1.5 | 34 | 142% |
| Text | T2 | 20 | 1.25 | 30 | 150% |
| Text | T3 | 18 | 1.125 | 27 | 150% |
| Text | T4 | 16 | 1 | 24 | 150% |
| Text | T5 | 14 | 0.875 | 20 | 143% |
| Text | T6 | 12 | 0.75 | 18 | 150% |
| Text | T7 | 11 | 0.6875 | 16 | 145% |
| Text | T8 | 10 | 0.625 | 15 | 150% |
| Text | T9 | 9 | 0.5625 | 14 | 156% |
| Text | T10 | 8 | 0.5 | 12 | 150% |
| Text | T11 | 7 | 0.4375 | 11 | 157% |
| Text | T12 | 6 | 0.375 | 9 | 150% |
| Utility | U1 | 24 | 1.5 | 24 | 100% |
| Utility | U2 | 20 | 1.25 | 20 | 100% |
| Utility | U3 | 18 | 1.125 | 18 | 100% |
| Utility | U4 | 16 | 1 | 16 | 100% |
| Utility | U5 | 14 | 0.875 | 14 | 100% |
| Utility | U6 | 12 | 0.75 | 12 | 100% |
| Utility | U7 | 11 | 0.6875 | 11 | 100% |
| Utility | U8 | 10 | 0.625 | 10 | 100% |
| Utility | U9 | 9 | 0.5625 | 9 | 100% |
| Utility | U10 | 8 | 0.5 | 8 | 100% |
| Utility | U11 | 7 | 0.4375 | 7 | 100% |
| Utility | U12 | 6 | 0.375 | 6 | 100% |
| Label | L1 | 24 | 1.5 | 32 | 133% |
| Label | L2 | 20 | 1.25 | 26 | 130% |
| Label | L3 | 18 | 1.125 | 24 | 133% |
| Label | L4 | 16 | 1 | 21 | 131% |
| Label | L5 | 14 | 0.875 | 18 | 129% |
| Label | L6 | 12 | 0.75 | 16 | 133% |
| Label | L7 | 11 | 0.6875 | 14 | 127% |
| Label | L8 | 10 | 0.625 | 13 | 130% |
| Label | L9 | 9 | 0.5625 | 12 | 133% |
| Label | L10 | 8 | 0.5 | 10 | 125% |
| Label | L11 | 7 | 0.4375 | 9 | 129% |
| Label | L12 | 6 | 0.375 | 8 | 133% |

Line heights are worked out from the formulas below; check them on the type-size-ramp sheet before they become tokens.

## Tracking — per font, not per step

| Font | Tracking | Status |
|---|---|---|
| Inter | the dynamic-metrics curve in the formulas below, per size | starting point; shown on the sheet by default |
| Special Gothic | its own curve | to set |
| JetBrains Mono | its own curve | to set |

## Guidelines — not rules

- The UI rarely needs text under 11px; the ramp goes to 6 so nothing is ever missing.
- UI headings usually stay at or under about 32px (twice a 16px body); the larger steps are for the website and brand.

## Ramp, style, set

| Word | Is | Is not |
|---|---|---|
| Ramp | the ordered steps; each step is a size and a line height | tracking, a font, a weight, a case |
| Style | one ramp step + one weight + one font (+ case) | a size of its own: a style always points to a step |
| Set | the list of styles one purpose uses: `article`, `site` and `research` (MarkdownPage's three variants, below), and UI later | a second ramp |

Fonts per role (2026-11-14): Special Gothic for display and headings, Inter for text, JetBrains Mono for labels.
A new style picks a step and joins a set; if no step fits, the ramp changes on purpose.

## The reading styles — MarkdownPage's three variants

The text sets serve one component: **`MarkdownPage`** (kol-framework), whose `variant` picks the reading style. The
styles live in `packages/framework/src/markdownVariants.js`, shared with kol-content's `PortableTextRenderer`.

| Variant | Is | Root class | Shown in |
|---|---|---|---|
| `research` (default) | the document sheet: a long document on the `.kol-sheet` style, with numbered paragraphs and footnotes | `.kol-sheet` | `apps/document` |
| `article` | the website article | `.kol-prose` | the website's articles |
| `site` | the brand-guide text style, on `SiteLayout` (not "the website"): page hero, chapter cards, one section per heading | `.kol-prose` in a page wash | brand pages |

"Document" in KOL names this sheet style (`apps/document`, `DocumentView`, `DocumentLibrary`), so it is not free
as a package name.

## Formulas — starting points, not the rule

Logged 2026-11-14 to build on, not to apply as they are.

| For | Formula | Gives |
|---|---|---|
| Tracking by size (Inter's published dynamic metrics) | tracking (em) = −0.0223 + 0.185 × e^(−0.1745 × size in px) | about +1% at 12px, −0.5% at 16, −2% at 24 and up |
| Line height by size | the ratio falls as size grows: about 140–150% for text, 115–120% for headings, 100–105% for display | leading that shrinks optically with size |
| Line height from 64px to 128px | headings and display dip below 100%, down to about 90–95% at the top of the range | tight display lockups; each step holds its own percentage, no extra prop |
