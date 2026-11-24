---
title: No comments
type: reference
status: draft
created: 2026-11-20
updated: 2026-11-20
description: The comments allowed in code
aliases:
  - no comments
  - no-comments rule
  - comments in code
tags:
  - domain/workflow
  - domain/conventions
  - audience/agency-internal
related:
  - "[[INDEX|development rules]]"
  - "[[02-linting-scripts|linting scripts]]"
  - "[[03-rollout|rollout]]"
  - "[[04-sources|sources]]"
---

# No comments

Code in this repo carries no comments, except the five kinds below. Draft: it is in force once [[03-rollout|the rollout]] reaches it. Nothing has been removed yet.

## Allowed

| Kind | Example |
|---|---|
| Licence and legal headers | a font's or a vendored file's licence block |
| Behaviour forced from outside | a browser bug, a dependency's quirk, a protocol's rule: something this repo cannot change |
| Public API docs | the doc comment on an exported component and its props, which other repos read |
| Formatter and style-only switches | a formatter's ignore line; a lint switch for a rule that is style only |
| A link that explains a constraint | an issue or a spec the code cannot express |

When it is not clear that a comment is one of these, it is not.

## Not allowed

| Kind | What happens to it |
|---|---|
| Narration: what the next line does | removed |
| Banners and section dividers | removed |
| Commented-out code | removed |
| An excuse for a shortcut ("fine for now", "the real fix is bigger", "too risky to change") | removed, and the code it sat on gets the real fix or is listed as open work |
| An explanation of a surprise in our own code | removed, and the code is renamed, extracted or typed until it needs no explanation |
| A lint or type switch that hides a real problem | removed, and the problem is fixed |
| "Do not remove", "do not change", "ask before changing" | turned into a check ([[02-linting-scripts|linting scripts]]), then removed |
| A history note: who changed what, when, why | removed; the plan, the phase log and the session log hold history |

## Replacements

1. A name that says it: the function, the variable, the file.
2. A smaller piece: the surprising part extracted and named.
3. A check that fails: a lint rule, a validate script or a test, with a message that says what to do instead.
4. A doc: a decision or a rule belongs in `docs/`, not above a line of code.

## New code

- Write none of the kinds in "Not allowed". A reason for a shortcut goes in the report to him, never into the file.
- Finding an excuse comment in existing code is not permission to copy what it excuses.
- Do not delete comments outside the task's files; the removal is the rollout's job.

## Why

His thought, 2026-11-20: "we reduce comments in code and that way we can reduce the amount of unpredictable choices agents make from those comments."

An agent writes from what it reads. A shortcut with its excuse beside it reads as how this codebase does things, and the next agent copies both. A comment cannot be enforced: nothing fails when it is ignored or when it is wrong. See [[04-sources|sources]].
