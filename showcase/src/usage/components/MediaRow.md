# MediaRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-media-admin, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-media-admin/src/FileList.jsx` |
| 3 | 1 | `kol-website/apps/brand/src/pages/SlideDeckManager.jsx` |

## Import

```jsx
import { MediaRow } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/brand/src/pages/SlideDeckManager.jsx`:

```jsx
<MediaRow
            key={deck.slug}
            thumb={
              <div className="w-full h-full bg-surface-inverse flex items-center justify-center">
                <Icon name="maximize" size={16} className="text-fg-inverse-64" />
```

From `kol-apps/kol-media-admin/src/FileList.jsx`:

```jsx
<MediaRow
                  key={o.key}
                  thumb={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))}
                  name={selectMode ? <p className="kol-mono-12 text-fg-default truncate">{o.displayKey}</p> : renderNameCell(o)}
                  date={formatDate(o.uploaded)}
                  size={formatSize(o.size)}
                  actions={renderActions(o)}
                  selectMode={selectMode}
                  selected={selected.has(o.key)}
                  onSelect={(e) => toggleSelect(idx, o.key, e.shiftKey)}
                />
```
