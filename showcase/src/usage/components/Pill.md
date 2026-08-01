# Pill

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 49 across 21 files in 6 apps
- **Weighted inbound:** 67★ across 21 edges — 4×4★ · 17×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 4 | 6 | `kol-apps/kol-mirror/src/components/styleguide/Components.jsx` |
| 4 | 6 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 4 | 6 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/OverviewHero.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/VariableFontDisplay.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/prose/layouts/ArticleHeader.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/prose/layouts/ArticleRichProse.jsx` |
| 3 | 2 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/OverviewHero.jsx` |
| 3 | 2 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/foundry/VariableFontDisplay.jsx` |
| 3 | 2 | `kol-website/_tmp/web-quarantine-elder/ArticleRichProse.jsx` |
| 3 | 2 | `kol-website/apps/web/src/components/prose/layouts/ArticleHeader.jsx` |
| … | | _9 more_ |

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

From `kol-website/_tmp/packages-elder-flush/ui/src/molecules/foundry/VariableFontDisplay.jsx`:

```jsx
<Pill variant="subtle">wdth {width}</Pill>}
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
