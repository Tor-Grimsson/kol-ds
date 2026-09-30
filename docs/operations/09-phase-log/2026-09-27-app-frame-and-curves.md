---
title: App frame + curves
type: log
status: archived
created: 2026-09-27
updated: 2026-09-30
description: The tool frame written, curves rebuilt
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-27-app-frame-and-curves|The plan]]"
---

# App frame + curves

**Run:** 2026-09-27 · **Plan:** [[_files/plan-2026-09-27-app-frame-and-curves|plan-2026-09-27-app-frame-and-curves]] · **State:** built and published (kol-hardware 0.3.0 · kol-component 0.226.0 · kol-deck 0.1.1)

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Wave A | [[../../documentation/04-compositions/16-app-anatomy\|app anatomy § Tool frame]] · [[../07-apps-tier/01-tier-rules\|tier rules]] | the tool frame written: PageShell fixed · one geometry alone or in the shell · masthead is the title only · nothing below the fold · no explanatory copy · space between units |
| Wave B | [[../../documentation/04-compositions/13-controls-system\|controls system]] | curves rebuilt: one control height, mirror's reference carried class for class, scope uses the height, BPM + timer, ADSR sustain grabber and release fixed |
| Wave C | — | the other apps conformed to the frame; `PageHeader` actions sit on the title's row |

## Decisions

| Decision | By |
|---|---|
| *"I dont like explanations in text when unnecessary, leave it for popovers/tooltips"* | user |
| Tools fit 100vh and do not scroll, like apps/media | user |
| Controls is a reference page, so it keeps the frame but scrolls; brand and editor keep their own chrome | agent, recorded |
| BPM scales the scope's clock; Hold is seconds at sustain, default 1 | agent, recorded |

## Open

- The deck editor's toolbar overlaps itself at 390 — the responsive pass over the non-brand apps.
