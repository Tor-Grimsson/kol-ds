# ToggleBracket

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 18 across 9 files in 4 apps
- **Weighted inbound:** 29★ across 9 edges — 2×4★ · 7×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx` |
| 4 | 3 | `kol-website/apps/brand/src/pages/Components.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/src/components/styleguide/preview/atoms/TogglesPreview.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/atoms/TogglesPreview.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/atoms/TogglesPreview.jsx` |

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

From `kol-apps/kol-modulator/src/components/styleguide/Components.jsx`:

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

From `kol-website/_tmp/workshop-museum-elder/components/workshop/atoms/TogglesPreview.jsx`:

```jsx
<ToggleBracket label="Feature" value={bracketState} onChange={setBracketState} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/apparatus/WavyCircleControls.jsx`:

```jsx
<ToggleBracket
          label="Symmetrical Handles"
          value={ui.symmetricalBezier}
          onToggle={(next) => onUiToggle('symmetricalBezier', next)}
          variant="plain"
          className="justify-between text-left text-fg-64"
        />
```
