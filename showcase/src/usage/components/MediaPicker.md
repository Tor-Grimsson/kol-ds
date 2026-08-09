# MediaPicker

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 7 across 7 files in 1 apps
- **Weighted inbound:** 21★ across 7 edges — 7×3★
- **Used in:** kol-labs-single

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/glass/GlassPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/gradient/abstract/AbstractDitherPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/optic/halftone/HalftonePage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/optic/moire/MoirePage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/optic/reaction/ReactionPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/radar/components/LibrarySourceButton.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/radar/components/SourcePlaceholder.jsx` |

## Import

```jsx
import { MediaPicker } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-labs-single/src/pages/radar/components/LibrarySourceButton.jsx`:

```jsx
<MediaPicker
        open={open}
        accept={accept}
        onClose={() => setOpen(false)}
        onPick={(url, o) => loadImageFromUrl(url, o?.contentType)}
      />
```

From `kol-apps/kol-labs-single/src/pages/radar/components/SourcePlaceholder.jsx`:

```jsx
<MediaPicker
        open={open}
        accept="all"
        onClose={() => setOpen(false)}
        onPick={(url, o) => pick?.(url, o?.contentType)}
      />
```

From `kol-apps/kol-labs-single/src/pages/glass/GlassPage.jsx`:

```jsx
<MediaPicker open={pickerOpen} accept="all" onClose={() => setPickerOpen(false)} onPick={(url, o) => { loadImageFromUrl(url, o?.contentType); setPickerOpen(false) }} />
```

From `kol-apps/kol-labs-single/src/pages/gradient/abstract/AbstractDitherPage.jsx`:

```jsx
<MediaPicker open={pickerOpen} accept="image" onClose={() => setPickerOpen(false)} onPick={(url, o) => { loadImageFromUrl(url, o?.contentType); setPickerOpen(false) }} />
```
