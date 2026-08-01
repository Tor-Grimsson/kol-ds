# MediaCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-media-admin, kol-video-editor

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-media-admin/src/FileList.jsx` |
| 3 | 1 | `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/MediaTab.tsx` |

## Import

```jsx
import { MediaCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-media-admin/src/FileList.jsx`:

```jsx
<MediaCard
                  key={o.key}
                  thumb={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))}
                  name={selectMode ? <p className="kol-mono-12 text-fg-default truncate">{o.displayKey}</p> : renderNameCell(o)}
                  meta={`${formatSize(o.size)} · ${formatDate(o.uploaded)}`}
                  actions={renderActions(o)}
                  downloadHref={downloadUrl(o.key)}
                  selectMode={selectMode}
                  selected={selected.has(o.key)}
                  onSelect={(e) => toggleSelect(idx, o.key, e.shiftKey)}
                />
```

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
