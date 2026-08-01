# EditorShell

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 20 across 20 files in 5 apps
- **Weighted inbound:** 60★ across 20 edges — 20×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/compose/Compose.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/palette/ComboLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/pattern/PatternLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/type/TypeLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/compose/Compose.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/palette/ComboLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/pattern/PatternLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/palette/ComboLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/pattern/PatternLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/modes/type/TypeLab.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/pages/Compose.jsx` |
| … | | _8 more_ |

## Import

```jsx
import { EditorShell } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/modes/compose/Compose.jsx`:

```jsx
<EditorShell registry={COMPOSE_REGISTRY} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/palette/ComboLab.jsx`:

```jsx
<EditorShell registry={PALETTE_REGISTRY} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/modes/pattern/PatternLab.jsx`:

```jsx
<EditorShell registry={PATTERN_REGISTRY} />
```

From `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/type/TypeLab.jsx`:

```jsx
<EditorShell registry={TYPE_REGISTRY} />
```
