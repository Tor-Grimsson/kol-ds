# ContentFilters

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 12 across 12 files in 4 apps
- **Weighted inbound:** 36★ across 12 edges — 12×3★
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/site/Shop.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CollectionFiltersPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/pages/Icons.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/pages/IconsVariants.jsx` |
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/pages/Icons.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-triage-elder/pages/IconsVariants.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/organisms/CollectionFiltersPreview.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/TypefaceLibraryGridWithVariables.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Stack.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { ContentFilters } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/pages/site/Shop.jsx`:

```jsx
<ContentFilters
          items={products}
          title="Shop"
          totalCount={products.length}
          filterGroups={FILTER_GROUPS}
          searchKeys={['name', 'type', 'print']}
          renderItem={(filteredItems) => <ShopGrid items={filteredItems} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CollectionFiltersPreview.jsx`:

```jsx
<ContentFilters
          items={sampleItems}
          title="Sample Collection"
          totalCount={sampleItems.length}
          filterGroups={filterGroups}
          renderItem={renderItems}
        />
```

From `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx`:

```jsx
<ContentFilters
            items={shuffledPrints}
            title="All Prints"
            totalCount={prints.length}
            filterGroups={filterGroups}
            renderItem={renderPrints}
          />
```

From `kol-website/_tmp/brand-triage-elder/pages/Icons.jsx`:

```jsx
<ContentFilters
        items={iconEntries}
        title="Icons"
        totalCount={iconEntries.length}
        filterGroups={filterGroups}
        renderItem={renderItems}
        searchKeys={['name', 'folder']}
        viewModeOptions={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
        ]}
        defaultViewMode="grid"
        showCountOnlyWhenFiltering
      />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Icons.jsx`:

```jsx
<ContentFilters
        items={loaderEntries}
        title="Icons"
        totalCount={loaderEntries.length}
        filterGroups={filterGroups}
        renderItem={renderItems}
        searchKeys={['name', 'folder']}
        viewModeOptions={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
        ]}
        defaultViewMode="grid"
        showCountOnlyWhenFiltering
      />
```
