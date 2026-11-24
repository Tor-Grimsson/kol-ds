---
title: Sources of the development rules
type: reference
status: active
created: 2026-11-20
updated: 2026-11-20
description: Where the two rules come from
aliases:
  - all code is slop except mine
  - Lauren Tan talk
  - pstack no-comments
sources:
  - https://www.tiktok.com/@thehypekevin/video/7709533096781040903
  - https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md
  - https://github.com/cursor/plugins/blob/main/pstack/agents/comment-sicko.md
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|development rules]]"
  - "[[01-no-comments|no comments]]"
  - "[[02-linting-scripts|linting scripts]]"
---

# Sources of the development rules

| Source | What it is | Where |
|---|---|---|
| Video, 10 min 20 s | A summary of Lauren Tan's talk "All code is slop except mine" | `https://vm.tiktok.com/ZN8agM4Ly/`, sent by him 2026-11-19 |
| Its captions | The video's own English captions, word for word | `_tmp/2026-11-20-corrections-become-checks/video-captions.eng-US.vtt` (local, not in the vault) |
| Skill `no-comments` | Her team's skill that removes comments | `https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md`, sent by him 2026-11-19 |
| Agent `comment-sicko` | The agent that skill runs, with its keep list | `https://github.com/cursor/plugins/blob/main/pstack/agents/comment-sicko.md` |

The captions are kept as the file the video served. They are not copied into this page: the text is the video maker's.

## The video

In my words, in its order.

1. **The numbers it opens on.** Her team merged almost 11,000 agent pull requests in October, up from 809 in June, and the share they had to undo halved to under half a percent.
2. **How one shortcut spreads.** An agent fixes a flicker by delaying a line with a zero timer and writes a comment saying the real fix is bigger. The next session meets a similar flicker, finds that timer and its comment, and does the same. Her example from a real codebase: one timer on 9 September, a shared module by 3 October, 183 timers by 17 October.
3. **Why a written rule loses.** A line in CLAUDE.md is one sentence. Against it stand several working examples in the code, each with its excuse beside it. The agent reads the excuses as permission, and if it adds one more, no check fails. Her point about comments is that nothing enforces them.
4. **What her team did about comments.** The codebase went from almost 66,000 comments at the end of July to about a dozen, the ones with a real reason to exist.
5. **The fix.** Each correction becomes a check that fails. For the timer it is a lint rule that bans the call, and the error message is written to the agent: what to do instead, and where the real fix belongs. Then the existing copies are removed so no example is left to copy.
6. **Where a correction goes**, cheapest first: the shape of the code; static checks (lint, types, tests); the agent running the app and proving it; written rules; a person reading the diff.
7. **Verification.** A feature map lists each feature from the user's side, how to reach it and what proves it works. The agent opens the app, does the thing and records it; review becomes watching what it brings back.
8. **The caveats the video gives itself.** An undo rate does not count every bug. Some numbers got worse (idle memory and CPU). Most of the tokens go to checking, not writing.
9. **Its last advice.** Fix the loop you have before automating it.

## The skill

- An agent removes every comment in scope except five kinds: licence headers, behaviour forced by something outside the code, formatter and style-only lint switches, doc comments that define a public API, and links to an issue that explains a constraint.
- A comment that explains a surprise in our own code is removed, and the code is marked for a real fix: a rename, an extraction, a type.
- A lint or type switch that hides a real problem is removed and its code marked the same way.
- A "do not remove" comment becomes a type, a test or a lint rule, on approval; if it cannot, it is removed and reported as an open constraint.
- It cannot be installed here as it is: it calls other skills of the same set.

## This repo

- The memory index holds about eighty written corrections, and several record that he said them more than once.
- The kolbox audit found 22 empty actions and 19 "Not wired" marks, a pattern agents had copied from one another.
- What has held here is already a check: the hooks and the validate scripts.
- Corrections about how the agent behaves cannot be linted. They stay written.
