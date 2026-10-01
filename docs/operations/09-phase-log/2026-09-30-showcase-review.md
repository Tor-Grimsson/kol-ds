---
title: Showcase review
type: log
status: active
created: 2026-09-30
updated: 2026-10-01
description: The user's showcase review built
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[2026-09-30-library-taxonomy|Library taxonomy]]"
---

# Showcase review

**Run:** 2026-09-30 → 2026-10-01 (one goal, W1–W22, each closed on gates and a browser check against the user's words) · **Plan:** [[_files/plan-2026-09-30-showcase-review|plan-2026-09-30-showcase-review]] · **State:** built · package changes are Unreleased, publish waits on the user

## Phases

| Phase | W | Docs | What was done |
|---|---|---|---|
| The tree | W1 | [[../../documentation/04-compositions/02-shells\|Shells]] | `ShellSidebar` nests to any depth; follow, fold and counts walk the whole tree |
| | W2 | [[../../documentation/00-overview/05-names\|Names]] | Library is the tab and the root: Composition › Components · Blocks · Apps, Collection › Sets · Packages |
| | W3 | — | every rail group opens its own page; `validate:rail-pages` (the 33rd gate) opens every rail in a browser; 13 gaps filled |
| | W4 | — | every set is a group of its members, one level; the rail opens one chain, deepest match first |
| What the pages say | W5 | — | every description a ≤ 8-word summary, no lists — `validate:metadata` M2/M6 on every surface |
| | W6 | — | pages tagged by subject from their own words; noise tags gone; `validate:tags` on the showcase |
| | W7 | — | package pages: what it is, install, used by, family; the changelog a page of its own |
| | W8 | — | `kol-icon-set-v1` → `kol-icon-set-interface` (aliases on the ledger); Icons home rewritten; catalog grid fixed |
| | W9 | — | a set page shows the set — members by tier, the set in use, its source |
| | W10 | — | `remark-gfm` — guide tables render |
| Search | W11 | — | results page: md input, one chip (`Tag` sm), facets in tabs, readable rows |
| | W12 | — | the search page carries its frontmatter; loose rail rows share one list |
| | W13 | — | the Search home documents every query form and the ranking |
| | W14 | — | `TagGraph` rewritten — one simulation, settled before the first frame, GSAP motion |
| Rails, shell, color | W15 | [[../../documentation/04-compositions/02-shells\|Shells]] | right rail: This page · Links · Tags; homes' tables in titled sections so This page fills |
| | W16 | [[../../documentation/04-compositions/02-shells\|Shells]] | `\` hides both rails; shortcut and settings labels cut to one or two words |
| | W17 | [[../../documentation/04-compositions/02-shells\|Shells]] | `Tag color` (palette hue, states kept); tags wear their namespace color; status is a toned `Badge` |
| Components and apps | W18 | — | Dash cards → molecules, grid wrappers → utilities, sidebars and ExhibitLinkCard → molecules; 8 atom demos; a collapsing preview wrapper fixed |
| | W19 | — | a Tone axis beside Variant · Size · State; 48 demos expose every named axis; LED gets its page |
| | W20 | — | the landing wall loads more — every live demo, 12 a batch, each batch its own block |
| | W21 | — | /apps opens on one table of all 23 apps |
| Record | W22 | [[../../documentation/00-overview/05-names\|Names]] | this entry; names and shells docs; Unreleased entries in kol-workshop, kol-theme, kol-component (kol-icons from W8) |

## Decisions

| Decision | By |
|---|---|
| Every category and group in every rail gets its own page | user |
| Library is the shared root; Composition and Collection sit inside it | user |
| A W closes on the agent's simulated review — gates plus a browser check against the user's words | user |
| Every set folds (the plan said only Cards) — one kind of thing, one level | agent |
| The icon set's new name, Interface | agent |
| Tone in the showcase is the ground axis (kol-tone-*), not status; status stays `Badge`'s | agent |
| ProfileAvatar's 2026-09-03 brand-mock exemption dropped — its demo wears the KOL mark, every atom previews | agent |
| Numeric sizes (Icon, DonutChart, RotaryDial …) get no picker — free numbers, not options | agent |
| ContentFilters' exemption was stale (kol-shell's copy retired 2026-08-15) and hid the only one — dropped, the page is back | user |
| DropdownTagFilter retired → `SettingsMulti`; on the ledger | user |
| `validate:rail-pages` leaves the default `pnpm validate` — run it when rail or nav code changes | user |
| ContentFilters' 'namesake' exemption was stale — kol-shell's copy retired 2026-08-15 — so it was hiding the only one; dropped, the page is back | user |
| DropdownTagFilter retired → `SettingsMulti`: its own pill, hardcoded radii, one look, no consumer; on the ledger | user |

## Open

- **The /components wall** — 81 non-atom cards have no demo; one demo repeats a key; two font fetches fail.
