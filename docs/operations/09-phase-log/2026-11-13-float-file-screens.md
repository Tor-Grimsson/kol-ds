---
title: Float file screens
type: log
status: active
created: 2026-11-13
updated: 2026-11-13
description: The float Figma file's Labs, Randomiser, Record dashboard, Metric dashboard and Ebook pages built from the live apps, in three rounds; Figma LAW 18–20 and two audit checks added
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
---

# Float file screens

**Run:** 2026-11-13 · **Plan:** [[_files/plan-2026-11-13-float-file-screens|plan-2026-11-13-float-file-screens]] · **State:** built in `◇ float--kol-ds-ui` (879P1yBsBPqpdGI5a5v2Y5); nothing published.

## Phases

| W | What was done | Where |
|---|---|---|
| W1 | ↳ Float labs rebuilt from library instances, 13 screens; old page to `_trash` | section 179:3235 |
| W2 | ↳ Randomiser, 13 states at desktop and phone | page 190:2326 |
| W3 | Record dashboard, two stacked layouts — superseded by W5 | `_trash` |
| W4 | Figma LAW 18 (instances keep their component name), 19 (no loose text in sections), 20 (screens 1440×900); audit fails `instance-renamed` and `loose-text-in-section`; float file swept to 0 | `~/.claude/skills/kol-figma/` |
| W5 | Record dashboard: tabs (9 screens) and float (one view, windows toggled) | page 40:8927 |
| W6 | Metric dashboard: standard (18 screens); float superseded by W7.1 | page 40:8931 |
| W7 | Float always has a main view the windows control — metric (10) and record (9) redone | sections 340:120605, 215:13203 |
| W8 | Phone twins (390×844) for every record and metric screen | both pages |
| W9 | ↳ Ebook: library, Folio and writer, record style and float style, desktop and phone, 150 screens | page 272:7754 |

## Decisions

| Who | Ruling |
|---|---|
| user | No component → build with plain frames, sync later |
| user | Float is one view: a main view in the background that the windows control; never stacked or docked |
| user | Instances keep their component name (LAW 18); no loose text in sections (LAW 19) |
| user | Screens one viewport, 100vw × 100vh (picked 1440×900, LAW 20) |

## Open

Library masters differ from code, so plain-frame stand-ins sit in their place: CalendarHeatmap, CalendarScale, StatTiles, card header, LineChart, RankedListRow share bar, RailFloat collapse-v body/footer, ReaderBar phone.
