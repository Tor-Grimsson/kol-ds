# PairingCard

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 5 across 5 files in 2 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/PairingsList.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/foundry/FoundryAtomsPreview.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-specimen-sections/PairingsList.jsx` |
| 3 | 1 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/foundry/PairingsList.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/foundry/FoundryAtomsPreview.jsx` |

## Import

```jsx
import { PairingCard } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/PairingsList.jsx`:

```jsx
<PairingCard
          key={index}
          leftTitle={pairing.leftTitle}
          leftTag={pairing.leftTag}
          leftDescription={pairing.leftDescription}
          leftFontFamily={pairing.leftFontFamily}
          rightTitle={pairing.rightTitle}
          rightTag={pairing.rightTag}
          rightDescription={pairing.rightDescription}
          rightFontFamily={pairing.rightFontFamily}
        />
```

From `kol-website/_tmp/workshop-museum-elder/components/workshop/foundry/FoundryAtomsPreview.jsx`:

```jsx
<PairingCard
              key={i}
              leftTitle={pairing.leftTitle}
              leftTag={pairing.leftTag}
              leftDescription={pairing.leftDescription}
              rightTitle={pairing.rightTitle}
              rightTag={pairing.rightTag}
              rightDescription={pairing.rightDescription}
            />
```
