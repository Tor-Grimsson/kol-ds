# MenuDropdownItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 116 across 23 files in 10 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-website

## Import

```jsx
import { MenuDropdownItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/molecules/Dropdown.jsx`:

```jsx
<MenuDropdownItem
                key={option.value}
                onClick={() => handleSelect(option)}
                shortcut={isActive ? <Icon name="check" size={11} />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/LayerStack.jsx`:

```jsx
<MenuDropdownItem
                    key={k.id}
                    iconLeft={<EditorIcon name={k.icon} size={12} />
```

From `kol-apps/kol-client-kolkrabbi/src/editor/compose/LayerStack.jsx`:

```jsx
<MenuDropdownItem
              key={t.id}
              iconLeft={<EditorIcon name={TYPE_ICONS[t.id] ?? 'layer-shape'} size={12} />
```

From `kol-apps/kol-draw-3d/src/components/chrome/TopBar.jsx`:

```jsx
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

From `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/chrome/TopBar.jsx`:

```jsx
<MenuDropdownItem onClick={() => setArmature({ showLines: !armature.showLines })} shortcut={check(armature.showLines)}>Lines</MenuDropdownItem>
            <MenuDropdownItem onClick={() => setArmature({ showNodes: !armature.showNodes })} shortcut={check(armature.showNodes)}>Nodes</MenuDropdownItem>
            <MenuDropdownItem onClick={() => setArmature({ snap: !armature.snap })} shortcut={check(armature.snap)}>Snap</MenuDropdownItem>
            <MenuDropdownDivider />
```
