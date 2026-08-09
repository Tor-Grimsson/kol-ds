# LogoCard

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 37 across 13 files in 7 apps
- **Weighted inbound:** 44★ across 13 edges — 5×4★ · 8×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-client-ac/src/pages/Styleguide.jsx` |
| 4 | 6 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx` |
| 4 | 6 | `kol-apps/kol-client-kolkrabbi/src/pages/Styleguide.jsx` |
| 4 | 6 | `kol-website/_tmp/brand-page-split-elder/Brand.jsx` |
| 4 | 4 | `kol-website/apps/brand/src/pages/brand/Lockups.jsx` |
| 3 | 2 | `kol-website/apps/brand/src/pages/brand/Logo.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/sections/LogoCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/styleguide/LogoCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/LogoCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/components/cards/LogoCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/styleguide/LogoCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/sections/LogoCarousel.jsx` |
| … | | _1 more_ |

## Import

```jsx
import { LogoCard } from '@kolkrabbi/kol-styleguide'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/sections/LogoCarousel.jsx`:

```jsx
<LogoCard
          key={l.name}
          name={l.name}
          caption={l.caption}
          backdrop={l.backdrop ?? backdrop}
          light={light}
        />
```

From `kol-apps/kol-client-canalix/src/components/cards/LogoCarousel.jsx`:

```jsx
<LogoCard
          key={l.name}
          brand={brand}
          name={l.name}
          caption={l.caption}
          backdrop={l.backdrop ?? backdrop}
          light={light}
        />
```

From `kol-apps/kol-client-ac/src/pages/Styleguide.jsx`:

```jsx
<LogoCard variant="wordmark" clearspace={false} frame={false} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx`:

```jsx
<LogoCard variant="logomark" clearspace={false} frame={false} />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Styleguide.jsx`:

```jsx
<LogoCard variant="logomark"    caption="Logomark" />
```
