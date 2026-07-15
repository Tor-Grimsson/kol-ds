# DocsHeader

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** docs
- **Real-world usages found:** 15 across 15 files in 3 apps
- **Used in:** kol-docs, kol-docs-md, kol-website

## Import

```jsx
import { DocsHeader } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-apps/kol-docs/src/pages/WikiDatabaseDetail.jsx`:

```jsx
<DocsHeader
        title={database.name}
        subtitle={database.description}
        meta={[
          { label: 'Type', value: database.type },
          { label: 'Owner', value: database.owner },
          { label: 'Updated', value: database.updated }
        ]}
      />
```

From `kol-apps/kol-docs-md/src/pages/WikiDatabasePage.jsx`:

```jsx
<DocsHeader
        title={page.title}
        subtitle={page.subtitle}
        meta={[
          { label: 'Database', value: database.name },
          ...(page.meta || [])
        ]}
      />
```

From `kol-website/apps/web/src/workshop-system/docs/DocumentationReader.jsx`:

```jsx
<DocsHeader title="Document Not Found" subtitle={`Could not find document: ${docId}`} />
```

From `kol-apps/kol-docs/src/pages/WikiDatabases.jsx`:

```jsx
<DocsHeader
        title="Database Hub"
        subtitle="Control room for every structured store feeding the wiki."
        meta={[
          { label: 'Databases', value: `${databases.length}` },
          { label: 'Last sweep', value: 'Mar 24, 2025' }
        ]}
      />
```

From `kol-apps/kol-docs/src/pages/WikiHome.jsx`:

```jsx
<DocsHeader
        title="Kolkrabbi Wiki"
        subtitle="A shared space for design & engineering playbooks."
        meta={[
          { label: 'Status', value: 'In flight' },
          { label: 'Last sweep', value: 'Mar 24, 2025' }
        ]}
      />
```
