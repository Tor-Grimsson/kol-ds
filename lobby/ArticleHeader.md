---
component: ArticleHeader
source: kol-monorepo/apps/web/src/components/prose/layouts/ArticleHeader.jsx#L1-L167
date: 2026-07-03
status: draft
deps: [Pill, Image, AssetPlaceholder]
---

# ArticleHeader

## Purpose
The masthead for a long-form article: a row of tag `Pill`s, a display-size title, an author block (avatar + name + role), a meta line (date • reading time), an optional excerpt, and an optional hero image. Pure presentational composition driven by a flat prop bag — no CMS query inside it, just the values. The strongest / most reusable of the prose-layout set.

## Anatomy
- `<header className="pb-12">`
  - `.max-w-[1400px] mx-auto flex flex-col` — content column
    - **Tags row** (rendered only when `tags.length > 0`) — two copies of the same list, breakpoint-toggled:
      - mobile: `reveal flex lg:hidden flex-wrap items-center gap-2 pb-6` → `Pill variant="inverse" size="sm"` per tag
      - desktop: `reveal hidden lg:flex flex-wrap items-center gap-2 pb-6` → `Pill variant="inverse" size="md"` per tag
    - **Title group** `flex flex-col gap-6`
      - `<h1 className="reveal kol-heading-display text-balance">` — the title
      - **Author + meta line** `reveal flex flex-wrap items-center gap-6 text-fg-64 pb-3`
        - Author cluster `flex items-center gap-4`:
          - avatar — `<img className="w-12 h-12 rounded-full object-cover">` when an image resolves, else placeholder `<div className="w-12 h-12 rounded-full bg-surface-secondary">`
          - name/role `flex flex-col`: name `<span className="kol-helper-s uppercase text-fg-48">`, role `<span className="kol-mono-xs text-fg-64">`
        - Meta cluster `flex items-center gap-3 kol-helper-s uppercase text-fg-48`: `<span>{date}</span>`, `<span>• {readingTime}</span>`
      - **Excerpt** (conditional) `reveal pb-4 w-[80%]` → `<p className="kol-mono-text text-fg-64">`
      - **Hero image** (conditional, 3-way branch) `reveal rounded overflow-hidden border border-fg-08` → `<img className="w-full aspect-[4/2] object-cover" srcSet sizes>`; if `heroImage` is truthy but unresolvable → empty `aspect-[4/2]` box; else nothing

## Variants
No structural variants. The only conditional shape is the responsive pill-size swap (sm below `lg`, md at `lg+`) implemented as duplicated markup, and the three hero states (image / empty placeholder box / none).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| tags | string[] | `[]` | Pill labels; row hidden when empty |
| title | string | — | Display title (`kol-heading-display`) |
| authorName | string | — | Author name (rendered uppercase via class) |
| authorTitle | string | — | Author role/title line |
| date | string | — | Publication date text |
| readingTime | string | — | Reading-time text (prefixed `• ` in the meta line) |
| excerpt | string | — | Lede paragraph; block hidden when falsy |
| heroImage | string \| Sanity image obj | — | Hero source (currently resolved via `resolveImageUrl`) |
| authorImage | string \| Sanity image obj | — | Avatar source (currently resolved via `resolveImageUrl`) |

## Styling
- Type: `kol-heading-display` (title), `kol-helper-s` (name + meta), `kol-mono-xs` (role), `kol-mono-text` (excerpt). `text-balance` on the title.
- Tokens: `text-fg-64`, `text-fg-48`, `border-fg-08`, `bg-surface-secondary`.
- Radius/shape: hero `rounded overflow-hidden border border-fg-08`, avatar `rounded-full`, aspect `aspect-[4/2]`, avatar `w-12 h-12`.
- **App-specific bits to DROP:**
  - The four embedded helpers — `buildSanityImageUrl`, `buildSanityImageUrlWithParams`, `buildSanityImageSrcSet`, `resolveImageUrl` — are **Sanity-image-CDN URL builders** (they append `?w=&h=&fit=crop&crop=center&auto=format`, Sanity's param API) and `resolveImageUrl` unpacks `{url}` / `{asset:{url}}` / the sentinel `'placeholder'` (raw Sanity doc shapes). Drop all four: take a **resolved `heroImage` / `authorImage` string** and let DS `Image` own its own srcSet.
  - `HERO_IMAGE_SIZES = '200vw'` (yes, >100vw) and `HERO_IMAGE_WIDTHS` array + hardcoded aspect `2` are ad-hoc — reconsider on recreation.
  - `reveal` class + `--reveal-delay` inline vars (0s / 0.1s / 0.2s / 0.25s / 0.3s stagger) is an **app scroll-reveal utility** — drop or map to a DS entrance-motion primitive.

## States & interactions
Static. Entrance is the staggered `reveal` animation (delays above). Author avatar falls back to a `bg-surface-secondary` circle when no image resolves. Hero has a three-way branch: resolved URL → `<img>` with srcSet; truthy-but-unresolved `heroImage` → empty aspect box (skeleton); falsy → nothing.

## Dependencies
- `Pill` (`@kol/ui`) — the only imported DS component. Everything else is raw markup.
- Recreation additionally composes DS `Image` (hero + avatar) and `AssetPlaceholder` (the empty-hero / no-avatar fallbacks).

## Recreation notes
- Tier: **organism** (masthead composition of pills + heading + author + media).
- The props are already 90% flat — the work is deleting the Sanity layer: drop `resolveImageUrl` + the three URL builders, accept `heroImage`/`authorImage` as **plain resolved src strings**, and swap the two raw `<img>` tags for DS `Image` (which supplies its own responsive srcSet). Empty-hero box → `AssetPlaceholder`; missing avatar → `AssetPlaceholder`/`Image` fallback.
- Tokens to keep/swap: `text-fg-64`, `text-fg-48`, `border-fg-08`, `bg-surface-secondary` are canonical — keep. Reconsider `w-[80%]` excerpt width and the `200vw` sizes quirk.
- Text casing at call site: name + meta render uppercase purely via `kol-helper-s uppercase` (presentational) — keep the CSS class, do **not** uppercase content in JS, author strings as-is per KOL rule.
