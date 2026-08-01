# SourcesReferences

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 3 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-website/apps/web/src/routes/StackArticle.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/WorkDetail.jsx` |

## Import

```jsx
import { SourcesReferences } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/StackArticle.jsx`:

```jsx
<SourcesReferences
                  title="Sources & References"
                  sources={formatSources(article.sources)}
                />
```

From `kol-website/apps/web/src/routes/WorkDetail.jsx`:

```jsx
<SourcesReferences
                    title=""
                    sources={project.links.map((link) => ({ title: link.label, href: link.url, note: link.url }))}
                  />
```
