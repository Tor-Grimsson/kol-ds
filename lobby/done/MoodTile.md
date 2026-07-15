---
component: MoodTile
source: kol-monorepo/apps/brand/src/components/styleguide/MoodTile.jsx#L1-L21
date: 2026-07-10
status: draft
deps: []
---

# MoodTile

## Purpose
An image tile with a centered brand-logo overlay — a mood/board specimen for the
brand style-guide. A cover-cropped photo fills a 4:3 frame, an optional logo sits
centered on top, and an optional caption runs below. Image and logo are
consumer-injected so the component carries no app coupling (the upstream version
hard-imported `KolLogo` and passed a `variant` string — both dropped).

## Anatomy
```
figure.kol-mood-tile
├─ div.kol-mood-tile-frame (relative, rounded-[4px], overflow-hidden, aspect-[4/3])
│  ├─ img                         (src/alt, loading=lazy; CSS: absolute inset-0, object-cover)
│  └─ div.kol-mood-tile-overlay   (absolute inset-0, flex center, pointer-events-none) [overlay && logo]
│     └─ span.kol-brand-logo      (CSS: 32% / max 180px box; inner svg → width 100%)
│        └─ {logo}                (consumer node)
└─ figcaption                     (kol-helper-12 tracking-wider text-meta mt-2) [caption]
```

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | image URL |
| alt | string | `''` | image alt text |
| logo | node | — | logo node centered over the image; wrapped in `.kol-brand-logo` |
| overlay | boolean | `true` | show the logo overlay (only when `logo` is also given) |
| caption | string | — | caption below the frame (author casing at call site) |

## Styling
- Frame: `relative rounded-[4px] overflow-hidden aspect-[4/3]` inline; `.kol-mood-tile-frame img` (framework CSS) cover-crops the photo via `absolute inset-0 / object-fit:cover`.
- Overlay: `text-emphasis absolute inset-0 flex items-center justify-center pointer-events-none` inline.
- Logo box: `.kol-brand-logo` (framework CSS) → `width:32%; max-width:180px; display:inline-flex`; `.kol-mood-tile-overlay svg` → inner svg `width:100%`.
- Caption: `kol-helper-12 tracking-wider text-meta mt-2`.
- **DROP:** the upstream `uppercase` on the figcaption (no auto text-transform — author casing at the call site). `tracking-wider` kept as a style choice.

## Recreation notes
Tier: **styleguide molecule**. All chrome already exists in
`packages/framework/kol-framework.css` (`.kol-mood-tile-frame img`,
`.kol-mood-tile-overlay .kol-brand-logo`, `.kol-mood-tile-overlay svg`) — reuse
those rules, no new CSS. Two decoupling moves vs upstream:
1. **Logo is a node prop**, not a `KolLogo variant` string — drop the hard import.
   Wrap the injected node in `<span className="kol-brand-logo">` so the 32%/180px
   sizing applies (upstream passed a raw `svg.kol-logo`, so the `.kol-brand-logo`
   rule was never matched — the wrapper makes both surviving rules coherent).
2. **Image is `src`/`alt` props** — no bundled asset import/path.
Overlay only renders when both `overlay` and `logo` are truthy (no empty overlay box).
