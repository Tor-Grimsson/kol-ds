# MenuItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 47 across 11 files in 7 apps
- **Weighted inbound:** 42★ across 11 edges — 9×4★ · 2×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-editor, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 12 | `kol-apps/kol-editor/src/components/organisms/TopNav.jsx` |
| 4 | 12 | `kol-apps/kol-labs-monorepo/apps/editor/src/components/organisms/TopNav.jsx` |
| 4 | 3 | `kol-apps/kol-client-ac/src/editor/shell/MenuTop.jsx` |
| 4 | 3 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/MenuTop.jsx` |
| 4 | 3 | `kol-apps/kol-client-kolkrabbi/src/editor/shell/MenuTop.jsx` |
| 4 | 3 | `kol-apps/kol-draw-3d/src/components/chrome/TopBar.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/chrome/TopBar.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/shell/MenuTop.jsx` |
| 4 | 3 | `kol-website/_tmp/brand-triage-elder/editor/shell/MenuTop.jsx` |
| 3 | 1 | `kol-apps/kol-editor/src/components/molecules/Menu.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/editor/src/components/molecules/Menu.jsx` |

## Import

```jsx
import { MenuItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuItem label="Mode">
          <div className="py-1 w-[220px]">
            {MODES.map((m) => (
              <MenuDropdownItem
                key={m.id}
                onClick={() => navigate(`/editor/${m.id}`)}
                shortcut={currentMode === m.id ? <EditorIcon name="check" size={11} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuItem label="File">
          <div className="py-1 w-[220px]">
            <MenuDropdownItem onClick={onSave}>
              {currentPresetId ? 'Save' : 'Save…'}
            </MenuDropdownItem>
            <MenuDropdownItem onClick={onSaveAs}>
              Save as…
            </MenuDropdownItem>
            <MenuDropdownItem onClick={clearLayers} disabled={layers.length === 0}>
              Clear
            </MenuDropdownItem>
            <MenuDropdownDivider />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuItem label="Canvas">
          <div className="py-1 w-[220px]">
            <MenuDropdownNest label="Aspect">
              {ASPECT_OPTIONS.map((opt) => (
                <MenuDropdownItem
                  key={opt.value}
                  onClick={() => setAspect(opt.value)}
                  shortcut={aspect === opt.value ? <EditorIcon name="check" size={11} />
```

From `kol-apps/kol-draw-3d/src/components/chrome/TopBar.jsx`:

```jsx
<MenuItem label="File">
          <div className="py-1 w-[220px]">
            <MenuDropdownItem onClick={exportSvg} disabled={viewMode === 'three'}>Export SVG</MenuDropdownItem>
            <MenuDropdownDivider />
```

From `kol-apps/kol-editor/src/components/molecules/Menu.jsx`:

```jsx
<MenuItem onSelect={onSave} shortcut="⌘S">Save</MenuItem>
 *     <MenuSeparator />
```
