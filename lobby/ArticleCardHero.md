---
component: ArticleCardHero
source: kol-monorepo/apps/web/src/components/prose/cards/ArticleCardHero.jsx#L1-L61 + apps/web/src/components/sections/blog/ArticleCardHero.jsx#L1-L61
date: 2026-07-03
status: draft
deps: [Image]
---

# ArticleCardHero

## Purpose
The large **hero size** of the `ArticleCard` family, used at the top of the `/stack` blog index: a "Featured" header row with meta, a big 16/9 image that zooms on hover, then a kicker → title → summary stack. Takes a shaped view-model bag `article` ({image, title, kicker, summary, meta, tags, slug}) — **not** a raw Sanity doc.

## Anatomy
- Root router `Link` `className="block group"` with `data-tags={article.tags?.join(' ')}` — DROP the routing (see below).
  - `<article className="w-full">`
    - **Header** (only when `variant === 'featured'`) `<div className="flex justify-between items-center mb-4">`
      - `<div className="kol-mono-text">Featured</div>` — literal app label.
      - meta row (when `article.meta?.length`) `<div className="flex gap-3 kol-mono">` → each `<span>{item}</span>`.
    - **Image wrapper** `<div className="aspect-[16/9] mb-4 overflow-hidden w-full …" style={{ borderRadius: '4px' }}>` (bg treatment is the copy delta — see Recreation notes).
      - `article.image` → `<img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">`.
    - **Text stack** `<div className="space-y-3">`
      - **Kicker** (when `article.kicker`) `<div className="uppercase tracking-wide" style={{ fontFamily:'RightGroteskMono', fontWeight:300, fontSize:'16px', lineHeight:'100%', opacity:0.6 }}>`.
      - **Title** `<h2 className="kol-display-section-sm transition-opacity duration-200 group-hover:opacity-70 line-clamp-2">`.
      - **Summary** (when `article.summary`) `<p className="kol-mono-sm line-clamp-3" style={{ opacity:0.4 }}>`.

## Variants
- **`featured`** (default) — shows the "Featured" + meta header row.
- **`grid`** — no header row; intended smaller heading.
- **Dead variant seam:** `headingClass` is computed from `variant` (`kol-heading-section-small-fine` vs `kol-heading-section-fine`) but **never applied** — the `<h2>` hardcodes `kol-display-section-sm`. Either wire `headingClass` in or drop it on recreation.
- (Family-level: this is the **hero size**; default & mini are the other two.)

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| article.image | string | — | Hero image src (omit → placeholder bg) |
| article.title | string | — | Title (h2), `line-clamp-2` |
| article.kicker | string | — | Small uppercase eyebrow above title |
| article.summary | string | — | Summary, `line-clamp-3` |
| article.meta | string[] | — | Header meta chips (featured only) |
| article.tags | string[] | — | Emitted to `data-tags` only (not rendered) |
| variant | `'featured' \| 'grid'` | `'featured'` | Header presence (+ intended heading size) |
| href / to | string | — | **Replaces** `article.slug ? '/stack/${slug}' : '/post'` |

## Styling
- Type: `kol-mono-text` ("Featured"), `kol-mono` (meta), `kol-display-section-sm` (title), `kol-mono-sm` (summary).
- Layout: `aspect-[16/9]`, `space-y-3`, `line-clamp-2/3`, `transition-transform duration-300 group-hover:scale-105`, `transition-opacity duration-200 group-hover:opacity-70`.
- **App-specific bits to DROP:**
  - Hardcoded `article.slug ? '/stack/${slug}' : '/post'` router `Link` → `href`/`to` prop; DS owns routing.
  - **`"Featured"` literal label** is app copy → make it a `label` prop (default neutral / omittable), authored at the call site.
  - **Kicker inline font hack**: `fontFamily:'RightGroteskMono', fontWeight:300, fontSize:'16px', lineHeight:'100%'` bypasses the type scale → map to a KOL mono type token/utility.
  - Inline `opacity:0.6` (kicker) / `opacity:0.4` (summary) → opacity tokens.
  - `borderRadius:'4px'` inline → a KOL radius token (default card uses `--radius-xl`; reconcile).
  - Placeholder bg is the copy delta (see notes) → one KOL placeholder token.
  - `uppercase` on the kicker is presentational — keep as a class default, do not uppercase the string in JS.
  - Unused `headingClass` variable — dead; drop or wire.

## States & interactions
- **Hover:** image `scale-105` (300ms); title fades to `opacity-70` (200ms). Whole card is the link (`group`).
- **Truncation:** title `line-clamp-2`, summary `line-clamp-3`.
- Static otherwise; `article.tags` surfaces only as a `data-tags` attribute (filtering hook), never visible.

## Dependencies
- Raw `<img>` → DS **Image** for the hero image + placeholder.
- Router `Link` (`react-router-dom`) — to be dropped in favor of a link prop.
- No pill/tag rendering here (tags are `data-tags` only).

## Recreation notes
- Tier: **molecule/organism**. The **hero size** of one `ArticleCard` family (default / hero / mini) that should collapse to a `size`/`variant` prop. Note the naming clash: the family size axis and Hero's existing `variant` (`featured`/`grid`, really a header toggle) are different axes — rename one (e.g. family `size`, keep `variant` for the header, or fold header into `showFeatured`).
- **Two source copies** (`prose/cards/ArticleCardHero.jsx` + `sections/blog/ArticleCardHero.jsx`) — **only delta is the image-wrapper placeholder bg**:
  - `prose/cards`: `bg-fg-04 border border-fg-08 hover:border-fg-16` (KOL fg tokens + a hovering border).
  - `sections/blog`: `bg-neutral-200 dark:bg-neutral-700` (raw Tailwind neutrals, no border).
  - Converge on the **KOL fg-token treatment** (`bg-fg-04 border border-fg-08 hover:border-fg-16`) and drop the raw-neutral copy.
- Values that become flat props: `image/title/kicker/summary/meta/tags` (via the `article` bag or spread flat), `slug`→`href`/`to`, `"Featured"`→`label`.
- Text casing at call site: `title`, `kicker`, `summary`, `meta` are content strings authored as-is; the kicker's `uppercase` stays a presentational class, not a JS transform.
