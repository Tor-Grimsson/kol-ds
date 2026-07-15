# LogoCard

- **Package:** `@kolkrabbi/kol-styleguide`
- **Category:** flat
- **Real-world usages found:** 31 across 11 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

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
