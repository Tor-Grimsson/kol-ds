# MediaCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-video-editor

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/MediaTab.tsx` |

## Import

```jsx
import { MediaCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/MediaTab.tsx`:

```jsx
<MediaCard
                key={asset.id}
                asset={asset}
                isSelected={previewMediaId === asset.id}
                isUsedInTimeline={usedMediaIds.has(asset.id)}
                onClick={() => setPreviewMedia(asset.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, mediaId: asset.id });
                }}
                onAddToTimeline={() => onAddToTimeline?.(asset, "media")}
              />
```
