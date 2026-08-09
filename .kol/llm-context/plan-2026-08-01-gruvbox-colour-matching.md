# Plan — gruvbox ↔ kolkrabbi colour matching

**Parked:** 2026-08-01, out of AGENT-CONTEXT at the lobby/publish milestone.
**Status:** 🔴 **needs the user's ruling.** Not blocked on work — blocked on a decision only he makes.

## Why it is parked, not closed

It has been the single held item since 2026-07-28 and it has never been agent-work.
It is a **design ruling**: which kolkrabbi palette stops correspond to which gruvbox
stops, and whether the correspondence is a mapping the DS ships or a reference the
user keeps. No amount of implementation resolves that, and design-law rulings are
never the agent's.

Parking it here keeps AGENT-CONTEXT to *current state* — a held decision is not
state, it is a question.

## What travelled with it, now delivered

| Item | Outcome |
|---|---|
| the search-results page that sat beside it | **delivered 2026-08-01** — `/search?q=…`, same items and same matcher as the ⌘K overlay |
| tag colour by taxonomy | **returns layered on** the chip variants, never replacing them — settled when Tag was rebuilt on Pill's model (`kol-tag--*`, 3 variants, one scheme) |

So this file carries the colour ruling **alone**. Nothing else waits on it.

## What a ruling would need to answer

1. Is gruvbox a **source** the kolkrabbi ramps should be tuned toward, or a **separate theme** the DS could ship beside its own?
2. If a mapping: at which stops? The kolkrabbi ramps and gruvbox's do not have the same number of steps, so a mapping is a judgement at every rung.
3. Does it touch `--kol-palette-*` (the eight-colour family) or only the surface/ink tiers?

## Where the relevant material already is

| | |
|---|---|
| the palette tokens | `packages/theme/kol-color.css` |
| the colour doc | `docs/documentation/01-foundations/02-color.md` |
| the tag colour family | `.kol-tag--*` in `packages/theme/kol-components-atoms.css` (theme 0.13.3 authored the rules; 0.14–0.17 rebuilt them on Pill's model) |
| the law that governs theming | ARCHITECTURE §5 — cascade order **and** layer are contract |

**Do not start this unattended.** It is on the record as the user's call.
