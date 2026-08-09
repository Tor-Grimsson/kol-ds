---
title: Breakpoints
type: reference
status: active
created: 2026-07-31
updated: 2026-08-01
description: Front door to the breakpoint system
aliases:
  - breakpoints
  - responsive
sources:
  - packages/theme/kol-theme.css
tags:
  - domain/layout
  - audience/consumer
related:
  - "[[01-values|breakpoint values]]"
  - "[[02-best-practices|best practices]]"
  - "[[../../operations/06-workflows/07-device-testing|testing methods]]"
  - "[[04-kol-ds-rules|KOL-DS rules]]"
  - "[[../01-foundations/04-layout-breakpoints|layout law (foundations)]]"
---

# Breakpoints — the lookup

Everything responsive in one folder. The one-glance numbers:

| Break | Min-width | Role |
|---|---|---|
| `sm` | 640px | first grid collapse |
| `md` | 768px | padding ramp step 1 |
| `lg` | 1024px | **chrome reveal** (nav drawer → rails) · padding step 2 |
| `xl` | 1280px | TOC rail enhancement |
| `2xl` | 1536px | — |

| Width token | Value | For |
|---|---|---|
| `--kol-content-canvas` | 87.5rem | the page BODY inside the shell's main column — item fields (swatch grids, icon walls, galleries). Sorts under shell. |
| `--kol-content-shell` | 1800px | THE outer frame, every page |
| `--kol-content-panel` | 960px | tables, code, framed panels |
| `--kol-content-column` | 768px | reading columns |
| `--kol-content-measure` | 65ch | running text inside any tier |

Defined in `packages/theme/kol-theme.css:79-81`. Tailwind's scale ONLY, min-width only.

## Contents

| Doc | What |
|---|---|
| [[01-values\|01 — Breakpoint values]] | every number: scale, width tokens, padding ramp, rails, grid collapses |
| [[02-best-practices\|02 — Best practices]] | how to write responsive KOL code without inventing numbers |
| [[../../operations/06-workflows/07-device-testing\|Device testing]] | desktop device-testing rig: Chrome device mode, WebKit, Playwright sweeps |
| [[04-kol-ds-rules\|04 — KOL-DS rules]] | the laws with teeth + the exemption list |
