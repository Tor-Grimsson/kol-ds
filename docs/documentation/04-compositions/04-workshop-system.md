---
title: Workshop system
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The handrolled docs subsystem in kol-workshop
aliases:
  - workshop system
  - kol-workshop
  - docs system
  - workshop navbar set
sources:
  - packages/workshop/src
  - packages/theme/kol-components-workshop.css
tags:
  - domain/compositions
  - audience/consumer
  - pattern/app-shell
related:
  - "[[01-blocks-and-sets|blocks & sets]]"
  - "[[02-shells|shells]]"
  - "[[../03-components/01-inventory|components]]"
---

# The workshop docs system

**The "workshop navbar set" is not one component — it is a whole docs subsystem.** It powers the monorepo's `/workshop` docs experience: markdown parsing, full-text + tag search, a d3 tag graph, the app shell, and the docs viewer. It was lifted out of `kol-monorepo/apps/web` into a new fifth UI package, **`@kolkrabbi/kol-workshop`**, on 2026-07-09.

This doc is the map: what it is, what the package owns vs. reuses, the engine API, how content is injected, and the known gaps. Read it before touching the package or wiring a consumer.

## Five parts

| Part | What | Where it lives now |
|---|---|---|
| **Engine** | Handrolled markdown parser, frontmatter parser, doc inventory, search-match predicate, tag co-occurrence, doc helpers. **No `remark`/`gray-matter`/`fuse.js`** — all bespoke. | `kol-workshop/src/engine/` (React-free, zero-dep) |
| **Docs viewer** | Renders a parsed doc — `DocumentationReader` + `DocsArticle`/`DocsHeader`/`DocsFrontmatter` + `render-tokens` (the JSX render layer for the parser). **Speaks the doc voice, not prose** (0.3.4 retype): every element typed through the `kol-doc-*` roles — the same dialect as the showcase MDX map — sections via `DocSection`, markdown tables via the kol-component `Table` (`variant="simple"` + `.kol-doc-table`), code/tables panel-capped. `.kol-prose` is the blog/CMS voice and never wraps a docs surface. | `kol-workshop/src/docs/` |
| **Tag system** | `TagMode` context/overlay/gate + `TagGraph` (force-directed, **the only heavy dep — `d3`**). Frontmatter `tags:` + inline `#hashtags` merged. | `kol-workshop/src/tags/` |
| **Shell composition** | `ShellLayout` (grid + 3 contexts) + `ShellSidebar`. Composes the DS shell primitives; owns the docs-specific `FullHeight` context. Grid gutter is theme-owned (0.3.1): `.shell-content-grid` gap 32px / 48px ≥1600 — no `gap-*` utility on the element (§5: a utility outranks the layered rule and killed the wide step). | `kol-workshop/src/shell/` |
| **Compositions** | `WorkshopSidebar` (primary + docs nav) + `WorkshopDefaultSidebar` (right rail) — example consumers copy. | `kol-workshop/src/compositions/` |

## Package law

The package is **not** self-contained. Much of the shell chrome **already existed in the DS** (a prior port), so `kol-workshop` reuses it rather than shipping a second copy. This is the single most important fact for anyone extending it.

| Reused FROM the DS (do NOT duplicate) | Package |
|---|---|
| `AppShell`, `SideNav`, `ShellHeader`, `ThemeToggle` | `@kolkrabbi/kol-framework` |
| `ShellDrawer`, `ShellSearchOverlay`, `SearchInput`, `DocsToc`, `Icon`/`Button`/`Input`/`Tag`/`CodeBlock`/`Divider` | `@kolkrabbi/kol-component` |
| chrome CSS (`.shell-*`, `.docs-*`) | `@kolkrabbi/kol-theme` → `kol-components-workshop.css` |

`kol-workshop` **owns only** the engine, docs viewer, tag system, the shell *composition*, and the example compositions. Tier: it sits **above** the other four UI packages (see [[../00-overview/INDEX|overview]] / `ARCHITECTURE.md §3`, amended to five UI packages).

## Engine API

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

## Injection seam

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
- **Sidebar rhythm (2026-07-15, ledger-2.0 #2.6 — ruled, user-reviewed; box law added 2026-08-01):** the right rail keeps its quieter label scale (deliberate hierarchy vs the nav's), but **row rhythm is shared** — the eyebrow and the nav-group-header both read `--kol-pad-rail-row-y`, one token rather than two copies of a number.
- **The eyebrow's box has ONE owner (user ruling 2026-08-01).** An eyebrow row wears `shell-sidebar-toggle` (collapsible) **or** `shell-sidebar-label` (static), never both and never beside `shell-nav-group-header`; the two names share a single CSS rule owning padding *and* margin, and no y-spacing is set inline. Before the ruling the left rail carried three spacing owners on one row and the right carried two, so the rails disagreed while `validate:rails` stayed green — it locked the voice, not the box. Now **R3** of that gate, which counts owners rather than measuring pixels. Full law: [[02-shells|reference shells]].
- **No chevron on a rail eyebrow (user ruling 2026-08-01).** Sections still collapse and expand on click; the glyph is not drawn. Reverses the 2026-07-30 affordance note in `DocumentationReader`.
- **`RailSection` owns the rail ladder (user ruling 2026-08-01).** Three rungs — L1 section (`.shell-sidebar-toggle`, no chevron, **no count**), L2 group (`.shell-nav-group-header`, chevron, **count**), L3 row (`.shell-nav-item`) — and **one component owns L1 and L2 in both rails**, including where the count sits. The classes existed all along; what was missing is that nothing declared them a ladder, so each call site hand-typed its own count and the two rails printed theirs on different rows. L3 was the proof: the only rung a component (`DocsToc`) already owned, and the only one that never drifted. `validate:rails` **R4** fails a hand-written rung class, a hand-placed `({n})`, or the section order out of sequence. Full law: [[02-shells|reference shells]].
- **The count is an L2 affordance, and rail rows show the NAME (user rulings 2026-08-01).** An eyebrow names a body of material and never tallies it — `RailSection` drops a `count` passed at L1. And `cleanTitle` now strips everything after a spaced em/en dash, so `Type classes — the two families and when to use which` renders as `Type classes`; **search still reads the full title**, and the doc's own title is untouched.
- **ONE RAIL STACK (user ruling 2026-08-01, said in anger and said before).** *"I HAVE TOLD YOU LEFT AND RIGHT = THE SAME LAYOUT MARGINPADDING."* The row gap was given one owner earlier that day and the stack above it was not, so a single layout shipped as **four** idioms — `flex flex-col gap-6` (left rail), `space-y-6` (right rail), `space-y-4` (shell sidebars), `space-y-0` (rows). `.shell-rail-stack` / `.shell-rail-stack-inner` own it now, and they are flex `gap` rather than `space-y-*` on purpose: `space-y` is a margin on every child but the first, so it fights the eyebrow box, which owns its own margin. Full law: [[../01-foundations/05-layout-systems|layout systems registry]].
- **BOTH right rails carry the same three categories, in the same order.** `AutoToc` (every non-vault page) and `DocReaderSidebar` (the vault) had drifted into different structures again — Quick actions and Tags hanging inside "This page", which claims they describe the document. Order is `THIS PAGE` → `LINKS` → `TAGS`: contents, then exits, then filing.
- **Every category keeps its CHAPTER rung.** Collapsing `This page` straight onto `DocsToc` deleted the middle rung on the one side of the page that had just been given it — *"why did you remove the 'this page' collapsable chapter? when you do YOU BREAK THE RULE"*. `Contents` is a group and stays one.
- **The tag shelf is indented to the ROW text edge** — `.shell-rail-tags` reads `--kol-pad-rail-row-x`. It used to sit flush left, the only block in the rail setting its own left margin.
- **The scroll spy activates the FIRST heading at rest (user ruling 2026-08-01).** The top edge-lock cleared the active id, so the rail highlighted nothing — and a page *opens* at rest, which made "no active row" the state the reader saw first and most. The bottom lock had always activated the last id; this is that rule at both ends.
- **The right rail is THREE eyebrow categories (user ruling 2026-08-01, the fourth asking).** `THIS PAGE` · `TAGS` · `LINKS`. It was one category — "This page" — with four L2 groups under it, so `Tags` rendered as a nav row in `kol-mono-14` beside a category rendered as an eyebrow: *"for the 4th time Tags, change it from this style to EYEBROW"*. A category is a **body of material**, and contents / filing / where-you-can-go are three of them — which is why `Tags` could never be a peer of `Contents`, and why `Related` and `Quick actions` now sit inside `LINKS` rather than under "This page", a category making the opposite claim. The count rule is unchanged: `TAGS` carries none, because a count sits inside a category and never beside its label.
- **CHAPTER is Medium + `shout`, PAGE is Thin (user rulings 2026-08-01, settled after six attempts).** `.shell-nav-group-header` **500 + `--kol-fg-shout` (88)** against `.shell-nav-item` **100 + `fg-64`**. Every weight-only attempt failed on arithmetic, not cascade: 400→500, 300→500 and 200→500 all applied correctly and none read as hierarchy — measured on the H stem, 300 against 500 is a **0.28 device-pixel** difference in stroke. 700/100 was tried for one turn and reverted: once the rows sit at Thin the weight gap already carries, so the chapter buys its prominence from **ink** instead and stays inside the ramp's normal range. **Weight and colour each do half the work.** Thin is renderable only because the family went **variable** the same day (`wght 100 800`, two faces, 151 kb replacing 1024 kb of statics) — see [[../01-foundations/03-typography|type classes]]. L2 carries **no colour class**: the rule owns weight and ink together, and `text-body` was removed from the rung string rather than left to fight it.
- **The active row is `emphasis`, in both rails (user ruling 2026-08-01).** `.shell-nav-item.is-active` reads `var(--kol-fg-emphasis)`, not the raw `--kol-surface-on-primary` it used to — same value, but reached through the ladder. Where-you-are is the one thing in a rail that earns max ink, and the left tree's current PAGE and the right rail's current SECTION are the same state. A call site that reaches past the role set is how a role set ends up with consumers that do not know it exists.
- **An array frontmatter field is a LIST (user ruling 2026-08-01).** `sources`/`aliases` were `value.join(' · ')` — one run-on string, so three file paths ran off the right edge of the panel with no way to see where one ended. They stack one per line, and `.docs-frontmatter-value` finally carries the `min-width: 0` half of the flex contract that let a long value overflow at all.
- **The unnamed key is a label too (user ruling 2026-08-01).** `FIELD_LABELS[key] ?? key` printed an unlisted field raw — `imported_from`, snake_case, in a column where every neighbour is sentence case. It falls back to a humanised label now, cased at the data layer as the no-`text-transform` law requires.
- **ONE search (user ruling 2026-08-01).** `TagModeOverlay` owned a second search — a raw `Input` driving `tag.toLowerCase().includes(q)` — over a corpus the shell's index already covered. It is **deleted, not aligned**: tags are rows in `buildShellSearchItems` carrying an `action` closure instead of an `href`, so the one modal finds a tag the way it finds a doc. The overlay browses (list + graph); it does not search.
- **Tag mode's `view` lives in the CONTEXT.** `openTagMode(tag, { view })` — the overlay held local `viewMode`, so the graph was reachable only by finding an unlabelled hex glyph inside the already-open overlay. The rail's **Graph view** row needs to name the mode before the overlay exists.
- **Tags: no `color`, no `size` (user ruling 2026-08-01).** Passing `color` swaps the base class from `tag-control` to `tag tag--{color}`, and **only `tag-control` has a `:hover` rule** — a coloured Tag silently loses its interaction state. `sm` is the default and the only size; `lg` is never used. Colour returns later as its own decision.
- **The TOC rail holds its grid track even when empty (user ruling 2026-08-01).** The track is `--kol-shell-toc-w`, not `auto`, and mounts on `!tocCollapsed` alone. It used to collapse to zero on heading-less routes so main could reclaim the space — which made the layout a property of page content. Collapsing is a user action and may change the layout; content appearing may not.

### Known gaps (carried, not silently faked)

| Gap | State |
|---|---|
| 5 frontmatter field icons (`type`, `calendar`, `layers`, `tag`, `clock`) | **no v1 equivalent** → icon dropped, label kept. Author them into v1 to restore. |
| `share-2` (tag graph-view toggle) | remapped to `polygon` (closest v1 node-graph glyph) — eyeball it. |
| `dock-right` (DS `ShellHeader`'s TOC-rail toggle) | no `panel-right` in v1 → legacy fallback in the DS component itself (pre-existing, not ours). |
| `ShellHeader` prop API | DS `ShellHeader` is **not** a drop-in for the monorepo one — `ShellLayout` adapts `routes`→`nav`, builds a `brand` node, `onSearchOpen`→`actions` slot, `onMenuOpen`→`onMenuClick`. |

## Provenance

Lifted from `kol-monorepo/apps/web`: `components/shell/*`, `components/workshop/**`, `routes/workshop/*`, `utils/parseDocsMarkdown.jsx` + `docsHelpers.js`, `data/workshop/*`. The monorepo repoints onto this package next (see the migration brief at the monorepo root).

## Status

- **Not render-tested.** Everything is static-verified only (parse + grep + engine self-check). First live render is the acceptance gate — watch the `.shell-*` / `.kol-btn` cascade.
- Package is `private: true` until the render passes; flip + publish after eyeball.
