---
title: Apps review
type: log
status: archived
created: 2026-09-29
updated: 2026-09-30
description: Render gates, Hub naming, Studio, brand catalogue
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-09-29-apps-review|The plan]]"
---

# Apps review

**Run:** 2026-09-29 (two goals) · **Plan:** [[_files/plan-2026-09-29-apps-review|plan-2026-09-29-apps-review]] · **State:** built and published (design-editor 0.17.0 · kol-shell 0.59.0 · kol-component 0.229.0 · kol-theme 0.156.0 · kol-search 0.2.0 · kol-markdown 0.1.1 · kol-notes 0.2.0 · kol-deck 0.2.0 · kol-hardware 0.3.1 · kol-workshop 0.30.1 · kol-store 0.3.1)

## Phases

| Phase | Docs | What was done |
|---|---|---|
| W1 Trust | [[../07-apps-tier/01-tier-rules\|tier rules]] | five gates: variants · type-in-controls · row-height · overlap · tone siblings; the last three in `validate:render` (headless, desktop + 390) |
| W2 media | [[../../documentation/04-compositions/15-media-uploads\|media uploads]] | the `S` sheet on phones; search on kol-search; count line as a setting |
| W3 Shell + Hub | [[../../documentation/04-compositions/11-shell-system\|shell system]] · [[../../documentation/04-compositions/16-app-anatomy\|app anatomy]] | `<tool>` · `<tool>-hub` · `shell` · `hub`; the phone bottom bar; one masthead per app |
| W4–W6 | [[../07-apps-tier/INDEX\|apps tier]] | notes and presentation open on a blank editor; `apps/catalog`; `apps/search` holds every search surface |
| W7 /apps | [[../07-apps-tier/INDEX\|apps tier]] | grouped by layer — Engine · Shell · Hub · Catalog · Tool · Fixture; a home per app |
| §6c | [[../../documentation/04-compositions/14-design-editor-system\|design-editor system]] · [[../../documentation/04-compositions/16-app-anatomy\|app anatomy § The Studio]] | every editor chrome on one rail; `validate:views`; `AppStudio` + `apps/studio`; `apps/panels`; VOYAGER + `apps/fixtures`; `apps/brand` the catalogue, `apps/brand-hub` a client's home |

## Decisions

| Decision | By |
|---|---|
| D1 — render checks run as `pnpm validate:render`, required before every publish | agent (the user: a check proposal is the agent's call) |
| D2 — app naming `<tool>` · `<tool>-hub` · `shell` · `hub` | user |
| D3 — the masthead is set per app, no default; fxr · mirror · monitor stay mono | user |
| D4 — tag graph data in kol-search, the d3 view stays in kol-workshop | user |
| D5 — on touch, every text input renders 16px | user |
| `apps/studio` approved; `apps/brand` is the catalogue, `apps/brand-hub` the client's home | user |
| No open item may be left owed after a goal — decide and do | user |

## Open

- Panels shows a bool param as an inline switch in one place and an Off/On strip in another — the editor review.
- Editor #12 · #14 · #15.
