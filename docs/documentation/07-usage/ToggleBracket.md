# ToggleBracket

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 26 across 13 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { ToggleBracket } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleBracket
          label="Symmetric Editing"
          value={ui.symmetricEdit}
          onToggle={(next) => onUiToggle('symmetricEdit', next)}
          variant="plain"
          className="justify-between text-left text-fg-64"
        />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx`:

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

From `kol-apps/kol-mirror/src/components/styleguide/Components.jsx`:

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

From `kol-apps/kol-modulator/src/components/styleguide/preview/atoms/TogglesPreview.jsx`:

```jsx
<ToggleBracket
            label="Feature"
            value={bracketState}
            onChange={setBracketState}
          />
```

From `kol-website/apps/brand/src/pages/Components.jsx`:

```jsx
<ToggleBracket label="Default off"  value={br1} onToggle={setBr1} />
```
