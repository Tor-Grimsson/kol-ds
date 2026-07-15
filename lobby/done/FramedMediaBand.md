---
component: FramedMediaBand
source: kol-monorepo/apps/web/src/routes/foundry/components/TypefacePage.jsx#L105-L118
date: 2026-07-03
status: draft
deps: [Image]
---

# FramedMediaBand

## Purpose
A framed 2:1 media showcase band: a full-width section that centers a `max-w-[1400px]`, `aspect-[2/1]` frame — a bordered `surface-secondary` panel with a rounded, `object-cover` image filling it. Used as a rhythm/breather between content sections on the Typeface page. It is **inlined 5× verbatim** in `TypefacePage.jsx` (L105, L130, L169, L196 — a near-copy at each) with only the photo/srcSet/alt changing. This spec extracts the one trivial molecule.

The 5 inline copies (identical but for the `getPhoto(n)` index and tiny wrapper deltas like `mt-12`):
- `#L105-L118` (photo 1) · `#L130-L143` (photo 2) · `#L169-L182` (photo 3, adds `mt-12`) · `#L196-L209` (photo 4)
- (plus the hero at L78 uses `FullBleedHero`, not this band)

## Anatomy
- `<section className="w-full overflow-hidden py-16">` (one copy adds `mt-12`)
  - frame `<div className="max-w-[1400px] mx-auto aspect-[2/1]">`
    - panel `<div className="w-full h-full bg-surface-secondary rounded border border-fg-08">`
      - `<img src srcSet sizes="(max-width: 1400px) 100vw, 1400px" alt className="w-full h-full object-cover rounded-[4px]" loading="lazy">`

## Variants
None structurally. The only per-instance deltas are the image (`src`/`srcSet`/`alt`) and an optional top margin (`mt-12` on one copy) → both become props (`className`/`aspectRatio` cover the rest). Aspect is always `2/1` in source but should be a prop.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | Image `src` |
| srcSet | string | — | Responsive `srcSet` |
| sizes | string | `'(max-width: 1400px) 100vw, 1400px'` | `sizes` attr |
| alt | string | `''` | Alt text |
| aspectRatio | string | `'2/1'` | Frame aspect (`aspect-[…]`) |
| maxWidth | string | `'max-w-[1400px]'` | Frame max width |
| className | string | `''` | Section-level extras (e.g. the `mt-12` case) |

## States & interactions
Static. `loading="lazy"` (these bands sit below the fold). No interaction.

## Styling
- Tailwind + KOL tokens: `bg-surface-secondary`, `border border-fg-08`, `rounded` (panel) + `rounded-[4px]` (image), `aspect-[2/1]`, `object-cover`, `max-w-[1400px] mx-auto`, `py-16`.
- **App-specific bits to DROP:**
  - **Nothing structural** — no CDN, no Sanity, no routes. The `src`/`srcSet` in situ come from `TypefacePage`'s `getPhoto()`/`getSrcSet()` helpers (which rebuild a `-400/-800/-1200/-1600.jpg` size ladder from a CDN URL) — that srcSet-generation logic stays at the foundry call site; the band just takes a finished `src`/`srcSet`.
  - Swap the raw `<img>` for DS `Image` (placeholder + lazy decode), preserving `object-cover`, `rounded-[4px]`, `sizes`, and `loading="lazy"`.
  - The double radius (`rounded` on panel, `rounded-[4px]` on image) is intentional (image nests inside the bordered panel) — keep both.

## Dependencies
- **`Image`** (DS) — replaces the raw `<img srcSet sizes loading="lazy">`, keeping `w-full h-full object-cover rounded-[4px]`.

## Recreation notes
- Tier: **molecule** (framed media band). Trivial + generic — the whole value is killing the 5× duplication in `TypefacePage.jsx`.
- **Prop/slot seam:** flat media props (`src`/`srcSet`/`sizes`/`alt`) + `aspectRatio`/`maxWidth`/`className` for the layout knobs. No `children` slot needed — it is an image frame, not a content container.
- The consumer keeps its `getSrcSet()` ladder logic; the band receives the computed strings. Default `aspectRatio="2/1"` reproduces every current instance.
- Text casing at call site: only `alt` carries text; author it at the call site.
