# Pill

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 35 across 11 files in 5 apps
- **Used in:** kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-radar

## Import

```jsx
import { Pill } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/Components.jsx`:

```jsx
<Pill size="sm">Small</Pill>
        <Pill size="md">Medium</Pill>
        <Pill size="lg">Large</Pill>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function QuantityInputShowcase() {
  return (
    <ComponentShowcase name="QuantityInput" description="Quantity input with +/- controls">
      <VariantGroup label="Default">
        <QuantityInput value={1} min={0} max={10} />
```

From `kol-apparat/kol-video/kol-mirror/src/components/styleguide/Components.jsx`:

```jsx
<Pill size="md">Medium</Pill>
        <Pill size="lg">Large</Pill>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function QuantityInputShowcase() {
  return (
    <ComponentShowcase name="QuantityInput" description="Quantity input with +/- controls">
      <VariantGroup label="Default">
        <QuantityInput value={1} min={0} max={10} />
```

From `kol-apparat/kol-video/kol-modulator/src/components/styleguide/Components.jsx`:

```jsx
<Pill size="lg">Large</Pill>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function QuantityInputShowcase() {
  return (
    <ComponentShowcase name="QuantityInput" description="Quantity input with +/- controls">
      <VariantGroup label="Default">
        <QuantityInput value={1} min={0} max={10} />
```

From `kol-client/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/VariableFontDisplay.jsx`:

```jsx
<Pill variant="subtle">wght {weight}</Pill>
            {width !== undefined && <Pill variant="subtle">wdth {width}</Pill>}
          </div>
        </div>

        {/* Bottom Row - Play/Pause + Sliders */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <PlayPauseButton
              isPlaying={isAnimating}
              onToggle={onToggleAnimation}
            />
```

From `kol-apparat/kol-video/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/Components.jsx`:

```jsx
<Pill variant="inverse">Inverse</Pill>
        <Pill variant="subtle">Subtle</Pill>
        <Pill variant="outline">Outline</Pill>
      </VariantGroup>
      <VariantGroup label="Sizes">
        <Pill size="sm">Small</Pill>
        <Pill size="md">Medium</Pill>
        <Pill size="lg">Large</Pill>
      </VariantGroup>
    </ComponentShowcase>
  )
}

function QuantityInputShowcase() {
  return (
    <ComponentShowcase name="QuantityInput" description="Quantity input with +/- controls">
      <VariantGroup label="Default">
        <QuantityInput value={1} min={0} max={10} />
```
