# ShortcutsOverlay

- **Package:** `@kolkrabbi/kol-shell`
- **Category:** flat
- **Real-world usages found:** 9 across 9 files in 7 apps
- **Weighted inbound:** 27★ across 9 edges — 9×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-draw-3d/src/App.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/draw-3d/src/App.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/monitor/src/rack/VideoModulo.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/framework/AppShell.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/editor/EditorShell.jsx` |

## Import

```jsx
import { ShortcutsOverlay } from '@kolkrabbi/kol-shell'
```

## Real usage

From `kol-apps/kol-draw-3d/src/App.jsx`:

```jsx
<ShortcutsOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} />
```

From `kol-apps/kol-labs-monorepo/apps/monitor/src/rack/VideoModulo.jsx`:

```jsx
<ShortcutsOverlay onClose={() => setShowShortcuts(false)} />
```

From `kol-apps/kol-client-ac/src/editor/EditorShell.jsx`:

```jsx
<ShortcutsOverlay />
```
