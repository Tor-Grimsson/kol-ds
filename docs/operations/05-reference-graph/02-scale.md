---
title: Star scale
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: How an edge earns its rating
tags:
  - domain/reference-graph
  - audience/agency-internal
related:
  - "[[INDEX|reference graph]]"
  - "[[01-pipeline|the pipeline]]"
---

# Star scale

What a star means, and where the canon threshold comes from.

## Star scale

| ★ | Rule |
|---|---|
| **5** | the file's only KOL component import, used 3+ times — a near-copy or thin wrapper |
| **4** | imported and used 3+ times |
| **3** | imported, used once or twice |
| **2** | a namespaced class or token used 3+ times |
| **1** | used once |

Five 1★ dependents are not one 5★ dependent — a bare count cannot tell a near-copy
that breaks from a page that loses one element.

**Hand-rated 2026-08-01: 9 of 9 sampled edges agreed with the rule** (four 5★, three
4★, two 3★, verified by reading each source file). That is the first validation
against human judgement in either repo; the sample is small and the other ~540 edges
remain unchecked.

## Canon bar

```js
const weights = nodes.map((n) => n.weighted).sort((a, b) => a - b)
const median = weights[Math.floor(weights.length / 2)]
const threshold = Math.max(median * 3, 2)
```

**A multiple of the median, not a constant** — so the bar moves with the repo instead
of ageing into a lie.

> ⚠ This is transcribed in **two** places — `scripts/validate-references.mjs:57-59`
> and `showcase/src/pages/References.jsx:60-62`. They agree today. Two
> hand-maintained sources always drift, which is this repo's own standing rule and
> the documented cause of the `.text-fg-*` vs `--kol-fg-*` duplication.
