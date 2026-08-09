# Input

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 262 across 160 files in 17 apps
- **Weighted inbound:** 511★ across 160 edges — 4×5★ · 23×4★ · 133×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/molecules/InputPreview.jsx` |
| 5 | 3 | `kol-apps/kol-mirror/src/components/styleguide/preview/molecules/InputPreview.jsx` |
| 5 | 3 | `kol-apps/kol-modulator/src/components/styleguide/preview/molecules/InputPreview.jsx` |
| 5 | 3 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/preview/molecules/InputPreview.jsx` |
| 4 | 11 | `kol-apps/kol-client-ac/src/pages/site/Checkout.jsx` |
| 4 | 7 | `kol-apps/kol-client-kolkrabbi/src/pages/Components.jsx` |
| 4 | 7 | `kol-website/apps/brand/src/pages/Components.jsx` |
| 4 | 6 | `kol-apps/kol-labs-single/src/pages/interfaces/InterfacesPage.jsx` |
| 4 | 5 | `kol-apps/kol-client-ac/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/inspectors/LayerInspector.jsx` |
| 4 | 5 | `kol-apps/kol-editor/src/pages/AtomsPage.jsx` |
| … | | _148 more_ |

## Import

```jsx
import { Input } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/atoms/Slider.jsx`:

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

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/StrokePanel.jsx`:

```jsx
<Input
          variant="filled"
          size="sm"
          suffix="pt"
          chars={4}
          value={weight}
          onChange={(e) => onWeight(e.target.value)}
        />
```

From `kol-apps/kol-client-hrafn/src/components/atoms/Slider.jsx`:

```jsx
<Input
        type="text"
        inputMode="decimal"
        variant="filled"
        size="sm"
        chars={displayWidth}
        value={draft}
        onFocus={(e) => { setEditing(true); e.target.select() }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        inputClassName="text-center"
      />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/SearchInput.jsx`:

```jsx
<Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size={size}
      iconLeft="search-16"
      className={className}
      {...rest}
    />
```

From `kol-apps/kol-divs/src/pages/Figma.jsx`:

```jsx
<Input
            placeholder="search figma term, tailwind class, css property, or note…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            iconLeft="search"
            size="sm"
          />
```
