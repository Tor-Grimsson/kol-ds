---
component: TypeBlock
source: kol-client-kolkrabbi/src/components/styleguide/TypeBlock.jsx + src/data/typography-cuts.js
date: 2026-07-10
status: closed
package: "@kolkrabbi/kol-styleguide"
deps: []
staged: 2026-07-10
---

# TypeBlock

## Purpose
A typography **specimen primitive**: renders one sample string with a fully consumer-controlled type treatment — cut (Right Grotesk width or mono), weight, italic, size, tracking, line-height, case, alignment, colour, and optional stroke. Pure, stateless, presentational: feed props, it draws the specimen. The atom a type-scale page, cut table, or "type in the wild" tile is built from.

## Anatomy
- A single `<div>` whose entire look is inline `style`, plus any pass-through `className`.
  - `fontFamily` resolved from `cut` via `familyFor(cut)` → `'Right Grotesk <Cut>'` / `'Right Grotesk'` / `'JetBrains Mono'`, with `'Right Grotesk', sans-serif` fallbacks.
  - `fontWeight`, `fontStyle`, `fontSize` (px), `letterSpacing` (em), `lineHeight`, `textAlign`, `color`.
  - `textTransform` = the `case` prop verbatim (consumer opt-in; default `none`).
  - Optional `-webkit-text-stroke` (`strokeWidth` + `strokeColor`) with `paint-order: stroke fill`.
  - `min-height: 1em`, `overflow-wrap: break-word`, `white-space: pre-wrap` — the sample flows across lines.

## Variants
No discrete variants — the prop surface is the variation. The specimen ranges from a 12px mono caption to a 96px display cut off one component.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| text | string | `'Right Grotesk'` | the sample string |
| cut | string | `'base'` | Right Grotesk cut key or `'mono'` (see CUTS) → `familyFor` |
| weight | number | `400` | font-weight 100–900 |
| italic | boolean | `false` | italic style |
| size | number | `48` | font-size in px |
| tracking | number | `0` | letter-spacing in em |
| lineHeight | number | `1` | unitless line-height |
| case | `'none'\|'uppercase'\|'lowercase'\|'capitalize'` | `'none'` | CSS text-transform the consumer opts into — never baked |
| align | string | `'left'` | text-align |
| color | string | `'currentColor'` | ink; inherits from surface / theme by default |
| strokeWidth | number | `0` | outline width in px (0 = none) |
| strokeColor | string | — | outline colour (required for stroke to render) |
| className | string | `''` | extra classes on the sample element |
| style | object | — | inline-style overrides merged last |

## Styling
- **Entirely inline** — the whole point is previewing arbitrary cuts/sizes, so the sample is style-driven, NOT a fixed `kol-*` type class. No new CSS.
- Family strings from `familyFor` name the theme's Right Grotesk / JetBrains Mono `@font-face` declarations (`kol-typography.css` / `kol-typography-mono.css`).
- Colour defaults to `currentColor` (token-friendly — surrounding surface drives ink); consumer may pass a `--kol-*` token string.
- Kept wrap-capable → honours the mono wrap-vs-nowrap fault line for wrapping sample text.

## States & interactions
Static, presentational. No state, no hooks, no editing. (The source's contentEditable inline-edit + drag-select is Type-Lab editor chrome — dropped.)

## Dependencies
- **typographyCuts** (`./typographyCuts.js`) — `familyFor` (cut → family) at runtime; `WEIGHTS` / `CUTS` / `CASES` are for consumer control UIs.

## Recreation notes
- **Tier:** atom / rendering primitive. Positioning, outlines, and drag chrome are the consumer's job.
- **Case handling (KOL rule):** `case` is an explicit consumer-set prop defaulting to `'none'`, applied as CSS `text-transform`. The sample string is **never** mutated (source's JS `applyCase` — `toUpperCase` / `charAt(0).toUpperCase()` — is not ported; sentence-case is dropped, author the string in its intended case).
- **Flattened API:** the source's nested `value` object became discrete props.
