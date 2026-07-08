# Textarea

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 21 across 14 files in 5 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-labs-single, kol-noter

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

From `kol-client/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<Textarea
            variant="ghost" size="sm" rows={3}
            value={layer.customSvg ?? ''}
            onChange={(e) => setProp('customSvg', e.target.value)}
            placeholder='<svg viewBox="0 0 24 24">…</svg>'
          />
```

From `kol-client/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx`:

```jsx
<Textarea
          variant="ghost"
          size="sm"
          rows={2}
          value={layer.text ?? ''}
          onChange={(e) => setProp('text', e.target.value)}
        />
```

From `kol-client/kol-client-kolkrabbi/src/editor/modes/pattern/PatternControls.jsx`:

```jsx
<Textarea
              variant="filled" size="sm"
              value={customSvg}
              onChange={(e) => setCustomSvg(e.target.value)}
              placeholder='<svg viewBox="0 0 24 24">…</svg>'
            />
```

From `kol-apparat/kol-labs-single/src/pages/kinetic/DesignControls.jsx`:

```jsx
<Textarea key={ins.id} value={ins.text} onChange={(e) => onText(ins.id, e.target.value)} rows={2} resize="vertical" placeholder="Type…" />
```
