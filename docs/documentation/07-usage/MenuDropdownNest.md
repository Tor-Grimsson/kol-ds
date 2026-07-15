# MenuDropdownNest

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 23 across 14 files in 6 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-website

## Import

```jsx
import { MenuDropdownNest } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/compose/LayerStack.jsx`:

```jsx
<MenuDropdownNest
                key={t.id}
                iconLeft={<EditorIcon name={TYPE_ICONS.shape} size={12} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuDropdownNest label="Aspect">
              {ASPECT_OPTIONS.map((opt) => (
                <MenuDropdownItem
                  key={opt.value}
                  onClick={() => setAspect(opt.value)}
                  shortcut={aspect === opt.value ? <EditorIcon name="check" size={11} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/shell/MenuTop.jsx`:

```jsx
<MenuDropdownNest label="View">
              <MenuDropdownItem
                onClick={() => setView('single')}
                shortcut={view === 'single' ? <EditorIcon name="check" size={11} />
```

From `kol-apps/kol-draw-3d/src/components/chrome/TopBar.jsx`:

```jsx
<MenuDropdownNest label="Armature">
              {ARMATURE_OPTIONS.map((o) => (
                <MenuDropdownItem
                  key={o.value}
                  onClick={() => setArmature({ system: o.value })}
                  shortcut={check(armature.system === o.value)}
                >
                  {o.label}
                </MenuDropdownItem>
              ))}
            </MenuDropdownNest>
            <MenuDropdownDivider />
```

From `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/LayersPanel.jsx`:

```jsx
<MenuDropdownNest label="Scene">
          {SCENE_PRESETS.map((p) => (
            <MenuDropdownItem key={p.id} onClick={click(loadScenePreset, p.id)}>{p.label}</MenuDropdownItem>
          ))}
        </MenuDropdownNest>
      </PopoverPanel>
    </>
```
