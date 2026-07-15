# ContentFilters

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 17 across 17 files in 4 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-monitor, kol-website

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

From `kol-website/apps/brand/src/pages/Icons.jsx`:

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
