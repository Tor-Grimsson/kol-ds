# TypeSample

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 9 across 4 files in 3 apps
- **Used in:** kol-client, kol-client-canalix, kol-website

## Import

```jsx
import { TypeSample } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/routes/workshop/Typography.jsx`:

```jsx
<TypeSample
                key={type.id}
                id={type.id}
                className={type.className}
                label={type.label}
                usage={type.usage}
                font={type.font}
                breakpoints={type.breakpoints}
              />
```

From `kol-apps/kol-client/src/pages/Brand.jsx`:

```jsx
<TypeSample label="Playfair · 700 · italic · 56/64" family="Playfair" weight={700} size={56} lineHeight={64} italic>
          Above as below — justice is a starfield.
        </TypeSample>
      </PageSection>

      <PageSection
        id="color"
        label="05 — color"
        title="Signature palette"
        body="Five anchors. Burgundy hero over cream, grey canvas beneath. Burgundy-400 for accent moments, burgundy-900 for ink. The palette is quiet — the brand does its shouting in composition, not count."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {brandSwatches.map((s) => <Swatch key={s.hex} hex={s.hex} name={s.name} />
```

From `kol-apps/kol-client-canalix/src/pages/Canalix.jsx`:

```jsx
<TypeSample label="PP Hatton · 700 · 32/40" family="PP Hatton" weight={700} size={32} lineHeight={40}>
          Above as below — justice is a feather.
        </TypeSample>
      </TypeScaleSection>

      <PageSection
        id="color"
        label="07 — color"
        title="Identity palette"
        body="Brand work only — logo, print, identity. Not a UI palette. Warm, restrained: cream-navy-yellow with a brick-red accent."
      >
        {identityRamps.map((r) => <Ramp key={r.name} name={r.name} stops={r.stops} />
```

From `kol-apps/kol-client-canalix/src/pages/Casedoc.jsx`:

```jsx
<TypeSample label="Montserrat · 400 · 16/24 · p" family="Montserrat" weight={400} size={16} lineHeight={24}>
          Centralised evidence, data monitoring, privilege structure, people /
          role / location management.
        </TypeSample>
      </TypeScaleSection>

      <PageSection
        id="color"
        label="06 — color"
        title="Product palette"
        body={<>The full Canalix design-system palette used by all products. Fourteen ramps plus two curated palettes (Core + Accent). Brand anchor: <strong>Hugvit Blue 500</strong> = <code>#00469C</code>.</>
```
