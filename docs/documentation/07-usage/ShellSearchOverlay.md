# ShellSearchOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

## Import

```jsx
import { ShellSearchOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx`:

```jsx
<ShellSearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            routes={routes}
            basePath={basePath}
            items={searchItems}
          />
```

From `kol-website/apps/web/src/workshop-system/shell/ShellLayout.jsx`:

```jsx
<ShellSearchOverlay
            open={isSearchOpen}
            onClose={() => { setIsSearchOpen(false); setSearchQuery('') }}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={matchSearchItems(searchItems, searchQuery).map((item) => ({
              id: item.id,
              label: item.label,
              hint: item.matchedHeading || item.matchedKeyword || null,
              group: item.sectionLabel,
            }))}
            onSelect={(item) => {
              const original = searchItems.find((i) => i.id === item.id)
              if (original) navigate(joinPath(original.path))
            }}
          />
```
