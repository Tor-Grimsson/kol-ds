---
title: Cloud sessions
type: index
status: active
created: 2026-09-28
updated: 2026-09-28
description: Agents working from a claude.ai container
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
related:
  - "[[../INDEX|Operations]]"
  - "[[../01-release/INDEX|Release pipeline]]"
---

# Cloud sessions

A cloud session is an agent running in a throwaway container on claude.ai, not on the iMac or
the MBP. The repo is cloned fresh from GitHub when the container starts. Nothing on the local
machines reaches it — no `~/.dotfiles`, no local skills, no `_tmp/`, no uncommitted work — and
nothing it leaves outside git survives it.

`LLM_RULES.md` is written for the local machines. Where it and this shelf disagree, **this shelf
wins inside a cloud session** (git especially: locally the user owns all git; in the cloud the
agent commits and pushes to its own branch).

| Page | What it holds |
|---|---|
| [[01-authorship\|Authorship]] | The user is the only author. No agent credit, trailer or identity anywhere in the repo |
| [[02-branch-and-handoff\|Branch and handoff]] | The session branch, how it reaches `main` without a merge commit, and when it is deleted |
| [[03-publishing\|Publishing]] | The cloud bumps and writes changelogs; the user publishes locally |

## Starting

- **Context:** `/agent-init` lives in `~/.dotfiles`, which the container does not have. Clone the
  public `Tor-Grimsson/.dotfiles` and run `claude/skills/agent-init/SKILL.md` by hand.
- **Machine:** the container reports `x86_64`. That is not the iMac — say "cloud container".
- **The report:** one line, "Context loaded." Nothing after it — no receipts, no flags, no summary.
- **Replies:** short. A yes/no question gets a yes or no.

## Ending

Everything worth keeping is committed and pushed before the turn ends. The last message gives the
user the terminal steps from [[02-branch-and-handoff|Branch and handoff § 2]] and the
publish list from [[03-publishing|Publishing]].
