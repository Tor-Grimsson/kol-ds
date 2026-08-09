# Figure

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/components/prose/blocks/ImageBlock.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/prose/blocks/VideoBlock.jsx` |

## Import

```jsx
import { Figure } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/components/prose/blocks/ImageBlock.jsx`:

```jsx
<Figure label={label} caption={caption}>
      <SanityImage
        image={value}
        alt={alt || ''}
        className="w-full h-full object-cover"
      />
```

From `kol-website/apps/web/src/components/prose/blocks/VideoBlock.jsx`:

```jsx
<Figure label={value?.label} caption={value?.caption} aspect={embedSrc ? '16/9' : ''}>
      {embedSrc ? (
        <iframe
          src={embedSrc}
          title={value?.label || value?.caption || 'Embedded video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
```
