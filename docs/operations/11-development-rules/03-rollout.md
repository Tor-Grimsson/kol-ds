---
title: Rollout of the development rules
type: plan
status: draft
created: 2026-11-20
updated: 2026-11-20
description: Putting the two rules in force
aliases:
  - development rules rollout
phases:
  - Reduce apps
  - ESLint in
  - Comments out
  - The crawl, widened and timed
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|development rules]]"
  - "[[01-no-comments|no comments]]"
  - "[[02-linting-scripts|linting scripts]]"
---

# Rollout of the development rules

Not started. It gets a session of its own once `apps/*` is reduced. Every phase is a proposal until that session; none has his go.

| Phase | Closes when |
|---|---|
| 1. Reduce `apps/*` | the folders that are development only are in `_tmp/` |
| 2. ESLint in | the lint run reads 0 errors and a planted mistake fails it |
| 3. Comments out | 0 comments outside the allowed kinds, per package |
| 4. The crawl, widened and timed | dead 0 and wrong 0 per app, on a weekly run |

## Why

[[01-no-comments|No comments]] and [[02-linting-scripts|linting scripts]] are written but not in force. This is the order that puts them in force.

## Current state

Read 2026-11-20.

- 50 folders in `apps/`, many of them for development only (his words: "we should also reduce apps/* since many of them only exist for development").
- No ESLint. 41 `validate-*` scripts.
- Comments are not counted yet.
- The crawl knows the kolbox editor only.

## Phases

1. **Reduce `apps/*`.** Which apps go is his call. They move to `_tmp/`; nothing is deleted. Acceptance: the count of folders in `apps/` and the list of what moved.
2. **ESLint in.** One config at the root. The first rules answer corrections already made: empty actions, "Not wired" marks, imports across packages. Acceptance: 0 errors on the repo, and a planted empty action fails the run with a message that says what to do instead.
3. **Comments out.** Package by package, against the allowed kinds. A comment that guards a constraint becomes a check first. Acceptance: comment lines per package counted before and after; 0 left outside the allowed kinds; the comment rule itself is an ESLint rule, so a new one fails.
4. **The crawl, widened and timed.** One crawl over the apps that are left, about once a week. It also takes over the four runs the kolbox plan dropped on 2026-11-20 (Firefox, light mode, touch, phone width): the crawl script updated for the new shell and its partial results are in `_tmp/2026-11-20-w13/`. Acceptance: dead 0 and wrong 0 per app, read from the crawl's own table.

## Open calls

- CSS files: the theme's section banners are comments too. Whether they go or count as structure.
- The lazy-developer mode loaded in sessions tells the agent to mark a shortcut with a comment, which the no-comments rule forbids. Which one gives way.
