---
title: Labs + generator
type: log
status: archived
created: 2026-10-05
updated: 2026-10-05
description: Labs and the generator on one frame
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-10-03-fxr-labs-generator-panels|The plan]]"
---

# Labs + generator

**Run:** 2026-10-03 and 2026-10-05 (two goals) · **Plan:** [[_files/plan-2026-10-03-fxr-labs-generator-panels|plan-2026-10-03-fxr-labs-generator-panels]] · **State:** built and published 2026-10-05 (design-editor 0.20.0 · kol-theme 0.166.0 · kol-component 0.239.1 · kol-icons 0.33.1) · the user reviews after

## Phases

| Phase | Docs | What was done |
|---|---|---|
| fxr rehearsed | [[../07-apps-tier/INDEX\|apps tier]] | `apps/editor-hub` — kol-fxr's shell and pages, copied, on this repo's packages; every route compared with live fxr at 1600 and 390 |
| Regressions fixed | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | rail icons blank under a lazy route (kol-icons); labs' and the randomiser's segmented strips as bare text; labs' phone drawer outgrown; a dead Loops row; Crop half outside the inspector |
| Panels rebuilt | [[../07-apps-tier/INDEX\|apps tier]] · [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | `apps/panels` is labs with the stage taken out — labs' params rail beside the compositor's inspector; the invented page retired to `_tmp/` |
| Two tools alone | [[../07-apps-tier/INDEX\|apps tier]] | `apps/labs` and `apps/generator`, each from design-editor's source |
| One frame | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | labs and the generator put their controls in the same place per device: a rail on the right at a desk, a sheet along the bottom on a phone; `PanelHeader` · `PanelPills` shared |
| Two bugs | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] | the generator's collapsed row ran off a 390 screen; the transport's loop length had no width on a phone |

## Decisions

| Decision | By |
|---|---|
| "The generator" is fxr's Generator — the randomiser chrome, not the envelope generator in `apps/curves` | agent (the user: answer your own questions) |
| fxr is rehearsed from its own nine files as `apps/editor-hub`, not rebuilt on `AppStudio` | agent |
| `apps/controls` stays; all three of its pages now have a live app | agent — retiring it is the user's |
| Labs and the generator get their own apps | user (the agent's proposal) |
| One frame for both, per device — phone: the bottom sheet; desk: the right rail | user (the agent's plan) |
| Labs' right drawer on a phone goes — this overrides "labs needs both sidebars" (2026-09-01) for the params side | user |
| The hamburger stays top-right with nav from the left; the two tools' tab sets stay as they are | user (kept rulings) |
| On touch, labs' footer is one row until a tab is tapped; the transport's glyph cells are squares again | agent — both followed from the sheet and the loop-length bug |
| Publish before the user's eye | user |

## Open

- The user has not looked at either app yet.
- The two tools' tab sets still differ (labs: Gen · Style · Anim plus Output · File below; the generator: Generate · Effects · Transport · Output).
- The generator's sheet still covers the bottom third of its stage on a phone.
- Not checked: a real phone, export and recording.
- kol-fxr has not been told; its bump notes are `.kol/llm-context/backlog/2026-10-03-fxr-bump-notes.md`.
