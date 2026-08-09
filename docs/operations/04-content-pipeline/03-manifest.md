---
title: Nav manifest
type: decisions
status: active
created: 2026-07-31
updated: 2026-08-01
description: Why the sidebar is pointers, not a mirror
aliases:
  - nav-manifest
  - system-pipeline
tags:
  - domain/content-pipeline
  - audience/agency-internal
  - pattern/docs-as-data
related:
  - "[[INDEX|content pipeline]]"
  - "[[01-sources|the seven content roots]]"
  - "[[02-taxonomy|categories, chapters, pages]]"
---

# The nav manifest

## The decision

**The sidebar is a manifest of pointers. Content is never copied into a second tree.**

A manifest names and orders material that stays where it was authored. The rejected alternative — a `port-hub/` folder whose subfolders mirror the sidebar shape — is a second copy of the tree that must be kept in agreement with the first, forever, by hand. Two trees always drift; this repo has already paid that bill twice (the vendored shell fork, the hand-maintained TOC arrays).

## The models

Every docs system solves this the same way — one content root, one nav manifest. They differ only in whether the manifest is central or distributed.

| System | Manifest | Shape |
|---|---|---|
| Docusaurus | `sidebars.js` | one central file, tree of ids |
| shadcn/ui | `config/docs.ts` | one central file, tree of `{title, href}` |
| VitePress / Starlight | `themeConfig.sidebar` | one central config |
| Nextra | `_meta.json` per folder | **distributed** — each folder describes itself |
| Storybook | none — each story's `title` string | derived, fully distributed |

**Chosen: the central manifest (Docusaurus / shadcn model).** Not because the showcase apes shadcn's front end — the two questions are unrelated — but because of one fact about this repo:

> Content comes from **seven roots**, not one. A distributed `_meta.json` can only describe the folder it sits in. It cannot express a sidebar that interleaves package barrels, MDX files and vault markdown, because no single folder contains them.

Two further facts settle it:

1. **The quarantine gate is inherently global.** `admitted.js` decides which categories appear at all. A per-folder manifest has nowhere to put a cross-cutting gate.
2. **Most rows aren't files.** The Components category is derived from 19 package barrels — there is no folder to drop a `_meta.json` into.

## Row shape

Every row the manifest declares carries five fields. `render` is the one that keeps the taxonomy honest — [[02-taxonomy|a page is a slot]], so the row must say how it fills.

| Field | Holds | Example |
|---|---|---|
| `id` | stable handle, never reused, never renumbered | `foundations-tokens` |
| `label` | authored display text, exact case | `Tokens` |
| `path` | the route | `/documentation/01-foundations/01-tokens` |
| `source` | where the content is authored | `docs/documentation/01-foundations/01-tokens.md` |
| `render` | which renderer fills the slot | `vault` · `mdx` · `page` |

`render` values map to the three renderers that already exist:

| Value | Renderer | Source kind |
|---|---|---|
| `vault` | `DocumentationReader` | a `docs/**/*.md` file |
| `mdx` | `MdxDoc` | a `showcase/src/docs/*.mdx` file — markdown with live components inside |
| `page` | a React component | a `showcase/src/pages/*.jsx` route |

A fourth renderer is a fourth value here. It is never a fourth level in the category/chapter/page ladder.

## Existing manifest

It is six files in `showcase/src/lib/`, ~1,050 lines, with no name and no index tying them together. That anonymity is why a chapter got promoted to a category with nobody noticing.

| File | Lines | Owns |
|---|---|---|
| `registry.js` | 352 | joins roster + usage + docs into the per-component record |
| `classification.js` | 206 | tier assignment for flat packages |
| `shell-nav.js` | 170 | `ALL_ROUTES` / `SHELL_ROUTES`, search items, tree builders |
| `admitted.js` | 145 | **the quarantine gate** — which chapters and categories the shell may show |
| `chapter-pages.js` | 36 | slot-pages — live routes belonging to a vault chapter, shared with `extract-manifest.mjs` |
| `vault.js` | 109 | globs `docs/**/*.md`, builds the vault tree + search + tag inventory |
| `roster.js` | 71 | every component, derived from the package barrels |

### The rename — done 2026-07-31

They live at `showcase/src/nav/` with an `index.js` barrel whose header names the system and points here. Behaviour is unchanged; the point is that the system acquired a name, so the next reader meets one thing rather than seven unrelated helpers.

| Before | After |
|---|---|
| `showcase/src/lib/{registry,classification,shell-nav,admitted,vault,roster}.js` | `showcase/src/nav/*` + `showcase/src/nav/index.js` |

## Rail split

They are, correctly, separate — and only the left one is a manifest.

| Rail | Built from | Rule |
|---|---|---|
| **Left** | the manifest — categories, chapters, pages | declared and ordered; a row exists because the manifest says so |
| **Right** | the rendered page — headings scraped from the DOM, plus per-route data (tags, related, quick actions) | derived at render; never declared, so it cannot go stale |

The right rail must stay derived. The moment a page has to declare its own TOC, the hand-maintained arrays come back — that is the exact thing `AutoToc` replaced on 2026-07-30.

## Today

This section describes the target. Three things in the code do not match it yet, recorded here so the difference is a known distance rather than a discovery:

| Today | Target | Where |
|---|---|---|
| ~~The section label is the string `"Showcase"`~~ — **done 2026-07-31.** The rail is `Documentation` · `Components` · `Tools`; Foundations and Icons left `ALL_ROUTES` and became chapters, with their live pages as slot-pages inside them | — | `ShellChrome.jsx`, `shell-nav.js`, `chapter-pages.js` |
| ~~Chapters resolve only under `documentation/`~~ — **done 2026-07-31.** The grouping key is now `docs/<category>/<chapter>/…` for every root; Operations renders its four chapters, and a chapter's own subfolders (`06-research/workflows/`) fold into the chapter rather than becoming a fourth rung | — | `vault.js`, the `VAULT_TREE` grouping key |
| ~~`foundations` sits in `ALL_ROUTES` as a peer of `documentation`~~ — **done 2026-07-31.** The admission gate keys on chapter, so admitting Foundations opens chapter 01 inside Documentation | — | `shell-nav.js`, `admitted.js` |
| ~~The six files are unrelated helpers in `lib/`~~ — **done 2026-07-31.** One named system at `showcase/src/nav/`, barrel included | — | `showcase/src/nav/` |

The vault grouping is the substantive one: it hardcodes that only `documentation/` has chapters, which is exactly the assumption that let a chapter be mistaken for a category. Everything else is a label or a move.

## Non-goals

- **It may not hold content.** Titles, order and pointers only. A description that belongs to a doc belongs in that doc's frontmatter.
- **It may not fork a source.** If the manifest and a barrel disagree about whether a component exists, the barrel wins and `pnpm validate:roster` fails the build.
- **It may not silently hide.** A held category is invisible in the tree but still routable and still findable by name in ⌘K — enforced by `validate-reachable`.
