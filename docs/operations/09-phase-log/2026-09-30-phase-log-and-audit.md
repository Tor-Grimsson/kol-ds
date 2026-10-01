---
title: Phase log + audit
type: log
status: active
created: 2026-09-30
updated: 2026-09-30
description: The phase log and the names audit
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[../03-showcase/05-audit-names-and-homes|The audit]]"
---

# Phase log + audit

**Run:** 2026-09-29 → 2026-09-30 (one goal) · **Plan:** `plan-2026-09-29-phase-log-and-showcase-review` — in progress; archived into `_files/` when it closes · **State:** built; the audit's rulings were taken and built in [[2026-09-30-showcase-build|Showcase build]]

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Phase log | [[INDEX\|Phase log]] | `docs/operations/09-phase-log/` — one entry per run (phases · decisions · open), the finished plans archived in `_files/`; nine past runs backfilled from their plans and session logs; shown at Development › Records › Phase log |
| Open questions | — | `/development/open-questions` — rounds of visual calls as live specimens. Round 1: accent, dark green, search rows, tooltip copy, apps nesting (answered). Round 2: search rows redrawn |
| Audit | [[../03-showcase/05-audit-names-and-homes\|Names and homes audit]] | names, homes, categories, placement (all 321 components swept), blocks and sets, Docs, Apps, tags, rails, frontmatter, display names, tools — each with a proposal; nine rulings listed |

## Decisions

| Decision | By |
|---|---|
| The log is not specific to `/kol-goal` — a list of work done, a table per run with the plan and the docs it touched | user |
| Nothing in the showcase reads `.kol/`; a finished plan is copied into the docs as an archive | user |
| No rule is made without visual context — a visual call goes on the open-questions page first | user |
| Round 1: accent **white** · dark green dropped · tooltips **one word** · apps as nested containers **yes**, documented as a visual pattern · search rows: title up rejected; Round 2 — both, as variants of one row component, underline default | user |
| Open questions go in rounds — one page each, an answered round stays as the record | user |
| Phase-log titles fit the rail: ≤ 3 words, ≤ 22 characters, no leading The — `validate:metadata` M5 | user → agent |
| One spelling: `color` | user |
| The audit's nine rulings taken on the recommendations — *"assume i go with recommendation"*; review and iterate after the build | user |
| The audit and the open-questions page come first, together; the build (W3–W6) waits on the rulings | user |
| The phase log opens in the Development space: one href function (`vaultDocHref`) sends every log id to `/development/log/…`, so reader, search and tag graph agree | agent, recorded |
| Vault tables never wrap, so the Docs column sits before the long one in log entries | agent, recorded |

## Open

- Added to the plan: a home per package (frontmatter, tags, changelog) and a home for the icon sets.
- Found while building: every vault table is `white-space: nowrap`, so a long prose cell scrolls sideways instead of wrapping — a reader-wide defect for W3.
