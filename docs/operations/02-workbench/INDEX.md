---
title: Using the workbench
type: playbook
status: active
created: 2026-07-31
updated: 2026-08-01
audience: internal
description: Zero-knowledge walkthrough of the Ladle workbench
aliases:
  - using-the-workbench
  - workbench-usage
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/component-workbench
related:
  - "[workbench adoption plan](../../../.kol/llm-context/migration/2026-06-26-workbench-adoption.md)"
  - "[[../06-workflows/01-component-workbench|component workbench]]"
---

# Using the workbench

The **workbench** is a Ladle app that renders KOL components in isolation — one component, one state at a time — outside any real app. You use it to build, eyeball, and sanity-check components across every state without clicking through a running product.

A **story** is the unit: a single function that renders one component in one state (e.g. `Button` → `Disabled`). Stories live in `workbench/src/*.stories.jsx` and are grouped by component in the sidebar.

> Assumes the repo is cloned and `pnpm install` has been run. Nothing else.

## The chapter

| Page | What it holds |
|---|---|
| [[01-starting\|Starting the workbench]] | Prerequisites, the start command, reading the layout |
| [[02-browsing\|Browsing components]] | The tree, states, URLs, search, viewport, theme |
| [[03-authoring\|Authoring stories]] | Hot reload, the restart rule, the story shape, static build |

**Why this is three pages, not one** (2026-08-01): a chapter earns its folder with three documents beside its index. This walkthrough already had three distinct jobs — get it running, drive it, write for it — separated by nothing but a heading number.
