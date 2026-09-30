---
title: Showcase refinement
type: log
status: archived
created: 2026-09-28
updated: 2026-09-30
description: Space table, per-space rails, search, engines
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-28-showcase-refinement|The plan]]"
---

# Showcase refinement

**Run:** 2026-09-28 (cloud session) · **Plan:** [[_files/plan-2026-09-28-showcase-refinement|plan-2026-09-28-showcase-refinement]] · **State:** built and published (kol-markdown · kol-search · theme 0.155.0 · framework 0.45.0 · component 0.228.0 · shell 0.58.0 · workshop 0.30.0)

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Reference app | [[../07-apps-tier/INDEX\|apps tier]] | `apps/workshop` + `apps/workshop-fixture` — the shell judged alone before the showcase adopts it |
| Engine tier | [[../../documentation/04-compositions/04-workshop-system\|workshop system]] | `@kolkrabbi/kol-markdown` and `@kolkrabbi/kol-search` out of kol-workshop; `apps/markdown`, `apps/search` |
| Space table | [[../../documentation/04-compositions/02-shells\|shells § The space table]] | Components · Blocks · Sets · Docs · Apps · Development; References and Quarantine move to Development |
| Rails | [[../../documentation/04-compositions/02-shells\|shells]] · [[../../documentation/01-foundations/05-layout-systems\|layout systems]] | per-space rails; 256px each with seams; one edge-to-edge scroll region; a folded category shows its count |
| Search | [[../../documentation/04-compositions/04-workshop-system\|workshop system]] | the palette is a quick jump; Enter opens `/search` with scope and facets; `/` opens it too |
| Chrome | [[../../documentation/04-compositions/04-workshop-system\|workshop system]] | typed wordmark naming the space; settings drawer on `,`; the `S` sheet |

## Decisions

| Decision | By |
|---|---|
| Build `apps/workshop` first and keep the name `workshop` | user |
| An engine is plain JS, proved in its own app before a consumer switches | user |
| *"you are go on the plan"* — every other call in the space table taken on the plan's defaults, recorded so any can be overturned | user → agent |
| Every space root is an index page in its own layout; only `/` has no rails | agent, recorded |
| Docs rail order Guides · Specimens · Documentation · Operations | agent, recorded |
| Settings is a right drawer; ⌘K and `/` search, `S` the sheet, `,` settings | agent, recorded |

## Open

- The workshop + showcase review — carried: the control-preview pattern (Button has a variant dropdown and every size; most control pages have neither).
