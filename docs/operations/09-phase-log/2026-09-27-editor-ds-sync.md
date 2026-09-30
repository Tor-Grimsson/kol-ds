---
title: Editor on KOL
type: log
status: archived
created: 2026-09-27
updated: 2026-09-30
description: Editor copies swapped for KOL components
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-27-editor-ds-sync|The plan]]"
---

# Editor on KOL

**Run:** 2026-09-27 · **Plan:** [[_files/plan-2026-09-27-editor-ds-sync|plan-2026-09-27-editor-ds-sync]] · **State:** built and published (kol-component 0.226.0 · kol-icons 0.28.0 · kol-shell 0.57.1 · kol-theme 0.153.0 · kol-styleguide 0.5.2 · design-editor 0.15.0)

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Focus ring | — | the blue ring fixed in KOL itself |
| Gates | — | the gates run over `packages/design-editor` |
| Copies | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | the editor's copies swapped for KOL's; TransportBar rebuilt from KOL parts |
| Icons | [[../../documentation/02-icons/INDEX\|icons]] | one icon system — `Icon` only; the settings X fixed in kol-icons (the glyph is never the click target) |
| Inspector | — | 75 browser tooltips → KOL `Tooltip`; one toggle look; labels only where ambiguous; the `S` sheet stays on screen |

## Decisions

| Decision | By |
|---|---|
| Transport goes to the motion pack; the core has no motion | user |
| `S` stays the shortcuts key | user |
| Keyboard-shortcut ids keep their names — saved keymaps key on them | agent, recorded |

## Open

- #11 grounds — the `bg-fg-04` / `bg-fg-08` alpha grounds beside `surface-*` (13 + 5 sites).
- #12 fill / stroke — asset thumbnails; held for the user.
