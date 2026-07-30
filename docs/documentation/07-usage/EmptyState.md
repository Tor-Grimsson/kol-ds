# EmptyState

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 4 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-docs-noter, kol-video-editor

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-docs-noter/src/pages/Index.tsx` |
| 3 | 1 | `kol-apps/kol-docs-noter/src/components/overviews/OverviewRoot.tsx` |
| 3 | 1 | `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/MediaTab.tsx` |

## Import

```jsx
import { EmptyState } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-docs-noter/src/components/overviews/OverviewRoot.tsx`:

```jsx
<EmptyState
          title="No systems yet"
          description="Create your first system to start organizing your notes."
          action={
            <Button size="sm" className="gap-2" onClick={handleAddSystem}>
              <Plus className="w-3 h-3" />
```

From `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/MediaTab.tsx`:

```jsx
<EmptyState icon={CloudUpload} title="No media imported" description="Import videos, audio, or images to get started" />
```

From `kol-apps/kol-docs-noter/src/pages/Index.tsx`:

```jsx
<EmptyState title="No note open" description="Select a note from the sidebar or create a new one." />
```
