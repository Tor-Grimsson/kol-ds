---
title: Breakpoints — testing methods
type: reference
status: active
updated: 2026-07-29
description: The desktop device-testing rig — Chrome device mode with forced touch, Xcode Simulator for real iOS WebKit, Playwright viewport sweeps — and when the phone actually matters.
aliases:
  - device testing
  - responsive testing
sources:
  - .kol/llm-context/backlog/2026-07-29-device-testing-audit.md
tags:
  - domain/design-system
  - domain/layout
  - domain/workflow
related:
  - "[[INDEX|breakpoints]]"
  - "[[02-best-practices|best practices]]"
---

# Breakpoints — testing methods

Desktop emulation is the industry-standard workflow; real devices are last-mile
QA only. Three tiers, cheapest first.

## 1 — Layout tier: Chrome DevTools Device Mode

| Step | How |
|---|---|
| Open | ⌘⇧M (device toolbar) in DevTools |
| Pick sizes | device presets carry real metrics + DPR; or type the KOL breaks: 640 / 768 / 1024 / 1280 |
| **Force touch over mouse** | device mode emulates touch events AND flips `pointer: coarse` / `hover: none` — touch-branching CSS renders as touch while you review with the mouse |
| Touch-only, no frame | ⌘⇧P → "Emulate CSS media feature pointer: coarse" |

Firefox RDM is genuinely weaker (limited touch simulation) — not a you-problem.

## 2 — Engine tier: real iOS WebKit on the Mac

| Tool | What it gives |
|---|---|
| **Xcode Simulator** (free with Xcode) | actual iOS Safari — dvh, safe-area-inset, overscroll bounce, browser chrome overlap |
| Safari → Develop → Responsive Design Mode | quick iPhone/iPad presets; can drive the Simulator |

## 3 — Device tier: the phone

Final pass only — real touch latency, font rendering, thumb reach. Never the workhorse.

## Agent-side (automated)

Playwright viewport sweeps — 375 / 390 / 768 / 834 / 1024 (+ `hasTouch`),
screenshot per breakpoint per page; Playwright's bundled WebKit for
engine-truth checks. Backlog task: `.kol/llm-context/backlog/2026-07-29-device-testing-audit.md`.
