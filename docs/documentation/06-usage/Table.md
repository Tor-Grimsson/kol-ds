# Table

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 89 across 30 files in 10 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { Table } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/molecules/TablePreview.jsx`:

```jsx
<Table
            caption="Page surface tokens"
            columns={sampleColumns}
            rows={sampleRows}
          />
```

From `kol-client/kol-client-ac/src/pages/Reference.jsx`:

```jsx
<Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
          className="mt-8"
        />
```

From `kol-client/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx`:

```jsx
<Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
        />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/GameArchiveTable.jsx`:

```jsx
<Table
            caption="Archive of chess games matching current filters"
            columns={columns}
            rows={tableRows}
          />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/sections/TypeScaleSection.jsx`:

```jsx
<Table className="kol-table--simple" columns={cols} rows={rows} />
```
