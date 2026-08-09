---
title: Content-pipeline lookup
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: Where do I put this, in one table
aliases:
  - pipeline-lookup
  - cheatsheet
tags:
  - domain/content-pipeline
  - audience/agency-internal
  - pattern/docs-as-data
related:
  - "[[INDEX|content pipeline]]"
  - "[[01-sources|the seven content roots]]"
  - "[[04-conventions|conventions and gates]]"
---

# Lookup

One page. Nothing here is new — it is the rest of the section, compressed.

## Placement

| I am writing… | It goes | Prefix |
|---|---|---|
| a design-system rule, for humans | `docs/documentation/<NN-chapter>/` | `NN-` |
| repo process, for humans | `docs/operations/<NN-chapter>/` | `NN-` |
| agent state, plan, session log | `.kol/llm-context/` | per that folder |
| a component's doc page | `showcase/src/docs/components/<Name>.mdx` | none |
| a standalone doc page | `showcase/src/docs/<kebab>.mdx` | none |
| a live demo | `showcase/src/demos/<kebab>.jsx` | none |
| generator output | `showcase/src/usage/` | generator's own |
| a supporting image | nearest `_assets/` | none |
| a supporting non-renderable | nearest `_files/` | none |

## Seven roots

| Root | Files | Human or machine | Feeds |
|---|---|---|---|
| `docs/**/*.md` | 54 | human | Documentation surface, vault tree, ⌘K, tags |
| `showcase/src/demos/` | 179 | human | live previews |
| `showcase/src/docs/*.mdx` | 70 | human | component + standalone doc pages |
| `showcase/src/blocks/` | 22 | human | Blocks |
| `packages/*/src/**/index.js` | 19 | human (code) | the component roster |
| `showcase/src/usage/**` | 225 | **machine** | mined examples, token index |
| `showcase/src/sets/` | 8 | human | Sets |

## The manifest

| File | Owns |
|---|---|
| `roster.js` | every component, from the package barrels |
| `classification.js` | tier assignment for flat packages |
| `registry.js` | roster + usage + docs joined per component |
| `vault.js` | `docs/**/*.md` → tree, search, tag inventory |
| `shell-nav.js` | routes, surfaces, search items, tree builders |
| `chapter-pages.js` | slot-pages — live routes that belong to a vault chapter |
| `admitted.js` | the quarantine gate — what the shell may show, keyed per chapter |

`showcase/src/nav/`, with an `index.js` barrel ([[03-manifest|why]]). `chapter-pages.js` is shared with `scripts/extract-manifest.mjs`, so the app and the generated tree read one editorial map.

## Three levels

| Level | Is | Is not |
|---|---|---|
| **CATEGORY** | Documentation · Operations · Components | a route, an app, a surface |
| **CHAPTER** | `01-foundations` · `03-components` | a category, however important |
| **PAGE** | one doc, one component | a group of anything |

Blocks · Sets · References · Quarantine are **surfaces** — tools the app serves. Not categories.

## The gates

| Command | Fails when |
|---|---|
| `pnpm validate` | any of the twelve below fails; prints one scoreboard |
| `validate:roster` | roster and barrels disagree |
| `validate:taxonomy` | a component has no tier, or `misc` is non-empty |
| `validate:groups` | sidebar groups incomplete or overlapping |
| `validate:imports` | a cross-package import runs the wrong direction |
| `validate:foundations` | the foundations page hardcodes a value instead of reading the theme |
| `validate:width` | main isn't capped at canvas · a hardcoded pixel max-width · uncapped panel content |
| `validate:rails` | a rail row or label breaks the one idiom |
| `validate:frontmatter` | MDX frontmatter is out of contract |
| `validate:references` | a load-bearing component is deleted with dependents still on it |
| `validate:vault-links` | a `docs/` wikilink doesn't resolve by path |
| `validate:drift` | a generated artifact no longer matches its source |
| `validate:reachable` | a route can't be found by name in ⌘K, or a slot-page has no search row / no Route |

## The regenerators

| Command | Writes |
|---|---|
| `pnpm extract:usage` | `usage-index.json` |
| `pnpm extract:docs` | doc meta · API rows · composition · origins |
| `pnpm extract:tokens` | token index + the token-graph markdown |
| `pnpm extract:manifest` | [[06-manifest-tree\|the manifest tree]] |
| `pnpm extract:graph` | usage + tokens + MDX frontmatter |
| `pnpm sync:mdx-frontmatter` | MDX frontmatter blocks |

## Three laws

1. **Audience owns the root** — `docs/` human · `.kol/` agent · `showcase/src/` machine. The line is app-content vs documentation: a generated catalog the app renders never lands in `docs/`; a generated document about the repo may, if its parent INDEX marks it generated.
2. **The sidebar is a manifest of pointers** — content stays where it is authored; nothing is mirrored.
3. **Category → chapter → page** — and a surface is none of the three.
