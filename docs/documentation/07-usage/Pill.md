# Pill

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 48 across 20 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { Pill } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/VariableFontDisplay.jsx`:

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

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx`:

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

From `kol-apps/kol-mirror/src/components/styleguide/Components.jsx`:

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

From `kol-apps/kol-modulator/src/components/styleguide/Components.jsx`:

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

From `kol-website/apps/web/_quarantine/ArticleRichProse.jsx`:

```jsx
<Pill key={calloutTag ?? index} variant="inverse">
                        {calloutTag}
                      </Pill>
```
