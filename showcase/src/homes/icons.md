---
title: Icons
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: The icon sets and how to use them
tags:
  - domain/foundations
  - domain/iconography
---

# Icons

KOL ships two icon sets in one package, `@kolkrabbi/kol-icons`. Every icon is a single 1.5 stroke on a 24 grid, drawn in the current text color, so it takes whatever ink its parent sets.

| Set | For |
|---|---|
| **Interface** | app and site chrome: navigation, files, layout, playback, type, the editor's tools |
| **Signal** | instruments, racks and generators: waves, cables, filters, logic, sequencing, dither |

## Use one

Ask for an icon by name and give it a size. One name always means one drawing, across both sets.

```jsx
import { Icon } from '@kolkrabbi/kol-icons'

<Icon name="arrow-up" size={16} />
```

## Size

An icon alone in a square button takes the **solo** size: 12, 16, 20 or 24 for xs, sm, md and lg. An icon beside a label takes the **adjacent** size, one step smaller: 10, 14, 16 or 18. The button does not grow with the icon.

## Color

Icons take the opaque ink scale, `text-oq-*`, never the see-through `text-fg-*`: a see-through stroke shows darker where it crosses itself.

## Your own

Register your own SVGs beside the sets. A name you register wins over a shipped one, so check it is new first.

```jsx
import { registerIcons } from '@kolkrabbi/kol-icons'

registerIcons(import.meta.glob('./icons/*.svg', { eager: true, query: '?raw', import: 'default' }))
```

`npx kol-icons audit` lists every icon name a repo uses and whether each one resolves.
