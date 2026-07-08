---
title: Icon inventory — names by category
type: reference
status: active
updated: 2026-07-08
description: The full per-category roster of kol-icons stroke/solid icon names, with mirror-gap counts. Generated from packages/icons/src — regenerate after any cull.
aliases:
  - icon inventory
  - icon list
sources:
  - packages/icons/src/stroke
  - packages/icons/src/solid
tags:
  - domain/design-system
  - domain/iconography
related:
  - "[[INDEX|icons]]"
---

# Icon inventory — names by category

Generated from `packages/icons/src/{stroke,solid}/` — **regenerate after any cull or add** (it is not auto-synced; the live `/icons` page and the `ICON_ENTRIES` exports are the runtime source of truth). See [[INDEX|icons]] for the loader model.

## Inventory (current — regenerate from disk after any cull)

**881 stroke · 849 solid · 21 categories** (post 2026-07-08 Tier-1 cull). Counts drift as icons are culled/added — the live `/icons` page and the keys-only exports (`ICON_ENTRIES` etc.) are the source of truth; this table is the portable snapshot. `stroke-only` = names with no solid mirror yet (surface as "—" on the variants page).

| Category | Stroke | Solid | Stroke-only |
|---|--:|--:|--:|
| `actions` | 45 | 44 | 1 |
| `brand` | 9 | 9 |  |
| `commerce` | 15 | 15 |  |
| `communication` | 23 | 24 |  |
| `cursor` | 15 | 15 |  |
| `editing` | 117 | 102 | 17 |
| `files` | 33 | 33 |  |
| `layout` | 100 | 98 | 3 |
| `media` | 29 | 29 |  |
| `misc` | 88 | 87 | 2 |
| `navigation` | 51 | 50 | 1 |
| `rack` | 113 | 113 |  |
| `shapes` | 65 | 59 | 6 |
| `stats` | 19 | 19 |  |
| `status` | 12 | 12 |  |
| `system` | 85 | 76 | 10 |
| `theme` | 5 | 5 |  |
| `time` | 9 | 9 |  |
| `tools` | 7 | 7 |  |
| `typography` | 14 | 16 |  |
| `user` | 27 | 27 |  |
| **total** | **881** | **849** | |

### Names by category (stroke tree)

**actions** (45) — `check`, `clipboard-check`, `cloud-upload`, `copy`, `cross`, `cross-alt`, `download`, `edit`, `enter`, `exit`, `filter`, `filter-alt`, `maximize`, `minimize`, `minus`, `move`, `plus`, `redo`, `refresh`, `refresh-cw`, `rotate`, `rotate-alt`, `rotate-left`, `rotate-right`, `save`, `search`, `search-1`, `search-circle`, `search-line`, `settings-01`, `settings-02`, `share`, `snap`, `swap`, `trash`, `trash-1`, `trash-alt`, `undo`, `upload`, `upload-1`, `upload-2`, `upload-3`, `zoom-in`, `zoom-magnify`, `zoom-out`

**brand** (9) — `facebook`, `instagram`, `linkedin`, `messenger`, `signature-thick`, `snapchat`, `tiktok`, `twitter`, `youtube`

**commerce** (15) — `card`, `cash`, `credit-card`, `credit-card-1`, `dollar-sign`, `gift`, `package`, `receipt`, `receipt-refund`, `shopping-bag`, `shopping-basket`, `shopping-basket-1`, `shopping-basket-2`, `shopping-cart`, `tag`

**communication** (23) — `alarm-bell`, `chat`, `chat-alt`, `chat-alt-2`, `dialpad`, `dialpad-alt`, `dual-opponent`, `in-going`, `interactive`, `mail`, `mail-open`, `message-circle`, `message-rounded-add`, `message-rounded-error`, `message-square`, `paper-plane`, `phone`, `send`, `share-shape`, `speakerphone`, `thumb-down`, `thumb-up`, `voicemail`

**cursor** (15) — `crosshair`, `hand`, `mouse`, `mouse-alt`, `navigation`, `navigation-pointer-01`, `navigation-pointer-02`, `pointer`, `pointer-1`, `pointer-2`, `pointer-custom`, `pointer-mirrored`, `pointer-node`, `pointer-selector`, `target-lock`

**editing** (117) — `adjust`, `al-1`, `al-2`, `align-center`, `align-left`, `align-right`, `anchor`, `annotation`, `arrow-from-bottom`, `arrow-from-left`, `arrow-from-right`, `arrow-from-top`, `bold`, `boolean-exclude`, `boolean-intersect`, `boolean-merge`, `boolean-minus-back`, `boolean-minus-front`, `boolean-outline`, `boolean-trim`, `boolean-unite`, `broom`, `brush`, `brush-alt`, `bullseye`, `calc-1`, `calc-2`, `check-set-1`, `check-set-2`, `check-set-3`, `color`, `color-01`, `color-02`, `color-03`, `color-fill`, `color-swatch`, `color-swatches`, `corner-diag`, `crop`, `cut`, `edit-1`, `edit-2`, `edit-3`, `edit-alt`, `element-1`, `exclude`, `eyedrop`, `eyedropper`, `flip-x`, `flip-y`, `highlight`, `highlightercircle`, `intersect`, `intersect-1`, `italic`, `label`, `list-ordered`, `list-unordered`, `magnet`, `magnetstraight`, `markercircle`, `math`, `math-2`, `math-3`, `math-collection`, `measure`, `minus-back`, `minus-front`, `minus-set-1`, `minus-set-2`, `minus-set-3`, `move`, `mult-set-1`, `mult-set-2`, `mult-set-3`, `paint`, `paint-roll`, `paintbrushbroad`, `palette`, `pen`, `pen-copy`, `pencil`, `pencilcircle`, `pencilline`, `pencilsimple`, `pennib`, `pennibstraight`, `perc`, `plus-set-1`, `plus-set-2`, `plus-set-3`, `pushpin`, `registered`, `result`, `ruler`, `ruler-combined`, `ruler-trinangle`, `scissors`, `scissors-1`, `scribble`, `scribble-1`, `scribble-2`, `size`, `slider-shape`, `solid`, `solid-1`, `spray-can`, `stroke`, `stroke-1`, `sum`, `text-01`, `text-02`, `trim`, `type-01`, `type-02`, `type-03`, `underline`

**files** (33) — `add-file`, `archive`, `attachment`, `book-open`, `bookmark`, `bookmark-alt`, `briefcase`, `clipboard-1`, `clipboard-2`, `document`, `document-report`, `file`, `file-image`, `file-text`, `file-video`, `files-01`, `files-02`, `files-03`, `files-04`, `folder`, `folder-01`, `folder-02`, `folder-add`, `folder-open`, `img-01`, `img-02`, `img-03`, `journal`, `manual-empty`, `page`, `project`, `project-1`, `project-2`

**layout** (100) — `align-bottom`, `align-center`, `align-horizontal-center`, `align-horizontal-left`, `align-horizontal-right`, `align-left`, `align-middle`, `align-right`, `align-top`, `align-vertical-bottom`, `align-vertical-center`, `align-vertical-top`, `alignbottom`, `aligncenterhorizontal`, `aligncentervertical`, `alignleft`, `alignleft-1`, `alignright`, `alignright-1`, `aligntop`, `auto-layout`, `border-all`, `border-bottom`, `border-inner`, `border-left`, `border-none`, `border-outer`, `border-radius`, `border-right`, `border-top`, `carousel`, `category`, `category-alt`, `collapse`, `collapse-alt`, `collapse-horizontal`, `collapse-vertical`, `collection`, `columns`, `component`, `dock-bottom`, `dock-left`, `dock-right`, `dock-top`, `expand`, `expand-alt`, `expand-horizontal`, `expand-vertical`, `fatrows`, `grid`, `grid-01`, `grid-02`, `grid-03`, `grid-04`, `grid-05`, `grid-06`, `grid-alt`, `grid-horizontal`, `grid-small`, `grid-vertical`, `horizontal-center`, `horizontal-left`, `horizontal-right`, `layers`, `layout`, `layout-01`, `layout-02`, `layout-03`, `list-01`, `list-02`, `menu`, `menu-1`, `menu-2`, `menu-3`, `more-horizontal`, `more-vertical`, `move-collection`, `move-horizontal`, `move-vertical`, `objects-horizontal-center`, `objects-horizontal-left`, `objects-horizontal-right`, `objects-vertical-bottom`, `objects-vertical-center`, `objects-vertical-top`, `panel-left`, `panel-right`, `reflect-horizontal`, `reflect-vertical`, `row`, `row-alt`, `rows`, `sidebar`, `squaresfour`, `stacksimple`, `trello`, `user-interface`, `view-boards`, `view-grid`, `view-list`

**media** (29) — `camera`, `camera-1`, `camera-2`, `camera-home`, `camera-off`, `control-pause`, `control-play`, `control-stop`, `fast-forward`, `image`, `mic`, `mic-off`, `pause`, `pause-narrow`, `photo-02`, `play`, `repeat`, `repeat-1`, `rewind`, `shuffle`, `skip-back`, `skip-forward`, `stop`, `video`, `video-off`, `volume`, `volume-1`, `volume-2`, `volume-x`

**misc** (88) — `align-auto`, `baseball`, `basketball`, `bath`, `beaker`, `bed`, `been-here`, `bolt`, `bomb`, `bowl-hot`, `bowling-ball`, `bucket`, `bulb`, `bus`, `bus-school`, `cabinet`, `cable-car`, `cake`, `candles`, `car`, `chair`, `chalkboard`, `closet`, `coffee`, `cookie`, `cricket-ball`, `cycling`, `dice-1`, `dice-2`, `dice-3`, `dice-4`, `dice-5`, `dice-6`, `dish`, `door-open`, `dumbbell`, `fire`, `football`, `fork`, `foundation`, `fridge`, `ftx-token-ftt`, `game`, `gas-pump`, `ghost`, `glasses`, `glasses-alt`, `health`, `heart`, `home-1`, `home-2`, `hotel`, `instance`, `joystick`, `joystick-alt`, `joystick-button`, `knife`, `landscape`, `location`, `mask`, `meteor`, `pills`, `placeholder`, `placeholder-1`, `planet`, `plus-medical`, `puzzle`, `rabbit`, `restaurant`, `rocket`, `run`, `shower`, `star-1`, `stitches`, `sun`, `sushi`, `swim`, `taxi`, `tennis-ball`, `ticket`, `traffic-cone`, `train`, `trip`, `trophy`, `truck`, `walk`, `world`, `yarn`

**navigation** (51) — `arrow-cross`, `arrow-down`, `arrow-down-left`, `arrow-down-right`, `arrow-downright`, `arrow-expand`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-up-left`, `arrow-up-right`, `caret-down`, `caret-left`, `caret-right`, `caret-up`, `chevron-down`, `chevron-down-square`, `chevron-left`, `chevron-left-square`, `chevron-right`, `chevron-right-square`, `chevron-up`, `chevron-up-square`, `chevrons-down`, `chevrons-left`, `chevrons-right`, `chevrons-up`, `compass`, `control-arrow-back`, `control-arrow-end`, `control-arrow-forward`, `control-arrow-start`, `current-location`, `directions`, `dropdown-caret`, `external-link`, `globe`, `globe-alt`, `hamburger`, `home`, `location-marker`, `location-plus`, `map`, `map-alt`, `map-pin`, `menu`, `more`, `street-view`, `subdirectory-left`, `subdirectory-right`, `x`

**rack** (113) — `ascii-back`, `ascii-block`, `ascii-dash`, `ascii-dot`, `ascii-equal`, `ascii-hash`, `ascii-pipe`, `ascii-plus`, `ascii-slash`, `ascii-x`, `cable-lock`, `cable-off`, `cable-on`, `cable-trans`, `cable-unlock`, `cap-butt`, `cap-round`, `cap-square`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `clr-anl`, `clr-comp`, `clr-mono`, `clr-tri`, `curve-exp`, `curve-log`, `dith-cross`, `dith-crt`, `dith-diamond`, `dith-flow`, `dith-flower`, `dith-gear`, `dith-glitch`, `dith-grid`, `dith-hex`, `dith-htone`, `dith-melt`, `dith-radial`, `dith-xhatch`, `filter-bp`, `filter-hp`, `filter-lp`, `filter-notch`, `gen-color`, `gen-gradient`, `gen-pattern`, `gen-wave`, `grad-con`, `grad-lin`, `grad-rad`, `line-circle`, `line-grid`, `line-line`, `line-lissa`, `line-spiral`, `logic-and`, `logic-nand`, `logic-nor`, `logic-not`, `logic-or`, `logic-xor`, `nav-create`, `nav-home`, `nav-library`, `nav-rack`, `nav-settings`, `ptrn-checker`, `ptrn-dot`, `ptrn-stripe`, `radial-circle`, `radial-default`, `radial-hex`, `radial-random`, `radial-rect`, `radial-star`, `radial-triangle`, `ramp-down`, `ramp-tri`, `ramp-up`, `seq-a`, `seq-b`, `seq-c`, `seq-d`, `shape-cube`, `shape-cyl`, `shape-ico`, `shape-octa`, `shape-sphere`, `shape-tetra`, `shape-torus`, `shaper-clip`, `shaper-exp`, `shaper-fold`, `shaper-log`, `shaper-scurve`, `shaper-sine`, `shaper-step`, `shaper-wrap`, `tr-carets`, `tr-fwd`, `tr-inf`, `tr-left`, `tr-pause`, `tr-rew`, `tr-right`, `tr-skip`, `wave-rnd`, `wave-saw`, `wave-sin`, `wave-sqr`, `wave-tri`

**shapes** (65) — `3square`, `ball`, `box`, `circle`, `circle-1`, `circle-dashed`, `cone`, `cone-alt`, `cube`, `cube-transparent`, `design-shapes`, `design-shapes-1`, `diamond`, `diamond-alt`, `dimond`, `polygon`, `rectangle`, `shape`, `shape-1`, `shape-16`, `shape-17`, `shape-18`, `shape-19`, `shape-2`, `shape-3`, `shape-4`, `shape-circle`, `shape-polygon`, `shape-square`, `shape-triangle`, `shapes-01`, `shapes-02`, `shapes-03`, `shapes-04`, `shapes-05`, `shapes-06`, `shapes-07`, `shapes-08`, `shapes-09`, `shapes-10`, `shapes-11`, `shapes-12`, `shapes-13`, `shapes-14`, `shapes-15`, `shapes-16`, `shapes-17`, `shapes-18`, `shapes-19`, `shapes-20`, `shapes-21`, `shapes-22`, `shapes-23`, `shapes-24`, `shapes-25`, `shapes-26`, `shapes-27`, `shapes-stroke-01`, `shapes-stroke-02`, `shapes-stroke-03`, `star`, `triangle`, `triangle-alt`, `wave`, `wheel`

**stats** (19) — `chart-square-bar`, `cycle`, `presentation-chart-bar`, `presentation-chart-line`, `stat-abacus`, `stat-chart-a`, `stat-chart-b`, `stat-chart-c`, `stat-crown`, `stat-cycle`, `stat-donut`, `stat-medalion`, `stat-pie`, `stat-pie-c`, `stat-rocket`, `stat-stat`, `stat-winner`, `trending-down`, `trending-up`

**status** (12) — `alert-circle`, `alert-triangle`, `check-circle`, `eye-off`, `eye-on`, `help-circle`, `info`, `lightning-bolt`, `loader`, `loader-circle`, `status`, `x-circle`

**system** (85) — `atomic-atom`, `atomic-lifeform`, `atomic-molecule`, `atomic-organism`, `battery`, `bell`, `bolt-alt`, `brackets`, `bug`, `bug-1`, `bug-2`, `bug-alt`, `calendar`, `calendar-1`, `chip`, `cloud`, `code`, `code-2`, `code-alt-collection`, `code-collection`, `code-curly-collection`, `codesimple`, `cog`, `curly`, `customize`, `database`, `desktop`, `extension`, `eye-off`, `frequency`, `git-compare`, `git-merge`, `git-pull-request`, `git-repo-forked`, `hash`, `hash-italic`, `hash-italic-bold`, `hdd`, `information`, `information-1`, `information-2`, `information-3`, `interactive`, `laptop`, `library`, `light-bulb`, `light-bulb-1`, `link`, `link-1`, `linked`, `main-component`, `pills-alt`, `plug`, `power`, `qrcode`, `roadmap`, `scale`, `server`, `settings`, `settings-1`, `shield-check`, `slider`, `slider-alt`, `smartphone`, `tablet`, `tachometer`, `terminal`, `toggle-left`, `toggle-right`, `tui-crop`, `tui-draw`, `tui-filter`, `tui-flip-x`, `tui-flip-y`, `tui-image`, `tui-rotate-left`, `tui-rotate-right`, `tui-select`, `tui-shape`, `tui-text`, `tui-zoom`, `visible`, `wifi`, `wifi-off`, `wrench`

**theme** (5) — `contrast`, `monitor`, `moon`, `sun`, `theme-toggle`

**time** (9) — `calendar`, `calendar-check`, `calendar-days`, `clock`, `clock-alert`, `clock-rotate-left`, `history`, `stopwatch`, `timer`

**tools** (7) — `bucket-alt`, `color-palette`, `color-wheel`, `crop`, `filter-palette`, `mark-tool`, `paint-drop`

**typography** (14) — `a`, `a-framed`, `aa`, `font-01`, `font-02`, `font-03`, `italic-a`, `italic-b`, `roman-a`, `roman-b`, `type`, `typography-1`, `typography-2`, `typography-3`

**user** (27) — `award`, `certification`, `crown`, `fingerprint`, `flag`, `heart-1`, `heart-2`, `identification`, `key`, `lock`, `log-in`, `log-out`, `medal`, `shield`, `social-facebook`, `social-github`, `social-instagram`, `social-linkedin`, `social-twitter`, `unlock`, `user`, `user-1`, `user-2`, `user-circle`, `user-group`, `user-plus`, `users`
