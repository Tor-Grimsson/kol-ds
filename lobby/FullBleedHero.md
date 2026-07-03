---
component: FullBleedHero
source: kol-monorepo/apps/web/src/components/sections/shared/FullBleedHero.jsx#L1-L36
date: 2026-07-03
status: draft
deps: [Image, OverlayGlassPanel]
---

# FullBleedHero

## Purpose
A clean, generic full-bleed image hero: a background `<img>` (absolute, `object-cover`, dimmable via opacity) spanning a fixed-height section, with a single centered `children` slot laid over it. No baked-in copy, no CDN, no route coupling — just image + height + a content slot. It is the reusable base that consumer heroes (e.g. the Typeface specimen hero in `TypefacePage.jsx`) drop an `OverlayGlassPanel` into.

## Anatomy
- `<section className="relative w-full {height} overflow-hidden">`
  - background `<img src srcSet sizes="100vw" alt loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-{imageOpacity}">`
  - content layer `<div className="relative z-10 flex items-center justify-center w-full h-full">` → `{children}`

## Variants
No internal variants — one layout. Variation is entirely (a) `height` classes, (b) `imageOpacity`, (c) whatever the caller renders into `children`. The Typeface specimen hero is effectively the "hero + OverlayGlassPanel" recipe built on this base (`imageOpacity={100}`, glass card as children).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| image | string | — | Background image `src` |
| srcSet | string | — | Responsive `srcSet` (optional) |
| alt | string | `''` | Alt text |
| height | string | `'h-[440px] md:h-[640px]'` | Section height (Tailwind classes) |
| imageOpacity | number | `40` | Interpolated into `opacity-{n}` on the image |
| children | ReactNode | — | Content rendered centered over the image |

## States & interactions
Static. `loading="eager"` (above-the-fold hero). No hover/focus/interaction of its own; interactivity lives in whatever `children` contains.

## Styling
- Tailwind throughout: `relative w-full overflow-hidden`, image `absolute inset-0 w-full h-full object-cover`, content `relative z-10 flex items-center justify-center`.
- **App-specific bits to DROP:**
  - `opacity-${imageOpacity}` is a **dynamic Tailwind class** — JIT won't emit `opacity-40`/`opacity-100`/etc. unless they happen to exist elsewhere or are safelisted. Replace with an inline `style={{ opacity: imageOpacity/100 }}` or a fixed class map. This is the one real hazard.
  - Raw `<img srcSet sizes>` → DS `Image` (gets `AssetPlaceholder`, decoding, etc.) while preserving `object-cover` + the opacity dim + `loading="eager"`.
  - Nothing else — no CDN, no copy, no Sanity, no routes. Already spec-clean.

## Dependencies
- **`Image`** (DS) — swap the raw `<img>` for it, keeping `object-cover`, eager load, and the opacity dim.
- **`OverlayGlassPanel`** (staged, `lobby/OverlayGlassPanel.md`) — the intended content of `children` for the hero-with-card recipe. Not imported by this file, but the pair-compatible partner.

## Recreation notes
- Tier: **organism** (hero section).
- **Prop/slot seam:** flat presentational props (`image`/`srcSet`/`alt`/`height`/`imageOpacity`) + a single centered `children` slot. Keep it exactly this thin — its value is being the un-opinionated base.
- **Pair with `OverlayGlassPanel`:** the common recipe is `<FullBleedHero image=... imageOpacity={100}><OverlayGlassPanel>…eyebrow/title/desc/CTA…</OverlayGlassPanel></FullBleedHero>`. That is precisely what `TypefacePage.jsx#L78-L97` builds by hand and what `StudioHero` (#2) should collapse into. Consider shipping that composition as a documented example, not a new component.
- Fix the `opacity-{n}` dynamic-class hazard (inline opacity), swap `<img>`→`Image`.
- Text casing at call site: no copy here; all text authored inside `children`.
