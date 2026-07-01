import { MenuPopover, Icon } from '@kolkrabbi/kol-component'

/* MenuPopover's companion MenuItem/MenuDivider are not exported from the
 * barrel — only MenuPopover is. Rows are authored as `data-menu-item`
 * buttons (the attr the panel matches to close on click), mirroring the
 * row styling the component uses internally. */
const itemClass =
  'w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-meta hover:text-emphasis hover:bg-fg-08 text-left'

const Item = ({ icon, children }) => (
  <button type="button" data-menu-item className={itemClass} onClick={() => {}}>
    <span className="shrink-0 w-4 inline-flex items-center justify-center text-meta">
      <Icon name={icon} size={14} />
    </span>
    <span className="flex-1">{children}</span>
  </button>
)

export const ActionsMenu = () => (
  <MenuPopover label="Actions" panelClassName="w-[200px] py-1">
    <Item icon="plus">New item</Item>
    <Item icon="settings-01">Settings</Item>
    <div className="border-t border-fg-08 my-1" />
    <Item icon="trash">Delete</Item>
  </MenuPopover>
)

export const AlignEnd = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <MenuPopover label="More" align="end" panelClassName="w-[180px] py-1">
      <Item icon="search">Find…</Item>
      <Item icon="check">Mark done</Item>
    </MenuPopover>
  </div>
)
