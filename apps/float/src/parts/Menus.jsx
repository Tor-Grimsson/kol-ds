import { useState } from 'react'
import {
  AccountMenu, ContentFilters, ContextMenu, Dropdown, Icon, Menu, MenuDivider, MenuFilter, MenuFlyout, MenuLabel, MenuMore,
  MenuPanel, MenuRow, MenuTrigger, PanelsMenu, WorkspaceSwitcher, floatSurfaceClass, useContextMenu,
} from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — family 4, Menus (24-float-system.md § The parts, by family). Each part sits on the page's float
 * material (`floatSurfaceClass`) and links to its showcase page. The live triggers open their portalled lists; beside
 * them a `MenuPanel variant="float"` holds the same rows open in the page flow, so the list is visible without a click.
 * Layout glue only; every part is the shipped one. */
const Plate = ({ surface, className = '', children }) => (
  <div className={`${floatSurfaceClass(surface, true)} flex max-w-full flex-wrap items-start gap-4 rounded-[var(--kol-float-menu-r)] p-4 ${className}`}>{children}</div>
)

const noop = () => {}
/* the float row class, as Menu's own rows and the ContextMenu preview set it */
const ROW = 'kol-menu-row kol-helper-12'
const glyph = (name) => <Icon name={name} size={16} />

const ITEMS = [
  { heading: 'Layer' },
  { label: 'Duplicate', icon: 'copy', kbd: '⌘D', onClick: noop },
  { label: 'Rename', onClick: noop },
  { label: 'Arrange', items: [{ label: 'Bring to front', onClick: noop }, { label: 'Send to back', onClick: noop }] },
  { divider: true },
  { label: 'Snap to grid', checked: true, onClick: noop },
  { label: 'Lock', disabled: true, tooltip: 'Nothing selected' },
  { label: 'Delete layer', icon: 'trash', tone: 'danger', onClick: noop },
]
const FILTER_GROUPS = [
  { key: 'kind', label: 'Kind', icon: 'layers', more: true, fields: [{ key: 'video', label: 'Video' }, { key: 'still', label: 'Still' }] },
  { key: 'owner', label: 'Owner', icon: 'user', fields: [{ key: 'me', label: 'Me' }] },
]
const SORTS = [{ value: 'recent', label: 'Most recent' }, { value: 'name', label: 'Name' }, { value: 'size', label: 'Size' }]
const WORKSPACES = [{ value: 'personal', label: 'Personal / Kolkrabbi' }, { value: 'studio', label: 'Studio / Personal' }, { value: 'archive', label: 'Archive' }]
const FILES = ['brand-guide.pdf', 'cover.jpg', 'notes.md']
const CATALOGUE = [
  { id: 1, name: 'Opening titles', kind: 'Video', owner: 'Alex' },
  { id: 2, name: 'Cover still', kind: 'Still', owner: 'Sam' },
  { id: 3, name: 'Trailer cut', kind: 'Video', owner: 'Sam' },
  { id: 4, name: 'Poster', kind: 'Still', owner: 'Alex' },
]
const CATALOGUE_GROUPS = [{ label: 'Kind', key: 'kind', values: ['Video', 'Still'] }, { label: 'Owner', key: 'owner', values: ['Alex', 'Sam'] }]
const PANELS = [
  { id: 'side', name: 'Side Rail', meta: 'Layers, assets', state: 'Hidden', action: 'Show', primary: true },
  { id: 'inspector', name: 'Inspector', meta: 'Properties', state: 'Folded', action: 'Expand' },
]
const ACCOUNT = [
  { label: 'Profile', icon: 'user', onClick: noop },
  { label: 'Settings', icon: 'nav-settings', kbd: '⌘,', onClick: noop },
  { divider: true },
  { label: 'Sign out', tone: 'danger', onClick: noop },
]

export default function Menus() {
  const [sort, setSort] = useState('recent')
  const [ws, setWs] = useState('personal')
  const ctx = useContextMenu()
  return (
    <FamilyPage title="Menus" body="Lists that float over a trigger — the list radius, 34 rows, flyouts 8 off their row.">
      {(surface) => (
        <>
          <Part name="the Menu family float" slug="menu">
            <Plate surface={surface}>
              <div className="flex flex-wrap items-center gap-3">
                <Menu variant="float" items={ITEMS} minWidth={224} offset={8} trigger={({ open, props }) => <MenuTrigger variant="float" open={open} icon="layers" {...props}>Layer</MenuTrigger>} />
                <MenuFilter variant="float" groups={FILTER_GROUPS} onPick={noop} />
                <MenuMore variant="float" label="More" items={ITEMS.filter((it) => !it.items && !it.heading)} />
              </div>
              <MenuPanel variant="float" className="w-56">
                <MenuLabel>Layer</MenuLabel>
                <MenuRow rowClass={ROW} iconLeft={glyph('copy')} kbd="⌘D" onClick={noop}>Duplicate</MenuRow>
                <MenuRow rowClass={`${ROW} kol-menu-row--current`} indicator="dot" onClick={noop}>Rename</MenuRow>
                <MenuFlyout flyout label="Arrange" rowClass={ROW} panelClassName="kol-menu-panel kol-menu-panel--float min-w-[160px]" panelStyle={{ marginLeft: 8 }}>
                  <MenuRow rowClass={ROW} onClick={noop}>Bring to front</MenuRow>
                  <MenuRow rowClass={ROW} onClick={noop}>Send to back</MenuRow>
                </MenuFlyout>
                <MenuDivider className="kol-menu-rule" />
                <MenuRow rowClass={ROW} indicator="check" onClick={noop}>Snap to grid</MenuRow>
                <MenuRow rowClass={ROW} disabled>Lock</MenuRow>
              </MenuPanel>
            </Plate>
          </Part>

          <Part name="a destructive row" slug="menu">
            <Plate surface={surface}>
              <MenuPanel variant="float" className="w-56">
                <MenuRow rowClass={ROW} onClick={noop}>Rename</MenuRow>
                <MenuRow rowClass={ROW} tone="danger" iconLeft={glyph('trash')} onClick={noop}>Delete layer</MenuRow>
              </MenuPanel>
            </Plate>
          </Part>

          <Part name="Dropdown fused" slug="dropdown">
            <Plate surface={surface}><Dropdown variant="float" size="md" options={SORTS} value={sort} onChange={setSort} ariaLabel="Sort" /></Plate>
          </Part>

          <Part name="ContextMenu + MenuFlyout" slug="context-menu">
            <Plate surface={surface} className="w-72 flex-col items-stretch">
              <ul className="flex flex-col">
                {FILES.map((f) => (
                  <li key={f} onContextMenu={(e) => ctx.openAt(e, f)} className="kol-float-body cursor-context-menu rounded-[var(--kol-float-list-r)] px-3 py-2 text-fg-emphasis hover:bg-fg-04">{f}</li>
                ))}
              </ul>
              <span className="kol-float-hint text-fg-64">Right-click a row.</span>
              {ctx.open && (
                <ContextMenu menu={ctx} variant="float">
                  <MenuRow rowClass={ROW} onClick={noop}>Duplicate</MenuRow>
                  <MenuFlyout flyout label="Move to" rowClass={ROW} panelClassName="kol-menu-panel kol-menu-panel--float min-w-[160px]" panelStyle={{ marginLeft: 8 }}>
                    <MenuRow rowClass={ROW} onClick={noop}>Archive</MenuRow>
                    <MenuRow rowClass={ROW} onClick={noop}>Studio</MenuRow>
                  </MenuFlyout>
                  <MenuRow rowClass={ROW} tone="danger" iconLeft={glyph('trash')} onClick={noop}>Delete</MenuRow>
                </ContextMenu>
              )}
            </Plate>
          </Part>

          <Part name="ContentFilters" className="w-full" slug="content-filters">
            <Plate surface={surface} className="w-full">
              <div className="w-full min-w-0">
                <ContentFilters variant="float" filtersOpen onFiltersOpenChange={noop} title="Library" items={CATALOGUE} totalCount={CATALOGUE.length} filterGroups={CATALOGUE_GROUPS}
                  renderItem={(rows) => (
                    <ul className="flex flex-col gap-2">
                      {rows.map((r) => <li key={r.id} className="kol-float-body flex justify-between gap-4 text-fg-emphasis"><span>{r.name}</span><span className="text-fg-64">{r.kind} · {r.owner}</span></li>)}
                    </ul>
                  )} />
              </div>
            </Plate>
          </Part>

          <Part name="PanelsMenu" slug="panels-menu">
            <Plate surface={surface} className="w-full max-w-md"><PanelsMenu panels={PANELS} onAction={noop} /></Plate>
          </Part>

          <Part name="WorkspaceSwitcher" slug="workspace-switcher">
            <Plate surface={surface}><WorkspaceSwitcher variant="float" workspaces={WORKSPACES} value={ws} onChange={setWs} /></Plate>
          </Part>

          <Part name="AccountMenu" slug="account-menu">
            <Plate surface={surface} className="items-center">
              <AccountMenu initial="A" name="Alex" items={ACCOUNT} />
              <AccountMenu name="Signed out" items={ACCOUNT.slice(0, 2)} />
            </Plate>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
