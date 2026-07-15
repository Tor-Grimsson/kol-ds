# Table

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 132 across 41 files in 12 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { Table } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/pages/Reference.jsx`:

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

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx`:

```jsx
<Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
        />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/GameArchiveTable.jsx`:

```jsx
<Table
            caption="Archive of chess games matching current filters"
            columns={columns}
            rows={tableRows}
          />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/TablePreview.jsx`:

```jsx
<Table
            caption="Page surface tokens"
            columns={sampleColumns}
            rows={sampleRows}
          />
```

From `kol-website/apps/web/src/components/workshop/molecules/TablePreview.jsx`:

```jsx
<Table
          caption="Page surface tokens"
          columns={sampleColumns}
          rows={sampleRows}
        />
```
