# Input

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 179 across 104 files in 15 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-draw-3d, kol-editor, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar, kol-resume

## Import

```jsx
import { Input } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-divs/src/pages/Figma.jsx`:

```jsx
<Input
            placeholder="search figma term, tailwind class, css property, or note…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            iconLeft="search"
            size="sm"
          />
```

From `kol-apparat/kol-docs/kol-noter/src/components/note-browsing/NoteTabs.tsx`:

```jsx
<Input
                    ref={inputRef}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 text-xs font-medium px-1 py-0 flex-1 bg-transparent border-none focus-visible:ring-0 focus:ring-0 focus:outline-none"
                  />
```

From `kol-apparat/kol-editors/kol-draw-3d/src/components/atoms/Slider.jsx`:

```jsx
<Input
        type="text"
        inputMode="decimal"
        variant="filled"
        size="sm"
        width={64}
        value={draft}
        onFocus={(e) => { setEditing(true); e.target.select() }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        inputClassName="text-center"
      />
```

From `kol-apparat/kol-editors/kol-editor/src/components/atoms/Slider.jsx`:

```jsx
<Input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={onChange}
            className="w-10 shrink-0 !px-1"
            inputClassName="text-center"
          />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/molecules/InputPreview.jsx`:

```jsx
<Input
                  type="text"
                  placeholder="Enter text..."
                  size="md"
                  style={inputBreakpointStyles.md[bp.id]}
                />
```
