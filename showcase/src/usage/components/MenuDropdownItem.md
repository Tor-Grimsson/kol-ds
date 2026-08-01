# MenuDropdownItem

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 116 across 23 files in 10 apps
- **Weighted inbound:** 78★ across 23 edges — 9×4★ · 14×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 13 | `kol-apps/kol-client-ac/src/editor/shell/MenuTop.jsx` |
| 4 | 13 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/shell/MenuTop.jsx` |
| 4 | 13 | `kol-apps/kol-client-kolkrabbi/src/editor/shell/MenuTop.jsx` |
| 4 | 13 | `kol-apps/kol-draw-3d/src/components/chrome/TopBar.jsx` |
| 4 | 13 | `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/chrome/TopBar.jsx` |
| 4 | 13 | `kol-apps/kol-labs-monorepo/apps/generator/src/editor/shell/MenuTop.jsx` |
| 4 | 13 | `kol-website/_tmp/brand-triage-elder/editor/shell/MenuTop.jsx` |
| 4 | 3 | `kol-apps/kol-draw-3d/src/components/studio/LayersPanel.jsx` |
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/draw-3d/src/components/studio/LayersPanel.jsx` |
| 3 | 2 | `kol-apps/kol-client-ac/src/editor/compose/LayerStack.jsx` |
| 3 | 2 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/compose/LayerStack.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/src/editor/compose/LayerStack.jsx` |
| … | | _11 more_ |

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
