---
title: Design-system workflows — how other teams work
type: index
status: active
updated: 2026-06-26
description: The dimensions where design-system workflows diverge — isolation, composition, tokens, distribution, versioning — and the tools that cover each. A reference map, not a recommendation.
tags:
  - domain/design-system
  - domain/workflow
aliases:
  - workflows
  - ds-workflows
related:
  - "[[../benchmark/INDEX|shadcn ⇄ KOL benchmark]]"
  - "[workbench adoption plan](../../../../.kol/llm-context/migration/2026-06-26-workbench-adoption.md)"
---

# Design-system workflows

How teams and popular open-source design systems work, mapped along the axes where they diverge from a hand-built setup. Reference material — what's out there, what each thing is for. No recommendations.

The differences are rarely about React or Tailwind themselves. They're about **how you isolate, compose, source, distribute, and version** components.

## The five axes

| # | Axis | Question it answers | Doc |
|---|---|---|---|
| 1 | **Isolation** | Where do you build a component — in the app, or outside it? | [[01-component-workbench\|workbench]] · [[02-workbench-tools\|tools]] |
| 2 | **Composition** | How do you get from utility classes to a real, accessible component? | [[03-composition-layer\|composition layer]] |
| 3 | **Tokens** | Where do design values live, and what consumes them? | [[04-tokens\|tokens]] |
| 4 | **Distribution** | How does the system reach the apps that use it? | [[05-distribution\|distribution]] |
| 5 | **Versioning & testing** | How do you ship changes without breaking consumers? | [[06-versioning-testing\|versioning & testing]] |

## The contrast baseline

Each doc compares against the **hand-rolled solo setup**: build components inside a running app, design values in the Tailwind config, conditional class strings, no isolated test surface. That's the common starting point — these axes are the directions teams move *away* from it.

## Reading order

The numbering is the suggested arc — dev-time tooling first, then composition, then the ship-it concerns. Each doc stands alone; jump to whichever axis is live.
