# Input

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 263 across 161 files in 17 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-website

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
