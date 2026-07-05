# MediaRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-media-admin

## Import

```jsx
import { MediaRow } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-plugin/kol-media-admin/src/FileList.jsx`:

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
