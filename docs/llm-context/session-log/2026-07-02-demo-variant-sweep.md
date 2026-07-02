---
title: Demo variant sweep — show full variant/size sets
type: log
status: archived
updated: 2026-07-02
description: Widened single-instance component demos to show their full variant/size sets.
tags:
  - domain/design-system
  - pattern/component-docs
repo: kol-design-system
related:
  - "[[session-log/2026-07-01-showcase-shadcn-rebuild|showcase shadcn rebuild]]"
---

# Session: Demo variant sweep

**Date:** 2026-07-02
**Agent:** Grim (Opus 4.8)
**Summary:** The subagent-authored demos rendered a single instance; swept the ones whose component has a `variant`/`size` enum to show the full set (like Badge does).

## Changes
- **`demos/Dropdown.jsx`** — now shows `default | minimal | subtle`.
- **`demos/Slider.jsx`** — `default` + `minimal`.
- **`demos/Input.jsx`** — `filled | ghost | outline`.
- **`demos/Stepper.jsx`** — `sm | md | lg`.
- Avatar + SectionLabel already showed their full size sets (agent-authored well) — left as is.

## Note
- Root cause: batch demos were prompted to "render the component," not "show every variant." Demos I hand-authored (Badge/Button/Pill/Textarea/Tag/ViewToggle/ToggleBracket) already show variants.
- Left single-instance where appropriate: structural/compositional components (Table, Tooltip, SegmentedToggle, ContentFilters, menus) and single-variant ones (ToggleSwitch).

## Still pending (unchanged from 2026-07-01)
- Publish `kol-loader@0.2.0` (changeset staged): commit + push + merge the Version PR.
- Only drift vector: `DOC_DATA` API tables (hand-authored) → future `react-docgen` generation.
