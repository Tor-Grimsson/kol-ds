# Pill

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 39 across 20 files in 4 apps
- **Weighted inbound:** 62★ across 20 edges — 2×4★ · 18×3★
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 6 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 4 | 6 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/OverviewHero.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/VariableFontDisplay.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/prose/layouts/ArticleHeader.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/prose/layouts/ArticleRichProse.jsx` |
| 3 | 2 | `kol-website/_tmp/2026-08-14-prose-export/components/layouts/ArticleHeader.jsx` |
| 3 | 2 | `kol-website/_tmp/2026-08-15-anatomy-adoption/ArticleHeader.jsx` |
| 3 | 2 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/OverviewHero.jsx` |
| 3 | 2 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/foundry/VariableFontDisplay.jsx` |
| 3 | 2 | `kol-website/_tmp/web-quarantine-elder/ArticleRichProse.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/CollectionCard.jsx` |
| … | | _8 more_ |

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

From `kol-apps/kol-modulator/src/components/styleguide/Components.jsx`:

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

From `kol-website/_tmp/2026-08-14-prose-export/components/layouts/ArticleHeader.jsx`:

```jsx
<Pill key={index} variant="inverse" size="sm">
                  {tag}
                </Pill>
              ))}
            </div>
            <div className="reveal hidden lg:flex flex-wrap items-center gap-2 pb-6" style={{ '--reveal-delay': '0s' }}>
              {tags.map((tag, index) => (
                <Pill key={index} variant="inverse" size="md">
                  {tag}
                </Pill>
              ))}
            </div>
          </>
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/VariableFontDisplay.jsx`:

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
