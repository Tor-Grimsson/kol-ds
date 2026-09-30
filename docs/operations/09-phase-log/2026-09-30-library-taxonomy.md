---
title: Library taxonomy
type: log
status: active
created: 2026-09-30
updated: 2026-09-30
description: The parents named, drawn and made the tabs
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[2026-09-30-showcase-fixes|Showcase fixes]]"
---

# Library taxonomy

**Run:** 2026-09-30, after the taxonomy talk · **Plan:** `plan-2026-09-30-library-taxonomy` (`.kol/llm-context/`, copy in `_files/`) · **State:** built; showcase and docs only, no package changed

## The tree

```text
KOL
├─ Styles
├─ Library
│   ├─ Composition   Components → Blocks → Apps   (by size)
│   └─ Collection    Sets · Packages              (by belonging)
└─ Reference         Docs · Search · Development
```

## Phases

| Phase | Docs | What was done |
|---|---|---|
| W3 Header | [[../../documentation/04-compositions/02-shells\|Reference shells]] | six tabs, Styles · Composition · Collection · Docs · Search · Development; the old spaces are rail categories; no URL moved |
| W2 Homes | [[../../documentation/00-overview/05-names\|Names]] | a markdown home and a diagram for Library (`/library`), Composition and Collection; Search got a home above its results |
| W4 Sets | [[../../documentation/04-compositions/01-blocks-and-sets\|Blocks & sets]] | Cards is a set, first in the Sets rail; a set that was one package's family is that package's page (`/sets/family/<dir>` → `/packages/<dir>`) |
| W1 Names | [[../../documentation/00-overview/05-names\|Names]] | the tree, Library, Composition, Collection, Reference and Package defined; Set redefined as a purpose family that may cross packages |

## Decisions

| Decision | By |
|---|---|
| The header's tabs are the parents; their children are rail categories | user |
| Sets and Packages are siblings under Collection, not one axis; Cards is a set | user |
| A set equal to one package's family folds into the package page | user |
| Search is a space with its own home | user |
| Names documented after the build, to match what shipped | user |
| The Library lives at `/library`, not on `/` — the front door keeps its hero and wall above the fold | agent |
| The Search home shows only while no query is typed | agent |
| Search items carry the parent as their space (`in:composition`, `in:collection`) | agent |

## Open

- `.md` with frontmatter (`uses`) beside every block and app, and Styles › Ladders — the next run.
- The package page lists its family below the changelog; if that buries it, it moves above.
