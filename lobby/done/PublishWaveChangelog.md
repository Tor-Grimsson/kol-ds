---
component: PublishWaveChangelog
source: kol-website — consumer-side scoring of every publish wave since 2026-07-15
staged: 2026-08-14
status: draft
deps: []
---

# PublishWaveChangelog — a publish wave ships no readable record of what changed

## The ask

Every `@kolkrabbi/*` publish wave should leave **one changelog line per package**
naming what changed — and call out breaking or global-surface changes explicitly
(new bare-element rules, token renames, default-value flips).

This is process, not a component. Filing it here because the fix lives in this
repo's publish step.

## Why it keeps costing the consumer

A consumer cannot tell what a bump contains, so it either greps installed
`node_modules` per item or bumps blind and finds out live. Both have happened
repeatedly, and the defaults are the expensive part — a flipped default is
invisible at the call site and silent at build time:

| Wave | What bit | How it was found |
|---|---|---|
| framework 0.9.0 | ThemeToggle default variant `icon` → `button` | 6 bare call sites silently became padded labeled buttons in the navbar — spotted by eye |
| component 0.14.x | Pill `size` default → `sm` | bare `<Pill>` sites re-rendered smaller |
| component 0.28.0 | broken publish (parse error via the barrel) | killed all consumer dev; deprecated on the registry after the fact |

kol-website's own agent context now carries a standing warning that
**"the kol-ds-ui CHANGELOGs are stale — live verification is the only proof
available; do not report 'checked the changelog' as diligence."** `kol-theme`'s
newest changelog entry read `0.6.0` while the package was published at `0.18.0`.

## Suggested shape

- A changelog line per package per publish, even if it's one sentence.
- Breaking / global-surface changes flagged as such.
- Where a wave answers a lobby ticket, tick the ticket in the same pass.

Nothing here needs to be elaborate — the current state is that the file exists
but stopped being written, which is worse than no file, because it reads as a
record.

## History — this is a re-file, not a new finding

Raised 2026-07-15 as item **2.10** of kol-website's `docs/DS-CHANGES-2.0.md`, a
batch ledger predating the lobby that was never handed over. That ledger is being
retired; this is the live half, refiled through the current channel.

## What stays with kol-website

Nothing. This is entirely a kol-ds-ui process change.

## Resolution — 🟢 closed 2026-08-14

Process landed and exercised in the same wave:

- **The rule, written into the publish ritual** — `docs/operations/01-release/INDEX.md`
  §0 now documents the live direct-publish path with the changelog entry as a
  non-skippable step: one entry per package per wave, breaking/global-surface
  changes (token renames, default flips, bare-element rules, moved asset paths)
  flagged **BREAKING**, lobby tickets ticked in the same pass.
- **Every stale changelog squared** — resumed with a dated gap note (e.g. theme
  "0.6.0 → 0.40.0 shipped without entries"), old entries kept below (they are a
  true record; truncating would delete it). Empty ones (chess, content,
  dashboards, foundry, store, styleguide) created with a start note. 13 files.
- **Exercised immediately:** theme 0.41.0 (BREAKING font-path wave + shell
  chrome) · icons 0.16.0 · framework 0.20.0 · foundry 0.5.5 · shell 0.1.0 all
  shipped with real entries.

Nothing stays with kol-website — its agent-context "changelogs are stale" warning
can retire at its next bump.
