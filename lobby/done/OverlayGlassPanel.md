---
component: OverlayGlassPanel
source: kol-monorepo/apps/web/src/components/sections/studio/StudioHero.jsx#L19-L28
date: 2026-07-03
status: draft
deps: []
---

# OverlayGlassPanel

## Purpose
The shared frosted-glass content card that floats over hero/carousel media across the app: a semi-transparent surface-primary panel (`color-mix` 80%) with a 1px backdrop blur, rounded 2px, laying its children out as a centered vertical stack. It is the **content box** every full-bleed media section drops on top of its image/video. Currently **copy-pasted inline in 4 places** with only trivial layout deltas — this spec extracts the one molecule they should all compose.

The 4 inline copies (identical `style`, near-identical wrapper class):
- `sections/studio/StudioHero.jsx#L19` — hero card (eyebrow/title/description/CTA)
- `sections/studio/StudioAboutCard.jsx#L7` — about card (adds `justify-center`, `md:max-w-[600px] mx-auto`)
- `sections/shared/FeaturedCarousel.jsx#L141` — carousel slide overlay
- `routes/foundry/components/TypefacePage.jsx#L84` — specimen hero card (responsive `px`/`py`, `gap`)

## Anatomy
- Single panel `<div>`:
  - **Class (common core):** `flex flex-col items-center text-center rounded-[2px]` + padding + gap.
  - **Inline style (identical in all 4 — capture EXACTLY):**
    ```
    style={{
      backgroundColor: 'color-mix(in srgb, var(--kol-surface-primary) 80%, transparent)',
      backdropFilter: 'blur(1px)',
    }}
    ```
  - `{children}` — the eyebrow/title/description/CTA stack authored by the caller.

## Variants
Per-call deltas that become props (none of these are separate components — they are the axes of variation across the 4 copies):
| axis | seen values | becomes |
|------|-------------|---------|
| padding | `px-6 py-8` (Hero, About, Carousel) · `px-4 md:px-6 py-6 md:py-8` (Typeface) | `padding` prop / class override |
| gap | `gap-4 md:gap-6` (Hero) · `gap-6` (Carousel) · none, child `space-y-*` (About) | `gap` prop / class override |
| main-axis | default · `justify-center` (About) | `align` prop |
| max width | none · `md:max-w-[600px] mx-auto` (About) | `maxWidth` prop |

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| children | ReactNode | — | The content stack (eyebrow/title/desc/CTA) |
| surfaceOpacity | number (%) | `80` | The `80%` in the `color-mix` — panel translucency |
| blur | string | `'1px'` | The `backdrop-filter: blur(...)` radius |
| align | `'center' \| 'start' \| 'end'` | `'center'` | `items-*` / cross-axis; `justify-center` when vertically centering (About case) |
| gap | string | `'gap-6'` | Vertical rhythm between children |
| maxWidth | string | none | Optional `max-w-*` + `mx-auto` (About case) |
| className | string | `''` | Extra wrapper classes / padding override |

## States & interactions
Static, non-interactive. Pure presentational wrapper — no state, no handlers. `backdrop-filter` requires a positioned/overlaid context (the parent media section supplies it); the panel itself only paints translucent surface + blur.

## Styling
- Tailwind for layout (`flex flex-col items-center text-center rounded-[2px]`, padding, gap); the translucency + blur are **inline** because Tailwind can't express `color-mix(... var(--kol-surface-primary) ...)`.
- KOL tokens: `var(--kol-surface-primary)` is the only token; `rounded-[2px]` is the panel radius.
- **App-specific bits to DROP:** none structural — this molecule is already generic. The only cleanup is de-duplication: replace all 4 inline copies with this one component. Keep the `color-mix` + `blur(1px)` values verbatim (they are the KOL glass look, not app coupling).

## Dependencies
None. Leaf molecule — a styled wrapper. It is a **dependency of** FullBleedHero, StudioHero, FeaturedCarousel, and the Typeface specimen hero.

## Recreation notes
- Tier: **molecule** (styled content surface). High-leverage dedupe — one panel, 4 consumers.
- **Prop/slot seam:** `children` slot carries all content; `surfaceOpacity` + `blur` parametrize the exact `color-mix(in srgb, var(--kol-surface-primary) {surfaceOpacity}%, transparent)` + `backdrop-filter: blur({blur})`; `align`/`gap`/`maxWidth`/`className` cover the layout deltas between the 4 copies. Defaults reproduce the most common call (Hero/Carousel): `80%`, `blur(1px)`, centered, `gap-6`, `px-6 py-8`.
- **Do not tokenize away the magic values** — `80%` and `1px` are the design, expose them as props with those defaults rather than burying them.
- Text casing at call site: this panel renders no text of its own; eyebrow uppercasing etc. is authored by the caller inside `children`, never enforced here.
