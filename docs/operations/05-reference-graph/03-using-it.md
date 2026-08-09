---
title: Using the graph
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The queries, the commands, the limits
tags:
  - domain/reference-graph
  - audience/agency-internal
related:
  - "[[INDEX|reference graph]]"
  - "[[01-pipeline|the pipeline]]"
---

# Using the graph

What the graph answers, how to regenerate it, and what it deliberately cannot tell you.

## Queries

| Query | Mechanism |
|---|---|
| **canon** | anything above the bar is de-facto canon whether or not it was declared |
| **deletion guard** | `/references/:name` names every dependent with its star rating — "it will leave a gap" made mechanical |
| **lineage** | inbound edges are the family tree; altering a node enumerates what must be traced |

## Commands

| | |
|---|---|
| `pnpm extract:graph` | regenerate usage + tokens + styling + frontmatter |
| `pnpm extract:tokens` | token/class nodes only |
| `pnpm validate:references` | the gate — fails if a canon node no longer exists |
| `node scripts/validate-references.mjs --trace <node>` | lineage for one node |

> **`--regen-reuses` must never be wired into a pnpm script.** Author-wins is right
> in steady state and wrong exactly once — when a generator bug has already written
> values, the rule freezes the bug forever. It is the named escape hatch for that
> case only. Verified unwired 2026-08-01.

## Known limits

| Limit | Consequence |
|---|---|
| **composition through children is invisible** | `ButtonGroup` takes Buttons as children and imports nothing, so it produces no edge. A real false negative |
| **package imports are opaque** | only local imports resolve to a node; the graph cannot see inside a published dependency |
| **stars are unvalidated beyond the 9-edge sample** | the scale is a rule applied consistently, not a measured truth |
| **JS/TS and CSS only** | the contract is language-neutral; this implementation is not |

## Provenance

An agent working in the **humpty** repo built this directly into this tree,
uncommitted and unrequested, on 2026-07-30. It was filed here as
`lobby/done/ReferenceGraphPipeline.md` for this repo to judge, and adopted
2026-08-01 on the user's ruling.

**humpty owns the blueprint** — the portable contract and a zero-config
`bin/humpty-graph`. **A repo owns its implementation**, and whether to have one.
Their blueprint's own rule decided the shape here: *"implement the contract natively
when the repo already mines its own usage."*
