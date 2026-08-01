---
title: The content pipeline
type: index
status: active
updated: 2026-07-31
description: How seven content roots become one showcase — the audience split that governs where content may live, the manifest that builds the sidebar, and the taxonomy that names what the reader sees.
aliases:
  - content-pipeline
  - parsing-system
  - port-hub
tags:
  - domain/workflow
  - domain/design-system
  - pattern/docs-as-data
related:
  - "[[01-sources|the seven content roots]]"
  - "[[02-taxonomy|categories, chapters, pages]]"
  - "[[03-manifest|the nav manifest]]"
  - "[[04-conventions|conventions and gates]]"
  - "[[05-lookup|lookup]]"
  - "[[../INDEX|operations]]"
  - "[[../../documentation/04-compositions/02-shells|shells]]"
---

# The content pipeline

This repo serves its own documentation. The showcase at `ui.kolkrabbi.io` is a live Vite app whose sidebar, pages and search are **derived** from content that lives in seven different places — this vault among them. That wiring was built incrementally and never written down, and on 2026-07-30 it produced a sidebar that called a *chapter* a *category*, which made a one-category-at-a-time port read as structurally wrong. This section is the answer to "who is allowed to write what, where, and what reads it."

## Why

> The design system is documented in `docs/`. The showcase renders `docs/`. So `docs/` is both **your reading material** and **the app's database** — and those two roles have different rules. When they were never separated, a machine-written catalog of 219 files landed inside a numbered human chapter sequence and became load-bearing.

## The law

| Root | Audience | Written by | May be read by |
|---|---|---|---|
| `docs/` | **you** — the human vault | humans, by hand | anyone, including the app |
| `.kol/` | **agents** — state, plans, session logs | agents | agents |
| `showcase/src/` | **the machine** — app content + generated output | humans (MDX, demos) + generators (JSON) | the app only |

**The rule that was broken:** generated output never lands in `docs/`. A generator may *read* the vault; it may not *write* into it. Machine-written catalogs belong in `showcase/src/`, beside the JSON the app actually consumes.

## The pipeline

```
SOURCES                          DERIVATION                    SURFACES
─────────────────────────        ────────────────────────      ─────────────────────
packages/*/src/index.js   ──┐
docs/**/*.md              ──┤
showcase/src/docs/*.mdx   ──┼──▶  showcase/src/lib/       ──▶  left rail (tree)
showcase/src/demos/*      ──┤     roster · vault ·             right rail (TOC)
showcase/src/blocks/*     ──┤     shell-nav · registry ·       ⌘K search
showcase/src/sets/*       ──┤     classification · admitted    routes / pages
showcase/src/usage/*.json ──┘                                  tag graph
```

Three stages, and each has its own doc:

| Stage | Doc | The question it answers |
|---|---|---|
| **Sources** | [[01-sources\|01 — sources]] | What are the seven roots, who writes each, and what reads it? |
| **Taxonomy** | [[02-taxonomy\|02 — taxonomy]] | What is a category, a chapter, a page — and why is Foundations not a category? |
| **Derivation** | [[03-manifest\|03 — the manifest]] | Which six files build the sidebar, and why a manifest of pointers rather than a mirrored folder tree? |
| **Rules** | [[04-conventions\|04 — conventions]] | Naming, generated folders, frontmatter, and which gate enforces each rule. |
| **At a glance** | [[05-lookup\|05 — lookup]] | One page, every path, every owner, every gate. |
| **The tree itself** | [[06-manifest-tree\|06 — manifest tree]] | **GENERATED** (`pnpm extract:manifest`) — every category, chapter and page with its source path and renderer. |

## Three decisions

1. **Audience owns the root.** `docs/` is human-authored. Generated catalogs move to `showcase/src/usage/`. See [[01-sources|sources]].
2. **The sidebar is a manifest of pointers, not a folder of copies.** Content stays where it is authored; one manifest names and orders it. See [[03-manifest|the manifest]].
3. **Category → chapter → page, three levels, and a surface is not a category.** See [[02-taxonomy|taxonomy]].
