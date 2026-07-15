# PageSection

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 293 across 81 files in 10 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-canalix-contract, kol-client-kolkrabbi, kol-divs, kol-editor, kol-labs-monorepo, kol-website

## Import

```jsx
import { PageSection } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/sections/TypeScaleSection.jsx`:

```jsx
<PageSection id={id} label={label} title={title} body={body}>
      <Table className="kol-table--simple" columns={cols} rows={rows} />
```

From `kol-apps/kol-client-ac/src/pages/Acyr.jsx`:

```jsx
<PageSection id="identity" label="01 — identity" title="Identity" body="Pulled live from src/data/brand-info.js.">
        <div className="mt-8"><Table columns={identityCols} rows={identityRows} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/TypeScaleSection.jsx`:

```jsx
<PageSection id={id} label={label} title={title} body={body}>
      <Table className="ac-table--simple" columns={cols} rows={rows} />
```

From `kol-apps/kol-client-canalix/src/_archive/pages/Typography.jsx`:

```jsx
<PageSection
        id="introduction"
        label="00 — introduction"
        title="Typography"
        body="The Canalix house runs on two families: Montserrat for product and UI, PP Hatton as the serif display partner for marketing moments. Every style below is production-sized — px values, not clamps. Letter-spacing is 0 across the board."
      />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Acyr.jsx`:

```jsx
<PageSection id="identity" label="01 — identity" title="Identity" body="Pulled live from src/brand/data/info.js.">
        <div className="mt-8"><Table columns={identityCols} rows={identityRows} />
```
