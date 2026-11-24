---
title: Icon survey
type: reference
status: active
created: 2026-11-21
updated: 2026-11-21
description: The repeating shapes the icon workshop builds
aliases:
  - icon survey
  - icon bases
sources:
  - packages/icons/src
  - scripts/icon-duplicates-baseline.json
tags:
  - domain/iconography
  - domain/taxonomy
related:
  - "[[INDEX|icons]]"
  - "[[01-inventory|icon inventory]]"
  - "[[02-loader|icon loader]]"
---

# Icon survey

Every drawing in the four sets, read on contact sheets and by a script over the path data (W21.2, 2026-11-21). Bases are built in the Figma workshop file `iconset--kol-ds-ui` ([[02-loader|loader]], The workshop); this page is what the workshop builds. Nothing here changes code yet.

| Icons, after duplicates | Bases | Icons built on a base | Icons that stay drawn |
|--:|--:|--:|--:|
| 1213 | 89 | 1042 | 171 |

## Bases

Each base is one component in the workshop with live settings; an icon can use more than one (a frame with a dashed line is `shape` plus `line`). Ordered by how many icons each carries.

| Base | Parts | Live settings | Icons | Built on it |
|---|---|---|--:|---|
| `shape` | one rectangle | width, height, corner radius (live, from square to fully round), stroke, fill or both, dash, turn (the diamond) | 142 | `square`, `rectangle`, `browser`, `diamond`, `instance-01`, `instance-02`, `ascii-block`, `stop`, `stop-solid`, `paint-solid`, `ascii-back-02`, `ascii-dash`, `ascii-dot-02`, `ascii-equal`, `ascii-hash`, `ascii-pipe-02`, `ascii-plus`, `ascii-slash`, `ascii-x`, `square-slash`, `grad-lin`, `grad-con`, `gen-color`, `gen-gradient`, `gen-wave`, `nav-create`, `checkbox`, `toggle-oval`, `toggle-oval-02`, `toggle-square`, `toggle-square-02`, `toggle-overlay`, `mirror-frame-horizontal`, `mirror-frame-vertical`, `blur-background`, `blur-layer`, `select-frame`, `select-cursor`, `select-area`, `shadow-drop`, `shadow-inner`, `glass`, `hatch`, `noise`, `texture`, `opacity`, `image-frame`, `paint-noise`, `stroke-sides`, `frames-mirror`, `edit-square`, `square-pen`, `bookmark-square`, `chart-square`, `dashboard-tile`, `controls-box`, `captions`, `album`, `credit-card`, `ticket`, `inbox`, `kanban`, `pause`, `pause-solid`, `columns`, `columns-two`, `split`, `grid-2x2`, `line-grid`, `component-02`, `rack-h`, `rack-v`, `panel-bottom`, `panel-left`, `panel-right`, `panel-top`, `panel-bottom-dashed`, `panel-left-dashed`, `panel-right-dashed`, `panel-top-dashed`, `panel-bottom-close`, `panel-bottom-open`, `panel-right-close`, `panel-right-open`, `panel-top-close`, `panel-top-open`, `panels-left-bottom`, `panels-right-bottom`, `panels-top-left`, `panels-top-right`, `sidebar-collapse`, `sidebar-expand`, `layout`, `layout-dashboard`, `layout-template`, `layout-carousel`, `layout-freeform`, `layout-sidebar-dots`, `bento`, `bento-02`, `bento-grid`, `row`, `rows-02`, `table`, `table-cells-merge`, `table-columns`, `table-grid`, `grid`, `grid-3x3`, `app-squares`, `aspect-ratio`, `mobile`, `tablet`, `flip-frame`, `flip-transform`, `add-frame`, `image`, `images`, `image-minus`, `edit-image`, `keyboard-music`, `section`, `stack`, `align-horizontal-center`, `align-horizontal-left`, `align-horizontal-right`, `align-vertical-bottom`, `align-vertical-center`, `align-vertical-top`, `align-horizontal-center-solid`, `align-horizontal-left-solid`, `align-horizontal-right-solid`, `align-vertical-bottom-solid`, `align-vertical-center-solid`, `align-vertical-top-solid`, `space-evenly-horizontal`, `space-evenly-vertical`, `code-close`, `calendar`, `sd-card`, `save`, `file-zip` |
| `circle` | a circle | size, stroke, fill or both, dash, a dot, a ring, spokes or dots inside | 67 | `circle`, `ring`, `line-circle`, `dashed-circle`, `radial-default`, `ball`, `stop-circle`, `stop-circle-solid`, `more-circle`, `select-circle`, `drop-circle`, `target`, `crosshair`, `help-circle`, `info`, `check-circle`, `search-circle`, `user-circle`, `clr-anl`, `clr-cmpd`, `clr-comp`, `clr-mono`, `clr-rnd`, `clr-shd`, `clr-split`, `clr-tet`, `clr-tri`, `mode-toggle-01`, `mode-toggle-02`, `contrast`, `mask`, `power`, `disc`, `compass-04`, `globe`, `globe-earth`, `radar`, `radar-sweep`, `donut-ring`, `grad-rad`, `line-lissa`, `email-02`, `circles-overlap`, `rgb-circles`, `venn-circles`, `circles-pair`, `circles-three`, `transparency`, `blend`, `shape-union`, `orbit`, `orbit-dot`, `pie-chart`, `diameter`, `brightness`, `lifebuoy`, `lifebuoy-solid`, `disaster-recovery`, `highlighter-circle`, `marker-circle`, `pencil-circle`, `color-wheel`, `chrome-02`, `monitor-circle`, `webcam`, `gauge-circle`, `shape-sphere` |
| `arrow` | a shaft and an arrowhead | length, turn in eighths, head open or filled, a stop bar at the tip or tail, two arrows apart or crossed | 55 | `arrow-down`, `arrow-up`, `arrow-left`, `arrow-right`, `arrow-downleft`, `arrow-downright`, `arrow-upleft`, `arrow-upright`, `arrows-vertical`, `swap`, `switch-lane`, `switch-lane-solid`, `download`, `upload`, `cloud-download`, `cloud-upload`, `expand`, `scale-down`, `external-link`, `log-in`, `log-out`, `direction-cross`, `expand-cross`, `expand-cross-arrows`, `expand-cross-solid`, `expand-corners-solid`, `contract-cross`, `contract-cross-solid`, `contract-corners-solid`, `fold-horizontal`, `fold-vertical`, `resize-auto-h`, `resize-auto-w`, `trending-up`, `trending-down`, `growth-bars-arrow`, `bars-trend-arrow`, `circle-arrow-out-up-right`, `arrow-down-z-a`, `arrow-up-z-a`, `pilcrow-left`, `pilcrow-right`, `line-height`, `flow-arrows`, `branch-up`, `shuffle`, `shuffle-solid`, `trend-search`, `clipboard-copy`, `flatten`, `exchange`, `exchange-solid`, `chart-trend`, `chart-trend-solid`, `growth-bars` |
| `nodes` | circles joined by lines | count, layout (line, branch, ring, star, hexagon), node size, a centre part | 54 | `git-branch`, `git-branch-02`, `git-branch-03`, `git-branch-04`, `git-commit`, `git-compare`, `git-compare-02`, `git-compare-03`, `git-fork`, `git-merge`, `git-pull-request`, `git-pull-request-closed`, `rows`, `nodes`, `nodes-graph`, `nodes-hex`, `network`, `network-star`, `hub-nodes`, `share`, `node-graph`, `workflow-circle`, `data-network`, `gear-network`, `vector-nodes`, `bezier`, `bezier-node`, `flow-branch`, `branch-up`, `atomic-atom`, `atomic-atomic-01`, `atomic-atomic-02`, `atomic-molecule-01`, `atomic-molecule-02`, `atomic-molecule-03`, `atomic-molecule-04`, `atomic-organism-01`, `atomic-organism-02`, `atomic-organism-03`, `atomic-organism-04`, `cable-lock`, `cable-off`, `cable-on`, `cable-trans`, `cable-unlock`, `route-pins`, `s-route-roadmap`, `globe-network`, `bubbles`, `database-network`, `hierarchy`, `hierarchy-02`, `hierarchy-03`, `hierarchy-04` |
| `line` | a horizontal, a vertical and two diagonal strokes, each shown or hidden | length, cap (butt, round, square), dash, stroke, turn | 53 | `minus`, `plus`, `x`, `line`, `line-line`, `ascii-pipe`, `ascii-back`, `cap-butt`, `cap-round`, `cap-square`, `hamburger`, `ptrn-stripe`, `equal`, `equal-not`, `hash-01`, `asterisk`, `radial-star`, `dith-xhatch`, `frame`, `dith-crt`, `ascii-dash`, `ascii-pipe-02`, `ascii-back-02`, `ascii-slash`, `ascii-equal`, `ascii-hash`, `ascii-plus`, `ascii-x`, `split`, `flatten`, `stroke-weight`, `resize-fixed`, `resize-grip`, `columns-two`, `flip-horizontal`, `flip-vertical`, `flip-triangles-horizontal`, `flip-triangles-vertical`, `mirror-frame-horizontal`, `mirror-frame-vertical`, `fold-horizontal`, `fold-vertical`, `nav-create`, `align-horizontal-center`, `align-horizontal-left`, `align-horizontal-right`, `align-vertical-bottom`, `align-vertical-center`, `align-vertical-top`, `space-evenly-horizontal`, `space-evenly-vertical`, `heading`, `underline` |
| `badge` | a small mark in a corner or the centre of another icon: plus, minus, check, x, star, gear, lock, bolt | which mark, corner, the base cut where it sits | 45 | `check`, `check-circle`, `checkbox`, `copy-check`, `badge-check`, `shield-check`, `browser-check`, `browser-check-solid`, `clipboard-check`, `clipboard-check-solid`, `calendar-check`, `calendar-plus`, `alarm-clock-plus`, `mail-plus`, `folder-add`, `folder-minus`, `image-minus`, `file-check`, `file-plus`, `file-star`, `filter-x`, `sparkle-plus`, `shield-badge`, `shield-badge-solid`, `search-gear`, `server-gear`, `cloud-gear`, `clock-gear`, `brain-cog`, `folder-cog`, `hand-gear`, `head-gear`, `report-gear`, `database-zap`, `bolt-off`, `camera-off`, `eye-off`, `video-off`, `list-checks`, `desktop-skull`, `desktop-skull-solid`, `manual-warning`, `manual-warning-solid`, `equal-not`, `square-slash` |
| `flag-disc` | a disc cut into bands, crossed or plain, with an emblem | bands (two or three, across or down), a cross (the Nordic flags), colours, an emblem drawn on top | 39 | `flag-ar`, `flag-at`, `flag-au`, `flag-bd`, `flag-be`, `flag-br`, `flag-ca`, `flag-co`, `flag-de`, `flag-dk`, `flag-do`, `flag-ec`, `flag-ee`, `flag-es`, `flag-fr`, `flag-gb`, `flag-hk`, `flag-id`, `flag-ie`, `flag-il`, `flag-is`, `flag-jp`, `flag-mx`, `flag-my`, `flag-nl`, `flag-no`, `flag-pk`, `flag-pl`, `flag-pt`, `flag-rs`, `flag-ru`, `flag-sa`, `flag-se`, `flag-sg`, `flag-th`, `flag-us`, `flag-uz`, `flag-vn`, `flag-za` |
| `dots` | a dot, repeated | count, rows and columns, a ring, size, gap, solid or ring dots | 38 | `more`, `more-vertical`, `more-circle`, `grip-horizontal`, `grip-vertical`, `drag-handle`, `dot-matrix-3x3`, `grid-horizontal`, `ptrn-dot`, `ptrn-checker`, `noise`, `texture`, `opacity`, `paint-noise`, `dith-grid`, `dith-hex`, `dith-htone`, `dith-melt`, `dith-radial`, `dith-gear`, `dith-flower`, `radial-circle`, `radial-hex`, `radial-rect`, `radial-triangle`, `radial-random`, `ascii-dot`, `ascii-dot-02`, `layout-sidebar-dots`, `dot-plot-03`, `dot-plot-04`, `circles-grid`, `circles-grid-02`, `clr-rnd`, `dith-cross`, `dith-diamond`, `calendar-04`, `abacus-solid` |
| `file` | a page with its corner folded, open on the left for a badge (his atlas file) | fold shown, badge (search, check, pulse, heart, plus, star, code, terminal, pen, chart, text), lines inside | 34 | `file`, `file-search`, `file-check`, `file-pulse`, `file-heart`, `file-plus`, `file-star`, `file-code`, `file-terminal`, `file-pen`, `file-chart`, `file-text`, `file-audio`, `file-doc`, `file-image`, `file-md`, `file-pdf`, `file-svg`, `file-video`, `file-zip`, `file-quill`, `file-sliders`, `file-type`, `file-type-offset`, `file-checklist`, `file-checklist-solid`, `design-file`, `document`, `document-check`, `page-two-lines`, `report-chart`, `report-gear`, `files`, `notes` |
| `arrow-circle` | an arc and one or two arrowheads | sweep, direction, heads (one, two, three), dash, a centre part shown | 32 | `refresh`, `sync`, `sync-dashed`, `rotate-left`, `rotate-right`, `rotate-out`, `rotate-object`, `iteration-ccw`, `iteration-cw`, `history`, `timer-reset`, `undo-circle`, `24-h-refresh`, `3d-rotate`, `lasso-rotate`, `repeat`, `repeat-solid`, `arrows-3way`, `gear-cycle`, `database-refresh`, `target-refresh`, `clock-cycle`, `cycle-chart`, `screen-rotate`, `clock-reverse`, `reverse`, `reverse-solid`, `skip-back-15`, `skip-forward-15`, `skip-back-15-solid`, `skip-forward-15-solid`, `database-cycle` |
| `triangle` | a triangle with rounded corners | turn, count (one, two), a stop bar, stroke or fill | 32 | `play`, `play-solid`, `tr-left`, `caret-down`, `caret-up`, `caret-left`, `caret-right`, `skip-start`, `skip-end`, `skip-start-solid`, `skip-end-solid`, `fast-forward`, `rewind`, `fast-forward-solid`, `rewind-solid`, `reverse`, `reverse-solid`, `triangle`, `triangle-down`, `flip-horizontal`, `flip-vertical`, `flip-triangles-horizontal`, `flip-triangles-vertical`, `video`, `desktop-play`, `desktop-play-solid`, `file-video`, `video-film`, `airplay`, `alert-triangle`, `radial-triangle`, `cone` |
| `chevron` | one or two chevrons | turn, count, a stop bar, size, stroke or bold | 30 | `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `chevrons-down`, `chevrons-up`, `chevrons-left`, `chevrons-right`, `skip-back`, `skip-forward`, `skip-back-solid`, `skip-forward-solid`, `code`, `code-simple`, `code-close`, `terminal`, `sidebar-collapse`, `sidebar-expand`, `panel-bottom-close`, `panel-bottom-open`, `panel-right-close`, `panel-right-open`, `panel-top-close`, `panel-top-open`, `file-code`, `file-terminal`, `browser-code`, `browser-code-solid`, `desktop-code`, `desktop-code-solid` |
| `pencil` | a pencil body, its ferrule and tip | tip line, clip, rounded or square end, turn, a line or path drawn under it | 29 | `pencil`, `pencil-03`, `pencil-ferrule`, `pen-02`, `pen-03`, `edit`, `edit-square`, `edit-square-02`, `square-pen`, `edit-image`, `edit-selection`, `file-pen`, `book-pen`, `notebook-pen`, `notepad-pen`, `scroll-pen`, `clipboard-pen-line`, `idea-pencil`, `path-pencil`, `pen-scribble`, `magic-pen`, `ruler-pencil`, `highlighter`, `highlighter-circle`, `marker-circle`, `pencil-circle`, `drawing-tablet`, `text-tool`, `signature` |
| `text-lines` | lines of text | count, lengths, alignment (left, centre, right, justified), bullets or checks, vertical place | 26 | `text-align-away-spine`, `text-align-center`, `text-align-left`, `text-align-right`, `text-align-toward-spine`, `text-justify-all`, `text-justify-center`, `text-justify-left`, `text-justify-right`, `text-valign-bottom`, `text-valign-middle`, `text-valign-top`, `view-list`, `list-bullet`, `list-checks`, `letter-text`, `lockup`, `filter-lines`, `blinds`, `dith-glitch`, `captions`, `document`, `page-two-lines`, `scroll-text`, `notepad-text`, `notebook-text` |
| `letters` | type glyphs drawn on one alphabet (the H, A, T, B, numerals) | which letter, a number beside it, framed, italic, bold | 25 | `heading`, `heading-1`, `heading-2`, `heading-3`, `heading-4`, `heading-5`, `heading-6`, `seq-a`, `seq-b`, `seq-c`, `seq-d`, `type`, `type-02`, `aa`, `letter-a`, `a-framed`, `italic-a`, `font-01`, `bold`, `text-box`, `text-frame`, `text-tool`, `letter-spacing`, `file-type`, `file-type-offset` |
| `clock` | a face, two hands, ticks | ticks shown or hidden, face open for a modifier (reverse, dashed, dotted), hand angle, badge | 24 | `clock`, `clock-02`, `clock-04`, `clock-cycle`, `clock-dashed`, `clock-dotted`, `clock-gear`, `clock-reverse`, `clock-ring`, `dashed-clock`, `fast-clock`, `24-h-clock`, `alarm-clock`, `alarm-clock-02`, `alarm-clock-plus`, `globe-clock`, `person-clock`, `wall-clock-square`, `watch`, `watch-24`, `calendar-clock`, `history`, `time-zones`, `timer-reset` |
| `bars` | vertical bars on a baseline | count, heights, baseline shown, an arrow, a frame, solid | 23 | `bar-chart`, `bars-baseline`, `bars-baseline-solid`, `bars-descending`, `bars-descending-solid`, `bars-line`, `bars-pie`, `bars-search`, `bars-trend-arrow`, `growth-bars`, `growth-bars-arrow`, `chart-square`, `report-chart`, `phone-chart`, `server-bars`, `sound-bars`, `podium`, `podium-02`, `podium-solid`, `clipboard-pie`, `presentation-bar`, `audio-waveform`, `columns` |
| `graph` | an axis or baseline and a curve | which curve (exp, log, step, sine, clip, fold, wrap, ramp, filter shape), axis or baseline, grey baseline | 23 | `shaper-clip`, `shaper-exp`, `shaper-fold`, `shaper-log`, `shaper-scurve`, `shaper-sine`, `shaper-step`, `shaper-wrap`, `filter-bp`, `filter-hp`, `filter-lp`, `filter-notch`, `ramp-down`, `ramp-tri`, `ramp-up`, `curve-exp`, `curve-log`, `line-chart`, `line-chart-02`, `chart-trend`, `chart-trend-solid`, `stat-chart-a`, `angle` |
| `screen` | a screen on a stand | what is on the screen (code, play, chart, pie, pulse, skull, camera), solid, laptop base, easel legs | 20 | `desktop`, `desktop-camera`, `desktop-camera-solid`, `desktop-code`, `desktop-code-solid`, `desktop-play`, `desktop-play-solid`, `desktop-skull`, `desktop-skull-solid`, `monitor-chart`, `monitor-pie`, `monitor-pulse`, `monitor-circle`, `presentation`, `presentation-bar`, `laptop`, `laptop-solid`, `cloud-monitor`, `easel`, `easel-artboard` |
| `corner` | one corner mark | turn (four), radius, as four corners round a frame, join style | 20 | `corner-bottom-left`, `corner-bottom-right`, `corner-top-left`, `corner-top-right`, `corner-independent`, `corner-radius`, `maximize`, `aspect-ratio`, `camera-scan`, `face-scan`, `face-scan-solid`, `scan`, `expand-corners-solid`, `contract-corners-solid`, `join-bevel`, `join-miter`, `join-round`, `select-area`, `stroke-sides`, `crop` |
| `wave` | a wave line | shape (sine, saw, square, triangle, random), periods, amplitude, stacked | 18 | `wave`, `wave-rnd`, `wave-saw`, `wave-sin`, `wave-sqr`, `wave-tri`, `gen-wave`, `activity`, `frequency`, `dith-flow`, `dith-drift`, `wind`, `heart-pulse`, `file-pulse`, `monitor-pulse`, `audio-waveform`, `waves-cross`, `twist` |
| `chess-piece` | the piece base and foot every piece stands on | which piece, line (the white piece) or solid (the black one) | 18 | `chess-bishop`, `chess-bishop-black`, `chess-bishop-white`, `chess-king`, `chess-king-black`, `chess-king-white`, `chess-knight`, `chess-knight-black`, `chess-knight-white`, `chess-pawn`, `chess-pawn-black`, `chess-pawn-white`, `chess-queen`, `chess-queen-black`, `chess-queen-white`, `chess-rook`, `chess-rook-black`, `chess-rook-white` |
| `two-squares` | a back square, a front square and their overlap, each its own part | each part stroke, dash, fill or hidden; radius; offset; the boolean treatments (stroke with fill) | 17 | `copy`, `copy-check`, `duplicate`, `copy-layer`, `boolean-exclude`, `boolean-intersect`, `boolean-subtract`, `boolean-unite`, `squares-linked`, `squares-linked-02`, `shapes-stack`, `shadow-drop`, `files`, `book-copy`, `shape-union`, `clipboard-copy`, `notes` |
| `pie` | a circle cut into slices | slices, one pulled out, a hole (donut), hatched, solid | 15 | `chart-pie`, `chart-pie-slice`, `chart-pie-slice-solid`, `chart-pie-solid`, `chart-pie-split`, `chart-pie-split-solid`, `pie-chart`, `pie-hatch`, `pie-quarter`, `pie-search`, `donut-chart`, `donut-ring`, `monitor-pie`, `clipboard-pie`, `bars-pie` |
| `notebook` | a cover with spiral or rings | rings or tabs, lines or text inside, a pen, dashed | 15 | `notebook`, `notebook-pen`, `notebook-tabs`, `notebook-text`, `notepad-pen`, `notepad-text`, `notepad-text-dashed`, `journal`, `scroll`, `scroll-pen`, `scroll-text`, `manual`, `manual-solid`, `manual-warning`, `manual-warning-solid` |
| `box` | a box with a lid | lid on, open or lifted, flaps, solid | 13 | `archive`, `bin-lid`, `trash`, `package`, `package-solid`, `package-open`, `package-open-02`, `package-open-solid`, `bucket`, `bucket-rim`, `gift`, `gift-solid`, `inbox` |
| `cylinder` | a stack of discs | count, a stand, a badge, a globe or hexagon around it, solid | 13 | `database`, `database-02`, `database-cycle`, `database-globe`, `database-hex`, `database-network`, `database-refresh`, `database-zap`, `barrel`, `barrel-solid`, `shape-cyl`, `coins`, `coins-solid` |
| `gear` | a gear | teeth, a hole, size as a badge, turning arrows | 13 | `gear`, `gear-cycle`, `search-gear`, `clock-gear`, `brain-cog`, `folder-cog`, `cloud-gear`, `server-gear`, `report-gear`, `hand-gear`, `head-gear`, `gear-network`, `dith-gear` |
| `magnifier` | a lens and its handle | what is in the lens (a gear, a chart, a plus), a globe or chart behind it, size | 12 | `search`, `search-02`, `search-circle`, `search-gear`, `search-zoom`, `globe-search`, `bars-search`, `pie-search`, `trend-search`, `search-graph`, `search-chart`, `file-search` |
| `shield` | a shield outline | round or notched top, wave, a badge inside, solid | 12 | `shield`, `shield-round`, `shield-round-solid`, `shield-solid`, `shield-notch`, `shield-notch-solid`, `shield-wave`, `shield-wave-solid`, `shield-badge`, `shield-badge-solid`, `shield-check`, `badge-check` |
| `broadcast` | arcs spreading from a point | count, one side or both, the source (a dot, a speaker, a mast) | 12 | `broadcast`, `broadcast-solid`, `radio`, `radio-solid`, `antenna-wifi`, `radio-tower`, `bell-ringing`, `speaker`, `cast`, `airplay`, `siren`, `radar-sweep` |
| `person` | a head and shoulders | in a circle, several people, a target, a card, a badge | 11 | `user`, `users`, `user-group`, `user-circle`, `circle-user`, `user-target`, `person-clock`, `id-card`, `support`, `face-scan`, `face-scan-solid` |
| `slider` | a track and its knob | count, horizontal or vertical, knob round or square, stroke and fill (his slider-02) | 11 | `slider-02`, `sliders-rows`, `adjust-sliders`, `equalizer`, `equalizer-02`, `equalizer-03`, `equalizer-04`, `controls-box`, `nav-settings`, `file-sliders`, `controls` |
| `cloud` | a cloud (his atlas cloud) | placed smaller for a modifier: rain, sun, storm, an arrow, a badge | 10 | `cloud`, `cloud-rain`, `cloud-sun`, `cloud-storm`, `cloud-storm-solid`, `cloud-upload`, `cloud-download`, `cloud-apps`, `cloud-gear`, `cloud-monitor` |
| `pen-nib` | a pen nib with its slit and hole | turn and flip, the cap, a line written under it, handles, laurels | 10 | `pen`, `pen-nib`, `pen-tool`, `pen-tool-02`, `fountain-pen`, `pen-laurel`, `bezier-pen-handles`, `add-anchor-pen`, `pen-nib-writing`, `pointer-vector` |
| `pointer` | a cursor arrowhead (his pointer-head) | tail shown, solid, click rays, a frame around it, turn | 10 | `pointer`, `pointer-node`, `pointer-node-solid`, `pointer-selector`, `cursor-click`, `select-cursor`, `navigation`, `send`, `send-02`, `lasso-select` |
| `star` | a five-point star | solid, as a badge, on a podium or medal | 9 | `star`, `star-solid`, `file-star`, `podium`, `podium-02`, `podium-solid`, `medal`, `medal-solid`, `radial-star` |
| `building` | a columned or windowed building | columns or windows, solid | 9 | `bank`, `courthouse`, `courthouse-solid`, `buildings`, `buildings-solid`, `factory`, `factory-solid`, `shop`, `shop-solid` |
| `folder` | a folder with its tab | open or closed, badge (plus, minus, gear, branch), stacked | 8 | `folder`, `folder-add`, `folder-minus`, `folder-cog`, `folder-git`, `folder-open`, `folder-tree`, `folders` |
| `window` | a rounded rectangle with a title bar | title bar dots, content, check, solid | 8 | `browser`, `browser-check`, `browser-check-solid`, `browser-solid`, `browser-code`, `browser-code-solid`, `layout`, `section` |
| `tree` | boxes joined by elbow lines | levels, boxes per level, box radius | 8 | `hierarchy-boxes`, `network-02`, `tree`, `tree-three`, `flow-tree`, `folder-tree`, `gantt`, `block-diagram` |
| `clipboard` | a board and its clip | what is on it, as modifiers (his note 2026-11-21 with two references: plain lines, checked lines, crossed lines, a check, a ringed check, an x, a gear, a pen, a magnifier, bars, a pie, an arrow), solid | 8 | `clipboard`, `clipboard-check`, `clipboard-check-solid`, `clipboard-copy`, `clipboard-list`, `clipboard-list-solid`, `clipboard-pie`, `clipboard-pen-line` |
| `bolt` | a lightning bolt | slanted, struck through, zigzag, as a badge | 8 | `bolt`, `bolt-02`, `bolt-off`, `bolt-zigzag`, `battery-charge`, `database-zap`, `cloud-storm`, `cloud-storm-solid` |
| `cube` | a cube (his note: cube, and axes on it) | axes shown, dashed, turning arrows, open flaps | 8 | `cube`, `3d-cube`, `3d-axes`, `3d-rotate`, `cube-dashed`, `shape-cube`, `package-open`, `package-open-02` |
| `currency` | a currency sign on one stroke | which sign, the solid cut drawn heavier | 8 | `dollar`, `dollar-solid`, `euro`, `euro-solid`, `pound`, `pound-solid`, `yen`, `yen-solid` |
| `stopwatch` | a face, the crown and the button, one hand | ticks, speed lines (his fast), a gauge, solid | 7 | `stopwatch`, `stopwatch-02`, `stopwatch-fast`, `stopwatch-gauge`, `stopwatch-solid`, `fast-stopwatch`, `gauge-timer` |
| `heart` | a heart (his atlas heart) | half, pulse, dashed, solid | 7 | `heart`, `heart-half`, `heart-half-solid`, `heart-pulse`, `heart-handshake`, `card-heart`, `file-heart` |
| `map-pin` | a pin with its hole | with a route, a plane, a flag, several | 7 | `location`, `map-pin`, `map-pin-plane`, `map-route`, `map-route-solid`, `route-pins`, `route-flag-pin` |
| `vehicle` | a body on two wheels | car, truck, cart, train, solid | 7 | `car`, `car-solid`, `truck`, `cart`, `cart-load`, `train`, `train-solid` |
| `calendar` | a page with rings and a header | what is inside (dots, a date, a check, a clock, a plus), stacked | 6 | `calendar`, `calendar-04`, `calendar-check`, `calendar-clock`, `calendar-date`, `calendar-plus` |
| `book` | an open or closed book | open, copy behind, dashed, a pen, on a shelf | 6 | `book-open`, `book-open-02`, `book-copy`, `book-dashed`, `book-pen`, `library` |
| `sparkle` | a four-point star | count, size, a wand or pen beside it, a plus | 6 | `sparkle`, `sparkles`, `sparkle-plus`, `magic-wand`, `wand-sparkles`, `magic-pen` |
| `logic-gate` | a gate body with its inputs and output | which gate (and, or, xor), the not ring | 6 | `logic-and`, `logic-nand`, `logic-nor`, `logic-not`, `logic-or`, `logic-xor` |
| `award` | a cup or a ribbon medal | cup or medal, a star, solid | 6 | `trophy`, `trophy-02`, `medal`, `medal-02`, `medal-solid`, `award` |
| `arrow-turn` | a shaft that bends once and an arrowhead (his note: "the base is clearly an arrow shape") | turn and mirror for the four directions, bend radius, head | 5 | `undo`, `redo`, `corner-down-left`, `receipt-refund`, `constrain` |
| `drop` | a drop | in a circle, hatched, poured from a bucket | 5 | `drop`, `drop-circle`, `drop-hatch`, `paint-bucket`, `paint-bucket-02` |
| `ruler` | a ruler with ticks | turn, tick count, a second ruler or triangle, a pencil | 5 | `ruler`, `ruler-02`, `ruler-combined`, `ruler-pencil`, `ruler-triangle` |
| `brain` | a brain | circuit, gear, solid | 5 | `brain`, `brain-02`, `brain-circuit`, `brain-cog`, `brain-solid` |
| `crown` | a crown | royal, solid, on a chess king or queen | 5 | `crown`, `crown-royal`, `crown-royal-solid`, `chess-king`, `chess-queen` |
| `camera` | a camera body and lens | struck through, scan corners, on a screen | 5 | `camera`, `camera-off`, `camera-scan`, `desktop-camera`, `desktop-camera-solid` |
| `skull` | a skull | solid, on a screen | 5 | `skull`, `skull-02`, `skull-solid`, `desktop-skull`, `desktop-skull-solid` |
| `gauge` | a dial arc and its needle | sweep, ticks, in a circle or a stopwatch | 5 | `gauge`, `speedometer`, `gauge-circle`, `gauge-timer`, `stopwatch-gauge` |
| `bell` | a bell and its clapper | ringing lines, solid | 4 | `bell`, `bell-02`, `bell-ringing`, `concierge-bell` |
| `lock` | a body and its shackle | shackle open or closed, on a cable | 4 | `lock`, `unlock`, `cable-lock`, `cable-unlock` |
| `envelope` | an envelope | open, stacked, a badge | 4 | `email-01`, `mails`, `mail-plus`, `email-open` |
| `speech` | a speech bubble | round or square, tail side, dots inside, doubled | 4 | `chat`, `chat-double`, `message`, `message-circle-more` |
| `hourglass` | two bulbs in a frame | sand shown, round, turning arrows, solid | 4 | `hourglass`, `hourglass-02`, `hourglass-03`, `hourglass-round` |
| `layers` | stacked sheets seen at an angle | the number of sheets (two or three), sheets lined up on the left (his note 2026-11-21), solid | 4 | `layers`, `layers-02`, `layers-03`, `layers-04` |
| `flag` | a flag on its pole | square or pennant cut, on a pin, a signpost | 4 | `flag`, `pennant`, `route-flag-pin`, `signpost` |
| `bulb` | a light bulb | rays shown, a pencil beside it | 4 | `idea-bulb`, `idea-bulb-02`, `lightbulb`, `idea-pencil` |
| `server` | stacked server units | count, a stand, a badge, bars | 4 | `server`, `server-rack`, `server-gear`, `server-bars` |
| `polygon` | a polygon with rounded corners | sides (six, eight), a hole, turn | 4 | `polygon`, `octagon`, `hex-nut`, `database-hex` |
| `map` | a folded map | folds, a route on it | 3 | `map`, `map-folded`, `roadmap` |
| `eye` | an eye | struck through, almond or round | 3 | `eye-on`, `eye-off`, `eye-almond` |
| `film` | a strip with sprocket holes | frames, a play mark | 3 | `film`, `film-strip`, `video-film` |
| `house` | a house | a door, heavier for the rail | 3 | `home-01`, `home-02`, `nav-home` |
| `flask` | a lab vessel | beaker, conical, round | 3 | `lab-beaker`, `lab-conical`, `lab-flask` |
| `scissors` | two blades and their rings | open, crossed | 3 | `cut`, `scissors`, `scissors-open` |
| `robot` | a robot head | head alone or with a body, solid | 3 | `robot-head`, `robot-head-solid`, `robot-solid` |
| `eraser` | an eraser block | turn, a line it rubs out | 3 | `eraser`, `eraser-02`, `eraser-03` |
| `paint-roller` | a roller on a handle | turn | 3 | `paint-roller`, `paint-roller-02`, `palette-brush` |
| `iceland` | his Iceland outline | cropped, with a gavel | 3 | `iceland`, `iceland-crop`, `iceland-gavel` |
| `mouse` | a mouse body | wheel shown, solid | 3 | `mouse`, `mouse-capsule`, `mouse-solid` |
| `magnet` | a magnet | turn (his note: same base, one rotated) | 2 | `magnet`, `magnet-02` |
| `balance` | a beam with two pans | stand, pans | 2 | `scale`, `scale-pans` |
| `plug` | a plug with its prongs | a crossbar, round body | 2 | `plug-2`, `plug-round` |
| `thumb` | a thumb | up or down (turned) | 2 | `thumb-up`, `thumb-down` |
| `printer` | a printer with its paper | solid | 2 | `printer`, `printer-solid` |
| `link` | two chain links | joined or broken (unlink), horizontal (his note) | 1 | `link` |

## Duplicates

Decided by shape (2026-11-21, redone after his review, "you only cut based on name ? you didnt look at the shape?"). A row here is a duplicate only when the two files are one drawing shown twice: the same parts in the same place and proportion, a hair of stroke or rounding apart, as every group was looked at side by side at 96. Two different drawings of the same idea are not duplicates and stay. 15 names resolve to 14 keepers.

| Keeper | Names that resolve to it | Why |
|---|---|---|
| `link` | `link-02`, `link-03` | his ruling: link keeps link-02's drawing, set horizontal; unlink comes beside it. The three are one chain drawing |
| `slider-02` | `slider-01` | his ruling: slider-02 draws stroke and fill correctly; the same two tracks and knobs |
| `crop` | `crop-02` | his ruling (settled 2026-11-20): crop-02's drawing, without the over-rounded corners |
| `pencil` | `pencil-02` | settled 2026-11-20: the same rounded pencil, a hair apart at the end |
| `color-swatch` | `swatch-book-02` | settled 2026-11-20: the same swatch book, one a little smaller |
| `gear` | `settings-01` | his ruling 2026-11-21: settings-01's drawing is the keeper, the better gear; the name is `gear` (what it draws) and it carries the keywords setting, settings, preferences |
| `clock` | `clock-03` | his ruling 2026-11-21: clock-03's drawing is the keeper, because it is his atlas clock and the atlas clock base (the hands) and `clock-reverse` are already built on it; the ticked faces (clock-02, clock-04) are the clock base with ticks shown |
| `layers` | `layers-02` | his ruling 2026-11-21: layers-02's drawing is the keeper: its top sheet and the two under it line up on the left, where the old layers drawing's do not |
| `layers-03` | `layers-04` | the same three stacked sheets; his note 2026-11-21: fine, but built on the same base as `layers` (the count of sheets is the setting) |
| `scale` | `scale-02` | the same balance, the pans a hair wider |
| `drop` | `paint-drop` | the same drop, a hair narrower |
| `chip` | `cpu` | the same chip with its pins |
| `clipboard-list` | `checklist` | the same clipboard with three checked lines; his note 2026-11-21: a modifier icon, the clipboard base plus what is on it; checklist becomes a keyword |

### Style differences

The same structure with one visible difference of style. Each family is decided in the iconset file, with the difference as a setting of its base; none is cut. 17 families.

| Family | The setting that differs | Note |
|---|---|---|
| `git-branch`, `git-branch-03` | the connector curve: bends early and tight, or late and wide | his note: this can not be decided by one version of the set |
| `hierarchy`, `hierarchy-02` | the connectors: slanted or square | his ruling 2026-11-21: two boxes into one; flow drawings on the joined-nodes base |
| `pencil-ferrule`, `pencil-simple` | the tip: a point, or a square-cut corner | one file since 2026-11-20; the old pencil-simple drawing is in _tmp |
| `book-open`, `book-open-02` | the spine: plain, or notched at the foot |  |
| `circles-grid`, `circles-grid-02` | the circle size |  |
| `edit-square`, `edit-square-02` | the corner: closed under the pen, or open where the pen leaves it | his note: the shape base with a modifier on it (a pen; the same family as the square with a plus, a minus and the rest), not a duplicate |
| `equalizer`, `equalizer-02`, `equalizer-03`, `equalizer-04` | the knob: a circle, a square or a sled; and where the knobs sit | his note: equalizer-03 stays, it has sleds instead of circles; none is cut for having another knob |
| `home-01`, `home-02`, `nav-home` | a door shown or not, and the stroke weight (nav-home is heavier) |  |
| `stopwatch`, `stopwatch-02` | the ticks shown or hidden |  |
| `user-circle`, `circle-user` | the shoulders: an arc, or a rounded block |  |
| `text-box`, `text-frame` | the corner handles: round or square |  |
| `shield`, `shield-round`, `shield-solid`, `shield-round-solid` | the top edge: pointed in the middle, or one round curve |  |
| `eye-on`, `eye-almond` | the eye corners: round or pointed |  |
| `alert-triangle`, `triangle-alert` | the corners: sharp or rounded; the dot filled or a stroke |  |
| `toggle-oval`, `toggle-left`, `toggle-oval-02`, `toggle-right` | the proportion: a tall pill or a long one | his note: one toggle base |
| `color-palette`, `palette` | the paint dots: filled or open |  |
| `hourglass`, `hourglass-02`, `hourglass-03` | the sand: full, a little, or none |  |

### Wrong drawing

A file whose drawing belongs to another name.

| Name | Draws now | Should draw |
|---|---|---|
| `rows` | the compare arrows (the picture git-compare draws) | two stacked rows, as rows-02 draws |
| `atomic-atomic-01` | the same picture as atomic-molecule-04 (three circles) | a single atom, the first step of the atomic series |

### New names

Every numbered name that stays (90) gets a plain name for what it draws; its use goes in its keywords. Proposed only: nothing is renamed yet, and the old name will keep resolving.

| Now | Proposed |
|---|---|
| `alarm-clock-02` | `alarm-clock-ticks` |
| `ascii-back-02` | `ascii-back-box` |
| `ascii-dot-02` | `ascii-dot-box` |
| `ascii-pipe-02` | `ascii-pipe-box` |
| `atomic-atomic-01` | `atomic-atom-single` |
| `atomic-atomic-02` | `atomic-atom-trio` |
| `atomic-molecule-01` | `atomic-molecule-cell` |
| `atomic-molecule-02` | `atomic-molecule-share` |
| `atomic-molecule-03` | `atomic-molecule-branch` |
| `atomic-molecule-04` | `atomic-molecule-bubbles` |
| `atomic-organism-01` | `atomic-organism-ring` |
| `atomic-organism-02` | `atomic-organism-square` |
| `atomic-organism-03` | `atomic-organism-triangle` |
| `atomic-organism-04` | `atomic-organism-frame` |
| `bell-02` | `bell-flared` |
| `bento-02` | `bento-wide` |
| `bolt-02` | `bolt-narrow` |
| `book-open-02` | `book-open-spine` |
| `brain-02` | `brain-outline` |
| `brush-02` | `brush-round` |
| `calendar-04` | `calendar-dates` |
| `candlestick-02` | `candlestick-three` |
| `chrome-02` | `chrome-mono` |
| `circles-grid-02` | `circles-grid-small` |
| `clock-02` | `clock-quarters` |
| `clock-04` | `clock-ticks` |
| `compass-02` | `compass-drawing` |
| `compass-04` | `compass` |
| `component-01` | `component-diamonds` |
| `component-02` | `component-square` |
| `database-02` | `database-stand` |
| `dot-plot-03` | `dot-plot` |
| `dot-plot-04` | `dot-plot-rising` |
| `edit-square-02` | `edit-square-open` |
| `email-01` | `mail` |
| `email-02` | `at-sign` |
| `equalizer-02` | `equalizer-square` |
| `equalizer-03` | `equalizer-bars` |
| `equalizer-04` | `equalizer-offset` |
| `eraser-02` | `eraser-pen` |
| `eraser-03` | `eraser-block` |
| `font-01` | `font` |
| `git-branch-02` | `git-branch-fork` |
| `git-branch-03` | `git-branch-wide` |
| `git-branch-04` | `git-branch-down` |
| `git-compare-02` | `git-compare-open` |
| `git-compare-03` | `git-compare-curved` |
| `hash-01` | `hash` |
| `hash-02` | `hash-slanted` |
| `hierarchy-02` | `flow-merge-square` |
| `hierarchy-03` | `flow-merge-three` |
| `hierarchy-04` | `flow-split-three` |
| `home-01` | `house` |
| `home-02` | `home` |
| `hourglass-02` | `hourglass-sand` |
| `hourglass-03` | `hourglass-empty` |
| `idea-bulb-02` | `idea-bulb-plain` |
| `instance-01` | `instance` |
| `instance-02` | `instance-nested` |
| `layers-03` | `layers-three` |
| `line-chart-02` | `line-chart-low` |
| `magnet-02` | `magnet-turned` |
| `medal-02` | `medal-ribbon` |
| `mode-toggle-01` | `mode-toggle-hatched` |
| `mode-toggle-02` | `mode-toggle-half` |
| `network-02` | `network-boxes` |
| `orbit-02` | `orbit-moons` |
| `package-open-02` | `package-open-flaps` |
| `paint-bucket-02` | `paint-bucket-pour` |
| `paint-roller-02` | `paint-roller-side` |
| `pen-02` | `pencil-clip` |
| `pen-03` | `pen-writing` |
| `pen-tool-02` | `pen-nib-flipped` |
| `pencil-03` | `pencil-tip` |
| `podium-02` | `podium-wide` |
| `rows-02` | `rows-stacked` |
| `ruler-02` | `ruler-diagonal` |
| `search-02` | `search-handle` |
| `send-02` | `paper-plane` |
| `shapes-02` | `shapes-triangle` |
| `skull-02` | `skull-plain` |
| `slider-02` | `slider` |
| `squares-linked-02` | `squares-stack` |
| `stopwatch-02` | `stopwatch-ticks` |
| `syringe-02` | `syringe` |
| `toggle-oval-02` | `toggle-oval-on` |
| `toggle-square-02` | `toggle-square-on` |
| `trophy-02` | `trophy-handles` |
| `type-02` | `type-tt` |
| `variant-01` | `variant` |

### Real pairs

Two or more real icons: different drawings of one idea, or different ideas that only look alike. Turned, flipped and mirrored pairs also stay as names on their base: the arrows, carets, chevrons, aligns, panels, corners, flips, folds, iterations, rotates, mirror frames, grips, resize arrows, trends, thumbs, square toggles, skips, fast forward and rewind, filters, curves, text aligns, magnets, bento and layout-template, swap and arrows-vertical, download and upload, plus and x, undo and redo, the slashed ascii boxes, copy-layer and duplicate, the booleans, the 3D cube and axes.

| Icons | Why |
|---|---|
| `library`, `nav-library` | his ruling 2026-11-21: keep both (books of uneven height, books of even height) |
| `hierarchy`, `hierarchy-02`, `hierarchy-03`, `hierarchy-04` | his ruling 2026-11-21: not one icon drawn four times. `-04` and `-03` are one drawing flipped (one box over three, three boxes into one); `hierarchy` and `-02` are two boxes into one, with slanted and with square connectors. "hierarchy" is a keyword, not a name: they are flow chart drawings, the box form of `git-fork`, `git-merge` and `git-branch`. All four stay, built on the joined-nodes base (nodes as boxes or circles, two or three branches, up or down, slanted or square connectors) and renamed for what they draw in the flow family, each carrying the keyword hierarchy |
| `git-compare`, `git-compare-02`, `git-compare-03` | his note: three different icons |
| `medal`, `medal-02` | two different drawings of a medal |
| `paint-roller`, `paint-roller-02` | two different rollers |
| `shapes`, `shapes-02` | two different sets of shapes |
| `package-open`, `package-open-02` | an open box seen from the front and from above |
| `orbit`, `orbit-02` | two different orbits |
| `bell`, `bell-02` | two different bells |
| `bolt`, `bolt-02` | two different bolts |
| `brain`, `brain-02` | a detailed brain and an outline; his pick: if they ever become one, brain-02's drawing keeps the name brain |
| `hash-01`, `hash-02` | his note: the upright hash and the slanted one are different icons |
| `brush`, `brush-02` | two different brushes |
| `candlestick`, `candlestick-02` | his note: different icons, two candles and three |
| `dot-plot-03`, `dot-plot-04` | his note: different icons |
| `eraser`, `eraser-02`, `eraser-03` | three different erasers |
| `idea-bulb`, `idea-bulb-02` | two different bulbs |
| `line-chart`, `line-chart-02` | two different line charts |
| `paint-bucket`, `paint-bucket-02` | two different buckets |
| `podium`, `podium-02` | two different podiums |
| `search`, `search-02` | a plain lens and one with a handle cap and a highlight |
| `send`, `send-02` | two different paper planes |
| `skull`, `skull-02` | two different skulls |
| `trophy`, `trophy-02` | two different cups |
| `type`, `type-02` | Aa and Tt |
| `scissors`, `cut` | two different scissors |
| `drafting-compass`, `compass-02` | two different drawing compasses |
| `flip-frame`, `flip-transform` | two different flips; flip-frame is redrawn in the workshop (his note) |
| `mouse`, `mouse-capsule` | a mouse with its cable and wheel, and a plain one |
| `eyedrop`, `eyedropper` | two different droppers |
| `alarm-clock`, `alarm-clock-02` | a solid alarm clock and a line one with ticks |
| `chess-bishop`, `chess-bishop-white`, `chess-king`, `chess-king-white`, `chess-knight`, `chess-knight-white`, `chess-pawn`, `chess-pawn-white`, `chess-queen`, `chess-queen-white`, `chess-rook`, `chess-rook-white` | the plain and the white piece are different drawings of each piece |
| `command`, `gen-pattern` | his note: two different things entirely |
| `marker-circle`, `pencil-circle` | his note: one is a marker, the other a pencil |
| `contrast`, `mode-toggle-02` | his note: not the same, they share the circle base |
| `copy-layer`, `duplicate`, `boolean-exclude`, `boolean-intersect` | his note: three concepts on the two-squares base |
| `ascii-block`, `square`, `stop`, `paint-solid`, `stop-solid` | a character block, a shape and the stop button: one square, three ideas |
| `diamond`, `instance-01` | a shape and a component instance on the turned square |
| `circle`, `line-circle`, `radial-default`, `ring`, `stop-circle-solid`, `email-02`, `stop-circle` | a shape, generators and buttons that share the circle |
| `minus`, `line-line`, `ascii-pipe`, `cap-butt`, `cap-round`, `cap-square` | his note: one line base, horizontal or vertical, the cap is the setting |
| `ascii-plus`, `nav-create` | a character and the create action: the square with a plus (add-contained) |
| `atomic-molecule-02`, `share` | the design-system molecule and share: one node shape, two ideas |
| `columns`, `rack-v`, `gen-gradient`, `rack-h` | layout columns, a rack and a generator: the rounded square with dividers |
| `split`, `ascii-pipe-02`, `ascii-dash` | a layout split and two characters: the square with a line |
| `grid-2x2`, `line-grid`, `component-02` | a layout, a generator and a component on the divided square |
| `block-diagram`, `circles-grid`, `component-01`, `grid` | four of something, four ideas |
| `archive`, `bin-lid` | storing and throwing away on one box |
| `browser`, `rectangle`, `pucker-bloat` | a window, a shape and an effect |
| `chess-bishop`, `chess-pawn` | two pieces |
| `clr-shd`, `info` | a colour harmony and information |
| `dith-xhatch`, `hash-01` | a dither pattern and the hash sign |
| `git-fork`, `network-02` | a fork and a network |
| `grad-lin`, `square-slash` | a gradient and a slashed square |
| `hamburger`, `ptrn-stripe`, `text-justify-all`, `view-list`, `list-bullet`, `stroke-weight` | menus, patterns, text and strokes on the line base |
| `home-01`, `seq-d` | a house and the letter D only look alike to the check |
| `layout`, `shape-cyl` | a layout and a cylinder only look alike to the check |
| `map-folded`, `roadmap` | a map and a roadmap on one map drawing |
| `navigation`, `send-02`, `pointer-node` | a location arrow, a paper plane and a cursor |
| `shaper-sine`, `wave-sin` | a shaper on its baseline and the bare wave |
| `atomic-atomic-01`, `atomic-molecule-04`, `bubbles` | the atom, the molecule and bubbles; the atom needs its own drawing (Wrong drawing) |
| `bank`, `courthouse` | finance and law on one columned building |
| `skip-back`, `chevron-left` | transport and navigation on the chevron |
| `plug-2`, `plug-round` | settled 2026-11-20: the plug with and without its crossbar, his atlas drawing kept |

## Not bases

A shape seen in three or more icons that is not proposed as a base (5):

| Shape | Icons | Why not |
|---|--:|---|
| the hand | 6 | hand, hand-pointer, hand-metal, hand-gear, handshake and heart-handshake are each drawn for their gesture; no part repeats |
| the face | 4 | face-smile, its solid and the two face-scans share a face only in name; face-scan is the corner base with a face drawn in |
| the 3D wireframes | 5 | shape-ico, shape-octa, shape-tetra, shape-torus and cone are each their own solid; only the cube repeats |
| the tag | 3 | tag, tag-arrow and ticket: three outlines with no shared part |
| the spiral | 3 | line-spiral, snail and yarn each draw a different spiral |

## Stay drawn

Icons where nothing repeats, by set and category (171):

| Set and category | Icons |
|---|--:|
| interface / design | 28 |
| external / brands | 20 |
| interface / people | 19 |
| interface / places | 14 |
| interface / commerce | 10 |
| external / social | 10 |
| interface / layout | 8 |
| interface / actions | 6 |
| interface / devices | 6 |
| interface / media | 6 |
| interface / status | 6 |
| interface / code | 5 |
| interface / shapes | 4 |
| interface / typography | 4 |
| signal / shape | 4 |
| interface / charts | 2 |
| interface / files | 2 |
| signal / transport | 2 |
| interface / communication | 1 |
| interface / flow | 1 |
| signal / generator | 1 |
| signal / line | 1 |
| identity / brand | 1 |
| identity / foundry | 1 |
| identity / fxr | 1 |
| identity / kol-ds | 1 |
| identity / kolkrabbi | 1 |
| identity / metric | 1 |
| identity / mirror | 1 |
| identity / monitor | 1 |
| identity / r2b2 | 1 |
| identity / record | 1 |
| identity / studio | 1 |

## Inconsistencies

Inside a family, to fix in the workshop; listed only.

| Family | What differs | Icons |
|---|---|---|
| align | every file says round caps, but the drawings differ: the outline bars have sharp corners on an axis running edge to edge (2 to 22), the solid bars are rounded 1 on an axis from 3 to 21, and align-horizontal-right is not the mirror of align-horizontal-left (his note: one rule for the family) | align-horizontal-*, align-vertical-* |
| file | two file drawings in one category: his atlas file (open left, 11 icons) and the folded-corner page (file-pdf, file-doc and 20 more) | file-*, document, design-file |
| rounded squares | the same 18 square baked at three radii: 3.5 (panel-top, panel-bottom, checkbox, chart-square, controls-box, dashboard-tile, nav-create, the racks), 2 (panel-left alone of the panels, browser, edit-square, image, calendar, select-frame, the ascii boxes) and about 1 (kanban, toggle-square, square-pen, ascii-block); square itself has none | panel-*, toggle-*, ascii-*, browser, kanban, edit-square |
| strokes | 257 icons sit in a scaled group with an odd stroke width (1.21 to 1.64 before scale), so the rendered stroke is 1.5 but the file says otherwise | the fitted icons of 2026-11-04 and 2026-11-20 |
| solids | the currency and transport solids are the same line drawn heavier, where other solids fill the shape | dollar-solid, euro-solid, loop-solid, shuffle-solid |
| solids | browser-solid and browser-check-solid are outlines with a filled title bar, not solids | browser-solid, browser-check-solid |
| nav | the rail glyphs nav-home and nav-create are drawn at a heavier stroke than the set | nav-home, nav-create |
| pen | pen is drawn at stroke 2, the only pen not at 1.5 | pen |
| atomic | atomic-atomic-01 draws the same picture as atomic-molecule-04: the atom needs its own drawing | atomic-atomic-01 |
| flip | flip-frame: the arrowhead does not turn with the arc, no space between the frames (his note) | flip-frame |
| space-evenly | drawn unlike the distribute icons he points to; wants stroke and stroke with fill (his note) | space-evenly-* |
| slider | slider-01 fills the wrong part; slider-02 is right (his note) | slider-01 |

## Method

Contact sheets of every category at 48 in `_tmp/2026-11-21-icons-survey/sheets/` (one per interface category, two for signal, one for identity and external, four for the duplicate families and numbered names), read one by one; `_tmp/2026-11-21-icons-survey/scan.mjs` lists the elements and the sub-paths repeated across files (the panels' rounded square, the shaper baseline, the file page, the clipboard, the heading H); the corner radii and caps were measured from the files. The decisions are data in `_tmp/2026-11-21-icons-survey/survey-data.mjs`, and this page is written from it by `build-page.mjs`, which fails on a name the set does not have.
