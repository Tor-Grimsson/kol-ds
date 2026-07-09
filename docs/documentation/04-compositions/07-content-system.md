---
title: Content system — the CMS package (stack + work)
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-content — the two Sanity CMS streams /stack (blog editorial) and /work (portfolio), lifted out of kol-component on 2026-07-09. Presentation only; data is consumer-injected. The Sanity collection/query layer is deliberately per-repo, not packaged.
aliases:
  - content
  - kol-content
  - cms
  - stack
  - work
sources:
  - packages/content/src/index.js
  - packages/content/README.md
  - showcase/src/sets/stack-blog.jsx
  - showcase/src/sets/work-portfolio.jsx
tags:
  - domain/design-system
  - domain/content
related:
  - "[[01-package-topology|package topology]]"
  - "[[05-foundry-system|foundry system]]"
  - "[[06-store-system|store system]]"
---

# Content system — `@kolkrabbi/kol-content`

The CMS content system — the two Sanity streams `/stack` (blog editorial) and `/work` (portfolio) — lifted out of `kol-component` into one package because they share a content model and version on their own cadence.

```js
import { StackHero, ArticleHeader, PortableTextRenderer } from '@kolkrabbi/kol-content'
```

## Component index

### Stack (blog / editorial)

| Component | What it is |
|-----------|-----------|
| `StackHero` | full-bleed article hero (`variant` `default` / `tall`) |
| `ArticleHeader` | masthead — tags, title, `AuthorLine`, meta, excerpt, hero image |
| `AuthorLine` | author cluster (Avatar + name + role), standalone |
| `ArticleCard` | blog card family — `size` `hero` / `default` / `mini` |
| `PortableTextRenderer` (+ `slugify`) | portable-text body → 10 block types + inline `link` / `segmentTitle` marks |
| `ShareButtons` | share bar — copy-link + X / LinkedIn / email |
| `SourcesReferences` | end-of-article sources / references block |

### Work (portfolio / project)

| Component | What it is |
|-----------|-----------|
| `WorkViewToggle` | Shelf ⇄ List view switch |
| `WorkCard` | project card (3D-tilt hover), 3 sizes |
| `WorkListItem` | conservative list row |
| `ParallaxShelf` | embla-driven horizontal shelf |
| `ScrollDriftGallery` | gsap scroll-triggered outside-in drift gallery |

## The data boundary — CMS is per-repo

**Presentation only.** Components take flat prop bags / injected portable text; they never fetch. The **Sanity collection layer** (client + GROQ + the `blog`/`project` collection queries) lives in **each consumer repo**, not this package — because every consumer has its own Sanity project (dataset, schema, project ID). This is the opposite of `kol-chess/data` (one canonical public dataset, so bundled). The only shared contract is the doc *shape* the components expect, documented in their props.

## Consumer notes

- Shared primitives stay in `kol-component` — `ContentFilters`, `DropdownTagFilter`, `ShellSearchOverlay`, `GalleryCarousel`, `Avatar`, `Tag`. This package depends on them.
- **CSS** in `@kolkrabbi/kol-theme` (`.kol-prose` + component sheets). Peer: `gsap`; dep: `embla-carousel-react`.
- Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-content/src"` — Tailwind skips `node_modules`, or the utilities never generate).
- No auto text-transform — strings render in their authored case (KOL rule).
- Live: `showcase/src/sets/stack-blog.jsx` · `work-portfolio.jsx`.
