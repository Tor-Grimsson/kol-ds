---
title: Versioning & testing
type: reference
status: active
updated: 2026-06-26
description: How package-shipping teams version and guard a design system — Changesets for semver/changelogs, visual regression (Chromatic / Playwright), and accessibility checks (axe).
tags:
  - domain/design-system
  - domain/workflow
  - domain/testing
aliases:
  - versioning-testing
related:
  - "[[05-distribution|distribution]]"
  - "[[02-workbench-tools|workbench tools]]"
---

# Versioning & testing

The "ship without breaking consumers" axis. Teams that **publish** a system (model 1 in [[05-distribution|distribution]]) invest here; solo setups tend to skip it until something breaks for a downstream user.

## Versioning

The problem: a published system needs **version bumps + changelogs**, and a multi-package repo needs them **coordinated**.

| Tool | What it does |
|---|---|
| **Changesets** | The DS standard. You write a small **changeset** file per change (which packages, what semver bump, a human note). At release it **aggregates them into version bumps + a changelog + publishes**. Monorepo-aware — handles inter-package dependency bumps. |
| **semantic-release** | Alternative — derives the version automatically from **conventional commit messages**, no manual changeset file. Less common for multi-package UI repos. |

Changesets workflow:

1. Make a change → `npx changeset` → pick packages + bump level + write a note.
2. Commit the generated `.changeset/*.md` alongside the code.
3. On merge, a release step consumes all pending changesets → bumps versions, writes `CHANGELOG.md`, publishes.

It also replaces `workspace:*` with the **real resolved version** at publish time — internal links never leak to consumers.

## Testing — three layers

### Visual regression

Screenshot every component state, **diff against a baseline**, flag pixel changes. Catches "this refactor moved a border" that unit tests miss.

| Tool | Shape |
|---|---|
| **Chromatic** | Hosted, by the Storybook team. Screenshots every **story** per commit, gives a review/approve UI. Paid. |
| **Playwright** | Self-hosted — `toHaveScreenshot()` against rendered components/stories. Free, you own the baselines + CI wiring. |
| **Percy** | Hosted, BrowserStack. Same idea as Chromatic, tool-agnostic. |

Stories (rung 2 of the [[01-component-workbench|workbench]]) are the input — visual regression reads them directly.

### Accessibility

Automated a11y catches a meaningful slice of issues (missing labels, contrast, ARIA misuse) — not all, but cheap.

| Tool | Shape |
|---|---|
| **axe-core** | The engine everything wraps. Rules-based a11y scan. |
| **Storybook a11y addon** | Runs axe against each story, flags violations **inline in the workbench**. |
| **jest-axe / Playwright + axe** | axe in the test runner — fails CI on violations. |

### Interaction

Script user behavior (click, type, assert) and replay it as a test.

- **Storybook `play` functions** — interaction tests attached to a story, using Testing Library syntax; run in the workbench and in CI.
- **Testing Library + Vitest/Jest** — the same, outside a workbench.

## What "skipping this" looks like

The solo baseline: no changesets (hand-edited versions or none), no visual regression (eyeball it), no automated a11y. **Fine until you have consumers** — at which point a silent visual or a11y regression ships to every app at once, and an un-versioned breaking change has no changelog to explain it.
