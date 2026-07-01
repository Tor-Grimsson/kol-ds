---
title: KOL design-system docs
type: index
status: active
updated: 2026-06-26
description: Front door to the KOL docs — routes you by task. New here? Start with the workbench walkthrough.
aliases:
  - docs
  - docs-home
tags:
  - domain/design-system
related:
  - "[[workbench/01-using-the-workbench|using the workbench]]"
  - "[[_framework/INDEX|framework]]"
---

# KOL design-system docs

Everything documented about the KOL (Kolkrabbi) design system — how to use it, how it's built, how it compares, and what's planned. This page routes you; you shouldn't have to guess which folder to open.

> [!tip] New here, and you just want to *use* the design system?
> → **[[workbench/01-using-the-workbench|Using the workbench]]** — start the component browser and view every component and all its states, step by step. That's the only walkthrough you need to get going.

## Find your path

| I want to… | Go to |
|---|---|
| **Use the design system — run the workbench, view components & their states** | **[[workbench/01-using-the-workbench\|Using the workbench]]** ← start here |
| Look up how one component is used (props, real call-sites) | `usage/` — one file per component (`Button.md`, `Icon.md`, …), mined from real KOL apps |
| Learn how other teams build design systems (Storybook, tokens, distribution…) | [[workflows/INDEX\|Workflows]] |
| See how KOL compares to shadcn/ui, and the gaps | [[benchmark/INDEX\|shadcn ⇄ KOL benchmark]] |
| Understand the architecture & the load-bearing decisions | [[llm-context/ARCHITECTURE\|Architecture]] |
| Know the current state / what's in flight | [[llm-context/AGENT-CONTEXT\|Agent context]] |
| Read planned or in-progress restructures | [[migration/2026-06-26-workbench-adoption\|workbench plan]] · [[migration/2026-06-18-src-first-restructure\|src-first plan]] |
| Author or fix a doc (the spec these docs follow) | [[_framework/INDEX\|Framework]] |

## The folders

| Folder | What's in it | Mainly for |
|---|---|---|
| **`workbench/`** | How to run and use the Ladle component browser | **Users — start here** |
| `usage/` | One reference file per component, mined from real KOL apps | Users + agents |
| `workflows/` | The design-system landscape — how others isolate, compose, token, distribute, test | Learning / decisions |
| `benchmark/` | KOL vs shadcn/ui — side-by-side comparison + prioritised gaps | Strategy |
| `migration/` | Forward-looking plans (dated) | What's coming |
| `llm-context/` | Architecture, current state, session logs | Agents + maintainers |
| `_framework/` | The doc spec every doc here conforms to | Doc authors |

## Two kinds of doc here

- **To use or understand the system** → `workbench/`, `usage/`, `workflows/`, `benchmark/`. Start here as a human.
- **Maintenance & meta** → `llm-context/` (architecture, current state, logs), `migration/` (plans), `_framework/` (the doc spec). Real, but not where a user begins.
