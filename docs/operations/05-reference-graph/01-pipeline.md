---
title: Reference-graph pipeline
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The five stages, the scale, the canon bar
aliases:
  - reference-pipeline
  - deletion-guard
tags:
  - domain/reference-graph
  - audience/agency-internal
related:
  - "[[INDEX|reference graph]]"
  - "[[../04-content-pipeline/01-sources|content pipeline — sources]]"
  - "[[../../documentation/03-components/01-inventory|component inventory]]"
---

# The reference-graph pipeline

## Measures

Every artifact records what it reused and how strongly. The weighted inbound sum
replaces a raw count, which makes **high reference = canon** a threshold crossing
instead of an opinion.

| Reading, 2026-08-01 | |
|---|---|
| referenced nodes | **663** |
| canon bar | **60★** — derived as 3× the median of 20, never a constant |
| nodes at or above it | **81** |
| most load-bearing | `Icon` 2113★ across 577 edges, then `Button` 1281★ across 319 |
| defined but referenced by nothing | tokens with no inbound — dead weight the graph names |

## Derivation

> **An edge exists only if changing or deleting A would change or break B.**

That is derivation, not co-occurrence, and it is what stops the graph flooding.
The extractors read only what a file *uses*, so the property is structural rather
than a filter to tune:

| Pair | Edge? | Why |
|---|---|---|
| a component → the radius token it uses | **yes** | change the token, the component changes |
| `color-300` → `color-400` | **no** | siblings of one ramp; neither derives from the other |
| two swatches on one wheel | **no** | co-membership is not derivation |
| both → the ramp that defines them | **yes** | that is the real parent |
| two components on one page | **no** | co-use is the page's edge, not theirs |

**Everything has a parent; almost nothing has siblings.**

## Five stages

| # | Stage | Here | File |
|---|---|---|---|
| 1 | **discover** | this repo's vocabulary is known, so the probe is skipped — `--kol-*` and `packages/*/src` are stated, not guessed | — |
| 2 | **define** | every declared custom property, class and exported component becomes a node | `scripts/extract-tokens.mjs` |
| 3 | **extract** | edges from what a file uses; **only a component's own source may author its edges** | `scripts/extract-usage.mjs` · `sync-mdx-frontmatter.mjs:75` |
| 4 | **weight** | computed, never declared; a hand-set star is reported as a disagreement, never overwritten | `sync-mdx-frontmatter.mjs:280-287` |
| 5 | **consume** | canon bar · deletion guard · lineage | `scripts/validate-references.mjs` · `/references` |

**Stage 3's restriction is load-bearing.** `showcase/src/demos/` holds a same-named
file per component, and a demo rendering `<Accordion>` once made the AccordionPanel
page claim it reused Accordion. `isSource()` restricts authorship to
`packages/<pkg>/src/`.

**We extended, we did not fork.** `extract-usage.mjs` already mined consumer usage;
the graph added per-file edge tracking and an internal-composition pass to it, in a
**separate field** so `count` / `apps` keep meaning real-world consumer usage. Two
extractors would produce two graphs that disagree, which is worse than none.

## Elsewhere

| Page | What it holds |
|---|---|
| [[02-scale\|Star scale]] | What a star means, and the canon bar |
| [[03-using-it\|Using the graph]] | Queries, commands, and the stated limits |
