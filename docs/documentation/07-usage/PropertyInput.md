# PropertyInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 51 across 8 files in 6 apps
- **Used in:** kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-editor, kol-labs-monorepo, kol-website

## Import

```jsx
import { PropertyInput } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-acyr-website/apps/website/src/pages/site/Checkout.jsx`:

```jsx
<PropertyInput
                    size="lg"
                    label="Contact"
                    labelClassName="site-label-form mb-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
```

From `kol-apps/kol-editor/src/pages/MoleculesPage.jsx`:

```jsx
<PropertyInput
                label="Width"
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                min={0}
                max={500}
              />
```

From `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx`:

```jsx
<PropertyInput label="X"        type="number" value={x}   onChange={(e) => setX(Number(e.target.value))}   step={5} />
```

From `kol-apps/kol-draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<PropertyInput type="number" value={a.point[0]} step={0.1} onChange={(v) => setPoint(i, 0, v)} />
```

From `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<PropertyInput type="number" value={a.point[1]} step={0.1} onChange={(v) => setPoint(i, 1, v)} />
```
