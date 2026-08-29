# TextPressure

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/loaders/ColorLoader.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-14-introloader-merge/ColorLoader.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/layout/IntroLoader.jsx` |

## Import

```jsx
import { TextPressure } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/loaders/ColorLoader.jsx`:

```jsx
<TextPressure
                text="KOLKRABBI"
                fontFamily="TG Root-Tune"
                fontUrl="/fonts/TGRoot-TuneVF.ttf"
                textColor="#ffffff"
                flex={true}
                width={true}
                weight={true}
                italic={false}
                minFontSize={40}
              />
```

From `kol-website/_tmp/2026-08-14-introloader-merge/ColorLoader.jsx`:

```jsx
<TextPressure
                text="KOLKRABBI"
                fontFamily="TG Root-Tune"
                fontUrl="/fonts/tg-foundry/TGRoot-TuneVF.ttf"
                textColor="#ffffff"
                flex={true}
                width={true}
                weight={true}
                italic={false}
                minFontSize={40}
              />
```

From `kol-website/apps/web/src/components/layout/IntroLoader.jsx`:

```jsx
<TextPressure
                text="KOLKRABBI"
                fontFamily="TG Rot"
                fontUrl="/fonts/tg-foundry/TGRotVF.ttf"
                textColor="var(--kol-color-ab-white)"
                flex={true}
                width={true}
                weight={true}
                italic={false}
                minFontSize={40}
              />
```
