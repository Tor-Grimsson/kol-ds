# MenuDropdownItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 68 across 15 files in 8 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-single, kol-lightroom, kol-media-admin

## Import

```jsx
import { MenuDropdownItem } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-draw-3d/src/components/chrome/TopBar.jsx`:

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

From `kol-apparat/kol-plugin/kol-media-admin/src/components/molecules/Dropdown.jsx`:

```jsx
<MenuDropdownItem
                key={option.value}
                onClick={() => handleSelect(option)}
                shortcut={isActive ? <Icon name="check" size={11} />
```

From `kol-apparat/kol-labs-single/src/pages/kinetic/OpenTypeMenu.jsx`:

```jsx
<MenuDropdownItem
              key={f.tag}
              onClick={() => onToggle(f.tag, !value[f.tag])}
              shortcut={value[f.tag] ? <Icon name="check" size={11} />
```

From `kol-client/kol-client-ac/src/editor/compose/LayerStack.jsx`:

```jsx
<MenuDropdownItem
                    key={k.id}
                    iconLeft={<EditorIcon name={k.icon} size={12} />
```

From `kol-client/kol-client-acyr-website/apps/styleguide/src/editor/compose/LayerStack.jsx`:

```jsx
<MenuDropdownItem
              key={t.id}
              iconLeft={<EditorIcon name={TYPE_ICONS[t.id] ?? 'layer-shape'} size={12} />
```
