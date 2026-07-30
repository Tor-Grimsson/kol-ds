---
title: Breakpoints — the lookup
type: reference
status: active
updated: 2026-07-30
description: Front door for the breakpoint system — the Tailwind-only scale, the three content-width tokens, the padding ramp, and where the laws, practices, and testing methods live.
aliases:
  - breakpoints
  - responsive
sources:
  - packages/theme/kol-theme.css
tags:
  - domain/design-system
  - domain/layout
related:
  - "[[01-breakpoints|breakpoint values]]"
  - "[[02-best-practices|best practices]]"
  - "[[03-methods|testing methods]]"
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
| `--kol-content-shell` | 1800px | THE outer frame, every page |
| `--kol-content-panel` | 960px | tables, code, framed panels |
| `--kol-content-column` | 768px | reading columns |
| `--kol-content-measure` | 65ch | running text inside any tier |

Defined in `packages/theme/kol-theme.css:79-81`. Tailwind's scale ONLY, min-width only.

## In this folder

| Doc | What |
|---|---|
| [[01-breakpoints\|01 — Breakpoint values]] | every number: scale, width tokens, padding ramp, rails, grid collapses |
| [[02-best-practices\|02 — Best practices]] | how to write responsive KOL code without inventing numbers |
| [[03-methods\|03 — Testing methods]] | desktop device-testing rig: Chrome device mode, WebKit, Playwright sweeps |
| [[04-kol-ds-rules\|04 — KOL-DS rules]] | the laws with teeth + the exemption list |
