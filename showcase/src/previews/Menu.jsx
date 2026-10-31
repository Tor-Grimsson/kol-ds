import { Menu, MenuTrigger } from '@kolkrabbi/kol-component'

/* Index card: the closed trigger — the open panel is portalled to <body> (see previews/MenuItem.jsx) */
export function Card() {
  return <Menu items={[]} trigger={({ open, props }) => <MenuTrigger open={open} icon="filter-lines" {...props}>Filter</MenuTrigger>} />
}

/* the base: a MenuTrigger and rows as data — a MenuLabel, rows with icons, ✓ and key caps, a MenuDivider, a flyout
 * (MenuFlyout) and a disabled row with its reason; `search` puts the field above the rows */
export const variants = ['rows', 'search']

const noop = () => {}
const ROWS = [
  { heading: 'Graph interval' },
  { label: 'Hours', kbd: 'H', onClick: noop },
  { label: 'Days', kbd: 'D', current: true, checked: true, onClick: noop },
  { divider: true },
  { label: 'Location', icon: 'pushpin', items: [{ label: 'Country', onClick: noop }, { label: 'City', onClick: noop }] },
  { label: 'Screen size', icon: 'monitor', disabled: true, tooltip: 'Not available' },
  { label: 'Export stats', trailing: 'download', onClick: noop },
]
const PROPS = ['Author', 'Category', 'Plan', 'Theme'].map((label) => ({ label, onClick: noop }))

export default function MenuPreview({ variant = 'rows' }) {
  return (
    <div className="flex min-h-[380px] w-full items-start justify-center">
      <Menu key={variant} defaultOpen stayOpen minWidth={variant === 'search' ? 280 : 224}
        search={variant === 'search' ? {} : undefined} items={variant === 'search' ? PROPS : ROWS}
        trigger={({ open, props }) => <MenuTrigger open={open} {...props}>{variant === 'search' ? 'Properties' : 'Menu'}</MenuTrigger>} />
    </div>
  )
}
