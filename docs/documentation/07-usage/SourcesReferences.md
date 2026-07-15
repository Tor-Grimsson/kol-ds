# SourcesReferences

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { SourcesReferences } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/WorkDetail.jsx`:

```jsx
<SourcesReferences
                    title=""
                    sources={project.links.map((link) => ({ title: link.label, href: link.url, note: link.url }))}
                  />
```
