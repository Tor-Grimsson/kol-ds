# DropdownTagFilter

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 13 across 9 files in 5 apps
- **Used in:** kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { DropdownTagFilter } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/atoms/DropdownPreview.jsx`:

```jsx
<DropdownTagFilter
                  options={tagFilterOptions}
                  selectedValues={tagFilterSelected}
                  onChange={handleTagFilterChange}
                  size={bp.id === 'mobile' ? 'sm' : bp.id === 'tablet' ? 'md' : 'lg'}
                />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/DropdownPreview.jsx`:

```jsx
<DropdownTagFilter
          options={tagFilterOptions}
          selectedValues={tagFilterSelected}
          onChange={handleTagFilterChange}
        />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<DropdownTagFilter options={[{value: '1', label: 'Tag 1'}]} />
```
