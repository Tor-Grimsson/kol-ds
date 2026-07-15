---
component: ArticleCardMini
source: kol-monorepo/apps/web/src/components/prose/cards/ArticleCardMini.jsx#L1-L46 + apps/web/src/components/sections/blog/ArticleCardMini.jsx#L1-L46
date: 2026-07-03
status: draft
deps: [Image]
---

# ArticleCardMini

## Purpose
The compact **mini size** of the `ArticleCard` family: a horizontal list-item row with a fixed 120×120 thumbnail on the left and a title → summary → meta stack on the right. Used for "more articles" / sidebar lists on the `/stack` blog. Takes a flat view-model bag `item` ({image, title, summary, meta, tags, slug}).

## Anatomy
- Root router `Link` `className="group flex gap-6 items-start transition-opacity hover:opacity-80"` with `data-tags={item.tags?.join(' ')}` — DROP the routing.
  - **Thumbnail** `<div className="flex-shrink-0 w-[120px] h-[120px] overflow-hidden rounded bg-fg-12">`
    - `item.image` → `<img className="w-full h-full object-cover">` (rendered only when present).
  - **Text stack** `<div className="flex-1 min-w-0 flex flex-col gap-2.5">`
    - **Title** `<h4 className="kol-mono-text line-clamp-2 transition-opacity group-hover:opacity-80">`.
    - **Summary** (when `item.summary`) `<p className="kol-mono-sm-regular text-fg-64 line-clamp-2">`.
    - **Meta** (when `metaText`) `<div className="kol-helper-s text-fg-80 uppercase">` — `metaText = Array.isArray(item.meta) ? item.meta.join(' • ') : item.meta`.

## Variants
- None internally. (Family-level: this is the **mini size**; default & hero are the other two.)

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| item.image | string | — | Thumbnail src (omit → `bg-fg-12` placeholder) |
| item.title | string | — | Title (h4), `line-clamp-2` |
| item.summary | string | — | Summary, `line-clamp-2` |
| item.meta | string[] \| string | — | Joined with ` • ` (array) or used as-is |
| item.tags | string[] | — | Emitted to `data-tags` only (not rendered) |
| href / to | string | — | **Replaces** `item.slug ? '/stack/${slug}' : '/post'` |

## Styling
- Tailwind + KOL tokens: `kol-mono-text` (title), `kol-mono-sm-regular` (summary), `kol-helper-s` (meta).
- Tokens: `bg-fg-12` (placeholder), `text-fg-64` (summary), `text-fg-80` (meta). Layout: `w-[120px] h-[120px]`, `gap-6`, `gap-2.5`, `line-clamp-2`, `rounded`, `object-cover`.
- **App-specific bits to DROP:**
  - Hardcoded `item.slug ? '/stack/${slug}' : '/post'` router `Link` → `href`/`to` prop; DS owns routing.
  - `uppercase` on the meta line is presentational — keep as a class default, do not uppercase the string in JS.
  - `item.meta` is joined with `' • '` inside the component — the separator can stay an internal (or a `separator` prop); do not push casing to it.

## States & interactions
- **Hover:** whole row fades to `opacity-80` (`transition-opacity hover:opacity-80`) and the title additionally fades via `group-hover:opacity-80`.
- **Truncation:** title `line-clamp-2`, summary `line-clamp-2`.
- Static otherwise; `item.tags` surfaces only as `data-tags` (filtering hook), never visible.

## Dependencies
- Raw `<img>` → DS **Image** for the thumbnail + placeholder.
- Router `Link` (`react-router-dom`) — to be dropped in favor of a link prop.
- No pill/tag rendering here (tags are `data-tags` only).

## Recreation notes
- Tier: **molecule**. The **mini size** of one `ArticleCard` family (default / hero / mini) that should collapse to a `size`/`variant` prop. Note it uses the prop name `item` where Hero uses `article` — unify the bag name (or spread flat) when converging.
- **Source copies:** the `prose/cards/ArticleCardMini.jsx` and `sections/blog/ArticleCardMini.jsx` copies are **byte-identical — no delta**; converge to one.
- **`kicker` is NOT rendered here** — the family bag lists a kicker, but Mini only shows title / summary / meta. Either add a kicker line for parity across sizes or document mini as kicker-less.
- Values that become flat props: `image/title/summary/meta/tags` (via the `item` bag or spread flat), `slug`→`href`/`to`. The `' • '` meta join becomes an internal/`separator`.
- Text casing at call site: `title`, `summary`, `meta` are content strings authored as-is; the meta `uppercase` stays a presentational class, not a JS transform.
