# DocsArticle

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** docs
- **Real-world usages found:** 19 across 13 files in 4 apps
- **Used in:** kol-client-kolkrabbi, kol-docs, kol-docs-md, kol-website

## Import

```jsx
import { DocsArticle } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/docs/TagModeOverlay.jsx`:

```jsx
<DocsArticle>
      <div className="max-w-[864px] mx-auto">
        <div className="flex items-center justify-start gap-1 mb-3">
          {hasFilters && (
            <button
              type="button"
              className="shell-sidebar-action"
              style={{ width: 'auto' }}
              onClick={() => setViewMode(viewMode === 'graph' ? 'list' : 'graph')}
            >
              <Icon name={viewMode === 'graph' ? 'list' : 'share-2'} size={14} />
```

From `kol-apps/kol-docs/src/pages/WikiComposer.jsx`:

```jsx
<DocsArticle id="composer-preview" className="wiki-article-section space-y-5">
        <p className="wiki-section-label">Live Preview</p>
        <WikiBlockRenderer blocks={blocks} />
```

From `kol-apps/kol-docs-md/src/pages/WikiDatabasePage.jsx`:

```jsx
<DocsArticle className="wiki-article-section space-y-5">
        <p className="wiki-section-label">Page content</p>
        <WikiBlockRenderer blocks={page.blocks} />
```

From `kol-website/apps/web/src/workshop-system/docs/DocumentationReader.jsx`:

```jsx
<DocsArticle>
        <DocsFrontmatter metadata={doc.metadata} docId={docId} />
```

From `kol-apps/kol-docs/src/pages/WikiComposer.jsx`:

```jsx
<DocsArticle id="composer-editor" className="wiki-article-section space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label text-auto">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded border border-fg-08 bg-surface-primary text-auto px-4 py-2 text-base"
            />
```
