# SearchInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 8 across 5 files in 2 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellHeader.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/InputPreview.jsx` |
| 3 | 2 | `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/InputPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellSearchOverlay.jsx` |
| 3 | 1 | `kol-website/apps/web/src/workshop-system/shell/WorkshopHeader.jsx` |

## Import

```jsx
import { SearchInput } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellHeader.jsx`:

```jsx
<SearchInput
                value={searchQuery || ''}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search..."
              />
```

From `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/InputPreview.jsx`:

```jsx
<SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
          />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellSearchOverlay.jsx`:

```jsx
<SearchInput
          bare
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          onKeyDown={handleKeyDown}
          autoFocus
        />
```

From `kol-website/apps/web/src/workshop-system/shell/WorkshopHeader.jsx`:

```jsx
<SearchInput
                  className="shrink-0 self-center"
                  aria-label="Search"
                  {...(search === true ? {} : search)}
                />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/InputPreview.jsx`:

```jsx
<SearchInput value={query} onChange={(e) => setQuery(e.target.value)} />
```
