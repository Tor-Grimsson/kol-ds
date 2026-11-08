import { useState } from 'react'
import {
  Dropdown, SettingsMulti, MultiSelect, MenuFilter, MenuDatePicker, MenuMore, MenuItem, MenuRow, MenuDivider,
  ContextMenu, useContextMenu, IconLoader,
} from '@kolkrabbi/kol-component'
import Specimen from '../Specimen.jsx'

/* THE MENUS — one engine, `Menu` (plan-2026-10-31-menu-engine): every list that floats over a trigger is it, with a
 * different trigger. Each specimen is the behaviour, live: open it, pick, toggle, right-click. */

const SORT = [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }, { value: 'az', label: 'A → Z' }]
const SITES = ['kolkrabbi.io', 'metric.kolkrabbi.io', 'mirror.kolkrabbi.io', 'monitor.kolkrabbi.io'].map((h) => ({ value: h, label: h }))
const TONES = ['default', 'faint', 'grey', 'sunken', 'outline', 'ghost']
/* the page's own pickers: one size, tone and align for every control below, so the family changes together */
const opts = (list) => list.map((v) => ({ value: v, label: v }))
const PICKERS = [
  { id: 'size', label: 'Size', options: opts(['sm', 'md', 'lg', 'xs']) },
  { id: 'tone', label: 'Tone', options: opts(['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'faint', 'sunken']) },
  { id: 'align', label: 'Align', options: opts(['start', 'end']) },
]
const FILTERS = [
  { key: 'page', label: 'Page', icon: 'file', fields: [{ key: 'path', label: 'Page' }] },
  { key: 'location', label: 'Location', icon: 'pushpin', more: true, fields: [{ key: 'country', label: 'Country' }, { key: 'city', label: 'City' }] },
  { key: 'screen', label: 'Screen size', icon: 'monitor', fields: [], disabled: 'Not available' },
]
const RANGES = [
  [{ key: 'day', label: 'Today', kbd: 'D' }, { key: '7d', label: 'Last 7 Days', kbd: 'W' }],
  [{ key: '28d', label: 'Last 28 Days', kbd: 'F' }, { key: 'all', label: 'All time', kbd: 'A' }],
]
const COLS = [
  { id: 'variant', label: 'Variant', options: ['primary', 'grey'].map((v) => ({ value: v, label: v })) },
  { id: 'size', label: 'Size', options: ['sm', 'md', 'lg'].map((v) => ({ value: v, label: v })) },
]

export default function Menus() {
  const [sort, setSort] = useState('newest')
  const [sites, setSites] = useState(['kolkrabbi.io'])
  const [range, setRange] = useState('28d')
  const [unit, setUnit] = useState('day')
  const [cols, setCols] = useState({ variant: 'primary', size: 'sm' })
  const menu = useContextMenu()
  const [look, setLook] = useState({ size: 'sm', tone: 'default', align: 'start' })
  const { size, tone, align } = look
  const toggle = (h) => setSites((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h]))
  const rangeLabel = RANGES.flat().find((r) => r.key === range)?.label

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-end gap-3 py-4">
        <span className="kol-doc-caption">Every control below</span>
        <MultiSelect align="end" groups={PICKERS} value={look} onChange={(id, v) => setLook((s) => ({ ...s, [id]: v }))} />
      </div>
      <div className={tone === 'default' ? '' : `kol-tone-${tone}`}>
      <Specimen bare title="Select" ships="kol-component · Dropdown"
        does={['One pick. The list is fused under the trigger and takes its width.', 'A pick closes the list; the dot marks the current value.']}>
        <Dropdown size={size} value={sort} onChange={setSort} options={SORT} ariaLabel="Sort" />
      </Specimen>

      <Specimen bare title="Multiselect" ships="kol-component · SettingsMulti (Dropdown multiple)"
        does={['Many of N. The trigger reads N of M.', 'Each row toggles and the list stays open; the check marks every row that is on.']}>
        <div className="w-56"><SettingsMulti size={size} noun="sites" options={SITES} selected={sites} onToggle={toggle} /></div>
      </Specimen>

      <Specimen bare title="Filter" ships="kol-component · MenuFilter"
        does={['A chip trigger. Rows with › open their fields beside the row.', 'A disabled row says why on hover.']}>
        <MenuFilter key={align} groups={FILTERS} onPick={() => {}} align={align} />
      </Specimen>

      <Specimen bare title="Date picker" ships="kol-component · MenuDatePicker"
        does={['One pick, with its key: the cap is the shortcut, the dot is the current range.']}>
        <MenuDatePicker groups={RANGES} value={range} onChange={setRange} label={rangeLabel} align={align} key={align} />
      </Specimen>

      <Specimen bare title="More" ships="kol-component · MenuMore"
        does={['The ⋮ trigger. Its panel aligns to the trigger\u2019s end edge.', 'Actions and a single pick in one menu.']}>
        <div className="flex w-full justify-end">
          <MenuMore key={align} align={align} label="Graph settings" items={[
            { heading: 'Graph interval' },
            ...[['day', 'Days'], ['week', 'Weeks']].map(([key, label]) => ({ key, label, current: key === unit, indicator: key === unit ? 'dot' : undefined, onClick: () => setUnit(key) })),
            { divider: true },
            { key: 'export', label: 'Export stats', trailing: 'download', onClick: () => {} },
          ]} />
        </div>
      </Specimen>

      <Specimen bare title="Picker" ships="kol-component · MultiSelect"
        does={['Several pick-one settings, a column each. It stays open while you pick across columns.']}>
        <MultiSelect key={align} align={align} size={size} groups={COLS} value={cols} onChange={(id, v) => setCols((s) => ({ ...s, [id]: v }))} />
      </Specimen>

      <Specimen bare title="Menubar" ships="kol-component · MenuItem"
        does={['A named menu in a bar. Rows run actions; a key shows only when the row passes one.']}>
        <MenuItem key={align} label="File" size={size} align={align}>
          <MenuRow iconLeft={<IconLoader name="file" size={14} />} onClick={() => {}}>New file</MenuRow>
          <MenuRow iconLeft={<IconLoader name="save" size={14} />} kbd="⌘S" onClick={() => {}}>Save</MenuRow>
          <MenuDivider />
          <MenuRow iconLeft={<IconLoader name="trash" size={14} />} disabled onClick={() => {}}>Delete</MenuRow>
        </MenuItem>
      </Specimen>

      <Specimen bare title="Context menu" ships="kol-component · ContextMenu · useContextMenu"
        does={['No trigger: right-click a row and the menu opens at the pointer, with that row.']}>
        <ul className="flex w-64 flex-col">
          {['brand-guide.pdf', 'cover.jpg', 'notes.md'].map((row) => (
            <li key={row} onContextMenu={(e) => menu.openAt(e, row)} className="kol-mono-12 text-body border-b border-fg-08 px-3 py-2">{row}</li>
          ))}
        </ul>
        <ContextMenu menu={menu}>
          {(row) => (
            <>
              <MenuRow onClick={() => {}}>Rename {row}</MenuRow>
              <MenuRow onClick={() => {}}>Delete</MenuRow>
            </>
          )}
        </ContextMenu>
      </Specimen>

      <Specimen bare title="Tone comes from the wrapper" ships="kol-theme · kol-tone-*"
        does={['The same Select in a wrapper of each tone, side by side. Nothing is set on the control: trigger and list both follow the wrapper.']}>
        {TONES.map((t) => (
          <div key={t} className={`flex flex-col gap-2 ${t === 'default' ? '' : `kol-tone-${t}`}`}>
            <span className="kol-doc-caption">{t}</span>
            <Dropdown size={size} value={sort} onChange={setSort} options={SORT} ariaLabel={`Sort, ${t}`} />
          </div>
        ))}
      </Specimen>
      </div>
    </div>
  )
}
