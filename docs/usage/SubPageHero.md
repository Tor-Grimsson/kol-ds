# SubPageHero

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Used in:** kol-client-canalix

## Import

```jsx
import { SubPageHero } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-client/kol-client-canalix/src/pages/CanalixMarks.jsx`:

```jsx
<SubPageHero
        backTo="/canalix"
        backLabel="← back to canalix"
        label="canalix · marks"
        title="Marks"
        lede={<>Product icon family — 15 accented + 21 monochrome. Every fill that was white / near-white is now <code>currentColor</code>, so the marks inherit the theme. Accent colors remain fixed per icon.</>
```

From `kol-client/kol-client-canalix/src/pages/CanalixWebsites.jsx`:

```jsx
<SubPageHero
        backTo="/canalix"
        backLabel="← back to canalix"
        label="canalix · websites"
        title="canalix.io"
        lede="Marketing-site comps — desktop pages stacked for scroll context, mobile mocks follow in a tighter grid. Click any comp to open fullscreen."
      />
```

From `kol-client/kol-client-canalix/src/pages/CasedocWebsites.jsx`:

```jsx
<SubPageHero
        backTo="/casedoc"
        backLabel="← back to casedoc"
        label="casedoc · websites"
        title="casedoc.io"
        lede="Home family + Product detail + loose screens. Click a comp to open fullscreen."
      />
```
