---
title: Custom icons
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: Bring-your-own, and the promotion loop
tags:
  - domain/iconography
  - audience/consumer
related:
  - "[[INDEX|icons]]"
---

# Custom icons

Registering per-repo icons, what happened to the legacy trees, and how an icon is promoted into the set.

## Custom icons

The package ships the *small* shared set; each consumer repo registers the extra icons it needs from its own folder — so no repo pulls hundreds of icons it never uses.

```js
import { registerIcons } from '@kolkrabbi/kol-icons'
// once, at app boot — runs in YOUR source (import.meta.glob is compile-time + path-relative)
registerIcons(import.meta.glob('./icons/**/*.svg', { eager: true, query: '?raw', import: 'default' }))
```

Registered icons are keyed by filename, **win over the packaged set** (add *or* override), and render synchronously. Author them with `currentColor`.

## Legacy

The legacy trees (stroke / solid / svg / svg-web, ~1,900 SVGs) were **removed from the package in 0.8.0** (user ruling 2026-07-28: audience-of-one repos break-and-fix, no compat layer). The editable local shelf is **`_tmp/legacy-icons/`** in this repo (gitignored, this machine only). Downstream repo breaks on a dead name → grab the SVG from the shelf, drop it in that repo's own icons folder, `registerIcons()` picks it up — and if a glyph keeps earning hotfixes, promote it into v1 here instead.

## Promotion loop

Icons flow both ways, keeping the shared set clean while every repo stays lean:

- **⬇ down** — a repo consumes the shared set and `registerIcons` its own locals.
- **⬆ up** — when a local icon earns a place in the shared set, `/kol-lobby-icon` promotes it: **clean** (currentColor, strip export junk, normalise the name), **check** (stroke-weight, keyline fit, false/expanded stroke, name collision), then drop it into `kol-icon-set` under a group.
