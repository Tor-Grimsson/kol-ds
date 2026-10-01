---
title: Review round two
type: log
status: active
created: 2026-10-01
updated: 2026-10-01
description: The second showcase review built
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[2026-09-30-showcase-review|Showcase review]]"
  - "[[../../documentation/00-overview/05-names|Names]]"
---

# Review round two

**Run:** 2026-10-01 (W › phase › list; every phase not TALK or PARKED) · **Plan:** `.kol/llm-context/plan-2026-10-01-showcase-review-round-2.md` — the user's ten messages verbatim in `backlog/2026-10-01-showcase-review-round-2.md` · **State:** published 2026-10-01 — kol-theme 0.162.0 · kol-component 0.235.0 · kol-workshop 0.36.0

## Phases

| W | Phase | Docs | What was done |
|---|---|---|---|
| Search | 1.1 | — | palette: Enter opens the highlighted row, ⌘Enter the results page, the footer line is a link |
| | 1.2 | — | results page: one line, one count, kind chips, the rest behind `+`; the box owns its text |
| | 1.4 · 1.5 | — | Results is its own page (`/search/results`), the home is `/search`; the query survives Tags · Graph · A–Z; Tags, Graph and A–Z are markdown homes with frontmatter |
| Tags and the graph | 2.1 | — | a graph node selects and lists its connected tags; opening results is the second step |
| Rails, shell, header | 3.1 · 3.4 | [[../../documentation/00-overview/05-names\|Names]] | the Library rail has no "Library" level; Library is the first tab |
| | 3.3 | — | a group's own home keeps the group open; only the chevron folds |
| | 3.5 | — | the title leads "On this page" everywhere; `validate:rail-pages` P4 fails an empty outline |
| | 3.6 | — | Back returns to the scroll position you left |
| | 3.9 · 3.10 | — | the rails fade out at the foot; `useDragResize` has a `line` variant (double-click toggles) |
| Pages that must exist | 4.1 · 4.2 | — | References and Quarantine have homes; every open-questions round carries frontmatter |
| | 4.3 | — | `validate:previews` scans every component page in a browser; 44 demos written and 6 pages showing their host's demo — 81 without a preview down to 31; page-sized components preview in a frame |
| The reference home | 5.1 · 5.2 | [[../../documentation/00-overview/05-names\|Names]] · [[../../documentation/00-overview/03-install\|Installing KOL]] | Library › Lookup (names, opacity, sizes, color, type, tones, tiers, placement) and Library › Start (Introduction, Installation); install lines per package manager; the plan shape written down |
| | 5.3 | [[../../documentation/00-overview/05-names\|Names]] | Blocks renamed Modules — labels and URLs, old URLs redirect |
| | 5.5 | — | the landing wall no longer pads itself on x |
| Component pages | 6.1 · 6.13 | — | the generated and the authored page render in one frame — the same spacing; the install block owns the gap under its tabs |
| | 6.2 · 6.3 | — | `Table` `lastRule` (off by default); the pager is capped at the panel and uses the icon set's arrows |
| | 6.4 | — | the size knob reads xs → lg; SegmentedToggle's tone knob lists only the tones it paints |
| | 6.10 | — | space above the rule under the References table |
| The component audit | 7.1–7.3 | — | tier, overlap and Button-variant tables — `backlog/2026-10-01-component-audit.md`; nothing moved |
| | 7.4 | — | Badge icon gap; Clearspace preview (styleguide was missing from the Tailwind sources); Close Button and Section Label demos; the panel plate off 12 hardware demos |

## Decisions

| Decision | By |
|---|---|
| A plan is W › phase › list | user |
| Enter opens the highlighted row; ⌘Enter opens the results page (reverses 2026-08-01's "Enter commits") | user |
| The results page shows kind; scope, read-as, category and tags fold behind `+` | user |
| The lookup home is named Lookup and sits in the Library rail | user |
| Blocks are Modules | user |
| The tag taxonomy and tagging from the site are parked for their own session | user |
| A hardware control's demo draws no panel — "the component is not the component + its panel" | user |
| A group's own home keeps it open (reverses 2026-09-30's "a chapter's own home opens nothing") | user |
| Introduction and Installation sit in a group named Start | agent |
| Component pages built without an authored doc lose their section rules, to match the authored ones | agent |
| A page-sized component previews in an iframe on a bare route (`frame`) | agent |
| A component ruled to live inside a host shows the host's demo on its page (`SHOWN_IN`) | agent |
| The MediaPlayer merge was NOT carried out — Hls Video is an inert background video, not a player; the ruling rested on a wrong description | agent, back to the user |

## Open

- **For the user's eye** — open questions Round 6: result row, the tab chips, preview ground, knob bar, rail icons, the line resize handle.
- **Still TALK** — graph contents and settings, show-everything, landing walls per kind, component page sections vs shadcn, the atoms home filter, the Search and Tools rail shape, the collections question (rack, mixer — what Set was meant to be).
- **31 component pages still draw no preview** — apps that run on a client (decks, notes, brand, media, hub), two touch-only, two editor overlays ruled out, the font viewer, the video sheet, `ShellLayout`, `TagModeGate`.
- **Styles and Search rails** still list the space as their own parent — only Library was ruled.
