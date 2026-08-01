# TypefaceLibraryGridWithVariables

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 4 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/foundry/FoundryOrganismsPreview.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/foundry/FoundryOrganismsPreview.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/components/FoundryOtherTypefaces.jsx` |

## Import

```jsx
import { TypefaceLibraryGridWithVariables } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/foundry/FoundryOrganismsPreview.jsx`:

```jsx
<TypefaceLibraryGridWithVariables
        typefaces={typefaces}
        typefaceWeights={typefaceWeights}
        totalCount={typefaces.length}
      />
```

From `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx`:

```jsx
<TypefaceLibraryGridWithVariables
        typefaces={typefaces}
        typefaceWeights={typefaceWeights}
        totalCount={typefaces.length}
        linkComponent={Link}
      />
```

From `kol-website/apps/web/src/routes/foundry/components/FoundryOtherTypefaces.jsx`:

```jsx
<TypefaceLibraryGridWithVariables
      typefaces={typefaces}
      typefaceWeights={typefaceWeights}
      totalCount={typefaces.length}
      linkComponent={Link}
    />
```
