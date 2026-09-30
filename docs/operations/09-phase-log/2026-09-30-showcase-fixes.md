---
title: Showcase fixes
type: log
status: active
created: 2026-09-30
updated: 2026-09-30
description: The review's corrections, built
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[2026-09-30-showcase-build|Showcase build]]"
---

# Showcase fixes

**Run:** 2026-09-30, the same day as the build, after the user's review · **Plan:** `plan-2026-09-30-showcase-corrections` (`.kol/llm-context/`) · **State:** built and published (kol-component · kol-icons · kol-workshop); review by eye

## Phases

| Phase | Docs | What was done |
|---|---|---|
| W1 Rails | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | the right rail draws its chevron; a home no longer empties "This page"; a label opens its page and the chevron only folds; only the chapter holding the page opens; a childless entry is a plain row |
| W2 Search | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | the ⌘K palette rebuilt to the field's size and the grey tone — inset field, suggestions, group headings, a footer that says what Enter does; a `Kbd` atom; `corner-down-left` + `command` glyphs; the shortcut sheet lists Search once |
| — Results | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | `ResultRow` restored (underline default) — the swap for `ContentRow` had overridden a ruling |
| W3 Homes | [[../../documentation/00-overview/05-names\|Names]] | a markdown home for Foundations, Icons, Guides, every Function, every Block and Card category, Open questions; `validate:homes` fails a page whose home is missing |
| W4 Components | [[../../documentation/00-overview/05-names\|Names]] | Package left Group by and became a filter; Group by is a page (`/components/group-by`); every rail label opens its own home |
| W5 Places | [[../../documentation/00-overview/05-names\|Names]] | Packages is a space; Tags · Graph · A–Z are views of Search; Cards is a Blocks category; Development keeps references, quarantine, records, lobby |

## Decisions

| Decision | By |
|---|---|
| Every label opens its page, the chevron folds — components from the top and Components go to the same home | user |
| `ResultRow` stays; underline is its default | user |
| Group by is a page, not a switch — categories are data | user |
| Package is a filter, never a grouping | user |
| Tags, Tag graph, Index move to Search; Packages leaves Development; Cards becomes a Blocks category | user |
| The right rail has no fold shortcut — `C` is the left rail's | user |
| Sunken + ring key-cap plate not adopted — the `Kbd` plate is the existing `oq-08` | user |

## Open

- The right rail's tags (own tags by namespace) — a Settings toggle back to the old rail is proposed, undecided.
- Custom categories on the Group-by page — noted in `AGENT-CONTEXT.md`, its own session.
- The palette, results page and rails are built and gate-clean but not yet looked at in a browser.
