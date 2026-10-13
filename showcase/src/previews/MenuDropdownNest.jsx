import { MenuItem, MenuDropdownItem, MenuDropdownNest, Icon } from '@kolkrabbi/kol-component'

/* accordion = the rows open inline; flyout = beside the row, a desktop menu bar's submenu */
export const variants = ['accordion', 'flyout']

/* Index card: closed trigger — the open panel is portalled to <body> and
 * floats over the index (see previews/MenuItem.jsx). */
export function Card() {
  return <MenuItem label="Insert">{null}</MenuItem>
}

const PRESETS = Array.from({ length: 40 }, (_, i) => `Preset ${String(i + 1).padStart(2, '0')}`)

export default function MenuDropdownNestPreview({ variant = 'accordion' }) {
  const flyout = variant === 'flyout'
  return (
    <MenuItem key={variant} label="Insert" defaultOpen>
      <div className="min-w-[200px] py-1">
        <MenuDropdownItem onClick={() => {}}>Text block</MenuDropdownItem>
        <MenuDropdownNest flyout={flyout} iconLeft={<Icon name="image" size={14} />} label="Media">
          <MenuDropdownItem onClick={() => {}}>Image</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Video</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Embed</MenuDropdownItem>
        </MenuDropdownNest>
        <MenuDropdownNest flyout={flyout} iconLeft={<Icon name="folder" size={14} />} label="Layout">
          <MenuDropdownItem onClick={() => {}}>Columns</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Divider</MenuDropdownItem>
          {flyout && (
            <MenuDropdownNest flyout scroll label="Presets">
              {PRESETS.map((p) => <MenuDropdownItem key={p} onClick={() => {}}>{p}</MenuDropdownItem>)}
            </MenuDropdownNest>
          )}
        </MenuDropdownNest>
      </div>
    </MenuItem>
  )
}
