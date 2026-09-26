---
title: Consumer findings from the reference clones
type: backlog
status: open
created: 2026-09-26
updated: 2026-09-26
description: Bugs seen in monitor, mirror and fxr while reading them for the Hub — noted, not filed
tags:
  - domain/architecture
  - scope/consumers
related:
  - "[[../playbook/2026-09-26-the-hub|The Hub playbook]]"
---

# Consumer findings from the reference clones

monitor, mirror and fxr were cloned onto the MBP **for reference only** (user, 2026-09-26: nothing is filed to them from here). What turned up while reading them is kept here, to act on from the iMac when the user decides to.

## Open

- **kol-mirror — ContentFilters' search and filter icons are mirror's, not the DS's.** `src/App.jsx` registers every SVG under `src/components/icons/svg/` with `registerIcons`, and a registered name wins over the packaged sets (consumer → v1 → signal, the documented order). Mirror ships its own `02-actions-controls/search.svg` and `filter.svg`, so every ContentFilters row in mirror draws those two instead of the DS glyphs. Fix is mirror-side: retire those two files to `_tmp/` (the rack's `filter-lp/bp/hp/notch` are different names and unaffected).
- **kol-monitor / kol-mirror — on kol-shell 0.40.0**, fxr on 0.56.0. The masthead cluster placement (fixed 2026-09-26 in kol-component's `SectionText`) and the Hub arrive only with a bump.
- **All three — local ⌥-digit handlers.** `AppShell navKeys` now walks the bottom rows (Settings), which was fxr's reason for its local copy; mirror's reason (⌥1 = Home) was already fixed upstream. monitor's tap-⌥-then-digit form is still local-only. Each can drop its handler when it moves onto `AppHub`.
