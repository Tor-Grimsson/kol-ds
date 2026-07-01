# MenuItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 22 across 5 files in 4 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-draw-3d, kol-editor

## Import

```jsx
import { MenuItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-draw-3d/src/components/chrome/TopBar.jsx`:

```jsx
<MenuItem label="File">
          <div className="py-1 w-[220px]">
            <MenuDropdownItem onClick={exportSvg} disabled={viewMode === 'three'}>Export SVG</MenuDropdownItem>
            <MenuDropdownDivider />
```

From `kol-apparat/kol-editors/kol-editor/src/components/molecules/Menu.jsx`:

```jsx
<MenuItem onSelect={onSave} shortcut="⌘S">Save</MenuItem>
 *     <MenuSeparator />
```

From `kol-client/kol-client-ac/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuItem label="Mode">
          <div className="py-1 w-[220px]">
            {MODES.map((m) => (
              <MenuDropdownItem
                key={m.id}
                onClick={() => navigate(`/editor/${m.id}`)}
                shortcut={currentMode === m.id ? <EditorIcon name="check" size={11} />
```

From `kol-client/kol-client-kolkrabbi/src/editor/shell/MenuTop.jsx`:

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

From `kol-apparat/kol-editors/kol-editor/src/components/organisms/TopNav.jsx`:

```jsx
<MenuItem shortcut="⌘N" onSelect={onNewFile}>New file…</MenuItem>}
          {onOpenFile && <MenuItem shortcut="⌘O" onSelect={onOpenFile}>Open…</MenuItem>}
          {onSave && <MenuItem shortcut="⌘S" onSelect={onSave}>Save</MenuItem>}
          {(onSave || onNewFile || onOpenFile) && <MenuSeparator />
```
