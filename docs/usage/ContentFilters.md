# ContentFilters

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 5 across 5 files in 3 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-monitor

## Import

```jsx
import { ContentFilters } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-video/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx`:

```jsx
<ContentFilters
            items={shuffledPrints}
            title="All Prints"
            totalCount={prints.length}
            filterGroups={filterGroups}
            renderItem={renderPrints}
          />
```

From `kol-client/kol-client-ac/src/pages/site/Shop.jsx`:

```jsx
<ContentFilters
          items={products}
          title="Shop"
          totalCount={products.length}
          filterGroups={FILTER_GROUPS}
          searchKeys={['name', 'type', 'print']}
          renderItem={(filteredItems) => <ShopGrid items={filteredItems} />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CollectionFiltersPreview.jsx`:

```jsx
<ContentFilters
          items={sampleItems}
          title="Sample Collection"
          totalCount={sampleItems.length}
          filterGroups={filterGroups}
          renderItem={renderItems}
        />
```

From `kol-client/kol-client-kolkrabbi/src/pages/Icons.jsx`:

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

From `kol-client/kol-client-kolkrabbi/src/pages/IconsVariants.jsx`:

```jsx
<ContentFilters
        items={items}
        title="Variants"
        totalCount={items.length}
        filterGroups={filterGroups}
        renderItem={renderItems}
        searchKeys={['name', 'folder']}
        showCountOnlyWhenFiltering
      />
```
