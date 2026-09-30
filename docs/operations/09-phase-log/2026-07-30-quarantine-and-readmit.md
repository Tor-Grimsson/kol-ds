---
title: Quarantine + readmit
type: log
status: archived
created: 2026-07-30
updated: 2026-09-30
description: Sidebar emptied, then readmitted rule by rule
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-07-30-quarantine-reimport|The plan]]"
---

# Quarantine + readmit

**Run:** 2026-07-30 → 2026-08-09 · **Plan:** [[_files/plan-2026-07-30-quarantine-reimport|plan-2026-07-30-quarantine-reimport]] · **State:** built; showcase + scripts + docs only, nothing published

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Gates first | — | `validate:rails` and `validate:width` built before any styling; `pnpm validate` prints a scoreboard |
| Rules | [[../../documentation/03-components/02-placement\|placement]] · [[../../documentation/04-compositions/02-shells\|shells]] · [[../../documentation/01-foundations/05-layout-systems\|layout systems]] | R1 membership · R2 one rail row idiom · R3 width mapping · R4 one metadata dialect |
| Quarantine | [[../03-showcase/04-surface-rules\|surface rules]] | `admitted.js` gate on the derived roster; `/quarantine` lists what is held and why |
| Readmission | [[../../documentation/03-components/02-placement\|placement § The pass]] | all 11 categories readmitted; R1 pass over all 239 exports, 3 flagged (ExitPreview · TagModeGate · AlternativeControlsMock) |
| Enforcement | — | 18 gates clean |

## Decisions

| Decision | By |
|---|---|
| No surface is restyled before its rule is written | user |
| Per-category stops replaced by recorded decisions — *"go do whats left, Im not gonna hold your hand through this"* | user |
| Icon MODE toggle is dead — v1 is single-voice by design | user |
| Sidebar order: showcase sections above Documentation | user |

## Open

- **Display names.** The plan's own open question — search accepts a pasted JSX name, *or* rows stop showing PascalCase (`LabeledControl` → `Labeled Control`) — was left for the user and never answered in this run. It comes back on 2026-08-09 (Wave D) and 2026-09-29.
