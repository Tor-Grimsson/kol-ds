---
title: kol-shell duplicate audit
type: backlog
status: open
created: 2026-08-15
updated: 2026-08-15
description: What kol-shell 0.1.0 recreated that the estate already shipped
tags:
  - domain/architecture
  - scope/packages
related:
  - "[[../../../lobby/inbox/ListGridCards|ListGridCards collection]]"
---

# kol-shell duplicate audit

**Parked 2026-08-15 on the user's instruction** — deal with it after the card-family
consolidation. Do not start this without being told.

## Why

`kol-shell` 0.1.0 was recreated from the hand-copied twins in kol-monitor and
kol-mirror without first checking what kol-component / kol-framework / kol-icons
already exported. One duplicate (`ContentFilters`) surfaced only after **eight
publishes** of QA ping-pong. This audit is the rest of that same check, done up
front instead of discovered.

## The nine exports

| Export | Already existed as | State |
|---|---|---|
| `ContentFilters` | kol-component `ContentFilters` (since 2026-08-01) | ✅ **Confirmed** — export dropped in kol-shell 0.3.0, fork quarantined in `_tmp/2026-08-15-kol-shell-contentfilters-fork/` |
| `GridCard` | kol-component `MediaCard` (grid tile) + `MediaRow` (list row) — same slot contract: thumb · name · meta · actions | 🔴 **Confirmed dupe, still shipping** |
| `AppShell` | kol-framework `AppShell` | 🔴 **Name collision** — two different components, one name; a consumer importing both cannot |
| `TabStrip` | kol-component `TabsRow`, **and** the same flat-span idiom hand-rolled inline in `ContentFilters` **twice** (`viewModeOptions`, `layoutOptions`) | 🔴 **Idiom exists 4×** |
| `ShortcutsOverlay` | — | 🟢 **Examined, cleared.** `Modal` is a promise-based prompt/confirm; this is a static sheet. Sharing a scrim is not sharing a contract |
| `PageShell` / `PageHeader` | — | 🟢 **Examined, cleared.** framework's `Layout` is router-bound (renders `Outlet`); these take children. Different contract |
| `Logomark` | — | 🟢 **Examined, cleared.** Fetches an arbitrary SVG **URL**; `Icon` renders from a globbed known set. Different input contract |
| `NavRail` | — | 🟢 No equivalent found |
| `SettingsScaffold` | — | 🟢 No equivalent found |
| `WalkthroughPanel` | — | 🟢 No equivalent found |

**Tally:** 2 confirmed · 1 name collision · 1 idiom quadrupled · **6 clean**.

⚠️ The first cut of this file listed the three cleared rows as 🟠 "suspects" on a
shared-appearance reading — same scrim, same SVG output, same page-scaffold shape.
The user rejected it: **a shared look is not a shared contract.** Test a duplicate
claim on what a component ACCEPTS, not what it renders. Padding an audit with
maybes is the same noise the audit exists to remove.

## What "deal with it" means

Per repo law, the loser of any pair is **retired to `_tmp/<date>-<what>/`**, never
deleted, and the export dropped with a BREAKING bump. Nothing here is a rename-in-
place: consumers import these today.

**Sequencing note.** `GridCard` overlaps the card-family consolidation the
`ListGridCards` collection is gathering evidence for — resolve it there, not here,
so one ruling covers every card at once.

## The lesson this file is the receipt for

The ladder's second rung — *already in this codebase?* — was skipped for nine
components at once because the source material was a pair of consumer apps rather
than the DS barrels. **Lifting from a consumer means diffing against every DS barrel
first, not after the tickets come back.**
