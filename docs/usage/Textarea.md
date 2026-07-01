# Textarea

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 17 across 11 files in 4 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-labs-single, kol-noter

## Import

```jsx
import { Textarea } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-noter/src/components/note-editor/modular/BlockItem.tsx`:

```jsx
<Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Start writing..."
            className="bg-transparent !border-0 !rounded-none focus-visible:!ring-0 focus:!ring-0 focus:!outline-none !shadow-none px-0 min-h-[100px] resize-none text-xs ring-0 ring-offset-0"
          />
```

From `kol-apparat/kol-labs-single/src/pages/distress/components/ControlsPanel.jsx`:

```jsx
<Textarea
          rows={6}
          size="sm"
          placeholder="<svg>…</svg>"
          value={svgInput}
          onChange={onPasteChange}
        />
```

From `kol-client/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<Textarea
            variant="ghost" size="sm" rows={3}
            value={layer.customSvg ?? ''}
            onChange={(e) => setProp('customSvg', e.target.value)}
            placeholder='<svg viewBox="0 0 24 24">…</svg>'
          />
```

From `kol-client/kol-client-kolkrabbi/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<Textarea
          variant="ghost"
          size="sm"
          rows={2}
          value={layer.text ?? ''}
          onChange={(e) => setProp('text', e.target.value)}
        />
```

From `kol-apparat/kol-docs/kol-noter/src/components/note-editor/modular/BlockItem.tsx`:

```jsx
<Textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="// Enter your code..."
              className="bg-code-bg border border-code-border font-mono text-xs min-h-[200px] resize-none"
            />
```
