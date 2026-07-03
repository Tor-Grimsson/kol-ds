# PageSection

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 171 across 43 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-divs, kol-editor

## Import

```jsx
import { PageSection } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apparat/kol-docs/kol-divs/src/pages/Figma.jsx`:

```jsx
<PageSection
        id="figma-overview"
        label="01 — figma → tailwind"
        title="figma → tailwind"
        body="Figma and CSS use different words for the same things. You are not stupid for getting confused — the names actually are different. Here is the dictionary."
      />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/sections/TypeScaleSection.jsx`:

```jsx
<PageSection id={id} label={label} title={title} body={body}>
      <Table className="kol-table--simple" columns={cols} rows={rows} />
```

From `kol-client/kol-client/src/pages/Brand.jsx`:

```jsx
<PageSection
        id="logo"
        label="03 — logo"
        title="The crest"
        body="Four-blade rotary. Burgundy body with a cream blade. Rounded-square containment variant for bridge consoles. Full lockup family below."
      >
        <LogoCarousel logos={logoVariants} light />
```

From `kol-client/kol-client-ac/src/pages/Acyr.jsx`:

```jsx
<PageSection id="identity" label="01 — identity" title="Identity" body="Pulled live from src/data/brand-info.js.">
        <div className="mt-8"><Table columns={identityCols} rows={identityRows} />
```

From `kol-client/kol-client-acyr-website/apps/styleguide/src/components/styleguide/TypeScaleSection.jsx`:

```jsx
<PageSection id={id} label={label} title={title} body={body}>
      <Table className="ac-table--simple" columns={cols} rows={rows} />
```
