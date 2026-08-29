# SettingsPanel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 10 across 10 files in 1 apps
- **Weighted inbound:** 30★ across 10 edges — 10×3★
- **Used in:** kol-labs-single

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/gradient/GradientPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/gradient/environments/EnvironmentShell.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/gradient/forms/FormShell.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/gradient/primitive/PrimitiveScenePage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/loops/LoopsShell.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/math/attractor/AttractorPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/math/complex/ComplexPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/math/field/FieldPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/math/fourier/FourierPage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/pages/math/surface/SurfacePage.jsx` |

## Import

```jsx
import { SettingsPanel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-labs-single/src/pages/gradient/GradientPage.jsx`:

```jsx
<SettingsPanel
            page="gradient"
            theme={themeId}
            onTheme={setThemeId}
            invert={invert}
            onInvert={setInvert}
            onRandomize={randomize}
            seed={seedBase}
            onSeed={setSeedBase}
            getSettings={getSettings}
            applySettings={applySettings}
            showIO={false}
          />
```

From `kol-apps/kol-labs-single/src/pages/gradient/environments/EnvironmentShell.jsx`:

```jsx
<SettingsPanel
          page={`environments-${env}`}
          theme={themeId}
          onTheme={setThemeId}
          invert={invert}
          onInvert={setInvert}
          onRandomize={onRandomize}
          seed={seed}
          onSeed={setSeed}
          showIO={false}
          getSettings={getSettings}
          applySettings={applySettings}
        />
```

From `kol-apps/kol-labs-single/src/pages/gradient/forms/FormShell.jsx`:

```jsx
<SettingsPanel
          page={`forms-${form}`}
          theme={themeId}
          onTheme={setThemeId}
          invert={invert}
          onInvert={setInvert}
          onRandomize={onRandomize}
          seed={seed}
          onSeed={setSeed}
          showIO={false}
          getSettings={getSettings}
          applySettings={applySettings}
        />
```

From `kol-apps/kol-labs-single/src/pages/gradient/primitive/PrimitiveScenePage.jsx`:

```jsx
<SettingsPanel
            page="primitive"
            showIO={false}
            theme={themeId}
            onTheme={setThemeId}
            invert={invert}
            onInvert={setInvert}
            onRandomize={randomize}
            seed={seed}
            onSeed={reseed}
            getSettings={getSettings}
            applySettings={applySettings}
            label="Generate"
          />
```

From `kol-apps/kol-labs-single/src/pages/loops/LoopsShell.jsx`:

```jsx
<SettingsPanel
            page="loops"
            showIO={false}
            theme={themeId}
            onTheme={setThemeId}
            invert={invert}
            onInvert={setInvert}
            onRandomize={onRandomize}
            seed={seed}
            onSeed={(n) => { setSeed(n); rollWith(n) }}
            getSettings={getSettings}
            applySettings={applySettings}
          />
```
