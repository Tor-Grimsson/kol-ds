---
title: Linting scripts
type: reference
status: draft
created: 2026-11-20
updated: 2026-11-20
description: A correction becomes a check that fails
aliases:
  - linting scripts
  - lint rules
  - ESLint
  - corrections become checks
tags:
  - domain/workflow
  - domain/conventions
  - audience/agency-internal
related:
  - "[[INDEX|development rules]]"
  - "[[01-no-comments|no comments]]"
  - "[[03-rollout|rollout]]"
  - "[[04-sources|sources]]"
  - "[[../07-apps-tier/11-kolbox-audit|kolbox audit]]"
---

# Linting scripts

A correction he makes becomes a check that fails, before it becomes a written line. Draft: ESLint is not set up yet; see [[03-rollout|the rollout]].

## The checks

| Check | Holds | Runs | State |
|---|---|---|---|
| ESLint | Rules about the code itself: a banned call, a banned import, an import across folders, an empty action, a comment kind | on save in the editor, and by command | not set up |
| `validate:*` scripts | What ESLint cannot see: docs, taxonomy, rendered pages, package rules | by command, only the one that covers the change | 41 scripts in `scripts/` |
| The crawl | Whether every control does what its label says, in the running apps | on an interval, about once a week, never per change | knows the kolbox editor only |
| A written rule | How the agent behaves: when to act, how to report | read each session | CLAUDE.md, memory, hooks |

## The order

Ask in this order and stop at the first yes.

1. Can the code be shaped so the mistake cannot be written? Do that.
2. Can ESLint catch it? Write the rule.
3. Can a validate script catch it? Write the script.
4. Can the crawl, or the agent running the app, prove it? Add it there.
5. Only then: a written rule.

## Writing one

- The error message is written to the agent. It says what to do instead and where the real fix belongs, not only what is wrong.
- When a check is added, the existing copies of the mistake are removed in the same change, so no example is left to copy.
- One check per correction. A check that never fires after three months is reviewed, not kept by habit.

## The crawl

- His words, 2026-11-20: "i just dont want time consuming audits eveery time we make a change, that is time wasting, Id rather do it on some interval."
- About once a week. It covers kol-ds-ui, not one app: it is widened once `apps/*` is reduced.
- Today's crawl and its table: [[../07-apps-tier/11-kolbox-audit|the kolbox audit]] (3,216 controls on eight screens of the editor).

## Why both

- Settled 2026-11-20. The first suggestion was more validate scripts and no ESLint; he asked whether ESLint is not a valid tool. It is, and it is the better one for code rules: it reads the code's structure where a script matches text, and it reports while typing.
- The scripts stay because most of them check things that are not code: frontmatter, links, the taxonomy, what a page renders.
