---
title: Workbench tools — cut-points on the stack
type: reference
status: active
updated: 2026-06-26
description: Ladle, Histoire, Storybook, Chromatic, and the docs-site approach — each is a cut-point on the workbench stack. What each covers, weight, and stack ownership.
tags:
  - domain/design-system
  - domain/workflow
aliases:
  - workbench-tools
related:
  - "[[01-component-workbench|component workbench]]"
  - "[[06-versioning-testing|versioning & testing]]"
---

# Workbench tools

The tools aren't really competitors — they're **cut-points on the stack** in [[01-component-workbench|the workbench guide]]. Each climbs to a different rung.

## The tools

| Tool | Builder | Stops at (rung) | Weight | Framework |
|---|---|---|---|---|
| **Ladle** | Vite-native | stories + light controls | light | React only |
| **Histoire** | Vite-native | stories + controls | light | Vue-first (others partial) |
| **Storybook** | Vite (or Webpack) | the whole stack | heavy | framework-agnostic |
| **Chromatic** | — (SaaS on Storybook) | visual regression only | hosted | via Storybook |
| **Docs-site playground** | your docs framework | stories baked into docs | varies | varies |

## Ladle

Vite-native, **React-only**, built by Uber. Covers isolated rendering + stories + light controls — the **lower rungs cheaply**. Reuses your Vite config, minimal own-config, fast cold start. Small addon surface by design.

Pick it when the value you want is **isolated dev + a stories sidebar**, not the full testing pipeline.

## Histoire

Vite-native, **Vue-first** (React/Svelte support exists but is secondary). Same conceptual slice as Ladle — stories + controls. **Maintenance has gone quiet**; weigh that before adopting.

## Storybook

Climbs the **whole stack**. Framework-agnostic, Vite or Webpack builder. The **addon ecosystem is the payoff**:

- **Controls** — auto-generated prop knobs.
- **a11y addon** — runs axe against each story, flags violations inline.
- **Viewport** — responsive testing.
- **Interactions** — script and replay user behavior (`play` functions), assert inside the story.

Cost: a real dependency with its own config and build; **major-version upgrades have historically been painful**. Earns its weight when you want the full docs + testing pipeline; overkill for just isolated dev.

## Chromatic

Not a workbench — a **cloud visual-regression + review** service by the Storybook team, built **on your stories**. Screenshots every story per commit, flags pixel diffs, gives a review/approve UI. Paid. This is rung 5 as a hosted service. See [[06-versioning-testing|versioning & testing]].

## Docs-site playground

Skip a dedicated tool: **bake a live component playground into a docs framework** (e.g. an MDX-based docs site). You get isolated rendering + docs in one surface, but you build the controls/testing rungs yourself. Common when the system already ships a public docs site.

## Choosing by stack ownership

- Want **rungs 1–2** (isolated dev + stories as docs)? → Ladle (React) is the lean cut.
- Want **rungs 3–4** (controls, a11y, interaction tests)? → Storybook earns its weight.
- Want **rung 5** (visual regression in CI)? → Storybook **+** Chromatic (or Playwright screenshots, see [[06-versioning-testing|versioning & testing]]).

None are mutually exclusive with a docs site — many teams run a workbench for dev **and** a separate docs site for consumers, wiring the same stories into both.
