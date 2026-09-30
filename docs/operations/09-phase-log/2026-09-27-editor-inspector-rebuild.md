---
title: Editor inspector
type: log
status: archived
created: 2026-09-27
updated: 2026-09-30
description: Inspector as three named panes
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-27-editor-inspector-rebuild|The plan]]"
---

# Editor inspector

**Run:** 2026-09-27 → 2026-09-28 · **Plan:** [[_files/plan-2026-09-27-editor-inspector-rebuild|plan-2026-09-27-editor-inspector-rebuild]] · **State:** built and published (kol-theme 0.154.0 · kol-component 0.227.0 · kol-icons 0.29.0 · design-editor 0.16.0)

## Phases

| Phase | Docs | What was done |
|---|---|---|
| KOL root | [[../../documentation/03-components/05-control-chrome\|control chrome]] | tool buttons: quiet raised tile, ink-only hover, ~80ms press (scoped to `.kol-tool-palette`); `SegmentedToggle` names its glyph cells with tooltips; the native-title gate's T2 over the editor |
| Panes | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | Transform · Appearance · Typography as `InspectorSection pane`; no sub-labels, no TEXT row; new `text-valign-*` glyphs |
| Transport | — | fxr's two strips; thin vector lines select on the first click |

## Decisions

| Decision | By |
|---|---|
| Affinity is the reference for the tool row | user |
| Panes are named like the Color panel — *"this is type, this is transform"* | user |
| The inverted pressed tile stays the system law everywhere except the tool palette | agent, recorded |
| A pane is a variant of `InspectorSection`, not a new component | agent, recorded |

## Open

- #14 — redraw the align / rotate / flip glyphs.
- #15 — the `tone="primary"` hover stop.
- The editor's `AlignmentPanel` vs KOL's `AlignmentGrid`.
