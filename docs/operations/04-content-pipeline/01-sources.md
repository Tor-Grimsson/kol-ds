---
title: The seven content roots
type: reference
status: active
updated: 2026-08-01
description: Every place showcase content is authored or generated — who writes it, what reads it, whether it is hand-authored or machine-written, and the rule that keeps generated output out of the human vault.
aliases:
  - content-roots
  - source-paths
tags:
  - domain/workflow
  - domain/design-system
  - pattern/docs-as-data
related:
  - "[[INDEX|content pipeline]]"
  - "[[03-manifest|the nav manifest]]"
  - "[[04-conventions|conventions and gates]]"
---

# The seven content roots

Nothing in the showcase is hand-maintained twice. Every surface is derived from one of these seven roots. Counts are from 2026-07-31.

| # | Root | Files | Authored by | Read by | Feeds |
|---|---|---|---|---|---|
| 1 | `docs/**/*.md` | 54 | **human** | `showcase/src/lib/vault.js` (eager glob) | Documentation surface, vault tree, ⌘K, tag graph |
| 2 | `showcase/src/demos/` | 179 | human | `demos-registry.js` | live previews on component pages |
| 3 | `showcase/src/docs/*.mdx` | 70 | human | `@mdx-js/rollup` + `MdxDoc.jsx` | component doc pages, the four standalone doc pages |
| 4 | `showcase/src/blocks/` | 22 | human | `shell-nav.js` | Blocks surface |
| 5 | `packages/*/src/**/index.js` | 19 barrels | human (as code) | `scripts/lib/parse-barrel.mjs` → `roster.js` | the component roster — every component that exists |
| 6 | `showcase/src/usage/**` | 225 | **generated** (`extract-usage.mjs`) | `registry.js` | mined call-site examples, token index |
| 7 | `showcase/src/sets/` | 8 | human | `shell-nav.js` | Sets surface |

## Root 1

`vault.js` globs `docs/**/*.md` **eagerly, with `?raw`** — so every markdown file in this vault is bundled into the app, searchable, tagged, and routable. That is by design: the vault is the Documentation surface.

The consequence nobody wrote down: **anything written into `docs/` becomes app content.** A generator that emits into the vault is not adding documentation, it is shipping a payload.

### Where the line actually falls

Not *generated vs authored* — **app content vs documentation**. A generator may write into `docs/` when its output is a document about the repo that a human reads; it may not when its output is a database the app renders.

| Output | Belongs in | Why |
|---|---|---|
| 219 mined per-component usage files | `showcase/src/` | a component database — nobody reads it top to bottom, and the app renders it from JSON anyway |
| [[06-manifest-tree\|the manifest tree]] | `docs/` | one document about the repo's own structure, marked generated in this section's INDEX |

The framework already carries this shape — its "Generated folders" clause permits machine-written catalogs in the vault **provided the parent INDEX marks them generated**. The test is whether a person would open it on purpose.

### What went wrong — `07-usage/`

`scripts/extract-usage.mjs` mines JSX call-sites from `kol-apps/*` and `kol-website` and emits two things:

- `showcase/src/usage/usage-index.json` — machine-readable, and **the only one the app renders**
- `docs/documentation/07-usage/<Component>.md` — 219 files, one per component

The second output took **chapter slot 07** in a numbered human sequence, in PascalCase filenames, and bulked the vault from ~50 authored docs to 270. The naming itself is legal — the framework has a clause for exactly this case:

> **Generated folders** (machine-written catalogs, e.g. a mined per-component usage reference): files keep their generator's naming, unprefixed — the generator owns the folder; don't hand-rename its output.
> — `.kol/docs-framework/01-conventions.md`

But legality of the *filenames* was never the problem. A generated catalog is not a **chapter**, and a chapter slot is a claim on the reader's attention. On 2026-07-30 the folder was filtered out of the sidebar tree (`vault.js`, `OFF_TREE`) as a stopgap — it is still bundled, still searchable, still routable.

### The decision — executed 2026-07-31

**Generated output left `docs/`.** `extract-usage.mjs` and `extract-tokens.mjs` now emit to `showcase/src/usage/components/`, beside the JSON that was always the real source. The component page is untouched: it renders from `usage-index.json`, which is where it already read from.

Measured before and after:

| | Before | After |
|---|---|---|
| `docs/**/*.md` | 270 | **54** |
| `showcase/src/usage/components/` | — | **216** |
| `OFF_TREE` filter in `vault.js` | required | **deleted** — nothing left to hide |
| Chapter slot 07 | a generated catalog | free for a chapter a human writes |

Nothing about the content changed; only which root owns it. Nothing read the markdown — `registry.js`, `mdx-components.jsx` and `component-page-parts.jsx` all import JSON, verified before the move.

## Root contents

| Root | May hold | May never hold |
|---|---|---|
| `docs/` | hand-authored markdown, `_assets/`, `_files/`, and a generated document ABOUT the repo when its parent INDEX marks it generated | a generated catalog the app renders, app config, code |
| `.kol/` | agent state — architecture, context, plans, session logs, playbooks | anything a human is expected to read as documentation |
| `showcase/src/` | MDX pages, demos, blocks, sets, generated JSON, generated catalogs | the canonical text of a design-system rule (that lives in `docs/`) |

## The generators

| Script | Reads | Writes |
|---|---|---|
| `extract-usage.mjs` | consumer repos under `~/dev/projects` | `usage-index.json` + `showcase/src/usage/components/*.md` |
| `extract-api.mjs` | package sources | `component-sources.json`, API rows |
| `extract-origins.mjs` | package sources | per-component import provenance |
| `extract-tokens.mjs` | theme + framework CSS | `token-index.json` + the token-graph markdown |
| `extract-manifest.mjs` | `docs/`, package barrels, its own editorial table | [[06-manifest-tree\|the manifest tree]] — the one generated doc that belongs in `docs/` |
| `sync-mdx-frontmatter.mjs` | `showcase/src/docs/*.mdx` | frontmatter blocks in those files (idempotent; `--check` is the gate) |

A generator's output path is part of its contract. Changing where a generator writes is a change to this document first.

## The readers

Two surfaces render them, and they share their cell rendering rather than growing two copies of it (`showcase/src/lib/NodeLabel.jsx` — `NodeLabel` / `NodePreview` / `kindLabel`).

| Surface | Route | Reads |
|---|---|---|
| References | `/references`, `/references/:name` | `usage-index.json` + `token-index.json` via `useGraph()`, exported from `References.jsx` |
| Search results | `/search?q=…` | `buildShellSearchItems()` **plus** the same `useGraph()` nodes, matched by `matchSearchItems` from `@kolkrabbi/kol-workshop/engine` |

**The results page and the ⌘K overlay are one index, not two.** Both call `buildShellSearchItems()` and both run the engine's `matchSearchItems`; the page only adds the reference-graph family, a conditional per-hit preview, and room to show *why* a row matched. A page that re-implemented either would drift from the modal inside a week — the same failure `.text-fg-*` vs `--kol-fg-*` already taught this repo.

**Where a component is used is DERIVED, never authored** (`showcase/src/lib/set-membership.js`).
Every registry already carries each file's raw source, so membership is read
from its `@kolkrabbi/*` import statements across **sets · blocks · demos ·
pages**. An authored list would be a second copy of those imports and would
drift on the first edit.

Two facts, two rows, so neither misleads:

| Row | Answers | Notes |
|---|---|---|
| `in_sets` | which **sets** compose it | absent when zero — never padded with demos |
| `used_in` | every surface that composes it | demos collapse to "N demos"; a demo of X is not usage of X |

The set page reads the same map in the other direction (`membersOf`) to list its
members. Deriving from sets alone was the first attempt and it was too narrow:
`ContentFilters` is composed by `/references` and by **zero** sets, so its page
rendered blank while the mechanism worked perfectly.

**Previews are conditional, never a column of empty boxes.** A colour token renders its swatch, a type class renders itself applied, everything else renders nothing (`hasPreview()` is the predicate).
