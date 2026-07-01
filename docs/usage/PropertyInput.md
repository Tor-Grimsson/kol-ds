# PropertyInput

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 22 across 4 files in 3 apps
- **Used in:** kol-client-kolkrabbi, kol-draw-3d, kol-editor

## Import

```jsx
import { PropertyInput } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/src/pages/MoleculesPage.jsx`:

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

From `kol-apparat/kol-editors/kol-draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<PropertyInput type="number" value={a.point[0]} step={0.1} onChange={(v) => setPoint(i, 0, v)} />
```

From `kol-client/kol-client-kolkrabbi/src/pages/Components.jsx`:

```jsx
<PropertyInput label="X"        type="number" value={x}   onChange={(e) => setX(Number(e.target.value))}   step={5} />
```

From `kol-apparat/kol-editors/kol-editor/src/pages/MoleculesPage.jsx`:

```jsx
<PropertyInput
                label="Name"
                type="text"
                value="Sample Object"
                onChange={() => {}}
              />
```

From `kol-apparat/kol-editors/kol-draw-3d/src/components/studio/InspectorPanel.jsx`:

```jsx
<PropertyInput type="number" value={a.point[1]} step={0.1} onChange={(v) => setPoint(i, 1, v)} />
```
