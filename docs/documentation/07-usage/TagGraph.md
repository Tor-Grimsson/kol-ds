# TagGraph

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** tags
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

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
