# Icon treatment — report

Plan, not for the set until the user approves. Every name and category here is a proposal. Source files in `source/` are never touched; every change below is on the copy in `treated/<batch>-<name>.svg`.

## Counts

| Batch | From | Icons |
|---|---|--:|
| A | kol-atlas `more-icons-refs` (Figma 174:25332), shipped by mistake in kol-icons 0.55.0 | 164 |
| B | kol-website `super-icon-kol24` (Figma 160:20415), shipped by mistake in kol-icons 0.55.0 | 143 |
| C | kol-hq Claude list (`ClaudeListIconSet`) | 252 |
| | **total** | **559** |

`calendar` (A) is a copy: the original stays in the set because `MenuDatePicker` names it.

## 1. Clusters

111 clusters hold 440 of 559 icons; the other 119 stand alone. A cluster is one subject by name (synonyms folded: alarm/time/timer → clock, edit → pencil …) or a near-identical drawing (look ≥ 0.9). ★ = the strongest candidate per cut (outline · solid · mixed): fewest bugs, no rescale needed, the user's keep pick on C, then C > A > B. Keep every one; picking is the user's.

**A/B vs C name clashes: 23 names** (an A/B name that is also a C source or proposed name), 35 A/B files counting `-solid` twins — `brain` · `calendar` · `chart-pie` · `clock` · `compass` · `edit-square` · `eraser` · `expand-cross` · `hierarchy` · `link` · `map-route` · `medal` · `network` · `orbit` · `package-open` · `paint-roller` · `podium` · `ruler` · `scale` · `send` · `skull` · `syringe` · `user-circle`. Each sits in its cluster below.

| Cluster | Category | n | Batches | ★ strongest | Members |
|---|---|--:|---|---|---|
| `bars` | `chart` | 3 | C | `C-119-bars-line` | `C-119-bars-line` · `C-122-bars-trend-arrow` · `C-148-bars-search` |
| `candlestick` | `chart` | 2 | A | `A-candlestick-02` | `A-candlestick` · `A-candlestick-02` |
| `chart` | `chart` | 18 | ABC | `C-130-line-chart` · `B-chart-pie-slice-solid` | `A-bar-chart` · `A-chart-square` · `A-node-graph` · `B-chart-pie` · `B-chart-pie-slice` · `B-chart-pie-slice-solid` · `B-chart-pie-solid` · `B-chart-pie-split` · `B-chart-pie-split-solid` · `B-chart-trend` · `B-chart-trend-solid` · `C-130-line-chart` · `C-133-cycle-chart` · `C-135-donut-chart` · `C-137-phone-chart` · `C-163-line-chart` · `C-178-search-graph` · `C-181-report-chart` |
| `dot` | `chart` | 2 | A | `A-dot-plot-03` | `A-dot-plot-03` · `A-dot-plot-04` |
| `growth` | `chart` | 2 | C | `C-151-growth-bars` | `C-151-growth-bars` · `C-182-growth-bars-arrow` |
| `pie` | `chart` | 6 | AC | `C-157-pie-search` | `A-pie-hatch` · `A-pie-quarter` · `C-140-bars-pie` · `C-157-pie-search` · `C-162-pie-chart` · `C-179-clipboard-pie` |
| `presentation` | `chart` | 2 | AC | `C-214-presentation` | `A-presentation-bar` · `C-214-presentation` |
| `bag` | `commerce` | 2 | B | `B-shopping-bag` · `B-shopping-bag-solid` | `B-shopping-bag` · `B-shopping-bag-solid` |
| `barrel` | `commerce` | 2 | B | `B-barrel` · `B-barrel-solid` | `B-barrel` · `B-barrel-solid` |
| `buildings` | `commerce` | 2 | B | `B-buildings` · `B-buildings-solid` | `B-buildings` · `B-buildings-solid` |
| `cart` | `commerce` | 2 | AC | `C-153-cart-load` | `A-cart` · `C-153-cart-load` |
| `currency` | `commerce` | 11 | AB | `A-cash` · `B-coins-solid` | `A-cash` · `B-coins` · `B-coins-solid` · `B-dollar` · `B-dollar-solid` · `B-euro` · `B-euro-solid` · `B-pound` · `B-pound-solid` · `B-yen` · `B-yen-solid` |
| `exchange` | `commerce` | 2 | B | `B-exchange-solid` · `B-exchange` | `B-exchange` · `B-exchange-solid` |
| `factory` | `commerce` | 2 | B | `B-factory` · `B-factory-solid` | `B-factory` · `B-factory-solid` |
| `gem` | `commerce` | 2 | B | `B-gem` · `B-gem-solid` | `B-gem` · `B-gem-solid` |
| `gift` | `commerce` | 2 | B | `B-gift-solid` · `B-gift` | `B-gift` · `B-gift-solid` |
| `package` | `commerce` | 5 | BC | `C-188-package-open` · `B-package-open-solid` · `B-package` | `B-package` · `B-package-open` · `B-package-open-solid` · `B-package-solid` · `C-188-package-open` |
| `receipt` | `commerce` | 2 | AC | `C-215-receipt` | `A-receipt-refund` · `C-215-receipt` |
| `shop` | `commerce` | 2 | B | `B-shop` · `B-shop-solid` | `B-shop` · `B-shop-solid` |
| `equalizer` | `control` | 5 | AC | `C-018-adjust-sliders` | `A-equalizer` · `A-equalizer-02` · `A-equalizer-03` · `A-equalizer-04` · `C-018-adjust-sliders` |
| `toggle` | `control` | 6 | AB | `A-toggle-oval-02` · `B-switch-lane-solid` | `A-toggle-oval` · `A-toggle-oval-02` · `A-toggle-square` · `A-toggle-square-02` · `B-switch-lane` · `B-switch-lane-solid` |
| `database` | `data` | 7 | C | `C-124-database-cycle` | `C-124-database-cycle` · `C-126-database-network` · `C-128-database-globe` · `C-129-database-refresh` · `C-136-database-hex` · `C-147-database` · `C-191-database-zap` |
| `server` | `data` | 4 | C | `C-125-server-bars` | `C-125-server-bars` · `C-150-server` · `C-159-server-rack` · `C-174-server-gear` |
| `broadcast` | `device` | 2 | B | `B-broadcast` · `B-broadcast-solid` | `B-broadcast` · `B-broadcast-solid` |
| `browser` | `device` | 6 | B | `B-browser-code-solid` · `B-browser-check` | `B-browser` · `B-browser-check` · `B-browser-check-solid` · `B-browser-code` · `B-browser-code-solid` · `B-browser-solid` |
| `camera` | `device` | 3 | AC | `A-camera-off` · `A-camera-scan` | `A-camera-off` · `A-camera-scan` · `C-009-camera` |
| `desktop` | `device` | 10 | BC | `C-123-monitor-chart` · `B-desktop-camera-solid` | `B-desktop-camera` · `B-desktop-camera-solid` · `B-desktop-code` · `B-desktop-code-solid` · `B-desktop-play` · `B-desktop-play-solid` · `B-desktop-skull` · `B-desktop-skull-solid` · `C-123-monitor-chart` · `C-164-monitor-pie` |
| `easel` | `device` | 2 | C | `C-061-easel` | `C-051-easel-artboard` · `C-061-easel` |
| `gamepad` | `device` | 2 | B | `B-gamepad-solid` · `B-gamepad` | `B-gamepad` · `B-gamepad-solid` |
| `microphone` | `device` | 2 | B | `B-microphone` · `B-microphone-solid` | `B-microphone` · `B-microphone-solid` |
| `mouse` | `device` | 2 | B | `B-mouse` · `B-mouse-solid` | `B-mouse` · `B-mouse-solid` |
| `printer` | `device` | 2 | B | `B-printer` · `B-printer-solid` | `B-printer` · `B-printer-solid` |
| `radio` | `device` | 2 | B | `B-radio` · `B-radio-solid` | `B-radio` · `B-radio-solid` |
| `sd` | `device` | 2 | B | `B-sd-card` · `B-sd-card-solid` | `B-sd-card` · `B-sd-card-solid` |
| `eraser` | `editing` | 3 | AC | `A-eraser` | `A-eraser` · `C-006-eraser` · `C-035-eraser` |
| `pen` | `editing` | 20 | AC | `C-031-bezier-pen-handles` · `C-102-pen-laurel` | `A-pen-02` · `A-pen-nib-straight` · `C-004-pen-nib` · `C-008-add-anchor-pen` · `C-025-pen-nib` · `C-031-bezier-pen-handles` · `C-059-pen-tool` · `C-101-scroll-pen` · `C-102-pen-laurel` · `C-104-pen-nib-writing` · `C-106-pen` · `C-107-clipboard-pen` · `C-108-notepad-pen` · `C-111-book-pen` · `C-112-pen-scribble` · `C-113-magic-pen` · `C-116-fountain-pen` · `C-183-pen-tool` · `C-210-square-pen` · `C-217-clipboard-pen-line` |
| `pencil` | `editing` | 11 | AC | `C-023-edit-selection` | `A-edit-square` · `A-pencil` · `A-pencil-02` · `A-pencil-03` · `A-pencil-circle` · `A-pencil-simple` · `C-001-edit-square` · `C-020-path-pencil` · `C-023-edit-selection` · `C-052-edit-image` · `C-103-idea-pencil` |
| `face` | `eye-lock` | 4 | B | `B-face-scan` · `B-face-scan-solid` | `B-face-scan` · `B-face-scan-solid` · `B-face-smile` · `B-face-smile-solid` |
| `key` | `eye-lock` | 2 | B | `B-key` · `B-key-solid` | `B-key` · `B-key-solid` |
| `shield` | `eye-lock` | 10 | B | `B-shield-badge` · `B-shield-badge-solid` | `B-shield` · `B-shield-badge` · `B-shield-badge-solid` · `B-shield-notch` · `B-shield-notch-solid` · `B-shield-round` · `B-shield-round-solid` · `B-shield-solid` · `B-shield-wave` · `B-shield-wave-solid` |
| `spy` | `eye-lock` | 2 | B | `B-spy` · `B-spy-solid` | `B-spy` · `B-spy-solid` |
| `clipboard` | `files` | 4 | B | `B-clipboard-check` · `B-clipboard-check-solid` | `B-clipboard-check` · `B-clipboard-check-solid` · `B-clipboard-list` · `B-clipboard-list-solid` |
| `file` | `files` | 8 | ABC | `C-168-file-check` · `B-file-checklist-solid` · `C-042-design-file` | `A-file-chart` · `B-file-checklist` · `B-file-checklist-solid` · `C-042-design-file` · `C-105-file-pen` · `C-115-file-quill` · `C-168-file-check` · `C-177-document` |
| `folder` | `files` | 4 | AC | `A-folder-add` | `A-folder-add` · `A-folder-minus` · `A-folder-open` · `C-152-folder-tree` |
| `image` | `files` | 4 | C | `C-010-images` · `C-047-image-frame` | `C-010-images` · `C-012-shapes-on-image` · `C-047-image-frame` · `C-206-image-minus` |
| `manual` | `files` | 4 | B | `B-manual-warning` · `B-manual-warning-solid` | `B-manual` · `B-manual-solid` · `B-manual-warning` · `B-manual-warning-solid` |
| `video` | `files` | 2 | C | `C-011-video-film` | `C-011-video-film` · `C-209-film` |
| `git` | `flow` | 13 | AC | `C-247-git-pull-request-closed` | `A-branch-up` · `A-git-branch` · `A-git-branch-02` · `A-git-branch-03` · `A-git-branch-04` · `A-git-commit` · `A-git-compare` · `A-git-compare-02` · `A-git-compare-03` · `A-git-fork` · `A-git-merge` · `A-git-pull-request` · `C-247-git-pull-request-closed` |
| `hierarchy` | `flow` | 14 | AC | `C-155-data-network` · `A-tree` | `A-flow-branch` · `A-flow-tree` · `A-hierarchy` · `A-hierarchy-02` · `A-hierarchy-03` · `A-hierarchy-boxes` · `A-network` · `A-tree` · `C-141-gear-network` · `C-155-data-network` · `C-158-hierarchy` · `C-169-network-star` · `C-172-flow-arrows` · `C-184-network` |
| `columns` | `layout` | 3 | A | `A-kanban` | `A-columns-two` · `A-kanban` · `A-kanban-02` |
| `grid` | `layout` | 6 | AC | `C-117-bento-grid` | `A-bento` · `A-bento-02` · `A-circles-grid` · `A-circles-grid-02` · `A-grid-2x2` · `C-117-bento-grid` |
| `layers` | `layout` | 5 | AC | `C-055-layers` | `A-stack` · `A-stack-hang` · `C-055-layers` · `C-062-layers` · `C-176-layers` |
| `layout` | `layout` | 2 | C | `C-227-layout-dashboard` | `C-227-layout-dashboard` · `C-243-layout-template` |
| `table` | `layout` | 2 | AC | `C-249-table-cells-merge` | `A-table` · `C-249-table-cells-merge` |
| `brain` | `misc` | 5 | BC | `C-232-brain` · `B-brain-solid` | `B-brain` · `B-brain-solid` · `C-232-brain` · `C-235-brain-circuit` · `C-236-brain-cog` |
| `coffee` | `misc` | 2 | B | `B-coffee` · `B-coffee-solid` | `B-coffee` · `B-coffee-solid` |
| `courthouse` | `misc` | 2 | B | `B-courthouse` · `B-courthouse-solid` | `B-courthouse` · `B-courthouse-solid` |
| `graduation` | `misc` | 2 | B | `B-graduation-cap` · `B-graduation-cap-solid` | `B-graduation-cap` · `B-graduation-cap-solid` |
| `idea` | `misc` | 2 | C | `C-054-idea-bulb` | `C-044-idea-bulb` · `C-054-idea-bulb` |
| `medal` | `misc` | 3 | BC | `C-219-medal` · `B-medal-solid` | `B-medal` · `B-medal-solid` · `C-219-medal` |
| `podium` | `misc` | 3 | BC | `C-165-podium` · `B-podium-solid` | `B-podium` · `B-podium-solid` · `C-165-podium` |
| `robot` | `misc` | 4 | B | `B-robot-head` · `B-robot-head-solid` | `B-robot` · `B-robot-head` · `B-robot-head-solid` · `B-robot-solid` |
| `rocket` | `misc` | 2 | B | `B-rocket` · `B-rocket-solid` | `B-rocket` · `B-rocket-solid` |
| `scale` | `misc` | 2 | AC | `C-204-scale` | `A-scale` · `C-204-scale` |
| `skull` | `misc` | 3 | BC | `B-skull` · `B-skull-solid` | `B-skull` · `B-skull-solid` · `C-186-skull` |
| `syringe` | `misc` | 3 | BC | `C-237-syringe` · `B-syringe-solid` | `B-syringe` · `B-syringe-solid` · `C-237-syringe` |
| `gear` | `nav` | 3 | C | `C-173-gear-cycle` | `C-139-search-gear` · `C-173-gear-cycle` · `C-180-gear` |
| `lifebuoy` | `nav` | 2 | B | `B-lifebuoy` · `B-lifebuoy-solid` | `B-lifebuoy` · `B-lifebuoy-solid` |
| `log` | `nav` | 2 | A | `A-log-out` | `A-log-in` · `A-log-out` |
| `user` | `nav` | 5 | AC | `C-175-user-target` | `A-user-circle` · `A-user-group` · `C-086-person-clock` · `C-175-user-target` · `C-242-circle-user` |
| `bell` | `notify` | 3 | C | `C-190-concierge-bell` · `C-070-bell` | `C-070-bell` · `C-091-bell-ringing` · `C-190-concierge-bell` |
| `chat` | `notify` | 2 | A | `A-chat-double` | `A-chat` · `A-chat-double` |
| `send` | `notify` | 2 | AC | `A-send` | `A-send` · `C-223-send` |
| `thumb` | `notify` | 2 | A | `A-thumb-down` | `A-thumb-down` · `A-thumb-up` |
| `compass` | `place` | 4 | AC | `C-185-compass` · `C-057-compass` | `A-compass` · `C-046-compass` · `C-057-compass` · `C-185-compass` |
| `globe` | `place` | 3 | AC | `C-096-globe-clock` | `A-globe-earth` · `C-096-globe-clock` · `C-131-globe-search` |
| `location` | `place` | 2 | AC | `C-099-route-flag-pin` | `A-location` · `C-099-route-flag-pin` |
| `map` | `place` | 4 | BC | `C-066-map-pin` · `B-map-route-solid` · `C-074-map` | `B-map-route` · `B-map-route-solid` · `C-066-map-pin` · `C-074-map` |
| `bolt` | `shape-forms` | 3 | A | `A-bolt-02` | `A-bolt-02` · `A-bolt-off` · `A-bolt-zigzag` |
| `circles` | `shape-forms` | 2 | A | `A-circles-three` | `A-circles-pair` · `A-circles-three` |
| `cloud` | `shape-forms` | 8 | ABC | `C-138-cloud-apps` · `B-cloud-storm-solid` | `A-cloud-download` · `A-cloud-upload` · `B-cloud-storm` · `B-cloud-storm-solid` · `C-138-cloud-apps` · `C-146-cloud-gear` · `C-156-cloud-monitor` · `C-252-cloud-rain` |
| `cube` | `shape-forms` | 3 | AC | `A-cube-dashed-02` | `A-cube-dashed` · `A-cube-dashed-02` · `C-032-3d-cube` |
| `heart` | `shape-forms` | 3 | BC | `C-208-heart-handshake` · `B-heart-half-solid` | `B-heart-half` · `B-heart-half-solid` · `C-208-heart-handshake` |
| `duplicate` | `singletons` | 2 | C | `C-005-duplicate` | `C-005-duplicate` · `C-015-copy-layer` |
| `link` | `singletons` | 3 | AC | `C-207-link` | `A-link` · `A-link-02` · `C-207-link` |
| `search` | `singletons` | 2 | AC | `C-149-search` | `A-search-circle` · `C-149-search` |
| `calendar` | `time` | 5 | AC | `C-078-calendar-date` · `C-069-calendar` | `A-calendar` · `C-064-calendar` · `C-069-calendar` · `C-078-calendar-date` · `C-094-calendar-clock` |
| `clock` | `time` | 21 | AC | `C-068-clock` · `C-071-stopwatch` | `A-clock` · `C-065-clock` · `C-068-clock` · `C-071-stopwatch` · `C-072-alarm-clock` · `C-075-clock` · `C-076-clock-ring` · `C-079-alarm-clock` · `C-080-stopwatch-gauge` · `C-081-dashed-clock` · `C-082-clock-gear` · `C-083-watch` · `C-084-fast-stopwatch` · `C-085-clock-cycle` · `C-089-gauge-timer` · `C-090-watch-24` · `C-092-clock-dashed` · `C-095-time-zones` · `C-196-timer-reset` · `C-221-alarm-clock-plus` · `C-224-alarm-smoke` |
| `h` | `time` | 2 | C | `C-088-24-h-clock` | `C-088-24-h-clock` · `C-097-24-h-refresh` |
| `hourglass` | `time` | 4 | C | `C-250-hourglass` · `C-087-hourglass-round` | `C-067-hourglass` · `C-087-hourglass-round` · `C-098-hourglass` · `C-250-hourglass` |
| `bezier` | `tools` | 2 | AC | `C-013-bezier-node` | `A-bezier` · `C-013-bezier-node` |
| `brush` | `tools` | 7 | AC | `C-063-palette-brush` · `C-048-paint-bucket` | `A-paint-roller` · `C-036-brush` · `C-048-paint-bucket` · `C-063-palette-brush` · `C-114-brush` · `C-202-paint-bucket` · `C-205-paint-roller` |
| `drop` | `tools` | 2 | A | `A-drop-circle` | `A-drop-circle` · `A-drop-hatch` |
| `frame` | `tools` | 2 | C | `C-003-add-frame` | `C-003-add-frame` · `C-007-flip-frame` |
| `hand` | `tools` | 5 | ABC | `C-203-hand-metal` · `B-hand-pointer-solid` | `A-hand` · `B-hand-pointer` · `B-hand-pointer-solid` · `C-145-hand-gear` · `C-203-hand-metal` |
| `magnet` | `tools` | 2 | A | `A-magnet-02` | `A-magnet` · `A-magnet-02` |
| `orbit` | `tools` | 3 | AC | `C-239-orbit` | `A-orbit` · `A-orbit-dot` · `C-239-orbit` |
| `rotate` | `tools` | 3 | AC | `C-060-3d-rotate` | `A-rotate-out` · `C-014-rotate-object` · `C-060-3d-rotate` |
| `ruler` | `tools` | 5 | AC | `C-041-ruler` · `C-049-ruler-pencil` | `A-ruler` · `A-ruler-combined` · `A-ruler-triangle` · `C-041-ruler` · `C-049-ruler-pencil` |
| `select` | `tools` | 7 | AC | `C-026-lasso-select` | `A-select-circle` · `A-select-frame` · `A-select-frame-02` · `C-002-lasso-rotate` · `C-026-lasso-select` · `C-037-select-area` · `C-058-select-cursor` |
| `shapes` | `tools` | 2 | A | `A-shapes-02` | `A-shapes` · `A-shapes-02` |
| `squares` | `tools` | 2 | A | `A-squares-linked-02` | `A-squares-linked` · `A-squares-linked-02` |
| `swatch` | `tools` | 2 | C | `C-039-swatch-book` | `C-039-swatch-book` · `C-220-swatch-book` |
| `triangle` | `tools` | 2 | AC | `C-212-triangle-alert` | `A-triangle-down` · `C-212-triangle-alert` |
| `contract` | `traffic` | 3 | B | `B-contract-cross` · `B-contract-corners-solid` | `B-contract-corners-solid` · `B-contract-cross` · `B-contract-cross-solid` |
| `expand` | `traffic` | 4 | BC | `C-022-expand-cross-arrows` · `B-expand-corners-solid` | `B-expand-corners-solid` · `B-expand-cross` · `B-expand-cross-solid` · `C-022-expand-cross-arrows` |
| `sync` | `traffic` | 2 | A | `A-sync` | `A-sync` · `A-sync-dashed` |
| `car` | `transport` | 2 | B | `B-car` · `B-car-solid` | `B-car` · `B-car-solid` |
| `train` | `transport` | 2 | B | `B-train` · `B-train-solid` | `B-train` · `B-train-solid` |
| `quote` | `typography` | 2 | B | `B-quote` · `B-quote-solid` | `B-quote` · `B-quote-solid` |
| `text` | `typography` | 3 | C | `C-016-text-frame` | `C-016-text-frame` · `C-024-text-tool` · `C-053-text-box` |

## 2. Categories

One list for all three batches. Existing set groups are used where they fit; **new** ones are marked. A/B take their first group or the earlier sort's move; `place-time` splits into `time` and `place`; C takes the scan's home group (`docs/operations/09-phase-log/2026-10-31-icon-batch-scan.md`).

| Category | | A | B | C | Total |
|---|---|--:|--:|--:|--:|
| `add-remove` | set | 1 | 0 | 0 | 1 |
| `arrow-diagonal` | set | 0 | 0 | 2 | 2 |
| `chart` | **new** | 7 | 9 | 20 | 36 |
| `code` | set | 1 | 0 | 1 | 2 |
| `commerce` | **new** | 6 | 30 | 0 | 36 |
| `control` | **new** | 10 | 0 | 0 | 10 |
| `data` | **new** | 0 | 0 | 23 | 23 |
| `device` | set | 4 | 28 | 9 | 41 |
| `editing` | set | 10 | 0 | 28 | 38 |
| `eye-lock` | set | 1 | 16 | 0 | 17 |
| `files` | set | 5 | 10 | 26 | 41 |
| `flow` | **new** | 22 | 0 | 0 | 22 |
| `layout` | set | 10 | 0 | 11 | 21 |
| `misc` | set | 5 | 24 | 31 | 60 |
| `nav` | set | 5 | 2 | 4 | 11 |
| `notify` | set | 8 | 0 | 5 | 13 |
| `place` | **new** | 4 | 2 | 6 | 12 |
| `playback` | set | 2 | 0 | 1 | 3 |
| `shape-forms` | set | 13 | 5 | 1 | 19 |
| `shape-primitives` | set | 2 | 0 | 0 | 2 |
| `singletons` | set | 4 | 0 | 8 | 12 |
| `time` | **new** | 2 | 0 | 33 | 35 |
| `tools` | set | 37 | 2 | 37 | 76 |
| `traffic` | set | 2 | 9 | 0 | 11 |
| `transfer` | set | 2 | 0 | 1 | 3 |
| `transport` | **new** | 1 | 4 | 0 | 5 |
| `typography` | set | 0 | 2 | 5 | 7 |

## 3. Bugs

| Kind | A | B | C | Total | Fixed by treatment |
|---|--:|--:|--:|--:|---|
| empty/unrenderable | 0 | 0 | 0 | 0 | no |
| garbled path | 0 | 0 | 0 | 0 | no |
| open path in a fill | 1 | 2 | 0 | 3 | no — review |
| outline where a solid is meant | 0 | 0 | 0 | 0 | no — needs a redraw |
| solid carries strokes | 0 | 2 | 0 | 2 | no — review |
| fill mixed with stroke | 5 | 7 | 21 | 33 | no — review |
| expanded outline (redraw) | 0 | 0 | 0 | 0 | no — needs a redraw |
| mask construction (redraw flat) | 0 | 0 | 1 | 1 | no — kept as drawn, not fitted |
| outside live area | 0 | 5 | 4 | 9 | yes (fit), except a masked drawing |
| off-centre (ink) | 22 | 15 | 28 | 65 | the box is centred when off by >1; the rest is ink weight — check optical |
| undersized | 0 | 0 | 1 | 1 | yes (fit) |
| export junk | 0 | 0 | 0 | 0 | yes |

### Per icon

| Icon | Bugs |
|---|---|
| `A-beaker` | off-centre (ink) |
| `A-camera-scan` | fill mixed with stroke |
| `A-dot-plot-03` | fill mixed with stroke · off-centre (ink) |
| `A-dot-plot-04` | fill mixed with stroke · off-centre (ink) |
| `A-email-open` | off-centre (ink) |
| `A-flow-branch` | off-centre (ink) |
| `A-flow-tree` | off-centre (ink) |
| `A-git-branch` | off-centre (ink) |
| `A-git-branch-02` | off-centre (ink) |
| `A-git-branch-03` | off-centre (ink) |
| `A-git-branch-04` | off-centre (ink) |
| `A-git-merge` | off-centre (ink) |
| `A-hierarchy` | off-centre (ink) |
| `A-hierarchy-02` | off-centre (ink) |
| `A-hierarchy-03` | off-centre (ink) |
| `A-list-bullet` | off-centre (ink) |
| `A-log-in` | off-centre (ink) |
| `A-navigation` | off-centre (ink) |
| `A-network` | off-centre (ink) |
| `A-paint-roller` | off-centre (ink) |
| `A-ruler-triangle` | off-centre (ink) |
| `A-scan` | fill mixed with stroke |
| `A-tree` | open path in a fill · fill mixed with stroke · off-centre (ink) |
| `A-triangle-down` | off-centre (ink) |
| `B-arrows-3way` | outside live area |
| `B-brain-solid` | off-centre (ink) |
| `B-browser` | fill mixed with stroke |
| `B-browser-check` | fill mixed with stroke |
| `B-browser-check-solid` | off-centre (ink) |
| `B-browser-code` | fill mixed with stroke |
| `B-browser-solid` | off-centre (ink) |
| `B-buildings` | outside live area |
| `B-chart-pie-split-solid` | open path in a fill |
| `B-coffee-solid` | open path in a fill · solid carries strokes |
| `B-courthouse` | off-centre (ink) |
| `B-desktop-skull-solid` | outside live area |
| `B-dollar` | outside live area |
| `B-euro-solid` | off-centre (ink) |
| `B-exchange` | fill mixed with stroke |
| `B-gamepad` | fill mixed with stroke |
| `B-gem` | off-centre (ink) |
| `B-gem-solid` | off-centre (ink) |
| `B-gift` | fill mixed with stroke |
| `B-heart-half-solid` | off-centre (ink) |
| `B-mouse-solid` | off-centre (ink) |
| `B-package` | fill mixed with stroke |
| `B-podium` | off-centre (ink) |
| `B-podium-solid` | off-centre (ink) |
| `B-pound-solid` | off-centre (ink) |
| `B-printer-solid` | off-centre (ink) |
| `B-radio-solid` | off-centre (ink) |
| `B-robot-solid` | outside live area |
| `B-rocket-solid` | solid carries strokes |
| `B-syringe` | off-centre (ink) |
| `C-006-eraser` | off-centre (ink) · undersized |
| `C-014-rotate-object` | off-centre (ink) |
| `C-032-3d-cube` | off-centre (ink) |
| `C-042-design-file` | fill mixed with stroke |
| `C-046-compass` | off-centre (ink) |
| `C-047-image-frame` | fill mixed with stroke |
| `C-048-paint-bucket` | fill mixed with stroke |
| `C-049-ruler-pencil` | fill mixed with stroke |
| `C-050-3d-axes` | off-centre (ink) |
| `C-056-colour-swatches` | fill mixed with stroke · outside live area · mask construction (redraw flat) |
| `C-057-compass` | fill mixed with stroke |
| `C-064-calendar` | fill mixed with stroke |
| `C-065-clock` | fill mixed with stroke |
| `C-066-map-pin` | off-centre (ink) |
| `C-067-hourglass` | fill mixed with stroke |
| `C-069-calendar` | fill mixed with stroke |
| `C-070-bell` | fill mixed with stroke |
| `C-071-stopwatch` | fill mixed with stroke |
| `C-072-alarm-clock` | fill mixed with stroke · outside live area |
| `C-073-route-pins` | fill mixed with stroke |
| `C-074-map` | fill mixed with stroke |
| `C-086-person-clock` | outside live area |
| `C-087-hourglass-round` | fill mixed with stroke |
| `C-091-bell-ringing` | outside live area |
| `C-098-hourglass` | fill mixed with stroke |
| `C-100-s-route-roadmap` | fill mixed with stroke |
| `C-102-pen-laurel` | fill mixed with stroke |
| `C-103-idea-pencil` | off-centre (ink) |
| `C-104-pen-nib-writing` | off-centre (ink) |
| `C-118-app-squares` | fill mixed with stroke |
| `C-140-bars-pie` | off-centre (ink) |
| `C-148-bars-search` | off-centre (ink) |
| `C-151-growth-bars` | off-centre (ink) |
| `C-152-folder-tree` | off-centre (ink) |
| `C-158-hierarchy` | off-centre (ink) |
| `C-163-line-chart` | off-centre (ink) |
| `C-165-podium` | off-centre (ink) |
| `C-182-growth-bars-arrow` | off-centre (ink) |
| `C-184-network` | off-centre (ink) |
| `C-187-pilcrow` | off-centre (ink) |
| `C-190-concierge-bell` | off-centre (ink) |
| `C-201-antenna` | off-centre (ink) |
| `C-205-paint-roller` | off-centre (ink) |
| `C-212-triangle-alert` | off-centre (ink) |
| `C-216-palette` | fill mixed with stroke |
| `C-219-medal` | off-centre (ink) |
| `C-223-send` | off-centre (ink) |
| `C-224-alarm-smoke` | off-centre (ink) |
| `C-226-cake` | off-centre (ink) |
| `C-244-tent` | off-centre (ink) |
| `C-245-siren` | off-centre (ink) |

## 4. Styles

| | A | B | C |
|---|---|---|---|
| cut | outline 159 · mixed 5 | solid 70 · outline 64 · mixed 9 | outline 231 · mixed 21 |
| stroke weight (rendered, at 24) | 1.5 164 | 1.5 73 | 1.5 252 |
| caps | round 145 · butt 23 | butt 57 · round 49 · square 2 | round 252 |
| joins | round 135 · miter 33 | round 49 · miter 36 | round 252 |
| rect corner radii | 1.68 1 | 0.88 3 · 0.4 3 · 1 2 · 1.77 2 · 0.82 1 · 0.34 1 | 0.5 7 · 1.25 6 · 0.75 6 · 1.5 5 · 1 3 · 1.3 3 |
| keyline shape fit (source) | square 3–21 101 · wide 20×16 33 · tall 16×20 28 · circle 2–22 1 · inner (<17) 1 | square 3–21 41 · wide 20×16 41 · tall 16×20 29 · circle 2–22 27 · over live area 5 | circle 2–22 82 · square 3–21 73 · wide 20×16 46 · tall 16×20 36 · inner (<17) 10 · over live area 4 |

**What they share:** every stroke in all three renders at 1.5 on the 24 grid, all `currentColor`, all `viewBox 0 0 24 24`. **How they differ:** A is outline-first, each glyph refitted by a wrapping `scale()` group with the stroke written as 1.5 ÷ scale, mostly round caps and joins but 23 butt-capped and 33 miter-joined (its geometric marks), and sits mostly on the 3–21 square. B is outline/`-solid` pairs (half its files are solids: plain fills, no stroke), drawn straight on the grid with no width/height, butt caps outnumber round and miter joins are common — the most geometric of the three, with the widest marks (circle 2–22) and five over the live area. C is hand-drawn on the keyline at 1.5 in one `<g>` that carries the stroke, round caps and joins throughout, rect corners 0.5–1.5, small filled dots beside strokes (its 21 mixed), and ten drawn inside the square.

## 5. Normalisation

| Step | A | B | C | Total |
|---|--:|--:|--:|--:|
| 5.1 stroke → 1.5 | 0 | 0 | 0 | 0 |
| 5.2 viewBox → 0 0 24 24 | 0 | 0 | 0 | 0 |
| 5.2 width/height → 24 | 0 | 143 | 252 | 395 |
| 5.3 scaled to the keyline | 1 | 17 | 40 | 58 |
| 5.3 centred | 0 | 6 | 5 | 11 |
| 5.4 colours → currentColor | 0 | 0 | 0 | 0 |
| 5.4 junk stripped | 0 | 0 | 0 | 0 |
| untouched geometry | 163 | 120 | 210 | 493 |

Mechanical only: no drawing was redrawn. Every stroke is written explicitly on its element (fill · stroke · width · cap · join), group-level presentation is folded down, attribute-less groups unwrapped. Fit rule: outer extent (geometry + 1.5 stroke) — near-square (aspect 0.9–1.1) passes from 17.25 (square 3–21) to 20 (circle 2–22), otherwise the long side 19–20; outside that it is scaled about its centre to 18 (20 when over), or 20 for non-square, and the stroke kept at 1.5 rendered. Centred when the box centre is off (12, 12) by more than 1, or when the drawing crosses the 2–22 live area.

### Per icon

| Icon | Category | Cut | Changes |
|---|---|---|---|
| `A-archive` | `files` | outline | — |
| `A-asterisk` | `shape-forms` | outline | — |
| `A-bar-chart` | `chart` | outline | — |
| `A-beaker` | `misc` | outline | — |
| `A-bento` | `layout` | outline | — |
| `A-bento-02` | `layout` | outline | — |
| `A-bezier` | `tools` | outline | — |
| `A-blend` | `tools` | outline | — |
| `A-bolt-02` | `shape-forms` | outline | — |
| `A-bolt-off` | `shape-forms` | outline | — |
| `A-bolt-zigzag` | `shape-forms` | outline | — |
| `A-bookmark-square` | `shape-forms` | outline | — |
| `A-branch-up` | `flow` | outline | — |
| `A-briefcase` | `commerce` | outline | — |
| `A-broom` | `tools` | outline | — |
| `A-bubbles` | `shape-forms` | outline | — |
| `A-calendar` | `time` | outline | — |
| `A-camera-off` | `device` | outline | — |
| `A-camera-scan` | `device` | mixed | — |
| `A-candlestick` | `chart` | outline | — |
| `A-candlestick-02` | `chart` | outline | — |
| `A-capsules` | `tools` | outline | — |
| `A-cart` | `commerce` | outline | — |
| `A-cash` | `commerce` | outline | — |
| `A-cast` | `device` | outline | — |
| `A-chart-square` | `chart` | outline | — |
| `A-chat` | `notify` | outline | — |
| `A-chat-double` | `notify` | outline | — |
| `A-check-circle` | `add-remove` | outline | — |
| `A-checkbox` | `control` | outline | — |
| `A-chip` | `device` | outline | — |
| `A-circles-grid` | `tools` | outline | — |
| `A-circles-grid-02` | `tools` | outline | — |
| `A-circles-pair` | `tools` | outline | — |
| `A-circles-three` | `shape-forms` | outline | — |
| `A-clock` | `time` | outline | — |
| `A-cloud-download` | `transfer` | outline | — |
| `A-cloud-upload` | `transfer` | outline | — |
| `A-code-close` | `code` | outline | — |
| `A-columns-two` | `layout` | outline | — |
| `A-compass` | `place` | outline | — |
| `A-container` | `misc` | outline | — |
| `A-controls-box` | `control` | outline | — |
| `A-credit-card` | `commerce` | outline | — |
| `A-cube-dashed` | `shape-primitives` | outline | — |
| `A-cube-dashed-02` | `shape-forms` | outline | — |
| `A-cursor-click` | `tools` | outline | — |
| `A-disc` | `shape-forms` | outline | — |
| `A-dot-plot-03` | `chart` | mixed | — |
| `A-dot-plot-04` | `chart` | mixed | — |
| `A-drop-circle` | `tools` | outline | — |
| `A-drop-hatch` | `tools` | outline | — |
| `A-edit-square` | `editing` | outline | — |
| `A-email-open` | `notify` | outline | — |
| `A-equalizer` | `control` | outline | — |
| `A-equalizer-02` | `control` | outline | — |
| `A-equalizer-03` | `control` | outline | — |
| `A-equalizer-04` | `control` | outline | — |
| `A-eraser` | `editing` | outline | — |
| `A-file-chart` | `files` | outline | — |
| `A-fire` | `shape-forms` | outline | — |
| `A-flow-branch` | `flow` | outline | — |
| `A-flow-tree` | `flow` | outline | — |
| `A-folder-add` | `files` | outline | — |
| `A-folder-minus` | `files` | outline | — |
| `A-folder-open` | `files` | outline | — |
| `A-git-branch` | `flow` | outline | — |
| `A-git-branch-02` | `flow` | outline | — |
| `A-git-branch-03` | `flow` | outline | — |
| `A-git-branch-04` | `flow` | outline | — |
| `A-git-commit` | `flow` | outline | — |
| `A-git-compare` | `flow` | outline | — |
| `A-git-compare-02` | `flow` | outline | — |
| `A-git-compare-03` | `flow` | outline | — |
| `A-git-fork` | `flow` | outline | — |
| `A-git-merge` | `flow` | outline | — |
| `A-git-pull-request` | `flow` | outline | — |
| `A-globe-earth` | `place` | outline | — |
| `A-grid-2x2` | `layout` | outline | — |
| `A-hand` | `tools` | outline | — |
| `A-hatch` | `tools` | outline | — |
| `A-help-circle` | `singletons` | outline | — |
| `A-hex-nut` | `tools` | outline | — |
| `A-hierarchy` | `flow` | outline | — |
| `A-hierarchy-02` | `flow` | outline | — |
| `A-hierarchy-03` | `flow` | outline | — |
| `A-hierarchy-boxes` | `flow` | outline | — |
| `A-id-card` | `eye-lock` | outline | — |
| `A-kanban` | `layout` | outline | — |
| `A-kanban-02` | `tools` | outline | — |
| `A-lightbulb` | `misc` | outline | — |
| `A-link` | `singletons` | outline | — |
| `A-link-02` | `singletons` | outline | — |
| `A-list-bullet` | `layout` | outline | — |
| `A-location` | `place` | outline | — |
| `A-log-in` | `nav` | outline | — |
| `A-log-out` | `nav` | outline | — |
| `A-magnet` | `tools` | outline | — |
| `A-magnet-02` | `tools` | outline | — |
| `A-marker-circle` | `editing` | outline | — |
| `A-megaphone` | `notify` | outline | — |
| `A-more-circle` | `nav` | outline | — |
| `A-navigation` | `place` | outline | — |
| `A-network` | `flow` | outline | — |
| `A-node-graph` | `flow` | outline | — |
| `A-octagon` | `shape-primitives` | outline | — |
| `A-orbit` | `tools` | outline | — |
| `A-orbit-dot` | `tools` | outline | — |
| `A-paint-roller` | `tools` | outline | — |
| `A-pen-02` | `editing` | outline | — |
| `A-pen-nib-straight` | `editing` | outline | — |
| `A-pencil` | `editing` | outline | — |
| `A-pencil-02` | `editing` | outline | — |
| `A-pencil-03` | `editing` | outline | — |
| `A-pencil-circle` | `editing` | outline | — |
| `A-pencil-simple` | `editing` | outline | — |
| `A-pie-hatch` | `tools` | outline | — |
| `A-pie-quarter` | `tools` | outline | — |
| `A-presentation-bar` | `chart` | outline | — |
| `A-puzzle` | `shape-forms` | outline | — |
| `A-receipt-refund` | `commerce` | outline | — |
| `A-rotate-out` | `tools` | outline | — |
| `A-rows-02` | `layout` | outline | — |
| `A-ruler` | `tools` | outline | — |
| `A-ruler-combined` | `tools` | outline | — |
| `A-ruler-triangle` | `tools` | outline | — |
| `A-scale` | `misc` | outline | — |
| `A-scan` | `tools` | mixed | — |
| `A-search-circle` | `singletons` | outline | — |
| `A-select-circle` | `tools` | outline | — |
| `A-select-frame` | `tools` | outline | — |
| `A-select-frame-02` | `tools` | outline | — |
| `A-send` | `notify` | outline | — |
| `A-shapes` | `tools` | outline | — |
| `A-shapes-02` | `tools` | outline | — |
| `A-share` | `flow` | outline | — |
| `A-sound-bars` | `playback` | outline | — |
| `A-split` | `layout` | outline | — |
| `A-square-slash` | `shape-forms` | outline | — |
| `A-squares-linked` | `tools` | outline | — |
| `A-squares-linked-02` | `tools` | outline | — |
| `A-stack` | `layout` | outline | — |
| `A-stack-hang` | `tools` | outline | — |
| `A-stop-circle` | `playback` | outline | — |
| `A-support` | `notify` | outline | — |
| `A-sync` | `traffic` | outline | — |
| `A-sync-dashed` | `traffic` | outline | scaled ×1.1428 (outer 15.9382 → 18) |
| `A-table` | `layout` | outline | — |
| `A-tag-arrow` | `tools` | outline | — |
| `A-thumb-down` | `notify` | outline | — |
| `A-thumb-up` | `notify` | outline | — |
| `A-ticket` | `commerce` | outline | — |
| `A-toggle-oval` | `control` | outline | — |
| `A-toggle-oval-02` | `control` | outline | — |
| `A-toggle-square` | `control` | outline | — |
| `A-toggle-square-02` | `control` | outline | — |
| `A-tree` | `flow` | mixed | — |
| `A-triangle-down` | `tools` | outline | — |
| `A-truck` | `transport` | outline | — |
| `A-undo-circle` | `tools` | outline | — |
| `A-user-circle` | `nav` | outline | — |
| `A-user-group` | `nav` | outline | — |
| `A-wind` | `shape-forms` | outline | — |
| `A-yarn` | `misc` | outline | — |
| `B-abacus-solid` | `chart` | solid | width/height → 24 |
| `B-arrows-3way` | `traffic` | outline | centred (off -0.7513, 0.75) · width/height → 24 |
| `B-barrel` | `commerce` | outline | width/height → 24 |
| `B-barrel-solid` | `commerce` | solid | width/height → 24 |
| `B-brain` | `misc` | outline | width/height → 24 |
| `B-brain-solid` | `misc` | solid | width/height → 24 |
| `B-broadcast` | `device` | outline | width/height → 24 |
| `B-broadcast-solid` | `device` | solid | width/height → 24 |
| `B-browser` | `device` | mixed | width/height → 24 |
| `B-browser-check` | `device` | mixed | width/height → 24 |
| `B-browser-check-solid` | `device` | solid | width/height → 24 |
| `B-browser-code` | `device` | mixed | width/height → 24 |
| `B-browser-code-solid` | `device` | solid | width/height → 24 |
| `B-browser-solid` | `device` | solid | width/height → 24 |
| `B-buildings` | `commerce` | outline | centred (off -0.9419, 0.0001) · width/height → 24 |
| `B-buildings-solid` | `commerce` | solid | width/height → 24 |
| `B-car` | `transport` | outline | width/height → 24 |
| `B-car-solid` | `transport` | solid | centred (off 0, 1) · width/height → 24 |
| `B-chart-pie` | `chart` | outline | width/height → 24 |
| `B-chart-pie-slice` | `chart` | outline | width/height → 24 |
| `B-chart-pie-slice-solid` | `chart` | solid | width/height → 24 |
| `B-chart-pie-solid` | `chart` | solid | width/height → 24 |
| `B-chart-pie-split` | `chart` | outline | width/height → 24 |
| `B-chart-pie-split-solid` | `chart` | solid | width/height → 24 |
| `B-chart-trend` | `chart` | outline | width/height → 24 |
| `B-chart-trend-solid` | `chart` | solid | width/height → 24 |
| `B-clipboard-check` | `files` | outline | width/height → 24 |
| `B-clipboard-check-solid` | `files` | solid | width/height → 24 |
| `B-clipboard-list` | `files` | outline | width/height → 24 |
| `B-clipboard-list-solid` | `files` | solid | width/height → 24 |
| `B-cloud-storm` | `shape-forms` | outline | width/height → 24 |
| `B-cloud-storm-solid` | `shape-forms` | solid | width/height → 24 |
| `B-coffee` | `misc` | outline | width/height → 24 |
| `B-coffee-solid` | `misc` | mixed | width/height → 24 |
| `B-coins` | `commerce` | outline | width/height → 24 |
| `B-coins-solid` | `commerce` | solid | width/height → 24 |
| `B-contract-corners-solid` | `traffic` | solid | width/height → 24 |
| `B-contract-cross` | `traffic` | outline | width/height → 24 |
| `B-contract-cross-solid` | `traffic` | solid | width/height → 24 |
| `B-courthouse` | `misc` | outline | width/height → 24 |
| `B-courthouse-solid` | `misc` | solid | width/height → 24 |
| `B-desktop-camera` | `device` | outline | width/height → 24 |
| `B-desktop-camera-solid` | `device` | solid | width/height → 24 |
| `B-desktop-code` | `device` | outline | width/height → 24 |
| `B-desktop-code-solid` | `device` | solid | width/height → 24 |
| `B-desktop-play` | `device` | outline | width/height → 24 |
| `B-desktop-play-solid` | `device` | solid | width/height → 24 |
| `B-desktop-skull` | `device` | outline | centred (off 0.0233, -1.5122) · width/height → 24 |
| `B-desktop-skull-solid` | `device` | solid | centred (off 0, -1.5) · width/height → 24 |
| `B-dollar` | `commerce` | outline | scaled ×0.925 (outer 21.5 → 20) · width/height → 24 |
| `B-dollar-solid` | `commerce` | solid | width/height → 24 |
| `B-euro` | `commerce` | outline | width/height → 24 |
| `B-euro-solid` | `commerce` | solid | width/height → 24 |
| `B-exchange` | `commerce` | mixed | width/height → 24 |
| `B-exchange-solid` | `commerce` | solid | width/height → 24 |
| `B-expand-corners-solid` | `traffic` | solid | width/height → 24 |
| `B-expand-cross` | `traffic` | outline | width/height → 24 |
| `B-expand-cross-solid` | `traffic` | solid | width/height → 24 |
| `B-face-scan` | `eye-lock` | outline | width/height → 24 |
| `B-face-scan-solid` | `eye-lock` | solid | width/height → 24 |
| `B-face-smile` | `misc` | outline | width/height → 24 |
| `B-face-smile-solid` | `misc` | solid | width/height → 24 |
| `B-factory` | `commerce` | outline | width/height → 24 |
| `B-factory-solid` | `commerce` | solid | width/height → 24 |
| `B-file-checklist` | `files` | outline | width/height → 24 |
| `B-file-checklist-solid` | `files` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-gamepad` | `device` | mixed | width/height → 24 |
| `B-gamepad-solid` | `device` | solid | width/height → 24 |
| `B-gem` | `commerce` | outline | width/height → 24 |
| `B-gem-solid` | `commerce` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-gift` | `commerce` | mixed | scaled ×0.9877 (outer 20.2313 → 20) · width/height → 24 |
| `B-gift-solid` | `commerce` | solid | width/height → 24 |
| `B-graduation-cap` | `misc` | outline | width/height → 24 |
| `B-graduation-cap-solid` | `misc` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-hand-pointer` | `tools` | outline | width/height → 24 |
| `B-hand-pointer-solid` | `tools` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-heart-half` | `shape-forms` | outline | width/height → 24 |
| `B-heart-half-solid` | `shape-forms` | solid | width/height → 24 |
| `B-key` | `eye-lock` | outline | width/height → 24 |
| `B-key-solid` | `eye-lock` | solid | width/height → 24 |
| `B-leaf` | `shape-forms` | outline | scaled ×1.065 (outer 18.8712 → 20) · width/height → 24 |
| `B-lifebuoy` | `nav` | outline | width/height → 24 |
| `B-lifebuoy-solid` | `nav` | solid | width/height → 24 |
| `B-manual` | `files` | outline | width/height → 24 |
| `B-manual-solid` | `files` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-manual-warning` | `files` | outline | width/height → 24 |
| `B-manual-warning-solid` | `files` | solid | width/height → 24 |
| `B-map-route` | `place` | outline | width/height → 24 |
| `B-map-route-solid` | `place` | solid | width/height → 24 |
| `B-medal` | `misc` | outline | scaled ×1.0819 (outer 18.5996 → 20) · width/height → 24 |
| `B-medal-solid` | `misc` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-microphone` | `device` | outline | scaled ×1.0727 (outer 18.7462 → 20) · width/height → 24 |
| `B-microphone-solid` | `device` | solid | width/height → 24 |
| `B-mouse` | `device` | outline | width/height → 24 |
| `B-mouse-solid` | `device` | solid | width/height → 24 |
| `B-package` | `commerce` | mixed | width/height → 24 |
| `B-package-open` | `commerce` | outline | width/height → 24 |
| `B-package-open-solid` | `commerce` | solid | width/height → 24 |
| `B-package-solid` | `commerce` | solid | width/height → 24 |
| `B-podium` | `misc` | outline | width/height → 24 |
| `B-podium-solid` | `misc` | solid | width/height → 24 |
| `B-pound` | `commerce` | outline | width/height → 24 |
| `B-pound-solid` | `commerce` | solid | width/height → 24 |
| `B-printer` | `device` | outline | width/height → 24 |
| `B-printer-solid` | `device` | solid | width/height → 24 |
| `B-quote` | `typography` | outline | width/height → 24 |
| `B-quote-solid` | `typography` | solid | width/height → 24 |
| `B-radio` | `device` | outline | width/height → 24 |
| `B-radio-solid` | `device` | solid | width/height → 24 |
| `B-robot` | `misc` | outline | width/height → 24 |
| `B-robot-head` | `misc` | outline | width/height → 24 |
| `B-robot-head-solid` | `misc` | solid | width/height → 24 |
| `B-robot-solid` | `misc` | solid | centred (off 0, -1) · width/height → 24 |
| `B-rocket` | `misc` | outline | width/height → 24 |
| `B-rocket-solid` | `misc` | mixed | width/height → 24 |
| `B-sd-card` | `device` | outline | width/height → 24 |
| `B-sd-card-solid` | `device` | solid | width/height → 24 |
| `B-shield` | `eye-lock` | outline | width/height → 24 |
| `B-shield-badge` | `eye-lock` | outline | width/height → 24 |
| `B-shield-badge-solid` | `eye-lock` | solid | width/height → 24 |
| `B-shield-notch` | `eye-lock` | outline | width/height → 24 |
| `B-shield-notch-solid` | `eye-lock` | solid | width/height → 24 |
| `B-shield-round` | `eye-lock` | outline | width/height → 24 |
| `B-shield-round-solid` | `eye-lock` | solid | scaled ×1.1111 (outer 18.0005 → 20) · width/height → 24 |
| `B-shield-solid` | `eye-lock` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-shield-wave` | `eye-lock` | outline | width/height → 24 |
| `B-shield-wave-solid` | `eye-lock` | solid | width/height → 24 |
| `B-shop` | `commerce` | outline | width/height → 24 |
| `B-shop-solid` | `commerce` | solid | width/height → 24 |
| `B-shopping-bag` | `commerce` | outline | width/height → 24 |
| `B-shopping-bag-solid` | `commerce` | solid | width/height → 24 |
| `B-skull` | `misc` | outline | width/height → 24 |
| `B-skull-solid` | `misc` | solid | width/height → 24 |
| `B-spy` | `eye-lock` | outline | width/height → 24 |
| `B-spy-solid` | `eye-lock` | solid | width/height → 24 |
| `B-switch-lane` | `traffic` | outline | width/height → 24 |
| `B-switch-lane-solid` | `traffic` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-syringe` | `misc` | outline | width/height → 24 |
| `B-syringe-solid` | `misc` | solid | width/height → 24 |
| `B-train` | `transport` | outline | width/height → 24 |
| `B-train-solid` | `transport` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `B-yen` | `commerce` | outline | scaled ×1.0822 (outer 18.5945 → 20) · width/height → 24 |
| `B-yen-solid` | `commerce` | solid | scaled ×1.1111 (outer 18 → 20) · width/height → 24 |
| `C-001-edit-square` | `editing` | outline | scaled ×1.0573 (outer 17.1065 → 18) · width/height → 24 |
| `C-002-lasso-rotate` | `tools` | outline | scaled ×1.1332 (outer 16.06 → 18) · width/height → 24 |
| `C-003-add-frame` | `tools` | outline | width/height → 24 |
| `C-004-pen-nib` | `editing` | outline | width/height → 24 |
| `C-005-duplicate` | `singletons` | outline | width/height → 24 |
| `C-006-eraser` | `editing` | outline | scaled ×1.3033 (outer 14.16 → 18) · centred (off 2.58, -2.26) · width/height → 24 |
| `C-007-flip-frame` | `tools` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-008-add-anchor-pen` | `editing` | outline | width/height → 24 |
| `C-009-camera` | `device` | outline | width/height → 24 |
| `C-010-images` | `files` | outline | width/height → 24 |
| `C-011-video-film` | `files` | outline | width/height → 24 |
| `C-012-shapes-on-image` | `files` | outline | width/height → 24 |
| `C-013-bezier-node` | `editing` | outline | width/height → 24 |
| `C-014-rotate-object` | `tools` | outline | width/height → 24 |
| `C-015-copy-layer` | `layout` | outline | width/height → 24 |
| `C-016-text-frame` | `typography` | outline | width/height → 24 |
| `C-017-flip-transform` | `tools` | outline | width/height → 24 |
| `C-018-adjust-sliders` | `tools` | outline | width/height → 24 |
| `C-019-vector-nodes` | `editing` | outline | width/height → 24 |
| `C-020-path-pencil` | `editing` | outline | scaled ×1.1609 (outer 17.4362 → 20) · width/height → 24 |
| `C-021-shape-union` | `tools` | outline | width/height → 24 |
| `C-022-expand-cross-arrows` | `arrow-diagonal` | outline | width/height → 24 |
| `C-023-edit-selection` | `tools` | outline | width/height → 24 |
| `C-024-text-tool` | `typography` | outline | width/height → 24 |
| `C-025-pen-nib` | `editing` | outline | width/height → 24 |
| `C-026-lasso-select` | `tools` | outline | width/height → 24 |
| `C-027-spray-can` | `editing` | outline | scaled ×1.1385 (outer 17.75 → 20) · width/height → 24 |
| `C-028-search-zoom` | `singletons` | outline | width/height → 24 |
| `C-029-magic-wand` | `editing` | outline | width/height → 24 |
| `C-030-eyedropper` | `tools` | outline | width/height → 24 |
| `C-031-bezier-pen-handles` | `editing` | outline | width/height → 24 |
| `C-032-3d-cube` | `tools` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-033-rgb-circles` | `tools` | outline | width/height → 24 |
| `C-034-cmyk` | `tools` | outline | width/height → 24 |
| `C-035-eraser` | `editing` | outline | scaled ×1.1741 (outer 17.2564 → 20) · width/height → 24 |
| `C-036-brush` | `editing` | outline | scaled ×1.0985 (outer 18.3417 → 20) · width/height → 24 |
| `C-037-select-area` | `tools` | outline | width/height → 24 |
| `C-038-crop` | `tools` | outline | width/height → 24 |
| `C-039-swatch-book` | `tools` | outline | width/height → 24 |
| `C-040-drawing-tablet` | `device` | outline | width/height → 24 |
| `C-041-ruler` | `tools` | outline | width/height → 24 |
| `C-042-design-file` | `files` | mixed | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-043-scissors` | `tools` | outline | width/height → 24 |
| `C-044-idea-bulb` | `misc` | outline | width/height → 24 |
| `C-045-craft-knife` | `tools` | outline | scaled ×1.0819 (outer 18.6 → 20) · centred (off 0.05, 1.6) · width/height → 24 |
| `C-046-compass` | `tools` | outline | width/height → 24 |
| `C-047-image-frame` | `files` | mixed | width/height → 24 |
| `C-048-paint-bucket` | `tools` | mixed | width/height → 24 |
| `C-049-ruler-pencil` | `editing` | mixed | width/height → 24 |
| `C-050-3d-axes` | `tools` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-051-easel-artboard` | `device` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-052-edit-image` | `files` | outline | scaled ×1.0913 (outer 18.453 → 20) · width/height → 24 |
| `C-053-text-box` | `typography` | outline | width/height → 24 |
| `C-054-idea-bulb` | `misc` | outline | width/height → 24 |
| `C-055-layers` | `layout` | outline | width/height → 24 |
| `C-056-colour-swatches` | `tools` | mixed | mask construction kept as drawn — not fitted (needs a flat redraw) · width/height → 24 |
| `C-057-compass` | `tools` | mixed | scaled ×0.9893 (outer 20.2 → 20) · width/height → 24 |
| `C-058-select-cursor` | `tools` | outline | width/height → 24 |
| `C-059-pen-tool` | `editing` | outline | width/height → 24 |
| `C-060-3d-rotate` | `tools` | outline | width/height → 24 |
| `C-061-easel` | `device` | outline | width/height → 24 |
| `C-062-layers` | `layout` | outline | width/height → 24 |
| `C-063-palette-brush` | `tools` | outline | width/height → 24 |
| `C-064-calendar` | `time` | mixed | width/height → 24 |
| `C-065-clock` | `time` | mixed | scaled ×0.925 (outer 21.5 → 20) · width/height → 24 |
| `C-066-map-pin` | `place` | outline | width/height → 24 |
| `C-067-hourglass` | `time` | mixed | width/height → 24 |
| `C-068-clock` | `time` | outline | width/height → 24 |
| `C-069-calendar` | `time` | mixed | width/height → 24 |
| `C-070-bell` | `notify` | mixed | width/height → 24 |
| `C-071-stopwatch` | `time` | mixed | scaled ×0.9828 (outer 20.3238 → 20) · width/height → 24 |
| `C-072-alarm-clock` | `time` | mixed | centred (off 0, -0.0531) · width/height → 24 |
| `C-073-route-pins` | `place` | mixed | width/height → 24 |
| `C-074-map` | `place` | mixed | width/height → 24 |
| `C-075-clock` | `time` | outline | width/height → 24 |
| `C-076-clock-ring` | `time` | outline | width/height → 24 |
| `C-077-wall-clock-square` | `time` | outline | width/height → 24 |
| `C-078-calendar-date` | `time` | outline | width/height → 24 |
| `C-079-alarm-clock` | `time` | outline | width/height → 24 |
| `C-080-stopwatch-gauge` | `time` | outline | width/height → 24 |
| `C-081-dashed-clock` | `time` | outline | width/height → 24 |
| `C-082-clock-gear` | `time` | outline | width/height → 24 |
| `C-083-watch` | `time` | outline | width/height → 24 |
| `C-084-fast-stopwatch` | `time` | outline | width/height → 24 |
| `C-085-clock-cycle` | `time` | outline | width/height → 24 |
| `C-086-person-clock` | `time` | outline | centred (off -0.0031, -0.165) · width/height → 24 |
| `C-087-hourglass-round` | `time` | mixed | width/height → 24 |
| `C-088-24-h-clock` | `time` | outline | width/height → 24 |
| `C-089-gauge-timer` | `time` | outline | width/height → 24 |
| `C-090-watch-24` | `time` | outline | width/height → 24 |
| `C-091-bell-ringing` | `notify` | outline | scaled ×0.9893 (outer 20.2 → 20) · centred (off 0, -0.625) · width/height → 24 |
| `C-092-clock-dashed` | `time` | outline | width/height → 24 |
| `C-093-fast-clock` | `time` | outline | width/height → 24 |
| `C-094-calendar-clock` | `time` | outline | width/height → 24 |
| `C-095-time-zones` | `time` | outline | width/height → 24 |
| `C-096-globe-clock` | `time` | outline | width/height → 24 |
| `C-097-24-h-refresh` | `time` | outline | width/height → 24 |
| `C-098-hourglass` | `time` | mixed | width/height → 24 |
| `C-099-route-flag-pin` | `place` | outline | width/height → 24 |
| `C-100-s-route-roadmap` | `place` | mixed | width/height → 24 |
| `C-101-scroll-pen` | `files` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-102-pen-laurel` | `editing` | mixed | width/height → 24 |
| `C-103-idea-pencil` | `editing` | outline | width/height → 24 |
| `C-104-pen-nib-writing` | `editing` | outline | scaled ×1.2333 (outer 16.5 → 20) · width/height → 24 |
| `C-105-file-pen` | `files` | outline | scaled ×1.0971 (outer 16.54 → 18) · width/height → 24 |
| `C-106-pen` | `editing` | outline | scaled ×1.0784 (outer 16.8 → 18) · width/height → 24 |
| `C-107-clipboard-pen` | `files` | outline | width/height → 24 |
| `C-108-notepad-pen` | `files` | outline | scaled ×1.1379 (outer 16 → 18) · width/height → 24 |
| `C-109-typewriter` | `device` | outline | width/height → 24 |
| `C-110-quill-signature` | `editing` | outline | scaled ×1.1541 (outer 17.5294 → 20) · width/height → 24 |
| `C-111-book-pen` | `files` | outline | width/height → 24 |
| `C-112-pen-scribble` | `editing` | outline | scaled ×1.1238 (outer 17.9617 → 20) · width/height → 24 |
| `C-113-magic-pen` | `editing` | outline | scaled ×1.1563 (outer 17.5 → 20) · width/height → 24 |
| `C-114-brush` | `editing` | outline | scaled ×1.076 (outer 16.8341 → 18) · width/height → 24 |
| `C-115-file-quill` | `files` | outline | scaled ×1.068 (outer 16.95 → 18) · width/height → 24 |
| `C-116-fountain-pen` | `editing` | outline | scaled ×1.1325 (outer 16.07 → 18) · width/height → 24 |
| `C-117-bento-grid` | `layout` | outline | width/height → 24 |
| `C-118-app-squares` | `layout` | mixed | width/height → 24 |
| `C-119-bars-line` | `chart` | outline | width/height → 24 |
| `C-120-gauge` | `chart` | outline | width/height → 24 |
| `C-121-dashboard-tile` | `layout` | outline | width/height → 24 |
| `C-122-bars-trend-arrow` | `chart` | outline | width/height → 24 |
| `C-123-monitor-chart` | `chart` | outline | width/height → 24 |
| `C-124-database-cycle` | `data` | outline | width/height → 24 |
| `C-125-server-bars` | `data` | outline | width/height → 24 |
| `C-126-database-network` | `data` | outline | width/height → 24 |
| `C-127-report-gear` | `files` | outline | width/height → 24 |
| `C-128-database-globe` | `data` | outline | width/height → 24 |
| `C-129-database-refresh` | `data` | outline | width/height → 24 |
| `C-130-line-chart` | `chart` | outline | width/height → 24 |
| `C-131-globe-search` | `singletons` | outline | scaled ×1.051 (outer 17.2 → 18) · width/height → 24 |
| `C-132-venn-circles` | `tools` | outline | width/height → 24 |
| `C-133-cycle-chart` | `chart` | outline | scaled ×1.055 (outer 17.14 → 18) · width/height → 24 |
| `C-134-trend-search` | `chart` | outline | scaled ×1.0632 (outer 18.9 → 20) · width/height → 24 |
| `C-135-donut-chart` | `chart` | outline | width/height → 24 |
| `C-136-database-hex` | `data` | outline | width/height → 24 |
| `C-137-phone-chart` | `chart` | outline | width/height → 24 |
| `C-138-cloud-apps` | `data` | outline | width/height → 24 |
| `C-139-search-gear` | `singletons` | outline | width/height → 24 |
| `C-140-bars-pie` | `chart` | outline | width/height → 24 |
| `C-141-gear-network` | `data` | outline | width/height → 24 |
| `C-142-target-refresh` | `tools` | outline | width/height → 24 |
| `C-143-checklist` | `files` | outline | width/height → 24 |
| `C-144-block-diagram` | `layout` | outline | width/height → 24 |
| `C-145-hand-gear` | `misc` | outline | width/height → 24 |
| `C-146-cloud-gear` | `data` | outline | width/height → 24 |
| `C-147-database` | `data` | outline | width/height → 24 |
| `C-148-bars-search` | `chart` | outline | width/height → 24 |
| `C-149-search` | `singletons` | outline | width/height → 24 |
| `C-150-server` | `data` | outline | width/height → 24 |
| `C-151-growth-bars` | `chart` | outline | width/height → 24 |
| `C-152-folder-tree` | `files` | outline | width/height → 24 |
| `C-153-cart-load` | `misc` | outline | width/height → 24 |
| `C-154-donut-ring` | `chart` | outline | width/height → 24 |
| `C-155-data-network` | `data` | outline | width/height → 24 |
| `C-156-cloud-monitor` | `data` | outline | width/height → 24 |
| `C-157-pie-search` | `chart` | outline | width/height → 24 |
| `C-158-hierarchy` | `data` | outline | width/height → 24 |
| `C-159-server-rack` | `data` | outline | width/height → 24 |
| `C-160-crosshair` | `tools` | outline | width/height → 24 |
| `C-161-power` | `singletons` | outline | scaled ×1.1213 (outer 17.9987 → 20) · width/height → 24 |
| `C-162-pie-chart` | `chart` | outline | width/height → 24 |
| `C-163-line-chart` | `chart` | outline | width/height → 24 |
| `C-164-monitor-pie` | `chart` | outline | scaled ×1.1212 (outer 18 → 20) · width/height → 24 |
| `C-165-podium` | `misc` | outline | width/height → 24 |
| `C-166-funnel` | `singletons` | outline | scaled ×1.085 (outer 18.55 → 20) · width/height → 24 |
| `C-167-head-gear` | `misc` | outline | width/height → 24 |
| `C-168-file-check` | `files` | outline | width/height → 24 |
| `C-169-network-star` | `data` | outline | width/height → 24 |
| `C-170-nodes` | `data` | outline | width/height → 24 |
| `C-171-workflow-circle` | `data` | outline | width/height → 24 |
| `C-172-flow-arrows` | `data` | outline | width/height → 24 |
| `C-173-gear-cycle` | `nav` | outline | width/height → 24 |
| `C-174-server-gear` | `data` | outline | width/height → 24 |
| `C-175-user-target` | `nav` | outline | width/height → 24 |
| `C-176-layers` | `layout` | outline | scaled ×1.1151 (outer 18.09 → 20) · width/height → 24 |
| `C-177-document` | `files` | outline | width/height → 24 |
| `C-178-search-graph` | `chart` | outline | width/height → 24 |
| `C-179-clipboard-pie` | `files` | outline | width/height → 24 |
| `C-180-gear` | `nav` | outline | width/height → 24 |
| `C-181-report-chart` | `files` | outline | width/height → 24 |
| `C-182-growth-bars-arrow` | `chart` | outline | width/height → 24 |
| `C-183-pen-tool` | `editing` | outline | width/height → 24 |
| `C-184-network` | `data` | outline | width/height → 24 |
| `C-185-compass` | `place` | outline | width/height → 24 |
| `C-186-skull` | `misc` | outline | scaled ×1.0819 (outer 18.6 → 20) · width/height → 24 |
| `C-187-pilcrow` | `typography` | outline | scaled ×1.2847 (outer 15.9 → 20) · width/height → 24 |
| `C-188-package-open` | `misc` | outline | width/height → 24 |
| `C-189-audio-waveform` | `playback` | outline | width/height → 24 |
| `C-190-concierge-bell` | `misc` | outline | width/height → 24 |
| `C-191-database-zap` | `data` | outline | width/height → 24 |
| `C-192-bird` | `misc` | outline | width/height → 24 |
| `C-193-heading-6` | `typography` | outline | scaled ×1.2092 (outer 16.8 → 20) · width/height → 24 |
| `C-194-slice` | `tools` | outline | width/height → 24 |
| `C-195-award` | `misc` | outline | width/height → 24 |
| `C-196-timer-reset` | `time` | outline | width/height → 24 |
| `C-197-air-vent` | `misc` | outline | width/height → 24 |
| `C-198-diameter` | `tools` | outline | width/height → 24 |
| `C-199-circle-arrow-out-up-right` | `arrow-diagonal` | outline | width/height → 24 |
| `C-200-folders` | `files` | outline | width/height → 24 |
| `C-201-antenna` | `device` | outline | width/height → 24 |
| `C-202-paint-bucket` | `tools` | outline | width/height → 24 |
| `C-203-hand-metal` | `misc` | outline | width/height → 24 |
| `C-204-scale` | `misc` | outline | width/height → 24 |
| `C-205-paint-roller` | `tools` | outline | width/height → 24 |
| `C-206-image-minus` | `files` | outline | width/height → 24 |
| `C-207-link` | `notify` | outline | width/height → 24 |
| `C-208-heart-handshake` | `misc` | outline | width/height → 24 |
| `C-209-film` | `files` | outline | width/height → 24 |
| `C-210-square-pen` | `editing` | outline | width/height → 24 |
| `C-211-cpu` | `device` | outline | width/height → 24 |
| `C-212-triangle-alert` | `singletons` | outline | width/height → 24 |
| `C-213-handshake` | `misc` | outline | width/height → 24 |
| `C-214-presentation` | `files` | outline | width/height → 24 |
| `C-215-receipt` | `files` | outline | width/height → 24 |
| `C-216-palette` | `tools` | mixed | width/height → 24 |
| `C-217-clipboard-pen-line` | `files` | outline | width/height → 24 |
| `C-218-book-open` | `files` | outline | width/height → 24 |
| `C-219-medal` | `misc` | outline | width/height → 24 |
| `C-220-swatch-book` | `tools` | outline | width/height → 24 |
| `C-221-alarm-clock-plus` | `time` | outline | width/height → 24 |
| `C-222-trophy` | `misc` | outline | width/height → 24 |
| `C-223-send` | `transfer` | outline | width/height → 24 |
| `C-224-alarm-smoke` | `notify` | outline | width/height → 24 |
| `C-225-snail` | `misc` | outline | width/height → 24 |
| `C-226-cake` | `misc` | outline | width/height → 24 |
| `C-227-layout-dashboard` | `layout` | outline | width/height → 24 |
| `C-228-fish` | `misc` | outline | width/height → 24 |
| `C-229-drafting-compass` | `tools` | outline | width/height → 24 |
| `C-230-sword` | `misc` | outline | width/height → 24 |
| `C-231-cctv` | `device` | outline | scaled ×1.0607 (outer 18.9419 → 20) · width/height → 24 |
| `C-232-brain` | `misc` | outline | width/height → 24 |
| `C-233-chrome` | `misc` | outline | width/height → 24 |
| `C-234-utensils-crossed` | `misc` | outline | width/height → 24 |
| `C-235-brain-circuit` | `misc` | outline | width/height → 24 |
| `C-236-brain-cog` | `misc` | outline | width/height → 24 |
| `C-237-syringe` | `misc` | outline | width/height → 24 |
| `C-238-plug-2` | `device` | outline | width/height → 24 |
| `C-239-orbit` | `data` | outline | width/height → 24 |
| `C-240-candy-cane` | `misc` | outline | width/height → 24 |
| `C-241-dices` | `misc` | outline | width/height → 24 |
| `C-242-circle-user` | `nav` | outline | width/height → 24 |
| `C-243-layout-template` | `layout` | outline | width/height → 24 |
| `C-244-tent` | `misc` | outline | width/height → 24 |
| `C-245-siren` | `notify` | outline | width/height → 24 |
| `C-246-wand-sparkles` | `editing` | outline | width/height → 24 |
| `C-247-git-pull-request-closed` | `code` | outline | width/height → 24 |
| `C-248-sparkles` | `editing` | outline | width/height → 24 |
| `C-249-table-cells-merge` | `layout` | outline | width/height → 24 |
| `C-250-hourglass` | `time` | outline | width/height → 24 |
| `C-251-radar` | `chart` | outline | width/height → 24 |
| `C-252-cloud-rain` | `shape-forms` | outline | width/height → 24 |

## Set name collisions

17 treated icons share a name with a glyph in the set today: `A-calendar` · `C-004-pen-nib` · `C-009-camera` · `C-025-pen-nib` · `C-038-crop` · `C-055-layers` · `C-062-layers` · `C-064-calendar` · `C-069-calendar` · `C-070-bell` · `C-071-stopwatch` · `C-106-pen` · `C-147-database` · `C-149-search` · `C-176-layers` · `C-218-book-open` · `C-222-trophy`


## 6. Categories v2 — the six Figma frames (2026-10-31)

The user's ruling: six categories, read from his frames in `library--kol-icon` (91RgXQdroY01wN96lAiOv1, page `more icons refs` 151:1760, read-only). Map: `categories-v2.json` (`{ name, category, frame, figmaNode }` per frame icon, in frame order; `name: null` = no treated file). A treated file in none of the six is `other`.

| Category | Frame (node) | Frame icons | Matched to a treated file | Treated files | Unmatched |
|---|---|--:|--:|--:|--:|
| `flow-connect` | `_flow` (174:23061) | 103 | 72 | 45 | 31 |
| `faders` | `_control` (174:22871) | 14 | 5 | 5 | 9 |
| `code` | `_code` (174:22815) | 11 | 1 | 1 | 10 |
| `input` | `_input` (174:22996) | 20 | 7 | 6 | 13 |
| `nav` | `_nav-01` (174:24781) | 127 | 54 | 51 | 73 |
| `shape-design` | `_design` (174:23376) + `_shape` (174:24239) | 121 + 51 | 57 + 14 | 61 | 101 |
| `other` | — | — | — | 395 | — |
| | **total** | **447** | **210** | **559** | **237** |

Frames 174:23061 · 174:22871 · 174:22815 · 174:22996 sit in `Frame 1000003784` (174:25330); `faders` is the frame named `_control`.

**How matched.** Layer names are mostly `Property N` / `Variant N`, so every variant was exported as SVG (Figma REST, read-only) and compared as a raster against all 559 treated files; every pair at 0.75+ was then checked by eye (`_tmp/2026-10-31-icon-page/figma-v2/sheet-*.png`). All 164 A files (kol-atlas) match a frame icon; one C file (`C-207-link`) does; no B file does.

**Unmatched (237).** Frame icons with no treated file. About 70 look already shipped in kol-icon-set (raster ≥ 0.95 against `packages/icons`, not eye-checked: `_code`'s terminal · code · code-simple · bug · hash; `_nav-01`'s message · email · home · eye-off · shield-check; `_design`'s highlighter-circle · pen-nib · pushpin · eyedrop · copy · scribble …). The rest are in neither — mostly the heroicons-style `_nav-01` rows (annotation, cog, trash, users, search, upload, camera …), the `_input` pencils / layers / lists, `_control`'s three plain faders, and `_design`'s Align* · Crop · Scissors · StackSimple. Node ids per frame in `categories-v2.json` (`name: null`).

**More than one file.** 7 frame icons tie between two treated files: `A-kanban` = `A-kanban-02` (identical files; 174:23035, 174:23821) · `A-select-frame` / `A-select-frame-02` (174:23835, 174:24258, 174:24491) · `A-cube-dashed` / `A-cube-dashed-02` (174:24326, 174:24715). The map takes the first.

**One file, several frame icons.** 37 treated files appear more than once across the frames (the frames repeat a glyph in a second weight or in a second frame). Five span two categories — `A-orbit` · `A-hex-nut` · `A-select-frame-02` (flow-connect + shape-design), `A-kanban-02` · `A-split` (input + shape-design); a file takes the first category in the order flow-connect · faders · code · input · nav · shape-design.

## 7. Set groups and his taxonomy (2026-10-31)

Two more facets per treated icon in `icon-treatment.json`: `setGroup` — the shipped kol-icons folder it fits (`packages/icons/src/kol-icon-set-interface|signal/<group>`), or `none`; `taxonomy` — his group from `3.2 Icon-Sets – Glyphs` (Xxs1JIvAgUERK3VKG96ry7, page 0:1, read-only), with the sub-group where the name tells it.

### His groups

| Group | Node | Sub-groups (his inner clusters) |
|---|---|---|
| Shape | 269:32017 | primitives (square … octagon, line) · symbols (heart, cross, star, sparkle) · badges (badge, certificate, cogwheel) · moon / cloud / droplet · shields · shapes / venn |
| Arrow | 147:0 | caret / angle / chevron · arrows (line, solid, circle, square, bracket) · curve / turn / repeat / exchange · expand / compress · pointer / send |
| Human | 269:32064 | users · body (skull, brain, heart, eye, lips, ear) · hands · hand-holding · handshake · baby / child / person · gender / restroom · emoji faces · masks |
| Location | 286:24437 | location / target · compass · map / pin / flag / signs · route / road · binoculars · layers |
| Contact | 286:23577 | at / envelope · comment / send · paperclip / inbox / phone · mobile / signal / satellite |
| Alert | 2650:3265 | spinners · exclamation / question / info · life-ring · bell · alarm alerts |
| Editor | 269:32149 | edit / save / trash / copy / paste · align / border · text formatting · quote · heading · link / code / docs |
| File | 286:22071 | calendar / archive / inbox · folder · clipboard / file · note · scroll · image · box |
| Device | 269:32201 | laptop / storage · lightbulb / switch · mobile / watch / camera / audio · monitor / gamepad / mouse / keyboard · plug / printer / battery / robot |
| Business | 269:34884 | analytics / charts · briefcase / money-bag · money / wallet · cards · cart / store · box / discount · receipt / ticket / tag / bag · gift |
| Nature | 269:32318 | trees · leaves / seedlings · plants (apple, mushroom, spa, cannabis) · virus / mold · fire / smoke · camping / boats |
| Transport | 269:37630 | bikes / scooters · cars · vans / trucks · ambulance · bus / train · planes / helicopter / rocket · ships / anchor |
| Game | 269:37736 | cards · crowns · dice · puzzle · gamepad / d-pad · trophy · balls / sports |
| Tool | 269:37737 | hand tools (wrench, screwdriver, hammer, mallet, toolbox, shovel, axe) · cogs |
| Font | 287:22320 | letters · digits · punctuation · math operators (`_Font` 374:124676 holds the alternates) |
| Place | 269:32135 | house · buildings / industry / landmark · globe · street furniture |
| Measure | 286:29348 | clock / alarm · timer · tachometer / speedometer · hourglass · watch · history |
| System | 2650:111 | battery · signal · wifi / volume · pointer · lock / key · cog / power · grid / qr / barcode · columns / layout |
| Interface | 269:32091 | menu / ellipsis / cog · plus / minus / check · search / zoom / target · eye / preview · share · toggle · half-fills · tag / bookmark · filter / sort |
| Design | 286:22822 | pens · pencils · palette · rulers · scissors / stamp · boolean · venn · adjust / exposure / aperture / image · crop / flip · align / distribute · bezier · object select / group · layers · guide |
| Multimedia | 269:32235 | camera / video · headphones · microphone · music / disc · playback · volume · view / sliders / focus · news |
| Education | 269:32256 | books · scroll / certificate · math / calculator / map · globe stand · graduation · bell |
| Weather | 269:32298 | temperature units · sun / moon / bolt / stars · water / wind / waves / fog · thermometer / cloud / rain / snow |
| Home | 269:37588 | door · key / house · furniture · mailbox · garage · window |
| Sign | 269:37728 | restroom / elevator / accessible · hospital · stop / yield / turn / directions · departures / arrivals |
| Medical | 287:22071 | cross / activity / heartbeat · bandage · hospital / ambulance · mask · clipboard · pharmacy / pills · microscope |
| Spiritual | 353:23611 | religious symbols · peace / yin-yang · mushroom / spa / cannabis · church |

### a) His groups with no set group

| His group | Nearest thing in the set today |
|---|---|
| Human | `nav/user` · `nav/users` |
| Place | `nav/globe` · `nav/home-01|02` |
| Location | — |
| Measure | `misc/stopwatch` · `misc/calendar` · `playback/stopwatch-solid` |
| Business | `misc/stat-chart-a` · `misc/trending-up|down` |
| Education | `files/book-open` · `files/library` · `files/journal` |
| Weather | `shape-forms/cloud` · `drop` · `bolt` · `wave` |
| Nature | — |
| Home | `nav/home-*` |
| Transport (vehicles) | — (`signal/transport` is playback, not vehicles) |
| Sign | — |
| Game | `misc/chess-pawn` · `chess-rook` · `crown` · `trophy` |
| Medical | — |
| Spiritual | — |
| Tool (hand tools) | — (`tools` holds design tools) |
| Font (letterforms) | — (`typography` holds text-setting controls) |

### b) Families buried inside a set group

| Host group | Implicit family | Members |
|---|---|---|
| `tools` | align | `align-horizontal-*` · `align-vertical-*` (6) · `space-evenly-*` (2) |
| `tools` | boolean | `boolean-exclude|intersect|subtract|unite` · `overlap` · `mask` |
| `tools` | color | `color-palette` · `color-swatch` · `color-wheel` · `paint-drop` · `eyedrop` · `brightness` · `opacity` |
| `tools` | transform | `flip-*` · `rotate-*` · `crop` · `undo` · `redo` · `swap` |
| `tools` | sliders | `slider-01|02` · `frequency` — with the treated `equalizer*` · `controls-box` · `adjust-sliders` (`faders`) |
| `tools` / `editing` | pens & pencils | `tools/pen` · `editing/pen-nib` · `highlighter-circle` · `scribble` — 42 treated pens / pencils / brushes join them |
| `misc` | charts | `stat-chart-a` · `trending-up|down` — 65 treated charts / hierarchy / network glyphs |
| `misc` | time | `calendar` · `stopwatch` — 37 treated clocks / calendars / hourglasses |
| `misc` | games / awards | `chess-pawn` · `chess-rook` · `crown` · `trophy` |
| `nav` | people | `user` · `users` |
| `nav` | home / settings | `home-01|02` · `nav-home` · `settings-01` · `nav-settings` |
| `files` | media | `image` · `video` · `video-off` · `file-image|audio|video` |
| `files` | books | `book-open` · `journal` · `library` |
| `singletons` | editor actions | `copy` · `cut` · `edit` · `save` · `trash` |
| `singletons` | search / filter | `search` · `filter` · `filter-lines` |
| `typography` | text alignment | `text-align-*` (6) · `text-justify-*` (4) · `text-valign-*` (3) |
| `layout` | resize / panels | `resize-auto-h|w` · `resize-fixed` · `panel-left|right` |
| (treated `flow`) | git | 11 `git-*` · `branch-up` · `flow-branch` (+ `C-247-git-pull-request-closed`) — `flow-connect` |

### c) Set groups → his groups

| Set group | His group | Kind |
|---|---|---|
| `arrow` · `arrow-diagonal` · `caret` · `chevron` · `traffic` · `transfer` | Arrow | merged (6 → 1) |
| `shape-primitives` · `shape-forms` | Shape (+ Weather for cloud / drop / bolt) | merged, then split |
| `tools` | Design (align, boolean, color, transform) · Multimedia (sliders) | split |
| `editing` | Design / pens | one-to-one |
| `components` · `layout` (layers) | Design / object · layers | merged |
| `layout` (grid, columns, rows) | System / layout | split |
| `typography` | Editor / text (+ Font for `type` · `font-01` · `a-framed`) | split |
| `code` | Editor / code | one-to-one |
| `singletons` | Editor (copy, cut, edit, save, trash) · Interface (search, filter, info) · Alert (alert-triangle) | split 3 ways |
| `add-remove` | Interface / plus · minus · check | one-to-one |
| `nav` | Human (user, users) · Home / Place (home, globe) · Interface (hamburger, more) · System (settings) | split 4 ways |
| `notify` | Contact (email, message, attach) · Alert (bell) · System (fingerprint) | split |
| `eye-lock` | Interface (eye) · System (lock) · Shape (shield) | split |
| `files` | File (+ Education for books, Multimedia for video / image) | split |
| `device` | Device | one-to-one |
| `playback` · `signal/transport` | Multimedia / playback | merged |
| `misc` | Measure · Business · Game · Nature … | split, no core |
| `atomic` · `social` · `pattern` · all of `kol-icon-set-signal` | — | no place in his taxonomy |

The taxonomy covers objects and the world (Human, Place, Weather, Transport, Medical …); the set covers interface and tooling and has no groups for any of that. The set's widest groups — `tools`, `misc`, `nav`, `singletons` — are where his taxonomy splits most: each holds three or four of his groups. The treated batch lands mostly in Business (98, charts and money), Design (94) and Shape / System / Measure (~35 each); 12 treated icons fit none of his groups (food and animals: coffee, cake, fish, bird, snail, candy-cane, utensils; plus yarn, broom, air-vent, chrome). `taxonomy` is set by name rules in the generator, so treat it as a first pass.
