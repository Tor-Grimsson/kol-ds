---
component: ArticleCard
source: kol-monorepo/apps/web/src/components/prose/cards/ArticleCard.jsx#L1-L53 + apps/web/src/components/sections/blog/ArticleCard.jsx#L1-L53
date: 2026-07-03
status: draft
deps: [Image, Pill, Tag]
---

# ArticleCard

## Purpose
The default (grid) blog card for the `/stack` CMS index: a rounded thumbnail on top, an optional row of tag pills, a mono title, a truncation-free excerpt, and a meta line (`date • readingTime`). Takes a flat view-model bag — no Sanity doc. This is the **default size** of the one `ArticleCard` family (default / hero / mini); it should collapse into that component under a size/`variant` prop.

## Anatomy
- Root `<article className="group cursor-pointer w-full max-w-full">` — wrapped in a link only when a target is present (see Props / DROP).
  - **Thumbnail** `<div className="{aspectClass} mb-4 overflow-hidden w-full">` with inline `backgroundColor: var(--kol-oq-08)` + `borderRadius: var(--radius-xl)`.
    - `aspectClass` = `aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/9]'` (default landscape).
    - `thumbnail` → `<img className="w-full h-full object-cover">` (rendered only when present).
    - **inline `<style>` injection** setting the dark-mode placeholder bg to `var(--kol-oq-16)` — DROP (see Styling).
  - **Tags row** (when `tags.length > 0`) `<div className="flex gap-2 mb-2">` → each tag `<span className="pill-inverse">`.
  - **Title** `<h3 className="mb-2 kol-mono text-[24px]">` with inline `transition: opacity var(--transition-base)` + a second inline `<style>` injecting `article:hover h3 { opacity: var(--opacity-hover) }` — DROP the injection.
  - **Excerpt** `<p className="mb-2 kol-text-sm">` with inline `color: color-mix(in srgb, var(--kol-surface-on-primary) 64%, transparent)`.
  - **Meta** `<time className="pill-subtle">` rendering `{date} • {readingTime}`.

## Variants
- **Aspect** — `landscape` (`aspect-[16/9]`, default) vs `portrait` (`aspect-[3/4]`).
- **Linked vs static** — wrapped in a router `Link` when a slug/target is present, otherwise the bare `<article>`.
- (Family-level: this is the **default size**; `hero` and `mini` are the other two sizes — see ArticleCardHero / ArticleCardMini.)

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | — | Card title (h3) |
| excerpt | string | — | Summary paragraph |
| date | string | — | Meta — left of the `•` |
| readingTime | string | — | Meta — right of the `•` |
| aspect | `'landscape' \| 'portrait'` | `'landscape'` | Thumbnail aspect ratio |
| thumbnail | string | — | Image src (omit → placeholder bg) |
| tags | string[] | `[]` | Tag pills |
| href / to | string | — | **Replaces** hardcoded `/stack/${slug}`; omit → renders static, no link |

## Styling
- Tailwind + KOL tokens: `kol-mono text-[24px]` (title), `kol-text-sm` (excerpt), `aspect-[16/9]` / `aspect-[3/4]`, `object-cover`, `gap-2`.
- Tokens: `var(--kol-oq-08)` placeholder bg, `var(--radius-xl)` corner, `var(--transition-base)` + `var(--opacity-hover)` for the title hover.
- **App-specific bits to DROP:**
  - Hardcoded `/stack/${slug}` router `Link` → `href`/`to` prop; DS owns routing.
  - **Two inline `<style>` injection hacks** — (1) `.dark article > div:first-child { background-color: var(--kol-oq-16) }` for the dark placeholder, (2) `article:hover h3 { opacity: var(--opacity-hover) }`. Both leak descendant CSS from inside render. Replace (1) with a `dark:` class / dark placeholder token and (2) with `group-hover:opacity-[…]` on the h3.
  - Inline `color-mix(in srgb, var(--kol-surface-on-primary) 64%, transparent)` on the excerpt → the KOL `text-fg-64` token (already used by the mini card).
  - `pill-inverse` (tags) and `pill-subtle` (meta) are app CSS classes → DS `Tag` / `Pill` / `Badge`.

## States & interactions
- **Hover:** whole card is `cursor-pointer`; title fades to `var(--opacity-hover)` via the injected `article:hover h3` rule (recreate as `group-hover`).
- **Dark mode:** placeholder bg shifts `--kol-oq-08` → `--kol-oq-16` via the injected `.dark` rule (recreate as a `dark:` token).
- No focus/active styling in source beyond the link wrapper.

## Dependencies
- Raw `<img>` → DS **Image** (`lobby/` family) for the thumbnail + placeholder.
- Tag pills → DS **Tag**/**Pill**; the meta `<time>` chip → DS **Pill**/**Badge**.
- Router `Link` (`react-router-dom`) — to be dropped in favor of a link prop.

## Recreation notes
- Tier: **molecule**. This is one member of a single `ArticleCard` family with **three sizes — default (this) / hero / mini** — that should collapse to a `size`/`variant` prop rather than three files.
- **Two source copies** (`prose/cards/ArticleCard.jsx` and `sections/blog/ArticleCard.jsx`) are **byte-identical — no delta**; converge to one. (Earlier scan flagged a placeholder-bg delta here; the actual delta is on ArticleCardHero, not this card.)
- Values that become flat props: `title / excerpt / date / readingTime / thumbnail / tags / aspect` stay as props; `slug`→`href`/`to`. Drop the two `<style>` injections and the inline `color-mix` in favor of tokens/`group-hover`.
- Text casing at call site: `title`, `excerpt`, `date`, `readingTime`, and `tags` are content strings authored as-is — no `text-transform`, no JS casing.
