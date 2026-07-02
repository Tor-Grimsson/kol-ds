# Image

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 13 across 7 files in 5 apps
- **Used in:** kol-client, kol-client-ac, kol-client-kolkrabbi, kol-editor, kol-noter

## Import

```jsx
import { Image } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/brand/AssetCarousel.jsx`:

```jsx
<Image src={current.src} alt={current.caption ?? current.alt ?? ''} category={category} name={current.caption ?? current.alt} />
```

From `kol-client/kol-client/src/components/framework/brand/AssetCarousel.jsx`:

```jsx
<Image src={src} alt={alt ?? ''} category={category} name={caption ?? alt} />
```

From `kol-client/kol-client-ac/src/components/loaders/images/Image.jsx`:

```jsx
<Image category="mocks" name="business-card-bg" />
```

From `kol-apparat/kol-docs/kol-noter/src/components/note-editor/standard/Toolbar.tsx`:

```jsx
<Image className="w-4 h-4" />
```

From `kol-apparat/kol-docs/kol-noter/src/components/vault-system/MigrationWizard.tsx`:

```jsx
<Image className="w-4 h-4 text-purple-500" />
```
