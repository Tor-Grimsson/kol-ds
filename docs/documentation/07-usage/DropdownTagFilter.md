# DropdownTagFilter

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 14 across 10 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

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
