# TagGraph

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** tags
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/docs/TagModeOverlay.jsx` |
| 3 | 1 | `kol-website/apps/web/src/workshop-system/tags/TagModeOverlay.jsx` |

## Import

```jsx
import { TagGraph } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/docs/TagModeOverlay.jsx`:

```jsx
<TagGraph
                  docs={filteredDocs}
                  allDocs={documentationInventory}
                  activeTag={activeTag}
                  onTagClick={(tag) => toggleTag(tag)}
                />
```

From `kol-website/apps/web/src/workshop-system/tags/TagModeOverlay.jsx`:

```jsx
<TagGraph
                  docs={filteredDocs}
                  allDocs={inventory}
                  activeTag={activeTag}
                  onTagClick={(tag) => toggleTag(tag)}
                  tagHref={tagHref}
                />
```
