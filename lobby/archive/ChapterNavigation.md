---
component: ChapterNavigation
source: kol-monorepo/apps/web/src/components/sections/shared/ChapterNavigation.jsx#L1-L139
date: 2026-07-03
status: archived
deps: [Divider]
---

> **Archived 2026-07-09** — zero consumers in the app (spec itself flags it); DocsToc supersedes.

# ChapterNavigation

## Purpose
A table-of-contents / jump-nav section: a title + description over a set of anchor links to page sections, in one of three layouts (`compact` text links, numbered `cards`, or an editorial two-column `list` with hover-expanded descriptions and a "View in context →" affordance). Pure jump-anchor navigation — every link is an `href` to a section id; the component does **not** track the active section. **Currently unused** in the app (zero consumers) — stage as low priority and verify a real consumer before the DS invests.

## Anatomy
```
<section class="w-full px-8 py-16 [className]">
  <div class="max-w-[1400px] mx-auto">
    variant === 'list':
      <div class="flex flex-col lg:flex-row justify-between items-start">
        <div class="w-full lg:w-[400px]">
          <h2 class="kol-heading-lg text-auto mb-3">   {title}
          <p  class="kol-mono-sm text-fg-64">          {description}
        <div class="w-full lg:w-[880px] flex flex-col gap-8">
          {chapters.map => <div class="group">
            <a href class="flex justify-between items-start pb-4">
              <div class="flex-1">
                <div class="flex items-baseline gap-3">
                  <h3 class="kol-mono-text text-auto">   {chapter.title}
                  <span class="kol-mono-xs text-fg-64">  {chapter.subtitle}
                <div class="max-h-0 overflow-hidden group-hover:max-h-40 transition-all …">
                  <p class="kol-mono-xs text-fg-64 mt-2"> {chapter.description}
              <div class="flex-shrink-0 ml-4">
                <span class="kol-helper-uc-s text-fg-64 … group-hover:hidden">   {NN index}
                <span class="kol-mono-xs text-auto hidden group-hover:block …">  "View in context →"
            <Divider />
    else (compact | cards):
      <div class="mb-8"> <h2 class="kol-heading-md mb-4">{title}</h2> <p class="kol-mono-sm text-fg-64">{description}</p>
      variant === 'compact':
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chapters.map => <a href class="kol-text-compact-md text-auto hover:text-accent-primary transition-colors">→ {chapter.title}</a>
      else ('cards'):
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chapters.map => <a href class="p-4 border border-auto rounded hover:border-accent-primary … group">
            <span class="kol-helper-uc-sm text-fg-64 group-hover:text-accent-primary">{NN index}</span>
            <p class="kol-text-compact-md mt-2">{chapter.title}</p>
```
Renders `null` when `chapters` is empty.

## Variants
- **`compact`** (default) — 2/4-col grid of `→ Title` text links.
- **`cards`** — 2/4-col grid of bordered numbered cards (`NN` + title).
- **`list`** — two-column editorial: title/description left, a `Divider`-separated stack of link rows right, each with hover-expanded `description` and a `NN` ↔ "View in context →" swap.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | `'Jump to Section'` (DROP) | section heading |
| description | string | — | section lede (`kol-mono-sm text-fg-64`) |
| chapters | `{title,href,subtitle?,description?}[]` | `[]` | the jump links; empty → renders `null` |
| variant | `compact\|cards\|list` | `compact` | layout |
| className | string | `''` | extra classes on `<section>` |

## States & interactions
- **compact:** link hover → `hover:text-accent-primary`.
- **cards:** card hover → `hover:border-accent-primary`, number → `group-hover:text-accent-primary`.
- **list:** row hover → `chapter.description` expands (`max-h-0` → `group-hover:max-h-40`, `transition-all duration-300`), and the `NN` index swaps to "View in context →".
- Links are plain `<a href>` anchors — no active-section tracking, no `Link` router import, no scroll behavior of its own.

## Styling
- Type: `kol-heading-lg`/`kol-heading-md` (title), `kol-mono-sm`/`kol-mono-xs`/`kol-mono-text` (description/rows), `kol-text-compact-md` (link/card titles), `kol-helper-uc-s`/`kol-helper-uc-sm` (numbers).
- Tokens: `text-auto`, `text-fg-64`, `border-auto`, `accent-primary` (hover). `max-w-[1400px] mx-auto`, `rounded`.
- Numbers: `String(index+1).padStart(2,'0')` → zero-padded `NN` (presentational, fine to keep).
- **App-specific bits to DROP:**
  - `title` default `'Jump to Section'` and the "View in context →" literal — app copy → prop / neutral default.

## Dependencies
- **Divider** (`@kol/ui`) — row separators in the `list` variant only.
- `PropTypes` — dev-time only; drop or convert to TS types on recreation.

## Recreation notes
- Tier: **molecule** (nav list with three layout skins).
- **Priority: LOW — verify a consumer first.** Grep of `apps/web/src` finds zero imports of `ChapterNavigation`; it is dead code. Do not invest in the DS port until a real consumer is identified.
- **Reconcile vs DS `useScrollSpy`:** the DS already has `useScrollSpy` (`packages/component/src/hooks/useScrollSpy.js`) — IntersectionObserver active-section tracking with edge-lock — and `DocsToc` (staged) is the scrollspy-driven TOC. ChapterNavigation is the *jump-anchor* half only (no active state). If the DS wants an active-highlighting TOC, wire `useScrollSpy` into this; otherwise this overlaps `DocsToc` and should be deduped against it (one TOC family: jump-only vs scrollspy-tracked as a prop), not shipped as a parallel component.
- Text casing at call site: `kol-helper-uc-*` are type-class styles, not JS transforms — author `title`/chapter strings in final case; the `→` prefix and `NN` numbering are presentational, keep them.
- Prop/slot seam: keep `chapters[]` (`{title,href,subtitle?,description?}`) as the data slot and `variant` as the skin selector; make `title` a required/neutral prop (drop the "Jump to Section" default).
