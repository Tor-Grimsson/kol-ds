---
title: Icon batch scan
type: log
status: active
created: 2026-10-31
updated: 2026-10-31
description: The 252-icon ClaudeListIconSet batch scanned before import — duplicates inside the batch, collisions with kol-icon-set, a group and a name for each
tags:
  - domain/iconography
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[../../documentation/02-icons/01-inventory|Icon inventory]]"
---

# Icon batch scan

**Run:** 2026-10-31 · **Ticket:** `lobby/inbox/ClaudeListIconSet.md` · **State:** organised and scanned; **nothing imported, nothing published** — the import is his session.

## Summary

**Source:** the family boards page (`scratchpad/icon-scan/families.html`, built by `families.py`) — this table and the Verdict column below are synced from it; the page wins on any difference.

**Source:** the family boards page (`scratchpad/icon-scan/families.html`, built by `families.py`) — this table and the Verdict column below are synced from it; the page wins on any difference.

**Source:** the family boards page (`scratchpad/icon-scan/families.html`, built by `families.py`) — this table and the Verdict column below are synced from it; the page wins on any difference.

| Verdict | Count |
|---|--:|
| keep | 142 |
| rename | 66 |
| keep as modifier / base | 14 |
| keep · near (his call) | 7 |
| drop | 23 |
| **total** | **252** |

Batch clusters: **19** (same name, or look ≥ 0.72) — 004/025 · 005/015 · 006/035 · 016/053 · 036/114 · 039/220 · 044/054 · 046/057/185 · 048/202 · 055/062/176 · 059/183 · 064/069 · 065/068/075 · 067/098/250 · 072/079 · 124/129 · 130/163 · 154/233 · 232/236.

| Group | Count |
|---|--:|
| `tools` | 38 |
| `time (new)` | 33 |
| `misc` | 31 |
| `editing` | 28 |
| `files` | 26 |
| `data (new)` | 23 |
| `chart (new)` | 20 |
| `layout` | 11 |
| `device` | 9 |
| `singletons` | 8 |
| `typography` | 5 |
| `place (new)` | 5 |
| `notify` | 5 |
| `nav` | 4 |
| `arrow-diagonal` | 2 |
| `playback` | 1 |
| `transfer` | 1 |
| `code` | 1 |
| `shape-forms` | 1 |

**Four new groups proposed**, each because nothing in the 26 fits: `time` (clocks, timers, alarm clocks, calendars — the set has only `stopwatch`, in `misc`), `chart` (charts, gauges, chart-search — the set has `stat-chart-a` and `trending-*` in `misc`), `data` (databases, servers, clouds, networks and flows — `database` sits in `files`, racks in `device`), `place` (maps, pins, routes — no home today).

## Method

- Every batch SVG and every `kol-icon-set-*` glyph (523, all four sets) rendered to a 48 px alpha raster (sharp, 1 px blur), compared by soft IoU (Σmin/Σmax). One sweep; `external` (flags, brands) left out of the look match, kept for names.
- Pixel IoU is dominated by outer rings and boxes, so look matches on plain circles/squares (`highlighter-circle`, `mode-toggle-01`, `stop`, `component-01`, `rack-h`) are dropped, and 50 semantic aliases (eyedropper → `eyedrop`, scissors → `cut`, gear → `settings-01` …) were added as candidates.
- Every set candidate was judged by eye on the review page at 96: **duplicate-of-set** = the same drawing, skip the import; **name-collision** = same name, different drawing — gets `-02`; **near (judge)** = same object, his call.
- Names: the batch name minus `NNN-`, `colour` → `color`, `-02`/`-03` on a clash with the set or an earlier batch name. Solid twins are not yet given `-solid` — that is a pick in the import session.

## Table

Similarity = look score against the named match (batch peer for batch verdicts, nearest set glyph otherwise; nearest set glyph shown for new).

| Source | Proposed name | Group | Verdict | Score | Nearest set | Family | Home | Also |
|---|---|---|---|--:|---|---|---|---|
| `001-edit-square` | `edit-square` | `editing` | rename to edit-square | 0.464 | `stat-chart-a` | `pen` | `editing` | `tools` |
| `002-lasso-rotate` | `lasso-rotate` | `tools` | keep | 0.326 | `laptop` | `select` | `tools` | — |
| `003-add-frame` | `frame-plus` | `tools` | rename to frame-plus | 0.426 | `dith-gear` | `frame` | `tools` | `layout` |
| `004-pen-nib` | — | `editing` | drop (dup of pen-nib) | 0.46 | `attach` | `pen` | `editing` | `tools` |
| `005-duplicate` | `copy-02` | `singletons` | rename to copy-02 | 0.581 | `gen-color` | `copy` | `singletons` | `layout` |
| `006-eraser` | `eraser-02` | `editing` | keep as modifier eraser-02 | 0.334 | `rewind` | `eraser` | `editing` | — |
| `007-flip-frame` | `flip-frame` | `tools` | keep | 0.554 | `panel-left` | `flip` | `tools` | — |
| `008-add-anchor-pen` | `pen-plus` | `editing` | rename to pen-plus | 0.444 | `social-twitter` | `pen` | `editing` | `tools` |
| `009-camera` | — | `device` | drop (dup of camera) | 0.565 | `camera` | `camera` | `device` | — |
| `010-images` | `images` | `files` | keep | 0.447 | `r2b2` | `image` | `files` | — |
| `011-video-film` | `film-video` | `files` | rename to film-video | 0.487 | `kol-ds` | `film` | `files` | `playback` |
| `012-shapes-on-image` | `image-shapes` | `files` | rename to image-shapes | 0.471 | `boolean-unite` | `image` | `files` | — |
| `013-bezier-node` | `bezier-node` | `editing` | keep | 0.432 | `mirror-alt-mir` | `vector` | `editing` | `tools` |
| `014-rotate-object` | `rotate-object` | `tools` | keep | 0.371 | `heart` | `rotate` | `tools` | — |
| `015-copy-layer` | — | `layout` | drop (dup of copy-02) | 0.924 | `gen-color` | `copy` | `layout` | `singletons` |
| `016-text-frame` | `text-frame` | `typography` | keep | 0.491 | `atomic-organism-02` | `text` | `typography` | — |
| `017-flip-transform` | `flip-transform` | `tools` | keep | 0.653 | `line-grid` | `flip` | `tools` | — |
| `018-adjust-sliders` | `sliders-adjust` | `tools` | rename to sliders-adjust | 0.438 | `shape-ico` | `sliders` | `tools` | — |
| `019-vector-nodes` | `vector-nodes` | `editing` | keep | 0.547 | `diamond` | `vector` | `editing` | `tools` |
| `020-path-pencil` | `pencil-path` | `editing` | rename to pencil-path | 0.358 | `logic-nor` | `pen` | `editing` | `tools` |
| `021-shape-union` | `shape-union` | `tools` | keep | 0.516 | `boolean-intersect` | `boolean` | `tools` | — |
| `022-expand-cross-arrows` | `expand-cross` | `arrow-diagonal` | rename to expand-cross | 0.527 | `x` | `expand` | `arrow-diagonal` | `layout` |
| `023-edit-selection` | `edit-selection` | `tools` | keep | 0.488 | `atomic-organism-02` | `pen` | `tools` | `editing` |
| `024-text-tool` | `text-tool` | `typography` | keep | 0.438 | `mirror` | `text` | `typography` | — |
| `025-pen-nib` | — | `editing` | drop (dup of pen-nib) | 0.41 | `attach` | `pen` | `editing` | `tools` |
| `026-lasso-select` | `lasso-select` | `tools` | keep | 0.388 | `boolean-unite` | `select` | `tools` | — |
| `027-spray-can` | `spray-can` | `editing` | keep | 0.331 | `pen` | `brush` | `editing` | `tools` |
| `028-search-zoom` | — | `singletons` | drop (dup of search) | 0.33 | `boolean-intersect` | `search` | `singletons` | — |
| `029-magic-wand` | `magic-wand` | `editing` | keep | 0.352 | `boolean-unite` | `wand` | `editing` | — |
| `030-eyedropper` | `eyedropper` | `tools` | keep · near eyedrop | 0.445 | `edit` | `eyedrop` | `tools` | — |
| `031-bezier-pen-handles` | `pen-bezier` | `editing` | rename to pen-bezier | 0.49 | `boolean-unite` | `pen` | `editing` | `tools` |
| `032-3d-cube` | `cube-3d` | `tools` | rename to cube-3d | 0.442 | `stopwatch-solid` | `cube-3d` | `tools` | — |
| `033-rgb-circles` | `color-rgb` | `tools` | rename to color-rgb | 0.422 | `dith-flower` | `color-model` | `tools` | — |
| `034-cmyk` | `color-cmyk` | `tools` | rename to color-cmyk | 0.585 | `mirror-alt-mir` | `color-model` | `tools` | — |
| `035-eraser` | `eraser` | `editing` | keep as base eraser | 0 | `ramp-up` | `eraser` | `editing` | — |
| `036-brush` | `brush` | `editing` | keep | 0.372 | `edit` | `brush` | `editing` | `tools` |
| `037-select-area` | `select-area` | `tools` | keep | 0.52 | `opacity` | `select` | `tools` | — |
| `038-crop` | — | `tools` | drop (dup of crop) | 0.693 | `crop` | `crop` | `tools` | — |
| `039-swatch-book` | `color-swatch-book` | `tools` | rename to color-swatch-book | 0.49 | `fxr` | `swatch` | `tools` | — |
| `040-drawing-tablet` | `drawing-tablet` | `device` | keep | 0.455 | `social-instagram-2` | `easel` | `device` | `files` |
| `041-ruler` | `ruler` | `tools` | keep | 0.47 | `eyedrop` | `ruler` | `tools` | — |
| `042-design-file` | `design-file` | `files` | keep | 0.677 | `file-pdf` | `file` | `files` | — |
| `043-scissors` | `scissors` | `tools` | keep · near cut | 0.438 | `direction-cross` | `cut` | `tools` | `singletons` |
| `044-idea-bulb` | `bulb` | `misc` | rename to bulb | 0.503 | `pen` | `bulb` | `misc` | — |
| `045-craft-knife` | `craft-knife` | `tools` | keep | 0.342 | `expand` | `cut` | `tools` | `singletons` |
| `046-compass` | `compass-drafting` | `tools` | rename to compass-drafting | 0.456 | `star-solid` | `compass` | `tools` | `place` |
| `047-image-frame` | `image-frame` | `files` | keep | 0.507 | `monitor` | `image` | `files` | — |
| `048-paint-bucket` | `paint-bucket` | `tools` | keep | 0.384 | `caret-up` | `paint` | `tools` | — |
| `049-ruler-pencil` | `ruler-pencil` | `editing` | keep | 0.471 | `gen-pattern` | `ruler` | `editing` | `tools` |
| `050-3d-axes` | `axis-3d` | `tools` | rename to axis-3d | 0.42 | `stopwatch-solid` | `cube-3d` | `tools` | — |
| `051-easel-artboard` | `easel-artboard` | `device` | keep | 0.489 | `mirror-alt-mir` | `easel` | `device` | `files` |
| `052-edit-image` | `image-edit` | `files` | rename to image-edit | 0.422 | `monitor` | `image` | `files` | — |
| `053-text-box` | `text-box` | `typography` | keep · near batch | 0.725 | `monitor` | `text` | `typography` | — |
| `054-idea-bulb` | — | `misc` | drop (dup of bulb) | 0 | `stopwatch-solid` | `bulb` | `misc` | — |
| `055-layers` | — | `layout` | drop (dup of layers) | 0.655 | `layers` | `layers` | `layout` | `tools` |
| `056-colour-swatches` | `color-swatches` | `tools` | rename to color-swatches | 0.495 | `monitor` | `swatch` | `tools` | — |
| `057-compass` | `compass-drafting-ruler` | `tools` | keep as modifier compass-drafting-ruler | 0.501 | `caret-up` | `compass` | `tools` | `place` |
| `058-select-cursor` | `select-cursor` | `tools` | keep | 0.508 | `gen-color` | `select` | `tools` | — |
| `059-pen-tool` | `pen-tool` | `editing` | keep · same subject as shipped pen (tools) | 0.486 | `boolean-unite` | `pen` | `editing` | `tools` |
| `060-3d-rotate` | `rotate-3d` | `tools` | rename to rotate-3d | 0.504 | `component-01` | `rotate` | `tools` | — |
| `061-easel` | `easel` | `device` | keep | 0.509 | `brand` | `easel` | `device` | `files` |
| `062-layers` | `layers-02` | `layout` | keep as modifier layers-02 | 0.531 | `shape-ico` | `layers` | `layout` | `tools` |
| `063-palette-brush` | `palette-brush` | `tools` | keep | 0.461 | `caret-left` | `palette` | `tools` | — |
| `064-calendar` | `calendar-days` | `time (new)` | rename to calendar-days | 0.486 | `social-instagram-2` | `calendar` | `time` | — |
| `065-clock` | `clock-02` | `time (new)` | keep as modifier clock-02 | 0.638 | `mode-toggle-01` | `clock` | `time` | — |
| `066-map-pin` | `map-pin` | `place (new)` | keep | 0.37 | `radial-circle` | `map` | `place` | — |
| `067-hourglass` | `hourglass` | `time (new)` | keep | 0.466 | `caret-right` | `hourglass` | `time` | — |
| `068-clock` | `clock` | `time (new)` | keep as base clock | 0.707 | `highlighter-circle` | `clock` | `time` | — |
| `069-calendar` | `calendar` | `time (new)` | keep as base calendar | 0.55 | `a-framed` | `calendar` | `time` | — |
| `070-bell` | — | `notify` | drop (dup of bell) | 0.516 | `bell` | `bell` | `notify` | — |
| `071-stopwatch` | `stopwatch-dial` | `time (new)` | keep as modifier stopwatch-dial | 0.487 | `stopwatch` | `stopwatch` | `time` | `playback` |
| `072-alarm-clock` | `alarm-clock` | `time (new)` | keep | 0.509 | `social-instagram-2` | `alarm-clock` | `time` | `notify` |
| `073-route-pins` | `map-pin-route` | `place (new)` | rename to map-pin-route | 0.479 | `brand` | `map` | `place` | — |
| `074-map` | `map` | `place (new)` | keep | 0.541 | `rack-v` | `map` | `place` | — |
| `075-clock` | `clock-dial` | `time (new)` | keep as modifier clock-dial | 0.707 | `mode-toggle-01` | `clock` | `time` | — |
| `076-clock-ring` | `clock-ring` | `time (new)` | keep | 0.579 | `social-github` | `clock` | `time` | — |
| `077-wall-clock-square` | `clock-square` | `time (new)` | rename to clock-square | 0.538 | `social-instagram-2` | `clock` | `time` | — |
| `078-calendar-date` | `calendar-date` | `time (new)` | keep | 0.493 | `social-instagram-2` | `calendar` | `time` | — |
| `079-alarm-clock` | `alarm-clock-dial` | `time (new)` | keep as modifier alarm-clock-dial | 0 | `monitor` | `alarm-clock` | `time` | `notify` |
| `080-stopwatch-gauge` | `stopwatch-gauge` | `time (new)` | keep as modifier stopwatch-gauge | 0.511 | `stopwatch` | `stopwatch` | `time` | `playback` |
| `081-dashed-clock` | `clock-ticks` | `time (new)` | rename to clock-ticks | 0.374 | `clr-comp` | `clock` | `time` | — |
| `082-clock-gear` | `clock-gear` | `time (new)` | keep | 0.576 | `grad-rad` | `clock` | `time` | — |
| `083-watch` | `watch` | `time (new)` | keep | 0.46 | `bell` | `watch` | `time` | `device` |
| `084-fast-stopwatch` | `stopwatch-fast` | `time (new)` | rename to stopwatch-fast | 0.437 | `social-youtube` | `stopwatch` | `time` | `playback` |
| `085-clock-cycle` | `clock-cycle` | `time (new)` | keep | 0.433 | `social-youtube` | `clock` | `time` | — |
| `086-person-clock` | `user-clock` | `time (new)` | rename to user-clock | 0.355 | `shape-octa` | `clock` | `time` | — |
| `087-hourglass-round` | `hourglass-round` | `time (new)` | keep | 0.457 | `rectangle` | `hourglass` | `time` | — |
| `088-24-h-clock` | `clock-24h` | `time (new)` | rename to clock-24h | 0.573 | `highlighter-circle` | `clock` | `time` | — |
| `089-gauge-timer` | — | `time (new)` | drop (dup of stopwatch-gauge) | 0.61 | `highlighter-circle` | `stopwatch` | `time` | `playback` |
| `090-watch-24` | `watch-24h` | `time (new)` | rename to watch-24h | 0.468 | `brand` | `watch` | `time` | `device` |
| `091-bell-ringing` | `bell-ring` | `notify` | rename to bell-ring | 0.433 | `shape-octa` | `bell` | `notify` | — |
| `092-clock-dashed` | `clock-dashed` | `time (new)` | keep | 0.521 | `highlighter-circle` | `clock` | `time` | — |
| `093-fast-clock` | `clock-fast` | `time (new)` | rename to clock-fast | 0.392 | `globe` | `clock` | `time` | — |
| `094-calendar-clock` | `calendar-clock` | `time (new)` | keep | 0.586 | `a-framed` | `calendar` | `time` | — |
| `095-time-zones` | `clock-zones` | `time (new)` | rename to clock-zones | 0.566 | `grid` | `clock` | `time` | — |
| `096-globe-clock` | `clock-globe` | `time (new)` | rename to clock-globe | 0.569 | `mirror-alt-mir` | `clock` | `time` | — |
| `097-24-h-refresh` | `clock-24h-refresh` | `time (new)` | rename to clock-24h-refresh | 0.565 | `email-02` | `clock` | `time` | — |
| `098-hourglass` | — | `time (new)` | drop (dup of hourglass) | 0.688 | `social-instagram-2` | `hourglass` | `time` | — |
| `099-route-flag-pin` | `map-pin-flag` | `place (new)` | rename to map-pin-flag | 0.367 | `ascii-hash` | `map` | `place` | — |
| `100-s-route-roadmap` | `map-route` | `place (new)` | rename to map-route | 0.45 | `email-01` | `map` | `place` | — |
| `101-scroll-pen` | `scroll-pen` | `files` | keep | 0.529 | `file-doc` | `book` | `files` | `editing` |
| `102-pen-laurel` | `pen-laurel` | `editing` | keep | 0.462 | `mirror` | `pen` | `editing` | `tools` |
| `103-idea-pencil` | `bulb-pencil` | `editing` | rename to bulb-pencil | 0.346 | `tr-skip` | `bulb` | `editing` | `misc` |
| `104-pen-nib-writing` | `pen-nib-line` | `editing` | rename to pen-nib-line | 0.438 | `shape-tetra` | `pen` | `editing` | `tools` |
| `105-file-pen` | `file-pen` | `files` | keep | 0.434 | `mask` | `file` | `files` | — |
| `106-pen` | — | `editing` | drop (dup of edit) | 0.368 | `stat-chart-a` | `pen` | `editing` | `tools` |
| `107-clipboard-pen` | `clipboard-pen` | `files` | keep | 0.462 | `boolean-exclude` | `clipboard` | `files` | — |
| `108-notepad-pen` | `notepad-pen` | `files` | keep | 0.444 | `mask` | `book` | `files` | `editing` |
| `109-typewriter` | `typewriter` | `device` | keep | 0.51 | `mirror-alt-mir` | `typewriter` | `device` | — |
| `110-quill-signature` | `signature` | `editing` | rename to signature | 0.39 | `attach` | `pen` | `editing` | `tools` |
| `111-book-pen` | `book-pen` | `files` | keep | 0.526 | `social-youtube` | `book` | `files` | `editing` |
| `112-pen-scribble` | `pen-scribble` | `editing` | keep | 0.374 | `social-twitter` | `pen` | `editing` | `tools` |
| `113-magic-pen` | `pen-magic` | `editing` | rename to pen-magic | 0.417 | `star-solid` | `pen` | `editing` | `tools` |
| `114-brush` | — | `editing` | drop (dup of brush) | 0.469 | `social-twitter` | `brush` | `editing` | `tools` |
| `115-file-quill` | `file-quill` | `files` | keep | 0.448 | `mask` | `file` | `files` | — |
| `116-fountain-pen` | `pen-fountain` | `editing` | rename to pen-fountain | 0.411 | `mask` | `pen` | `editing` | `tools` |
| `117-bento-grid` | `bento-grid` | `layout` | keep | 0.533 | `grid` | `layout` | `layout` | — |
| `118-app-squares` | `app-squares` | `layout` | keep | 0.56 | `r2b2` | `layout` | `layout` | — |
| `119-bars-line` | `chart-bar-line` | `chart (new)` | rename to chart-bar-line | 0.48 | `social-youtube` | `chart-bar` | `chart` | `misc` |
| `120-gauge` | `gauge` | `chart (new)` | keep | 0.419 | `shape-torus` | `gauge` | `chart` | `time` |
| `121-dashboard-tile` | `dashboard-tile` | `layout` | keep | 0.538 | `ascii-dash` | `layout` | `layout` | — |
| `122-bars-trend-arrow` | `chart-bar-trend` | `chart (new)` | rename to chart-bar-trend | 0.458 | `tr-carets` | `chart-bar` | `chart` | `misc` |
| `123-monitor-chart` | `chart-monitor` | `chart (new)` | rename to chart-monitor | 0.498 | `rack-v` | `chart-screen` | `chart` | `device` |
| `124-database-cycle` | `database-cycle` | `data (new)` | keep | 0.545 | `target` | `database` | `data` | `files` |
| `125-server-bars` | `server-bars` | `data (new)` | keep | 0.55 | `boolean-unite` | `server` | `data` | `device` |
| `126-database-network` | `database-network` | `data (new)` | keep | 0.44 | `kolkrabbi` | `database` | `data` | `files` |
| `127-report-gear` | `report-gear` | `files` | keep | 0.447 | `mirror-alt-mir` | `file` | `files` | — |
| `128-database-globe` | `database-globe` | `data (new)` | keep | 0.56 | `studio` | `database` | `data` | `files` |
| `129-database-refresh` | `database-refresh` | `data (new)` | keep | 0.726 | `target` | `database` | `data` | `files` |
| `130-line-chart` | `chart-line` | `chart (new)` | rename to chart-line | 0.368 | `laptop` | `chart-line` | `chart` | `misc` |
| `131-globe-search` | `search-globe` | `singletons` | rename to search-globe | 0.564 | `stop` | `search` | `singletons` | — |
| `132-venn-circles` | `venn-circles` | `tools` | keep | 0.492 | `lock` | `boolean` | `tools` | — |
| `133-cycle-chart` | `chart-cycle` | `chart (new)` | rename to chart-cycle | 0.518 | `shape-cube` | `chart-pie` | `chart` | — |
| `134-trend-search` | `chart-line-search` | `chart (new)` | rename to chart-line-search | 0.402 | `stop` | `chart-line` | `chart` | `misc` |
| `135-donut-chart` | `chart-donut` | `chart (new)` | rename to chart-donut | 0.423 | `r2b2` | `chart-pie` | `chart` | — |
| `136-database-hex` | `database-hex` | `data (new)` | keep | 0.48 | `stopwatch-solid` | `database` | `data` | `files` |
| `137-phone-chart` | `chart-phone` | `chart (new)` | rename to chart-phone | 0.498 | `atomic-atom` | `chart-screen` | `chart` | `device` |
| `138-cloud-apps` | `cloud-apps` | `data (new)` | keep | 0.472 | `dith-diamond` | `cloud` | `data` | `shape-forms` |
| `139-search-gear` | `search-gear` | `singletons` | keep | 0.474 | `mirror-alt-mir` | `search` | `singletons` | — |
| `140-bars-pie` | `chart-bar-pie` | `chart (new)` | rename to chart-bar-pie | 0.457 | `dith-htone` | `chart-bar` | `chart` | `misc` |
| `141-gear-network` | `network-gear` | `data (new)` | rename to network-gear | 0.466 | `atomic-atom` | `network` | `data` | — |
| `142-target-refresh` | `target-refresh` | `tools` | keep | 0.438 | `clr-split` | `target` | `tools` | — |
| `143-checklist` | `checklist` | `files` | keep | 0.469 | `pattern-tool` | `clipboard` | `files` | — |
| `144-block-diagram` | `block-diagram` | `layout` | keep · near grid | 0.708 | `grid` | `layout` | `layout` | — |
| `145-hand-gear` | `gear-hand` | `misc` | rename to gear-hand | 0.443 | `mask` | `gear` | `misc` | `nav` · `tools` |
| `146-cloud-gear` | `cloud-gear` | `data (new)` | keep | 0.446 | `dith-diamond` | `cloud` | `data` | `shape-forms` |
| `147-database` | `database-02` | `data (new)` | rename to database-02 | 0.465 | `align-vertical-bottom` | `database` | `data` | `files` |
| `148-bars-search` | `chart-bar-search` | `chart (new)` | rename to chart-bar-search | 0.426 | `monitor` | `chart-bar` | `chart` | `misc` |
| `149-search` | — | `singletons` | drop (dup of search) | 0.33 | `overlap` | `search` | `singletons` | — |
| `150-server` | `server` | `data (new)` | keep | 0.463 | `monitor` | `server` | `data` | `device` |
| `151-growth-bars` | `chart-bar-growth` | `chart (new)` | rename to chart-bar-growth | 0.474 | `dith-htone` | `chart-bar` | `chart` | `misc` |
| `152-folder-tree` | `folder-tree` | `files` | keep | 0.463 | `dith-gear` | `folder` | `files` | — |
| `153-cart-load` | `cart-load` | `misc` | keep | 0.438 | `clr-tet` | `cart-load` | `misc` | — |
| `154-donut-ring` | `chart-donut-ring` | `chart (new)` | rename to chart-donut-ring | 0.63 | `highlighter-circle` | `chart-pie` | `chart` | — |
| `155-data-network` | `data-network` | `data (new)` | keep | 0.429 | `dith-crt` | `network` | `data` | — |
| `156-cloud-monitor` | `cloud-monitor` | `data (new)` | keep | 0.479 | `atomic-atom` | `cloud` | `data` | `shape-forms` |
| `157-pie-search` | `chart-pie-search` | `chart (new)` | rename to chart-pie-search | 0.408 | `clr-cmpd` | `chart-pie` | `chart` | — |
| `158-hierarchy` | `hierarchy` | `data (new)` | keep | 0.426 | `flip-vertical` | `network` | `data` | — |
| `159-server-rack` | `server-rack` | `data (new)` | keep | 0.568 | `mirror-alt-mir` | `server` | `data` | `device` |
| `160-crosshair` | `crosshair` | `tools` | keep · near target | 0.499 | `radial-rect` | `target` | `tools` | — |
| `161-power` | `power` | `singletons` | keep | 0.438 | `stopwatch` | `power` | `singletons` | — |
| `162-pie-chart` | `chart-pie` | `chart (new)` | rename to chart-pie | 0.458 | `mode-toggle-02` | `chart-pie` | `chart` | — |
| `163-line-chart` | — | `chart (new)` | drop (dup of chart-line) | 0.366 | `opacity` | `chart-line` | `chart` | `misc` |
| `164-monitor-pie` | `chart-monitor-pie` | `chart (new)` | rename to chart-monitor-pie | 0.454 | `monitor` | `chart-screen` | `chart` | `device` |
| `165-podium` | `podium` | `misc` | keep | 0.458 | `shape-tetra` | `trophy` | `misc` | — |
| `166-funnel` | `funnel` | `singletons` | keep | 0.433 | `pen` | `filter` | `singletons` | — |
| `167-head-gear` | `gear-head` | `misc` | rename to gear-head | 0.474 | `grad-rad` | `gear` | `misc` | `nav` · `tools` |
| `168-file-check` | `file-check` | `files` | keep | 0.475 | `clipboard` | `file` | `files` | — |
| `169-network-star` | `network-star` | `data (new)` | keep | 0.601 | `stop` | `network` | `data` | — |
| `170-nodes` | `nodes` | `data (new)` | keep | 0.47 | `boolean-exclude` | `network` | `data` | — |
| `171-workflow-circle` | `workflow-circle` | `data (new)` | keep | 0.601 | `component-01` | `network` | `data` | — |
| `172-flow-arrows` | `flow-arrows` | `data (new)` | keep | 0.456 | `hamburger` | `network` | `data` | — |
| `173-gear-cycle` | `gear-cycle` | `nav` | keep | 0.554 | `mask` | `gear` | `nav` | `tools` |
| `174-server-gear` | `server-gear` | `data (new)` | keep | 0.572 | `mirror-alt-mir` | `server` | `data` | `device` |
| `175-user-target` | `user-target` | `nav` | keep | 0.493 | `shape-ico` | `user` | `nav` | — |
| `176-layers` | `layers-03` | `layout` | keep as modifier layers-03 | 0.493 | `shape-ico` | `layers` | `layout` | `tools` |
| `177-document` | `document` | `files` | keep | 0.506 | `journal` | `file` | `files` | — |
| `178-search-graph` | `chart-line-search-02` | `chart (new)` | rename to chart-line-search-02 | 0.37 | `social-twitter` | `chart-line` | `chart` | `misc` |
| `179-clipboard-pie` | `clipboard-pie` | `files` | keep | 0.548 | `file-audio` | `clipboard` | `files` | — |
| `180-gear` | — | `nav` | drop (dup of settings-01) | 0.624 | `settings-01` | `gear` | `nav` | `tools` |
| `181-report-chart` | `report-chart` | `files` | keep | 0.454 | `bookmark` | `file` | `files` | — |
| `182-growth-bars-arrow` | `chart-bar-growth-arrow` | `chart (new)` | rename to chart-bar-growth-arrow | 0.429 | `file-md` | `chart-bar` | `chart` | `misc` |
| `183-pen-tool` | — | `editing` | drop (dup of pen-nib) | 0 | `monitor` | `pen` | `editing` | `tools` |
| `184-network` | `network` | `data (new)` | keep | 0.359 | `command` | `network` | `data` | — |
| `185-compass` | `compass` | `tools` | keep | 0 | `highlighter-circle` | `compass` | `place` | `tools` |
| `186-skull` | `skull` | `misc` | keep | 0.44 | `email-02` | `skull` | `misc` | — |
| `187-pilcrow` | `pilcrow` | `typography` | keep | 0.378 | `mask` | `text` | `typography` | — |
| `188-package-open` | `package-open` | `misc` | keep | 0.465 | `social-instagram-2` | `package-open` | `misc` | — |
| `189-audio-waveform` | `audio-waveform` | `playback` | keep | 0.417 | `mode-toggle-02` | `wave` | `playback` | — |
| `190-concierge-bell` | `concierge-bell` | `misc` | keep | 0.45 | `shape-tetra` | `bell` | `misc` | `notify` |
| `191-database-zap` | `database-zap` | `data (new)` | keep | 0.57 | `shape-cyl` | `database` | `data` | `files` |
| `192-bird` | `bird` | `misc` | keep | 0.371 | `atomic-atomic-01` | `bird` | `misc` | — |
| `193-heading-6` | `heading-6` | `typography` | keep | 0.411 | `resize-fixed` | `text` | `typography` | — |
| `194-slice` | `slice` | `tools` | keep | 0.384 | `edit` | `cut` | `tools` | `singletons` |
| `195-award` | `award` | `misc` | keep | 0.398 | `trophy` | `trophy` | `misc` | — |
| `196-timer-reset` | `stopwatch-reset` | `time (new)` | rename to stopwatch-reset | 0.41 | `stopwatch` | `stopwatch` | `time` | `playback` |
| `197-air-vent` | `air-vent` | `misc` | keep | 0.461 | `message` | `air-vent` | `misc` | — |
| `198-diameter` | `diameter` | `tools` | keep | 0.574 | `highlighter-circle` | `diameter` | `tools` | — |
| `199-circle-arrow-out-up-right` | `circle-arrow-out-up-right` | `arrow-diagonal` | keep | 0.477 | `highlighter-circle` | `circle-arrow-out-up-right` | `arrow-diagonal` | — |
| `200-folders` | `folders` | `files` | keep | 0.385 | `panel-right` | `folder` | `files` | — |
| `201-antenna` | `antenna` | `device` | keep | 0.364 | `align-horizontal-center` | `antenna` | `device` | — |
| `202-paint-bucket` | `paint-bucket-02` | `tools` | keep as modifier paint-bucket-02 | 0 | `monitor` | `paint` | `tools` | — |
| `203-hand-metal` | `hand-metal` | `misc` | keep | 0.409 | `social-dribbble` | `hand-metal` | `misc` | — |
| `204-scale` | `scale` | `misc` | keep | 0.444 | `flip-horizontal` | `scale` | `misc` | — |
| `205-paint-roller` | `paint-roller` | `tools` | keep | 0.355 | `color-wheel` | `paint` | `tools` | — |
| `206-image-minus` | `image-minus` | `files` | keep | 0.508 | `a-framed` | `image` | `files` | — |
| `207-link` | `link` | `notify` | keep | 0.351 | `ascii-equal` | `link` | `notify` | — |
| `208-heart-handshake` | `heart-handshake` | `misc` | keep | 0.438 | `heart` | `handshake` | `misc` | — |
| `209-film` | `film` | `files` | keep | 0.554 | `a-framed` | `film` | `files` | `playback` |
| `210-square-pen` | — | `editing` | drop (dup of edit-square) | 0.567 | `a-framed` | `pen` | `editing` | `tools` |
| `211-cpu` | `cpu` | `device` | keep | 0.515 | `opacity` | `cpu` | `device` | — |
| `212-triangle-alert` | — | `singletons` | drop (dup of alert-triangle) | 0.427 | `alert-triangle` | `alert` | `singletons` | `notify` |
| `213-handshake` | `handshake` | `misc` | keep | 0.406 | `image` | `handshake` | `misc` | — |
| `214-presentation` | `presentation` | `files` | keep | 0.394 | `a-framed` | `easel` | `files` | `device` |
| `215-receipt` | `receipt` | `files` | keep | 0.512 | `journal` | `receipt` | `files` | — |
| `216-palette` | — | `tools` | drop (dup of color-palette) | 0.6 | `color-palette` | `palette` | `tools` | — |
| `217-clipboard-pen-line` | `clipboard-pen-line` | `files` | keep | 0.513 | `clipboard` | `clipboard` | `files` | — |
| `218-book-open` | — | `files` | drop (dup of book-open) | 0.535 | `desktop` | `book` | `files` | `editing` |
| `219-medal` | `medal` | `misc` | keep | 0.389 | `database` | `trophy` | `misc` | — |
| `220-swatch-book` | — | `tools` | drop (dup of color-swatch) | 0 | `color-swatch` | `swatch` | `tools` | — |
| `221-alarm-clock-plus` | `alarm-clock-plus` | `time (new)` | keep | 0.456 | `stopwatch` | `alarm-clock` | `time` | `notify` |
| `222-trophy` | `trophy-02` | `misc` | rename to trophy-02 | 0.397 | `space-evenly-vertical` | `trophy` | `misc` | — |
| `223-send` | `send` | `transfer` | keep | 0.33 | `social-twitter` | `send` | `transfer` | — |
| `224-alarm-smoke` | `alarm-smoke` | `notify` | keep | 0.406 | `message` | `alert` | `notify` | `singletons` |
| `225-snail` | `snail` | `misc` | keep | 0.437 | `social-youtube` | `snail` | `misc` | — |
| `226-cake` | `cake` | `misc` | keep | 0.461 | `lock` | `cake` | `misc` | — |
| `227-layout-dashboard` | `layout-dashboard` | `layout` | keep | 0.5 | `a-framed` | `layout` | `layout` | — |
| `228-fish` | `fish` | `misc` | keep | 0.433 | `social-youtube` | `fish` | `misc` | — |
| `229-drafting-compass` | — | `tools` | drop (dup of compass-drafting) | 0.353 | `shape-tetra` | `compass` | `tools` | `place` |
| `230-sword` | `sword` | `misc` | keep | 0.306 | `pointer` | `sword` | `misc` | — |
| `231-cctv` | `cctv` | `device` | keep | 0.41 | `logic-xor` | `camera` | `device` | — |
| `232-brain` | `brain` | `misc` | keep | 0.54 | `mode-toggle-01` | `brain` | `misc` | — |
| `233-chrome` | `chrome-02` | `misc` | rename to chrome-02 | 0.609 | `highlighter-circle` | `chrome` | `misc` | — |
| `234-utensils-crossed` | `utensils-crossed` | `misc` | keep | 0.424 | `radial-star` | `utensils-crossed` | `misc` | — |
| `235-brain-circuit` | `brain-circuit` | `misc` | keep | 0.407 | `mode-toggle-02` | `brain` | `misc` | — |
| `236-brain-cog` | `brain-cog` | `misc` | keep · near batch | 0.765 | `color-wheel` | `brain` | `misc` | — |
| `237-syringe` | `syringe` | `misc` | keep | 0.425 | `eyedrop` | `syringe` | `misc` | — |
| `238-plug-2` | `plug-2` | `device` | keep | 0.347 | `caret-down` | `plug` | `device` | — |
| `239-orbit` | `orbit` | `data (new)` | keep | 0.573 | `highlighter-circle` | `network` | `data` | — |
| `240-candy-cane` | `candy-cane` | `misc` | keep | 0.337 | `eyedrop` | `candy-cane` | `misc` | — |
| `241-dices` | `dices` | `misc` | keep | 0.335 | `social-dribbble` | `dices` | `misc` | — |
| `242-circle-user` | `user-circle` | `nav` | rename to user-circle | 0.743 | `highlighter-circle` | `user` | `nav` | — |
| `243-layout-template` | `layout-template` | `layout` | keep | 0.543 | `row` | `layout` | `layout` | — |
| `244-tent` | `tent` | `misc` | keep | 0.397 | `filter-bp` | `tent` | `misc` | — |
| `245-siren` | `siren` | `notify` | keep | 0.45 | `cone` | `alert` | `notify` | `singletons` |
| `246-wand-sparkles` | `wand-sparkles` | `editing` | keep | 0.53 | `edit` | `wand` | `editing` | — |
| `247-git-pull-request-closed` | `git-pull-request-closed` | `code` | keep | 0.461 | `rows` | `git-pull-request-closed` | `code` | — |
| `248-sparkles` | `sparkles` | `editing` | keep | 0.385 | `brightness` | `wand` | `editing` | — |
| `249-table-cells-merge` | `table-cells-merge` | `layout` | keep | 0.663 | `rack-h` | `layout` | `layout` | — |
| `250-hourglass` | `hourglass-empty` | `time (new)` | keep as modifier hourglass-empty | 0.615 | `component-02` | `hourglass` | `time` | — |
| `251-radar` | `radar` | `chart (new)` | keep | 0.58 | `highlighter-circle` | `gauge` | `chart` | `time` |
| `252-cloud-rain` | `cloud-rain` | `shape-forms` | keep | 0.353 | `dith-cross` | `cloud` | `shape-forms` | `data` |
