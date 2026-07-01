# ToggleBracket

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 22 across 11 files in 5 apps
- **Used in:** kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { ToggleBracket } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/Components.jsx`:

```jsx
<ToggleBracket>Off</ToggleBracket>
        <ToggleBracket active>On</ToggleBracket>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function UnitSelectorShowcase() {
  return (
    <ComponentShowcase name="UnitSelector" description="Unit selector component">
      <VariantGroup label="Default">
        <UnitSelector options={[{value: 'px', label: 'px'}, {value: 'em', label: 'em'}]} />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<ToggleBracket active>On</ToggleBracket>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function UnitSelectorShowcase() {
  return (
    <ComponentShowcase name="UnitSelector" description="Unit selector component">
      <VariantGroup label="Default">
        <UnitSelector options={[{value: 'px', label: 'px'}, {value: 'em', label: 'em'}]} />
```

From `kol-apparat/kol-video/kol-modulator/src/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleBracket
            label="Feature"
            value={bracketState}
            onChange={setBracketState}
          />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleBracket
          label="Symmetric Editing"
          value={ui.symmetricEdit}
          onToggle={(next) => onUiToggle('symmetricEdit', next)}
          variant="plain"
          className="justify-between text-left text-fg-64"
        />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleBracket
          label="Symmetrical Handles"
          value={ui.symmetricalBezier}
          onToggle={(next) => onUiToggle('symmetricalBezier', next)}
          variant="plain"
          className="justify-between text-left text-fg-64"
        />
```
