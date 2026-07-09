---
component: TypeSample
source: kol-monorepo/apps/brand/src/components/styleguide/TypeSample.jsx#L1-L31
date: 2026-07-03
status: draft
deps: []
---

# TypeSample

## Purpose
A single labeled type-specimen block: an optional mono uppercase caption over one paragraph of sample text whose family / weight / italic / size / lineHeight are all driven by props (inline style). The atomic unit of the type-specimen kit — stack several to show a scale, a weight range, or a family. Fully generic; no data or app logic.

## Anatomy
- `.kol-type-sample` wrapper (vertical padding)
  - optional label — mono uppercase caption (rendered only when `label` set)
  - `.kol-type-sample-body` — one `<p>` holding `children`, typography set entirely via inline style from props

## Variants
No discrete variants — it is a parametric specimen. Every prop combination (family × weight × italic × size × lineHeight) is a continuous variation. Presence/absence of `label` is the only structural fork.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| family | string | `'Right Grotesk'` | `font-family` (wrapped as `"${family}", sans-serif`) |
| weight | number | `400` | `font-weight` |
| italic | bool | `false` | `font-style` (`italic` \| `normal`) |
| size | number (px) | `32` | `font-size` in px |
| lineHeight | number (px) | — | `line-height` in px; falls back to `1.2` (unitless) when unset |
| label | string | — | caption above the sample; omit to hide |
| children | node | — | the specimen text itself |

## Styling
- Wrapper: `kol-type-sample py-6`.
- Label: **`kol-helper-12`** (mono label stop — 12px/500/0.06em) + `uppercase tracking-wider text-meta m-0 mb-3`.
- Body: `kol-type-sample-body m-0 text-auto`; all type properties applied inline from props (family, weight, style, size px, lineHeight px-or-`1.2`).
- KOL CSS: `.kol-type-sample + .kol-type-sample { border-top: 1px solid var(--kol-fg-08) }` (adjacent-sibling separator between stacked samples) — lives in `apps/brand/src/components/framework/kol-framework.css`. Move this rule with the component.
- Tokens: `text-meta`, `text-auto`, `--kol-fg-08`.
- **App-specific bits to DROP:** the default `family = 'Right Grotesk'` is a brand font — in the DS make the default the neutral sans token (or a required prop) rather than hard-coding a brand family. Nothing else is app-coupled.

## States & interactions
Static, presentational. No interaction, no state, no hover.

## Dependencies
None. Pure JSX + KOL type classes + one framework CSS rule.

## Recreation notes
- Tier: **atom**.
- Props that stay props: `family`, `weight`, `italic`, `size`, `lineHeight`, `label`, `children` — the whole point is that typography is data-driven inline, so keep the inline-style approach rather than mapping to `kol-*` size classes (those are fixed stops; this needs arbitrary px).
- This is one member of a **type-specimen kit** — a coherent doc-component group (TypeSample, TypeSpecCard, ProsePreview, TypeScaleSection). Recreate them together so the label/mono-caption idiom (`kol-helper-12 uppercase`) stays consistent across the set.
- Text casing at call site: the `uppercase` here is presentational styling of a caption, not content — keep `text-transform` in CSS, do not uppercase the string. `children` and `label` render verbatim as authored.
