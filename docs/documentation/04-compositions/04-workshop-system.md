---
title: The workshop docs system — @kolkrabbi/kol-workshop
type: reference
status: active
updated: 2026-07-09
description: Everything the workshop "navbar set" actually is — a handrolled docs subsystem (markdown engine, search, tag system, shell, compositions) lifted from the monorepo apps/web into @kolkrabbi/kol-workshop, dedup'd against the DS shell chrome.
aliases:
  - workshop system
  - kol-workshop
  - docs system
  - workshop navbar set
sources:
  - packages/workshop/src
  - packages/theme/kol-components-workshop.css
tags:
  - domain/design-system
  - domain/docs
related:
  - "[[01-blocks-and-sets|blocks & sets]]"
  - "[[02-shells|shells]]"
  - "[[../03-components/01-inventory|components]]"
---

# The workshop docs system

**The "workshop navbar set" is not one component — it is a whole docs subsystem.** It powers the monorepo's `/workshop` docs experience: markdown parsing, full-text + tag search, a d3 tag graph, the app shell, and the docs viewer. It was lifted out of `kol-monorepo/apps/web` into a new fifth UI package, **`@kolkrabbi/kol-workshop`**, on 2026-07-09.

This doc is the map: what it is, what the package owns vs. reuses, the engine API, how content is injected, and the known gaps. Read it before touching the package or wiring a consumer.

## What it is — the five parts

| Part | What | Where it lives now |
|---|---|---|
| **Engine** | Handrolled markdown parser, frontmatter parser, doc inventory, search-match predicate, tag co-occurrence, doc helpers. **No `remark`/`gray-matter`/`fuse.js`** — all bespoke. | `kol-workshop/src/engine/` (React-free, zero-dep) |
| **Docs viewer** | Renders a parsed doc — `DocumentationReader` + `DocsArticle`/`DocsHeader`/`DocsFrontmatter` + `render-tokens` (the JSX render layer for the parser). | `kol-workshop/src/docs/` |
| **Tag system** | `TagMode` context/overlay/gate + `TagGraph` (force-directed, **the only heavy dep — `d3`**). Frontmatter `tags:` + inline `#hashtags` merged. | `kol-workshop/src/tags/` |
| **Shell composition** | `ShellLayout` (grid + 3 contexts) + `ShellSidebar`. Composes the DS shell primitives; owns the docs-specific `FullHeight` context. | `kol-workshop/src/shell/` |
| **Compositions** | `WorkshopSidebar` (primary + docs nav) + `WorkshopDefaultSidebar` (right rail) — example consumers copy. | `kol-workshop/src/compositions/` |

## Package law — owns vs. reuses

The package is **not** self-contained. Much of the shell chrome **already existed in the DS** (a prior port), so `kol-workshop` reuses it rather than shipping a second copy. This is the single most important fact for anyone extending it.

| Reused FROM the DS (do NOT duplicate) | Package |
|---|---|
| `AppShell`, `SideNav`, `ShellHeader`, `ThemeToggle` | `@kolkrabbi/kol-framework` |
| `ShellDrawer`, `ShellSearchOverlay`, `SearchInput`, `DocsToc`, `Icon`/`Button`/`Input`/`Tag`/`CodeBlock`/`Divider` | `@kolkrabbi/kol-component` |
| chrome CSS (`.shell-*`, `.docs-*`) | `@kolkrabbi/kol-theme` → `kol-components-workshop.css` |

`kol-workshop` **owns only** the engine, docs viewer, tag system, the shell *composition*, and the example compositions. Tier: it sits **above** the other four UI packages (see [[../00-overview/INDEX|overview]] / `ARCHITECTURE.md §3`, amended to five UI packages).

## Engine API (React-free, `@kolkrabbi/kol-workshop/engine`)

| Export | Signature | Does |
|---|---|---|
| `parseDocsMarkdown(md)` | → `{ sections, toc, introBlocks, inlineTags }` | Block + inline tokenizer; extracts TOC (H2) + inline `#hashtags`. |
| `parseFrontmatter(raw)` | → object | YAML-subset: `key: value`, block lists, inline `[a, b]` arrays. Keys lowercased. |
| `buildInventory(modules)` | `{path: raw}` → `[{id, file, title, metadata}]` | **The injection seam** (below). |
| `buildInventoryCounts(inv)` | → `{total, statuses, categories, contentTypes}` | Tallies. |
| `matchSearchItems(items, query)` | → filtered + annotated | Case-insensitive substring over label/tags/headings/keywords. |
| `buildTagCounts` / `buildTagCooccurrence` | inventory → tag data | Pure tag math (graph nodes/edges, counts). |
| `getTagColor`, `extractDocNumber`, `cleanTitle`, `groupDocsByMajor`, `categoryLabels`, … | — | Doc/tag helpers. **Bake in the KOL numbered-doc taxonomy** — parameterize if a consumer's scheme differs. |

Runnable self-check: `node packages/workshop/src/engine/__check.mjs`.

## The content-injection seam — why it's repo-agnostic

The monorepo original hard-bound doc discovery to Vite (`import.meta.glob('@docs/...')`) and the monorepo `/docs` path. **That coupling is cut.** The package never globs docs itself; the consumer supplies the module map and the routes:

```js
const modules = import.meta.glob('/docs/**/*.md', { eager: true, query: '?raw', import: 'default' })
const inventory = buildInventory(modules)
// components take: inventory, routes/basePath, docHref(id), tagHref(tag)
```

So it drops into any of the ~70 repos. Zero live `import.meta.glob`, zero `@docs`, zero hardcoded `/workshop` couplings remain in the package (the `/workshop` strings that survive are **overridable default prop values** only).

## KOL-conformance state

Conformed on lift (verified by grep + esbuild parse across 25 files):

- **Buttons** — 0 `ghost` (retiring), 0 `primary`. Buttons carrying a DS chrome hook (`.shell-*`/`.docs-*`) stay **raw `<button>`** (the chrome class IS the DS styling; wrapping in `Button` double-chromes). Genuine actions → `variant="outline"`.
- **Icons** — every `Icon name` resolves in **kol-icon-set-v1**.
- **Fonts** — `--kol-font-family-rgrot-*` → `sans-*` (the DS's Right-Grotesk token names).
- **Casing** — 0 `text-transform`/`uppercase`/`capitalize`.

### Known gaps (carried, not silently faked)

| Gap | State |
|---|---|
| 5 frontmatter field icons (`type`, `calendar`, `layers`, `tag`, `clock`) | **no v1 equivalent** → icon dropped, label kept. Author them into v1 to restore. |
| `share-2` (tag graph-view toggle) | remapped to `polygon` (closest v1 node-graph glyph) — eyeball it. |
| `dock-right` (DS `ShellHeader`'s TOC-rail toggle) | no `panel-right` in v1 → legacy fallback in the DS component itself (pre-existing, not ours). |
| `ShellHeader` prop API | DS `ShellHeader` is **not** a drop-in for the monorepo one — `ShellLayout` adapts `routes`→`nav`, builds a `brand` node, `onSearchOpen`→`actions` slot, `onMenuOpen`→`onMenuClick`. |

## Provenance

Lifted from `kol-monorepo/apps/web`: `components/shell/*`, `components/workshop/**`, `routes/workshop/*`, `utils/parseDocsMarkdown.jsx` + `docsHelpers.js`, `data/workshop/*`. The monorepo repoints onto this package next (see the migration brief at the monorepo root).

## Status / not-yet-done

- **Not render-tested.** Everything is static-verified only (parse + grep + engine self-check). First live render is the acceptance gate — watch the `.shell-*` / `.kol-btn` cascade.
- Package is `private: true` until the render passes; flip + publish after eyeball.
