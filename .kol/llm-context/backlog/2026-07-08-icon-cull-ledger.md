# Icon cull ledger — dupes, shadowed files, review queues (2026-07-08)

Companion to `2026-07-07-icon-qa.md` (geometry/stroke QA). Method: checksum + normalized-geometry scan over all of `packages/loader/src/{stroke,solid,svg}/` (2,104 files) + rendered-bbox flags from the live `/icons` page. **Zero corrupt/degenerate files found** — every "broken-looking" icon is a design-quality issue, not bad data.

Icon resolution order (`Icon.jsx:58-61`): `STROKE/SOLID → LEGACY (svg/) → WEB (svg-web/)`. Legacy files whose name exists in stroke/ or solid/ can NEVER render.

## The cull math

| Tier | What | Files | Action |
| --- | --- | --- | --- |
| 1 — mechanical, zero visual impact | legacy `svg/` files shadowed by stroke/solid names | **343 of 367** | delete outright |
| 1 | byte-identical dupes within stroke/ + solid/ | ~74 (69 groups incl. cross-tree) | keep one per group |
| 2 — quick judgment | same normalized geometry, different name/path | 197 (93 groups) | pick the canonical name, delete the rest |
| 2 | same filename in 2+ stroke categories | 17 groups | pick the canonical category |
| 3 — design review | undersized (63) · off-center (23) · outline-expanded no-stroke (35) · zero-area line glyphs (6, likely fine) | ~127 | refit / redraw / exempt |

Manual pass shrinks from 2,104 files to ~350 judgment calls, most of them one-glance.

Not scanned: `svg-web/` (164 files, `12px-*` sized glyphs — separate concern, last in resolution order).

## Tier 1a — legacy `svg/` shadowed files (343)

Every one of these is unreachable (a stroke/ or solid/ file owns the name). The 24 survivors in `svg/` NOT listed here are the only reachable legacy icons — review those separately before deleting the tree wholesale.

```
add-file, alarm-bell, alert-circle, alert-triangle, align-auto, align-center, align-left, align-right, arrow-cross, arrow-down, arrow-downright, arrow-expand, arrow-left, arrow-right, arrow-up, ascii-back, ascii-block, ascii-dash, ascii-dot, ascii-equal, ascii-hash, ascii-pipe, ascii-plus, ascii-slash, ascii-x, atomic-atom, atomic-lifeform, atomic-molecule, atomic-organism, attachment, battery, bold, bolt, book-open, bookmark, brush, bucket, cable-lock, cable-off, cable-on, cable-trans, cable-unlock, calendar, calendar-check, calendar-days, camera, camera-off, cap-butt, cap-round, cap-square, caret-down, caret-left, caret-right, caret-up, check, check-circle, chevron-down, chevron-left, chevron-right, chevron-up, circle, clipboard-1, clipboard-2, clock, clock-alert, clock-rotate-left, clr-anl, clr-comp, clr-mono, clr-tri, code, color, columns, component, cone, contrast, control-arrow-back, control-arrow-end, control-arrow-forward, control-arrow-start, control-pause, control-play, control-stop, copy, credit-card, cross, curve-exp, curve-log, database, diamond, dith-cross, dith-crt, dith-diamond, dith-flow, dith-flower, dith-gear, dith-glitch, dith-grid, dith-hex, dith-htone, dith-melt, dith-radial, dith-xhatch, dollar-sign, download, dual-opponent, edit, external-link, eye-off, eye-on, eyedrop, fast-forward, file, file-image, file-text, file-video, filter, filter-bp, filter-hp, filter-lp, filter-notch, flag, flip-y, folder-01, folder-02, folder-open, foundation, frequency, gen-color, gen-gradient, gen-pattern, gen-wave, gift, grad-con, grad-lin, grad-rad, grid, grid-01, grid-02, grid-03, grid-04, grid-05, grid-06, heart-1, heart-2, help-circle, history, home-1, home-2, image, in-going, info, instance, interactive, italic, journal, key, layers, layout, layout-01, layout-02, layout-03, library, line-circle, line-grid, line-line, line-lissa, line-spiral, list-01, list-02, list-ordered, list-unordered, loader, location, lock, log-in, log-out, logic-and, logic-nand, logic-nor, logic-not, logic-or, logic-xor, mail, manual-empty, maximize, menu, message-circle, message-square, mic, mic-off, minimize, minus, monitor, moon, more-horizontal, more-vertical, move, nav-create, nav-home, nav-library, nav-rack, nav-settings, package, page, panel-left, panel-right, pen, pencil, phone, pills, plus, power, ptrn-checker, ptrn-dot, ptrn-stripe, rabbit, radial-circle, radial-default, radial-hex, radial-random, radial-rect, radial-star, radial-triangle, ramp-down, ramp-tri, ramp-up, receipt, redo, refresh, repeat, repeat-1, rewind, roadmap, rotate, rotate-left, rotate-right, row, save, search, search-line, send, seq-a, seq-b, seq-c, seq-d, server, settings-01, settings-02, shape, shape-cube, shape-cyl, shape-ico, shape-octa, shape-sphere, shape-tetra, shape-torus, shaper-clip, shaper-exp, shaper-fold, shaper-log, shaper-scurve, shaper-sine, shaper-step, shaper-wrap, share, shield, shopping-bag, shopping-cart, shuffle, sidebar, signature-thick, skip-back, skip-forward, snap, social-facebook, social-linkedin, social-twitter, star, stat-abacus, stat-chart-a, stat-chart-b, stat-chart-c, stat-crown, stat-cycle, stat-donut, stat-medalion, stat-pie, stat-pie-c, stat-rocket, stat-stat, stat-winner, stop, stopwatch, sun, swap, tag, terminal, text-01, text-02, theme-toggle, timer, tr-carets, tr-fwd, tr-inf, tr-left, tr-pause, tr-rew, tr-right, tr-skip, trash, trending-down, trending-up, triangle, type-01, type-02, type-03, underline, undo, unlock, upload, user, user-plus, users, video, video-off, volume, volume-1, volume-2, volume-x, wave, wave-rnd, wave-saw, wave-sin, wave-sqr, wave-tri, wheel, wifi, wifi-off, x, x-circle, zoom-in, zoom-out
```

## Tier 1b — byte-identical duplicate groups (69)

One file per group survives. Groups spanning trees usually mean the legacy copy dies with Tier 1a.

- solid/actions/cross.svg = solid/navigation/x.svg
- solid/actions/minimize.svg = solid/layout/collapse.svg
- solid/editing/boolean-merge.svg = solid/editing/boolean-unite.svg
- solid/editing/color-03.svg = solid/editing/color-swatch.svg
- solid/editing/eyedrop.svg = solid/editing/eyedropper.svg
- solid/editing/highlightercircle.svg = solid/editing/markercircle.svg = solid/editing/pencilcircle.svg
- solid/editing/pencil.svg = solid/system/tui-draw.svg = solid/tools/pencil.svg
- solid/editing/pencilline.svg = solid/editing/pencilsimple.svg
- solid/editing/type-01.svg = solid/typography/type.svg
- solid/files/img-01.svg = solid/files/img-03.svg
- solid/layout/align-middle.svg = solid/layout/align-vertical-center.svg
- solid/layout/alignleft-1.svg = solid/layout/alignleft.svg
- solid/layout/alignright-1.svg = solid/layout/alignright.svg
- solid/layout/border-all.svg = solid/shapes/shape-square.svg
- solid/layout/component.svg = solid/misc/instance.svg
- solid/layout/list-01.svg = solid/navigation/menu.svg
- solid/media/control-stop.svg = solid/media/stop.svg
- solid/rack/seq-b.svg = solid/rack/seq-c.svg
- solid/shapes/circle.svg = solid/shapes/shape-circle.svg
- solid/shapes/star.svg = solid/user/star.svg
- solid/shapes/wheel.svg = solid/tools/wheel.svg
- solid/system/bug-1.svg = solid/system/bug-2.svg
- solid/system/code-curly-collection.svg = solid/system/curly.svg
- solid/system/tui-crop.svg = solid/tools/crop.svg
- solid/system/tui-filter.svg = solid/tools/filter-palette.svg
- solid/typography/a.svg = solid/typography/typography-3.svg
- solid/typography/italic-a.svg = solid/typography/typography-1.svg
- solid/typography/roman-a.svg = solid/typography/typography-2.svg
- solid/user/social-github.svg = stroke/user/social-github.svg
- stroke/actions/cross.svg = stroke/navigation/x.svg
- stroke/actions/move.svg = stroke/layout/move.svg = stroke/navigation/arrow-cross.svg
- stroke/actions/search-1.svg = stroke/actions/zoom-magnify.svg
- stroke/editing/boolean-intersect.svg = stroke/editing/boolean-outline.svg
- stroke/editing/color-02.svg = stroke/editing/solid-1.svg
- stroke/editing/color-03.svg = stroke/editing/color-swatch.svg
- stroke/editing/color.svg = stroke/theme/contrast.svg
- stroke/editing/cut.svg = stroke/editing/scissors.svg
- stroke/editing/edit-alt.svg = stroke/editing/pen-copy.svg
- stroke/editing/pencil.svg = stroke/tools/pencil.svg
- stroke/editing/text-02.svg = stroke/system/tui-text.svg
- stroke/layout/align-middle.svg = stroke/layout/align-vertical-center.svg
- stroke/layout/border-outer.svg = stroke/shapes/shape-square.svg
- stroke/layout/horizontal-center.svg = stroke/layout/objects-horizontal-center.svg
- stroke/layout/horizontal-left.svg = stroke/layout/objects-horizontal-left.svg
- stroke/layout/horizontal-right.svg = stroke/layout/objects-horizontal-right.svg
- stroke/media/control-stop.svg = stroke/media/stop.svg
- stroke/misc/health.svg = stroke/misc/plus-medical.svg
- stroke/navigation/caret-down.svg = stroke/rack/chevron-down.svg
- stroke/navigation/caret-left.svg = stroke/rack/chevron-left.svg
- stroke/navigation/caret-right.svg = stroke/rack/chevron-right.svg
- stroke/navigation/caret-up.svg = stroke/rack/chevron-up.svg
- stroke/rack/ascii-plus.svg = stroke/rack/nav-create.svg
- stroke/rack/line-circle.svg = stroke/shapes/circle.svg = stroke/shapes/shape-circle.svg
- stroke/shapes/circle-dashed.svg = stroke/shapes/shape-17.svg
- stroke/shapes/star.svg = stroke/user/star.svg
- stroke/shapes/wheel.svg = stroke/tools/wheel.svg
- stroke/system/bug-alt.svg = stroke/system/bug.svg
- stroke/system/customize.svg = stroke/system/slider.svg
- stroke/system/information-1.svg = stroke/system/information-2.svg = stroke/system/information-3.svg
- stroke/system/tui-crop.svg = stroke/tools/crop.svg
- stroke/system/tui-filter.svg = stroke/tools/filter-palette.svg
- stroke/typography/a.svg = stroke/typography/typography-3.svg
- stroke/typography/italic-a.svg = stroke/typography/typography-1.svg
- stroke/typography/roman-a.svg = stroke/typography/typography-2.svg
- svg/00-kol/eye-on.svg = svg/00-kol/eye-open.svg
- svg/01-navigation/chevron-right.svg = svg/99-rack/chevron-right.svg
- svg/08-time-calendar/clock-rotate-left.svg = svg/08-time-calendar/history.svg
- svg/99-rack/line-circle.svg = svg/99-rack/radial-circle.svg
- svg/99-rack/shaper-fold.svg = svg/99-rack/wave-tri.svg

## Tier 2a — same geometry, different name/path (93 groups)

Normalized path data identical (numbers rounded 1dp). Same drawing living under multiple names — pick one, delete the rest.

- solid/actions/redo.svg ≈ svg/02-actions-controls/redo.svg
- solid/actions/undo.svg ≈ svg/02-actions-controls/undo.svg
- solid/brand/signature-thick.svg ≈ stroke/brand/signature-thick.svg
- solid/communication/chat-alt-2.svg ≈ stroke/communication/chat-alt-2.svg
- solid/communication/chat-alt.svg ≈ stroke/communication/chat-alt.svg
- solid/communication/share-shape.svg ≈ stroke/communication/share-shape.svg
- solid/communication/speakerphone.svg ≈ stroke/communication/speakerphone.svg
- solid/cursor/navigation-pointer-01.svg ≈ stroke/cursor/navigation-pointer-01.svg
- solid/cursor/navigation.svg ≈ stroke/cursor/navigation.svg
- solid/editing/annotation.svg ≈ stroke/editing/annotation.svg
- solid/editing/bucket.svg ≈ svg/16-miscellaneous/bucket.svg
- solid/editing/calc-2.svg ≈ stroke/editing/calc-2.svg
- solid/editing/color-01.svg ≈ svg/15-shapes-geometric/wheel.svg
- solid/editing/color-02.svg ≈ svg/10-editing-content/color.svg
- solid/editing/color-03.svg ≈ solid/editing/color-swatch.svg ≈ stroke/editing/color-03.svg ≈ stroke/editing/color-swatch.svg
- solid/editing/edit-2.svg ≈ stroke/editing/edit-2.svg
- solid/editing/edit-3.svg ≈ stroke/editing/edit-3.svg
- solid/editing/highlightercircle.svg ≈ solid/editing/markercircle.svg ≈ solid/editing/pencilcircle.svg ≈ solid/shapes/shapes-01.svg
- solid/editing/math-3.svg ≈ stroke/editing/math-3.svg
- solid/editing/minus-set-3.svg ≈ stroke/editing/minus-set-3.svg
- solid/editing/mult-set-3.svg ≈ stroke/editing/mult-set-3.svg
- solid/editing/perc.svg ≈ stroke/editing/perc.svg
- solid/editing/plus-set-3.svg ≈ stroke/editing/plus-set-3.svg
- solid/files/attachment.svg ≈ stroke/files/attachment.svg
- solid/files/bookmark-alt.svg ≈ stroke/files/bookmark-alt.svg
- solid/files/briefcase.svg ≈ stroke/files/briefcase.svg
- solid/files/document-report.svg ≈ stroke/files/document-report.svg
- solid/files/document.svg ≈ stroke/files/document.svg
- solid/files/files-03.svg ≈ svg/03-files-documents/folder-02.svg
- solid/files/folder-add.svg ≈ stroke/files/folder-add.svg
- solid/files/folder.svg ≈ stroke/files/folder.svg
- solid/files/img-02.svg ≈ stroke/files/img-02.svg
- solid/layout/collection.svg ≈ svg/09-layout-ui/row.svg
- solid/layout/move-collection.svg ≈ svg/02-actions-controls/move.svg
- solid/misc/beaker.svg ≈ stroke/misc/beaker.svg
- solid/misc/heart.svg ≈ stroke/misc/heart.svg
- solid/misc/pills.svg ≈ stroke/misc/pills.svg
- solid/misc/puzzle.svg ≈ stroke/misc/puzzle.svg
- solid/misc/star-1.svg ≈ stroke/misc/star-1.svg
- solid/misc/star.svg ≈ svg/05-user-authentication/star.svg
- solid/misc/ticket.svg ≈ stroke/misc/ticket.svg
- solid/misc/traffic-cone.svg ≈ svg/15-shapes-geometric/cone.svg
- solid/rack/curve-exp.svg ≈ stroke/rack/curve-exp.svg
- solid/rack/curve-log.svg ≈ stroke/rack/curve-log.svg
- solid/rack/dith-flow.svg ≈ stroke/rack/dith-flow.svg
- solid/rack/filter-bp.svg ≈ stroke/rack/filter-bp.svg
- solid/rack/filter-hp.svg ≈ stroke/rack/filter-hp.svg
- solid/rack/filter-lp.svg ≈ stroke/rack/filter-lp.svg
- solid/rack/filter-notch.svg ≈ stroke/rack/filter-notch.svg
- solid/rack/line-spiral.svg ≈ stroke/rack/line-spiral.svg
- solid/rack/ptrn-dot.svg ≈ stroke/rack/dith-gear.svg
- solid/rack/radial-rect.svg ≈ stroke/rack/radial-rect.svg
- solid/rack/radial-star.svg ≈ stroke/rack/radial-star.svg
- solid/rack/ramp-down.svg ≈ stroke/rack/ramp-down.svg
- solid/rack/ramp-tri.svg ≈ stroke/rack/ramp-tri.svg
- solid/rack/ramp-up.svg ≈ stroke/rack/ramp-up.svg
- solid/rack/shaper-exp.svg ≈ stroke/rack/shaper-exp.svg
- solid/rack/shaper-log.svg ≈ stroke/rack/shaper-log.svg
- solid/rack/shaper-scurve.svg ≈ stroke/rack/shaper-scurve.svg
- solid/rack/shaper-step.svg ≈ stroke/rack/shaper-step.svg
- solid/rack/wave-rnd.svg ≈ stroke/rack/wave-rnd.svg
- solid/rack/wave-saw.svg ≈ stroke/rack/wave-saw.svg
- solid/rack/wave-sin.svg ≈ stroke/rack/wave-sin.svg
- solid/rack/wave-sqr.svg ≈ stroke/rack/wave-sqr.svg
- solid/rack/wave-tri.svg ≈ stroke/rack/wave-tri.svg
- solid/shapes/circle-dashed.svg ≈ solid/shapes/shape-17.svg
- solid/shapes/design-shapes-1.svg ≈ stroke/shapes/design-shapes-1.svg
- solid/shapes/dimond.svg ≈ svg/16-miscellaneous/instance.svg
- solid/stats/stat-chart-b.svg ≈ stroke/stats/stat-chart-b.svg
- solid/stats/stat-stat.svg ≈ stroke/stats/stat-stat.svg
- solid/system/chip.svg ≈ stroke/system/chip.svg
- solid/system/cloud.svg ≈ stroke/system/cloud.svg
- solid/system/component.svg ≈ svg/09-layout-ui/component.svg
- solid/system/frequency.svg ≈ stroke/system/frequency.svg
- solid/system/light-bulb.svg ≈ stroke/system/light-bulb.svg
- solid/system/shield-check.svg ≈ stroke/system/shield-check.svg
- solid/typography/a.svg ≈ solid/typography/roman-b.svg ≈ solid/typography/typography-3.svg
- solid/typography/aa.svg ≈ svg/10-editing-content/type-01.svg
- solid/user/identification.svg ≈ stroke/user/identification.svg
- solid/user/user-circle.svg ≈ stroke/user/user-circle.svg
- solid/user/user-group.svg ≈ stroke/user/user-group.svg
- stroke/actions/minus.svg ≈ stroke/rack/cap-round.svg ≈ stroke/rack/cap-square.svg
- stroke/editing/eyedrop.svg ≈ stroke/editing/eyedropper.svg
- stroke/editing/minus-front.svg ≈ stroke/editing/trim.svg
- stroke/editing/scribble-1.svg ≈ stroke/editing/scribble-2.svg ≈ stroke/editing/scribble.svg
- stroke/layout/menu.svg ≈ stroke/layout/squaresfour.svg
- stroke/rack/cable-on.svg ≈ stroke/rack/cable-trans.svg
- stroke/system/eye-off.svg ≈ svg/00-kol/eye-off.svg
- stroke/system/information-1.svg ≈ stroke/system/information-2.svg ≈ stroke/system/information-3.svg ≈ stroke/system/information.svg
- stroke/typography/a.svg ≈ stroke/typography/roman-b.svg ≈ stroke/typography/typography-3.svg
- svg/03-files-documents/file.svg ≈ svg/03-files-documents/page.svg
- svg/99-rack/cap-butt.svg ≈ svg/99-rack/cap-round.svg ≈ svg/99-rack/cap-square.svg
- svg/99-rack/shaper-sine.svg ≈ svg/99-rack/wave-sin.svg

## Tier 2b — same filename in multiple stroke categories (17)

- stroke/actions/move.svg vs stroke/editing/move.svg vs stroke/layout/move.svg
- stroke/communication/interactive.svg vs stroke/system/interactive.svg
- stroke/editing/align-center.svg vs stroke/layout/align-center.svg
- stroke/editing/align-left.svg vs stroke/layout/align-left.svg
- stroke/editing/align-right.svg vs stroke/layout/align-right.svg
- stroke/editing/crop.svg vs stroke/tools/crop.svg
- stroke/editing/pencil.svg vs stroke/tools/pencil.svg
- stroke/layout/menu.svg vs stroke/navigation/menu.svg
- stroke/misc/sun.svg vs stroke/theme/sun.svg
- stroke/navigation/chevron-down.svg vs stroke/rack/chevron-down.svg
- stroke/navigation/chevron-left.svg vs stroke/rack/chevron-left.svg
- stroke/navigation/chevron-right.svg vs stroke/rack/chevron-right.svg
- stroke/navigation/chevron-up.svg vs stroke/rack/chevron-up.svg
- stroke/shapes/star.svg vs stroke/user/star.svg
- stroke/shapes/wheel.svg vs stroke/tools/wheel.svg
- stroke/status/eye-off.svg vs stroke/system/eye-off.svg
- stroke/system/calendar.svg vs stroke/time/calendar.svg

## Tier 3 — design-review queues (from the rendered-bbox scan)

Full lists live in the QA data; headline queues:
- **Outline-expanded (35, redraw-as-stroke):** edit-1/2/3, menu-1/2/3, settings/settings-1, color-swatches, measure, result, ruler-combined, ruler-trinangle, scribble, size, stroke, stroke-1, rows, star-1, stitches, light-bulb ×2, link-1, shape-16/18/19, shapes-05, shapes-stroke-01/02/03, project ×3, social-github, a-framed
- **Undersized (63):** two families — compact-by-design glyphs (chevrons, carets, x/plus/cross, media transport, dropdown-caret) → declare a compact-glyph size class, don't inflate; genuinely underscaled (arrow-from-*, boolean-merge/unite, sum, clr-mono, dith-*, line-spiral, rabbit, code-curly-collection, linked, shapes-15 @8.7, font-01, twitter) → refit to the 18–20 keyline
- **Off-center (23):** boolean-merge/unite (plainly mis-registered), color-fill, slider-shape, spray-can, bulb, coffee, game, joystick-button, knife, meteor, code-2, tui-rotate-l/r, wrench, rotate-l/r, volume, fingerprint, shopping-basket-2, aa, clock-rotate-left, history — some are optical hangs, judge per icon
- **Zero-area bbox (6, probably fine):** minus-set-1, cap-butt/round/square, line-line, minus — 1-D line glyphs; bbox height 0 is inherent

## Suggested order

> **Tier 1 EXECUTED 2026-07-08** — 361 shadowed legacy + 8 same-name exact dupes deleted (369 files; scan predicted ~410 — the difference is exact-dupe groups with *different* names, deliberately left for Tier 2 since removing a name changes the API). Verified live: 880 tiles, all render, 0 console issues. `svg/` is down to 6 reachable unique files — review those during Tier 2. Changeset `.changeset/icon-tier1-cull.md` (held). Deleted-file list: session scratchpad `tier1-deleted.json`.

1. ~~Tier 1a+1b in one mechanical pass~~ ✅ (delete ~410 files, zero render change — verify with the icons page before/after count).
2. Tier 2 with the /icons page open (click-to-copy names) — an hour, not a day.
3. Tier 3 redraws/refits as design sessions, per the QA ledger sequence.
