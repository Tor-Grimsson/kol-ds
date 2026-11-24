---
title: Type sets
type: reference
status: draft
created: 2026-11-14
updated: 2026-11-22
description: The article, site and research sets and the Folio reader, each role mapped to its step on the type ramp
aliases:
  - type-sets
covers:
  - every role each MarkdownPage variant renders
  - today's size, line height, weight and font per role
  - the ramp step each role takes, and the change that causes
sources:
  - packages/framework/src/markdownVariants.js
  - packages/framework/src/MarkdownPage.jsx
  - packages/theme/kol-typography.css
  - packages/theme/kol-type-roles.css
  - packages/theme/kol-type-folio-classes.css
tags:
  - domain/tokens
related:
  - "[[15-type-ramp|type ramp]]"
  - "[[03-typography|type classes]]"
---

# Type sets

Draft (2026-11-14). A set is the list of styles one purpose uses; each style points to a step on the
[[15-type-ramp|type ramp]]. The three sets are `MarkdownPage`'s variants: `article`, `site`, `research`.

The library's `↳ Typography` page shows the sets in two tiers:

| Tier | Sets | What it is |
|---|---|---|
| font sets | `sans`, `mono`, `serif`, `ui` | The whole 48-step ramp in one font (Special Gothic, JetBrains Mono, Malromur, Inter); weight is a variable mode. `ui` also lists the `card` and `float` styles, which are picks from its ramp |
| markdown sets | `article`, `site`, `research`, `folio`, `workshop` | The styles one `MarkdownPage` variant uses, with its own fonts |

The font sets are general and wide; a markdown set does not depend on them.

How a role gets its step: the step of the same size whose line height is nearest. When today's size is not on the ramp,
the nearest size; a tie goes to the larger. The Change column is what a reader would see: size first, then line height
(lh), in px. Size changes over 2px were put to him and ruled (below).

## article — `.kol-prose`

| Role | Today (size/lh, weight, font) | Step | Change |
|---|---|---|---|
| body | 16/24, 300, sans | T4 16/24 | none |
| list item | 16/24 | T4 16/24 | none |
| lede | 24/28, 400, sans compact | T1 24/34 | lh +6 |
| display (phone, desktop) | 56/56, 80/80, 500, sans narrow | H1 56/56, D4 80/76 | lh −4 at 80 |
| display md (phone, desktop) | 48/51, 64/68, 500, sans narrow | H2 48/50, D6 64/64 | lh −1, −4 |
| title (phone, desktop) | 44/47, 56/60, 500, sans narrow | H2 48/50, H1 56/56 | 44 is not a step: takes 48 (ruled); lh −4 at 56 |
| h1 (phone, tablet, desktop) | 48/52, 56/52, 64/52, 500, sans narrow | H2 48/50, H1 56/56, D6 64/64 | lh −2, +4, +12 |
| h2 | 32/40, 400, sans compact | H5 32/36 | lh −4 |
| h3 | 24/32, 400, sans compact | L1 24/32 | none |
| h4 | 20/28, 400, sans compact | T2 20/30 | lh +2 |
| h5 | 16/24, 500, sans compact | T4 16/24 | none |
| h6 | 16/24, 500, sans compact, uppercase | T4 16/24 | none |
| label | 12/16, 500, mono, uppercase | L6 12/16 | none |
| tagline | 14/16, 500, sans narrow, uppercase | L5 14/18 | lh +2 |
| quote | 24/32, 600 | L1 24/32 | none |
| quote cite | 12/16, 500 | L6 12/16 | none |
| code block | 14/22.4, 400, mono | T5 14/20 | lh −2.4 |
| inline code | 12, 400, mono | T6 12/18 | none (line height is the paragraph's) |
| table | 14/22.4, 400, sans | T5 14/20 | lh −2.4 |
| table head | 10/10, 400, mono, uppercase | U8 10/10 | none |
| caption | 12/16, 400, mono | L6 12/16 | none |
| footer | 10/14, 400, mono | L8 10/13 | lh −1 |

## site — `PageHero`, `PageSection`, `IndexCard`, then `.kol-prose`

The site set is the article set plus the page parts that frame it.

| Role | Today (size/lh, weight, font) | Step | Change |
|---|---|---|---|
| hero title (`kol-prose-display`) | 56/56, 80/80, 500, sans narrow | H1 56/56, D4 80/76 | lh −4 at 80 |
| hero label (`kol-helper-12`) | 12/12, 500, mono | U6 12/12 | none |
| section label (`kol-prose-label`) | 12/16, 500, mono, uppercase | L6 12/16 | none |
| section title (`kol-prose-title`) | 44/47, 56/60, 500, sans narrow | H2 48/50, H1 56/56 | 44 is not a step: takes 48 (ruled) |
| section lede (`kol-prose-lede`) | 24/28, 400, sans compact | T1 24/34 | lh +6 |
| chapter card (`kol-mono-14`, `-12`, `-10`) | 14, 12, 10, mono | L5 14/18, L6 12/16, L8 10/13 | the mono classes read these steps since 2026-11-15; lh −1 at 10 |
| every block under a section | the article set | as above | as above |

## research — `.kol-sheet`

The sheet came from another project's stylesheet with half-pixel sizes; none of 13, 13.5, 14.5, 15, 15.5, 11.5 or 12.5 is
on the ramp, so most of its roles move by up to 1px.

| Role | Today (size/lh, weight, font) | Step | Change |
|---|---|---|---|
| body | 15/24, sans | T4 16/24 | size +1 |
| h1 | 36/43.2, 700, display | H4 36/40 | lh −3.2 |
| h2 | 24/28.8, 700, display | L1 24/32 | lh +3.2 |
| h3 | 18/21.6, 700, display | L3 18/24 | lh +2.4 |
| h4, numbered document | 15.5/21.7, 600, sans | L4 16/21 | size +0.5 |
| milestone head | 20/26, 700, display | L2 20/26 | none |
| milestone meta | 12, 400, mono | L6 12/16 | none |
| text item (`.tb`) | 14.5/23.2 | T5 14/20 | size −0.5, lh −3.2 |
| when and deliverable lines | 13/20.8 | T5 14/20 | size +1 |
| note | 10/16 | T8 10/15 | lh −1 |
| reason (`.why`) | 12, 400; 13 inside a heading | L6 12/16 | size −1 inside a heading |
| mark (`.mk`) | 15; 12 in an outline | T4 16/24; L6 12/16 | size +1 |
| table | 13.5/21.6 | T5 14/20 | size +0.5, lh −1.6 |
| table head | 11.5, 600, uppercase | L7 11/14 | size −0.5 |
| mono table and its head | 12/16.8, 12/15.6, mono | L6 12/16 | lh −0.8, +0.4 |
| key cell (key and value table) | 12, 600, uppercase | L6 12/16 | none |
| total bar; its figure | 13.5; 16, mono | T5 14/20; U4 16/16 | size +0.5 |
| figure caption | 12.5 | L6 12/16 | size −0.5 |
| file name on media | 12, mono | L6 12/16 | none |
| footnote; source note | 10; 12 | T8 10/15; T6 12/18 | none |
| footnote mark | 0.75em | relative, stays | none |
| inline code | 0.88em, mono | relative, stays | none |
| outline summary | 13.5/19.6 | T5 14/20 | size +0.5 |
| outline item | 13/19.5 | T5 14/20 | size +1 |
| outline item number | 11.5, mono | L7 11/14 | size −0.5 |
| outline count | 12, mono | L6 12/16 | none |

## Folio reader — `.kol-folio-*` (to join `MarkdownPage` as a variant)

Source: `packages/theme/kol-type-folio-classes.css` (`kol-reader-*` in apps/folio until 2026-11-22), the reader's own family on Inter. The reading text scales with the reader's
size setting (`--kol-folio-prose-size`, 16 by default) and everything inside it is in em; the steps below are at 16.

| Role | Today (size/lh, weight) | Step | Change |
|---|---|---|---|
| prose body | 16/26.4, 400 | T4 16/24 | lh −2.4 |
| prose h2 | 28/33.6, 700 | H6 28/32 | lh −1.6 |
| prose h3 | 20/26, 700 | L2 20/26 | none |
| prose h4 | 10, 600, uppercase | L8 10/13 | none |
| prose quote | 20/29, 500 | T2 20/30 | lh +1 |
| prose table | 14/21 | T5 14/20 | lh −1 |
| prose table head | 10, 600, uppercase | L8 10/13 | none |
| prose code block | 14.4 | T5 14/20 | size −0.4 |
| title | 72/72, 700 | D5 72/70 | lh −2 |
| chapter | 56/58.8, 700 | H1 56/56 | lh −2.8 |
| figure | 56/56, 700 | H1 56/56 | none |
| section | 28/33.6, 700 | H6 28/32 | lh −1.6 |
| book | 25/30.25, 700 | L1 24/32 | size −1 |
| shelf | 16/19.2, 700 | L4 16/21 | lh +1.8 |
| row | 14/17, 600 | L5 14/18 | lh +1 |
| glyph | 16/16, 400 | U4 16/16 | none |
| nav | 13/15.7, 500 | L5 14/18 | size +1 |
| body (interface) | 13/19.5, 400 | T5 14/20 | size +1 |
| control | 12/14.5, 600 | U6 12/12 | none (one line) |
| meta | 11/13.3, 400 | L7 11/14 | none |
| meta small | 10/12.1, 400 | L8 10/13 | none |
| label | 10/12.1, 600, uppercase | L8 10/13 | none |
| wordmark | 38, 800 | not a text style: the mark stays as drawn | none |

## Ruled 2026-11-14

- Phone title: 48 (H2). Research body: 16 (T4). Folio's 13px interface text: 14.

## Notes

- `title` at phone width is 44px; the ramp has 40 and 48. The table takes 48 (H2).
- Article headings h1 at tablet and desktop gain line height (+4, +12) because today's is a fixed 52px under a growing
  size; the ramp's is the step's own.
- The research set's body goes from 15 to 16px, which lengthens every document by about 6%.
- Folio's interface text is 13px (nav, body); the ramp has 12 and 14, the table takes 14. Its reading text follows a
  size setting, so the reader set scales as a whole while the ramp is fixed: the steps hold at the default 16.
- Weights and fonts are today's; the fonts per role (Special Gothic for display and headings, Inter for text, JetBrains
  Mono for labels) replace the families when the default font changes.
