# BrandHero

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 5 across 5 files in 4 apps
- **Used in:** kol-client, kol-client-ac, kol-client-canalix, kol-client-kolkrabbi

## Import

```jsx
import { BrandHero } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-client/kol-client/src/pages/Brand.jsx`:

```jsx
<BrandHero
        label="/ command"
        title={BRAND.name}
        lede="Federation flag. Fleet commission. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of sovereign institutions."
      />
```

From `kol-client/kol-client-ac/src/pages/Styleguide.jsx`:

```jsx
<BrandHero
        label="brand guidelines"
        title={BRAND.name}
        lede="Client-facing identity guidelines — chapter-structured for handoff. Mirrors the shape of the deliverable PDF."
      />
```

From `kol-client/kol-client-canalix/src/pages/Canalix.jsx`:

```jsx
<BrandHero
        label="/ canalix"
        title="Canalix"
        lede="Master brand. Branded house. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of governmental institutions."
        mark={<BrandLogo brand="canalix" name="logomark-light" className="kol-hero-mark" title="Canalix" />
```

From `kol-client/kol-client-canalix/src/pages/Casedoc.jsx`:

```jsx
<BrandHero
        label="/ casedoc"
        title="Casedoc"
        lede={<>Flagship product. <em>Above as below — justice is a feather.</em> Bringing the power of data to justice.</>
```
