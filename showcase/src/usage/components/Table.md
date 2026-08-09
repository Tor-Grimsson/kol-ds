# Table

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 131 across 42 files in 12 apps
- **Weighted inbound:** 136★ across 42 edges — 10×4★ · 32×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 14 | `kol-apps/kol-client-ac/src/pages/Acyr.jsx` |
| 4 | 14 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Acyr.jsx` |
| 4 | 14 | `kol-apps/kol-client-kolkrabbi/src/pages/Acyr.jsx` |
| 4 | 12 | `kol-website/_tmp/brand-triage-elder/pages/Kolkrabbi.jsx` |
| 4 | 10 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/Colors.jsx` |
| 4 | 8 | `kol-apps/kol-client-kolkrabbi/src/pages/Reference.jsx` |
| 4 | 6 | `kol-website/apps/brand/src/pages/Reference.jsx` |
| 4 | 5 | `kol-apps/kol-client-ac/src/pages/Reference.jsx` |
| 4 | 5 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx` |
| 4 | 5 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/Typography.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/TablePreview.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/TablePreview.jsx` |
| … | | _30 more_ |

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

From `kol-website/_tmp/workshop-museum-elder/components/workshop/molecules/TablePreview.jsx`:

```jsx
<Table
          caption="Page surface tokens"
          columns={sampleColumns}
          rows={sampleRows}
        />
```
