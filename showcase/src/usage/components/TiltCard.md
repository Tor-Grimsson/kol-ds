# TiltCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** utilities
- **Real-world usages found:** 11 across 9 files in 4 apps
- **Weighted inbound:** 27★ across 9 edges — 9×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/InteractivePreview.jsx` |
| 3 | 2 | `kol-website/_tmp/workshop-museum-elder/components/workshop/animations/InteractivePreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/work/ShelfCard.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/CardResp.jsx` |
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardResp.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/styleguide/preview/organisms/CardResp.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-15-anatomy-adoption/FoundryFeatureSection.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/organisms/CardResp.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/sections/home/HomeFoundry.jsx` |

## Import

```jsx
import { TiltCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/InteractivePreview.jsx`:

```jsx
<TiltCard
              src={imageSrc}
              alt="Foundry preview"
              className="w-full h-full rounded-[4px]"
            />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardResp.jsx`:

```jsx
<TiltCard
            src="/img/Kolk-img/trollatunga-3.png"
            alt="Dashboard card preview"
            className="w-full aspect-[4/5] rounded-3xl overflow-hidden"
          />
```

From `kol-website/_tmp/2026-08-15-anatomy-adoption/FoundryFeatureSection.jsx`:

```jsx
<TiltCard
          src={imageSrc}
          alt={imageAlt}
          className={imageClassName}
        />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/InteractivePreview.jsx`:

```jsx
<TiltCard
  src={imageSrc}
  alt="Type Design"
  className="w-full aspect-[5/4] rounded-[4px]"
/>
```

From `kol-website/apps/web/src/components/sections/home/HomeFoundry.jsx`:

```jsx
<TiltCard src={imageSrc} alt="Type Design" className="w-full h-full rounded-[var(--kol-radius-sm)]" />
```
