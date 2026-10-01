---
title: Deconstruction roadmap
type: log
status: archived
created: 2026-09-27
updated: 2026-09-30
description: Splitting the editor into packages
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-27-deconstruction-roadmap|The plan]]"
---

# Deconstruction roadmap

**Run:** 2026-09-27 (two goals) · **Plan:** [[_files/plan-2026-09-27-deconstruction-roadmap|plan-2026-09-27-deconstruction-roadmap]] · **State:** tracks 1–3 built and published; 4 parked, 5–6 open

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Editor split | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | coupling map; `apps/editor` (:5180) on the media fixture; a pack registry (`registerPack`); the core ships at `@kolkrabbi/design-editor/core`, packs at `/generators` · `/effects` · `/motion`; `pnpm check:core` proves the core reaches no pack |
| Controls | [[../../documentation/04-compositions/13-controls-system\|controls system]] | kol-controls renamed **kol-hardware**, grouped value · switches · indicators · panel · frames; `apps/controls` (:5181) |
| Curve generator | [[../../documentation/04-compositions/13-controls-system\|controls system]] | one signal engine (`kol-hardware/signal`) replacing four drifted copies; `EnvelopeGenerator`; `apps/curves` (:5182) |

## Decisions

| Decision | By |
|---|---|
| The editor is layers, not one package — core + vector · generators · effects · motion | user |
| The package is `@kolkrabbi/kol-hardware` — *"I like package hardware, its more descript anyway"* | user |
| Frames (ModuleFrame · ChannelStrip · FlipCard) move into the package; routing, rack and render loops stay out — amends ARCHITECTURE §3 | user |
| The core stays at the root entry for now (kol-fxr would break on its next bump) — a deviation from step 4 | agent, recorded |

## Open

- Text track — parked until the three text repos are downloaded.
- Adoption tickets to monitor · mirror · fxr; fxr labs' sliders onto kol-hardware.
- apps/controls' **App controls** page (buttons, toggles, `LabeledControl`, the section panel) — planned here; the labelled panels landed later as `apps/panels`.
