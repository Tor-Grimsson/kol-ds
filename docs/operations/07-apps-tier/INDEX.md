---
title: Apps tier
type: index
status: active
created: 2026-09-21
updated: 2026-09-26
description: Products proved as real apps before publishing
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
related:
  - "[[../INDEX|Operations]]"
---

# Apps tier

**The concept is written once, in dotfiles: `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md`. Read that first — it holds the why, the three-tier table, the data rule and the shared-shell rule. Nothing on this shelf restates it.**

What lives here is this repo's depth: which app is being built, in what order, and which are queued behind it.

| Page | What it holds |
|---|---|
| [[01-tier-rules\|Tier rules]] | How an app is wired here — shape, publishing, ownership, data, gotchas. Outlives any one app |
| [[02-media-app-plan\|Media app plan]] | The first app — phases, acceptance, and the one decision still held |
| [[03-candidate-apps\|Candidate apps]] | The roster the tier will absorb, one at a time. Only media is committed |

## The apps

| Workspace | Runs on | What it is |
|---|---|---|
| `apps/media` | `pnpm media` · `/apps/media` | the media tool alone |
| `apps/media-shell` | `pnpm media-shell` (5175) · `/apps/media-shell` | the same tool inside kol-shell — Home · Browse · Settings on the rail, the first-run tour |
| `apps/media-fixture` | — (private package) | the imagined olina setup both apps run on: a fake bucket (`bucket.js`) and a fake D1 (`d1.js`), the client over them, and `useFixtureMedia` — the wiring both apps share so neither grows a copy |

A media feature ships in the DS and shows in `apps/media`; `apps/media-shell` adds only the shell around it. `apps/shell` alone (the shell with no tool in it) is the next of this kind.

Build order came in as a ticket: `lobby/inbox/apps-tier-media-first.md`.
