# Image

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 19 across 11 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-editor, kol-website

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
