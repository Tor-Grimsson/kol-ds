# DropdownTagFilter

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 14 across 10 files in 6 apps
- **Weighted inbound:** 30★ across 10 edges — 10×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/DropdownPreview.jsx` |
| 3 | 2 | `kol-apps/kol-mirror/src/components/styleguide/preview/atoms/DropdownPreview.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/preview/atoms/DropdownPreview.jsx` |
| 3 | 2 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/preview/atoms/DropdownPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/DropdownPreview.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 3 | 1 | `kol-apps/kol-mirror/src/components/styleguide/Components.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/Components.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/atoms/DropdownPreview.jsx` |

## Import

```jsx
import { DropdownTagFilter } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/DropdownPreview.jsx`:

```jsx
<DropdownTagFilter
          options={tagFilterOptions}
          selectedValues={tagFilterSelected}
          onChange={handleTagFilterChange}
        />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/DropdownPreview.jsx`:

```jsx
<DropdownTagFilter
                  options={tagFilterOptions}
                  selectedValues={tagFilterSelected}
                  onChange={handleTagFilterChange}
                  size={bp.id === 'mobile' ? 'sm' : bp.id === 'tablet' ? 'md' : 'lg'}
                />
```

From `kol-apps/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<DropdownTagFilter options={[{value: '1', label: 'Tag 1'}]} />
```
