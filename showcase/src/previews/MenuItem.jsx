import { MenuItem, MenuRow, MenuDivider, IconLoader } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

/* Index card: the CLOSED trigger only. The full preview below opens by default
 * and its panel is PORTALLED to <body> — floating-ui escapes overflow by
 * design, so a clipped index card cannot contain it and the open menu floated
 * over the whole /components page (user bug report 2026-08-09). */
export function Card() {
  return <MenuItem label="File">{null}</MenuItem>
}

export const sizes = ['md', 'xs', 'sm', 'lg']
export const tones = CONTROL_TONES
export const aligns = ALIGNS

/* no `variants`: the old list was the panel's offset (4 · 0 · -2) in the variant picker — not a look, so its three
 * entries rendered alike (plan-2026-10-31-menu-engine W3.3) */
export default function MenuItemPreview({ size = 'md', tone, align = 'start' }) {
  return (
    /* The panel is portalled (escapes overflow by design), so the preview must
       reserve the space it lands on — otherwise the open-by-default menu
       overlays whatever sits under the card in dense galleries. */
    <div className={`flex min-h-[220px] w-full items-start justify-center ${toneWrap(tone)}`}>
    <MenuItem key={align} label="File" size={size} align={align} defaultOpen>
      <div className="min-w-[180px] py-1">
        <MenuRow iconLeft={<IconLoader name="file" size={14} />} onClick={() => {}}>
          New file
        </MenuRow>
        <MenuRow iconLeft={<IconLoader name="save" size={14} />} kbd="⌘S" onClick={() => {}}>
          Save
        </MenuRow>
        <MenuRow iconLeft={<IconLoader name="download" size={14} />} onClick={() => {}}>
          Export…
        </MenuRow>
        <MenuDivider />
        <MenuRow iconLeft={<IconLoader name="trash" size={14} />} disabled onClick={() => {}}>
          Delete
        </MenuRow>
      </div>
    </MenuItem>
    </div>
  )
}
