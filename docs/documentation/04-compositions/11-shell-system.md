---
title: Shell system
type: reference
status: canonical
created: 2026-08-14
updated: 2026-08-14
description: The application shell set — rail plus scaffolds
aliases:
  - shell
  - kol-shell
  - app shell
  - nav rail
sources:
  - packages/shell/src/index.js
  - packages/shell/README.md
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[02-shells|reference shells]]"
  - "[[09-dashboards-system|dashboards system]]"
---

# Shell system — `@kolkrabbi/kol-shell`

The **application** shell set — the fixed 48px NavRail, the AppShell layout
root, and the page scaffolds an app is built from. Lifted 2026-08-14 from the
hand-copied twins in kol-monitor ("Monitor") and kol-mirror ("Hall of
Mirrors"), whose copies had already drifted (shared dead import, shared
light-theme `GridCard` border bug, the same active-state ruling implemented
two different ways, twice-maintained shortcut lists disagreeing in both).

**App chrome vs site chrome.** kol-framework owns the site register — its
`SideNav` takes a two-level `navTree`. The shell rail is deliberately flat
`{ icon, path, label }`. Different components, not variants; do not merge.

```js
import {
  AppShell, NavRail, useNavHidden,
  PageShell, PageBleed, PageHeader,
  ContentFilters, TabStrip, GridCard,
  SettingsScaffold, SettingsSection, LabelRow,
  WalkthroughPanel, ShortcutsOverlay, Logomark,
} from '@kolkrabbi/kol-shell'
```

## Contracts

- **Router-agnostic** — `currentPath` + `onNavigate` props; render the
  router's element as children. No react-router dependency.
- **Icons** — resolved through the consumer's registry via Button's
  `iconComponent` seam; `ContentFilters` needs `filter` + `search` (in the DS
  set; the seam accepts any renderer).
- **Chrome in kol-theme** — `kol-components-shell.css` (theme ≥0.41.0):
  `--kol-shell-rail-width` (48px, read by rail AND content offset),
  `--kol-shell-page-pad` (48px), `.kol-shell-rail` at the `--kol-z-sticky`
  tier, `.kol-shell-card-preview--{natural|compact|cover}`.
- **Rail active state (user ruling 2026-08-12), carried natively:** ink
  `--kol-oq-96` in every state; hover = the `--kol-oq-04` wash; active route =
  that wash **held on**, keyed off `aria-current="page"`. Never
  `selected`/`pressed` — navigation is location, not a toggled tool. Scoped to
  `.kol-shell-rail`; the global `.kol-btn-nav[aria-current]` brightness-only
  rule (0.11.7) remains the site-nav law.
- **Grid geometry (documented default):** catalog grid = `repeat(6, 1fr)`
  gap 24 · list = `repeat(4, 1fr)` gap 8.
- **Shortcuts single-source:** one consumer array feeds both
  `ShortcutsOverlay` and the settings page's `LabelRow` map.
- **`useNavHidden`** — load-bearing seam: full-bleed routes (monitor's rack,
  mirror's studio) hide the rail at runtime and render their own nav header.

## Stays per-app

Domain surfaces (rack, studio, detail pages), accent bindings, product names,
logomark files, nav arrays, walkthrough/shortcut/settings **content**,
touch-device gates. Data and copy are consumer-injected — the set never
fetches.
