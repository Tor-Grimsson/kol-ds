# Canvas

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 27 across 27 files in 6 apps
- **Weighted inbound:** 81★ across 27 edges — 27×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/palette/PaletteCanvas.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/pattern/PatternCanvas.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/editor/modes/type/TypeCanvasPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/CanvasArea.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/palette/PaletteCanvas.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/pattern/PatternCanvas.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/type/TypeCanvasPanel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/EditorShell.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/CanvasArea.jsx` |
| … | | _15 more_ |

## Import

```jsx
import { Canvas } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/compose/CanvasArea.jsx`:

```jsx
<Canvas aspect={a} bgColor={bgColor ?? undefined}>
              <div className="relative w-full h-full">
                {visibleLayers.map((layer) => (
                  <LayerRenderer key={layer.id} layer={layer} palette={palette} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/modes/palette/PaletteCanvas.jsx`:

```jsx
<Canvas aspect={aspect} bgColor={bgColor} panEnabled>
      <div
        key={`${layoutId}-${colors.join('')}`}
        className="ac-combo-stage-anim w-full h-full self-stretch p-8"
      >
        {LayoutComponent ? <LayoutComponent palette={palette} logo={logo} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/modes/palette/PaletteCanvas.jsx`:

```jsx
<Canvas aspect={aspect} bgColor={bgColor} panEnabled>
      <div
        key={`${layoutId}-${colors.join('')}`}
        className="kol-combo-stage-anim w-full h-full self-stretch p-8"
      >
        {LayoutComponent ? <LayoutComponent palette={palette} logo={logo} />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/compose/CanvasArea.jsx`:

```jsx
<Canvas aspect={aspect} bgColor={bgColor ?? '#0E0E11'}>
        <div
          ref={stageRef}
          className={`relative w-full h-full ${bgColor === null ? 'kol-checker' : ''}`}
          onMouseDown={onStageMouseDown}
          style={{ cursor: drag?.mode === 'move' ? 'grabbing' : 'default' }}
        >
          {layers.map((layer) => (
            <LayerRenderer key={layer.id} layer={layer} palette={palette} />
```

From `kol-apps/kol-labs-monorepo/apps/generator/src/editor/modes/pattern/PatternCanvas.jsx`:

```jsx
<Canvas aspect="1:1" panEnabled>
      <div
        className={`w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full ${overflow ? '[&>svg]:overflow-visible' : ''}`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
```
