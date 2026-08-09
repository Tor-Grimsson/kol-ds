# Image

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 19 across 11 files in 7 apps
- **Weighted inbound:** 34★ across 11 edges — 1×4★ · 10×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-apps/kol-docs-noter/src/components/vault-system/MigrationWizard.tsx` |
| 3 | 2 | `kol-apps/kol-client/src/components/framework/brand/AssetCarousel.jsx` |
| 3 | 2 | `kol-apps/kol-client-ac/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 2 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 2 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/brand/AssetCarousel.jsx` |
| 3 | 2 | `kol-website/apps/brand/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-docs-noter/src/components/note-editor/standard/Toolbar.tsx` |

## Import

```jsx
import { Image } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/brand/AssetCarousel.jsx`:

```jsx
<Image src={current.src} alt={current.caption ?? current.alt ?? ''} category={category} name={current.caption ?? current.alt} />
```

From `kol-apps/kol-client-ac/src/components/loaders/images/Image.jsx`:

```jsx
<Image category="mocks" name="business-card-bg" />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/AssetCarousel.jsx`:

```jsx
<Image src={src} alt={alt ?? ''} category={category} name={caption ?? alt} />
```

From `kol-apps/kol-docs-noter/src/components/note-editor/standard/Toolbar.tsx`:

```jsx
<Image className="w-4 h-4" />
```

From `kol-apps/kol-docs-noter/src/components/vault-system/MigrationWizard.tsx`:

```jsx
<Image className="w-4 h-4 text-purple-500" />
```
