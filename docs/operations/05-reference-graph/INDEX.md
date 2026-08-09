---
title: Reference graph
type: index
status: active
created: 2026-08-01
updated: 2026-08-01
description: What depends on what, expressed as arithmetic
aliases:
  - reference-graph
tags:
  - domain/reference-graph
  - audience/agency-internal
related:
  - "[[../INDEX|operations]]"
  - "[[01-pipeline|the pipeline]]"
  - "[[../04-content-pipeline/INDEX|04 — content pipeline]]"
---

# Reference graph

**What depends on what, with a weight.** Every file in `packages/*/src` is read for
what it *uses*, each use becomes a rated edge, and the weighted inbound sum tells you
which artifacts are actually load-bearing.

| Doc | Covers |
|---|---|
| [[01-pipeline\|01 — the pipeline]] | the five stages, the derivation rule, the star scale, the canon bar, the commands, and the known limits |

**Live at** `/references` (ranked nodes, filterable) and `/references/:name` (one
node's dependents — the deletion guard). Gate: `pnpm validate:references`.

Adopted 2026-08-01 on the user's ruling. The blueprint is humpty's
(`kol-dumpty/humpty/docs/documentation/03-surveyor/`); this implementation is ours.
