# Section

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 501 across 93 files in 7 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-lightroom

## Import

```jsx
import { Section } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/combo-lab/ComboLab.jsx`:

```jsx
<Section label="Aspect">
            <Dropdown
              variant="subtle"
              size="sm"
              className="w-full"
              options={ASPECT_OPTIONS}
              value={aspect}
              onChange={setAspect}
            />
```

From `kol-apparat/kol-lightroom/src/pages/Develop.jsx`:

```jsx
<Section title="Info" defaultOpen={false}>
              <dl className="flex flex-col gap-3 kol-mono-12 text-body">
                <Row k="File" v={info?.fileName} />
```

From `kol-apparat/kol-labs-single/src/components/framework/SettingsPanel.jsx`:

```jsx
<Section label={label}>
      {showTheme && (
        <>
          <LabeledControl inline label="Theme">
            <Dropdown size="sm" variant="subtle" className="w-full" options={themeOptions} value={theme} onChange={onTheme} />
```

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/combo-lab/ComboLab.jsx`:

```jsx
<Section label="Layout">
            <Dropdown variant="subtle" size="sm" className="w-full" options={LAYOUT_OPTIONS} value={layoutId} onChange={setLayoutId} />
```

From `kol-apparat/kol-editors/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/combo-lab/ComboLab.jsx`:

```jsx
<Section label="Pool">
            <Dropdown variant="subtle" size="sm" className="w-full" options={POOL_OPTIONS} value={poolId} onChange={changePool} />
```
