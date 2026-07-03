---
component: StackHero
source: kol-monorepo/apps/web/src/components/sections/stack-detail/StackHero.jsx#L1-L59
date: 2026-07-03
status: draft
deps: [Image]
---

# StackHero

## Purpose
A full-bleed image hero: a background image (absolute, responsive `srcSet`) under a bottom-up gradient scrim, with a centered title + description anchored to the bottom of a tall viewport-height section. Used at the top of stack-detail pages. `StackHeroTall` is a **spacing-preset variant** of the same component (see Variants).

## Anatomy
- Wrapper `<div className={containerClassName}>` (default `relative px-6 pb-12 lg:px-12 flex items-end justify-center lg:justify-center min-h-[80vh] overflow-hidden`)
  - When `src`:
    - image layer `absolute inset-0 w-full h-full` → `<img src srcSet sizes alt className="w-full h-full object-{objectFit}" style={{ objectPosition }}>`
    - **scrim** `absolute inset-0 w-full h-full pointer-events-none` `aria-hidden`, inline `background: linear-gradient(to top, #151518 0%, rgba(21,21,24,0) 100%)`
  - **Content** `<div className={contentClassName}>` (default `relative z-10 flex flex-col gap-1 w-full max-w-[520px] lg:max-w-[30%] text-center mx-auto lg:mx-0`)
    - `<h1 className="reveal kol-heading-display text-center">` (`--reveal-delay: 0.2s`)
    - `<p className="reveal kol-mono-text text-center">` (`--reveal-delay: 0.3s`)

## Variants
| variant | source | difference |
|---------|--------|-----------|
| StackHero (default) | `StackHero.jsx` | `min-h-[80vh]`, `pb-12`, `px-6 lg:px-12` |
| StackHeroTall | `StackHeroTall.jsx#L1-L17` | wraps `StackHero`, overriding only `containerClassName` → `relative px-8 lg:px-14 pb-32 sm:pb-40 lg:pb-48 xl:pb-56 flex items-end lg:justify-center min-h-[90vh] overflow-hidden full-bleed` |

`StackHeroTall` is purely a taller / more-bottom-padded / `full-bleed` spacing preset — recreate as a `variant`/size prop on one component, not a second file.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | `"Study Stack"` | Heading text |
| description | string | `"Excercises in futility, manic obsessivities & braindumpster"` | Sub text |
| src | string | CDN `stack-hero-1200.jpg` | Background image |
| srcSet | string | CDN 400/800/1200/1600/2560 set | Responsive sources |
| sizes | string | `"100vw"` | `sizes` attr |
| alt | string | `"Stack hero background"` | Alt text |
| objectFit | string | `"cover"` | Interpolated into `object-{objectFit}` |
| objectPosition | string | `"top"` | Inline `objectPosition` |
| aspectRatio | string | `"auto"` | **Declared but never used in the body — dead prop** |
| containerClassName | string | (the wrapper default above) | Full wrapper class override (the `Tall` seam) |
| contentClassName | string | (the content default above) | Full content-box class override |

## Styling
- Type: `kol-heading-display` (title), `kol-mono-text` (description); both `text-center`.
- Layout: `min-h-[80vh]` (Tall `min-h-[90vh]`), `flex items-end`, `overflow-hidden`, content `max-w-[520px] lg:max-w-[30%]`.
- **App-specific bits to DROP:**
  - **CDN defaults**: `src`/`srcSet` point at `https://f005.backblazeb2.com/file/kolkrabbi/website/asset-library/cms/stack/stack-hero/…` — the Kolkrabbi B2 CDN. Drop; make `src`/`srcSet` required or neutral placeholders.
  - **Brand-copy defaults**: `title="Study Stack"` and `description="Excercises in futility, manic obsessivities & braindumpster"` (typos are in the source — do not "fix", just drop). Make required / neutral.
  - **Hardcoded scrim hex** `#151518` / `rgba(21,21,24,0)` is the KOL dark surface color → tokenize (`--kol-surface-*` gradient), don't hardcode.
  - `object-${objectFit}` is a **dynamic Tailwind class** (JIT won't emit it unless safelisted) → use an inline style or a fixed class map.
  - `reveal` + `--reveal-delay` (0.2s / 0.3s) is the app scroll-reveal utility → drop or map to DS entrance motion.
  - `aspectRatio` prop is dead — drop or actually wire it.

## States & interactions
Static. Entrance via staggered `reveal` (title 0.2s, description 0.3s). Scrim is `pointer-events-none` + `aria-hidden`. No interaction.

## Dependencies
None imported — a raw `<img>`. Recreation composes DS `Image` for the background.

## Recreation notes
- Tier: **organism** (hero section).
- Swap the raw `<img srcSet>` for DS `Image`. Fold `StackHeroTall` in as a `variant="tall"` (or size) rather than a wrapper file — the only delta is `containerClassName` spacing + `full-bleed` + `min-h`.
- Tokenize the scrim gradient (surface color), fix the `object-{objectFit}` dynamic-class hazard, drop CDN + brand-copy defaults, drop the dead `aspectRatio` prop.
- Text casing at call site: title/description authored as-is (no transform); these are content strings.
