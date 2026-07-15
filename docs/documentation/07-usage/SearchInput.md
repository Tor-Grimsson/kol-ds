# SearchInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 8 across 5 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

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

From `kol-website/apps/web/src/components/workshop/molecules/InputPreview.jsx`:

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

From `kol-website/apps/web/src/workshop-system/shell/ShellHeader.jsx`:

```jsx
<SearchInput
                  className="shrink-0 self-center"
                  {...(search === true ? {} : search)}
                />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/InputPreview.jsx`:

```jsx
<SearchInput value={query} onChange={(e) => setQuery(e.target.value)} />
```
