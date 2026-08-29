# Logomark

- **Package:** `@kolkrabbi/kol-shell`
- **Category:** flat
- **Real-world usages found:** 33 across 22 files in 9 apps
- **Weighted inbound:** 74★ across 22 edges — 4×5★ · 18×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-client/src/components/framework/logos/Logomark.jsx` |
| 5 | 3 | `kol-apps/kol-client-ac/src/components/loaders/logos/Logomark.jsx` |
| 5 | 3 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/loaders/logos/Logomark.jsx` |
| 5 | 3 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-loader/src/logos/Logomark.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/logos/Logomark.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/monitor/src/components/atoms/Logomark.jsx` |
| 3 | 2 | `kol-website/_tmp/packages-elder-flush/ui/src/atoms/logos/Logomark.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/chrome/TopNav.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/logos/index.js` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/CollectionCard.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/organisms/FeaturedItemsCarouselPreview.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/chrome/TopNav.jsx` |
| … | | _10 more_ |

## Import

```jsx
import { Logomark } from '@kolkrabbi/kol-shell'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/CollectionCard.jsx`:

```jsx
<Logomark
                name={item.logoName}
                svgUrl={item.svgUrl}
                size={logoSize}
                alt={logoAlt}
              />
```

From `kol-apps/kol-client/src/components/framework/chrome/TopNav.jsx`:

```jsx
<Logomark name="wordmark" title="Kolkrabbi" className="h-4 text-lede" />
```

From `kol-apps/kol-editor-radar/src-grab/components/structure/nav/WorkshopSidebar.jsx`:

```jsx
<Logomark className="h-10 w-10" title="Kolkrabbi logomark" />
```

From `kol-apps/kol-labs-monorepo/apps/monitor/src/components/NavSidebar.jsx`:

```jsx
<Logomark svgUrl="/svg/favicon-01.svg" size={20} />
```

From `kol-apps/kol-modulator/src/components/styleguide/preview/organisms/FeaturedItemsCarouselPreview.jsx`:

```jsx
<Logomark name={item.logoName} size={item.subtitle === 'Wordmark' ? 200 : 160} />
```
