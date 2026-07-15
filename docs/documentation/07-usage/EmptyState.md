# EmptyState

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 4 across 3 files in 2 apps
- **Used in:** kol-docs-noter, kol-video-editor

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
