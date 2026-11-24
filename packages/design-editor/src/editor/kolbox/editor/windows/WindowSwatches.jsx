import { useMemo, useState, useSyncExternalStore } from 'react'
import { resolveCssVar, useColorTarget } from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { Button, Dropdown, Input, SwatchGrid, Tooltip } from '@kolkrabbi/kol-component'

/* Swatches, as the real SwatchesBody (color/SwatchesPanel.jsx) bound to the engine's colour target as the real
   SwatchesTab binds it: Recent (this session's last eight picks), the palette picker (AC, Standard, Custom) with Add
   swatch (the current colour into Custom) and the four fixed chips (None, Black, Grey, White), the grid, the hint while
   Custom is empty, Search. AC reads the KOL ramps live from the CSS tokens; Standard is the real one's 48; Custom is
   kept in the same storage key as the real one ("kol.editor.swatches"). The stores are the real file's, carried, since
   it keeps them private. */
const FG_STOPS = ['01', '02', '04', '08', '12', '16', '24', '32', '40', '48', '64', '80', '88', '96']
const GREY_STOPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const RED_STOPS = ['100', '200', '300', '400', '500']
const CREAM_STOPS = ['100', '200', '300', '400', '500']
const STANDARD_SWATCHES = [
  '#000000', '#262626', '#525252', '#737373', '#A3A3A3', '#D4D4D4', '#E5E5E5', '#FFFFFF',
  '#7F1D1D', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2',
  '#78350F', '#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7',
  '#14532D', '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7',
  '#1E3A8A', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE',
  '#581C87', '#7E22CE', '#9333EA', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF', '#F3E8FF',
]
const PALETTES = [{ value: 'ac', label: 'AC' }, { value: 'standard', label: 'Standard' }, { value: 'custom', label: 'Custom' }]
const FIXED = [{ hex: null, name: 'None' }, { hex: '#000000', name: 'Black' }, { hex: '#808080', name: 'Grey' }, { hex: '#FFFFFF', name: 'White' }]

const CUSTOM_KEY = 'kol.editor.swatches'
const RECENT_MAX = 8
let recent = []
let custom = (() => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) ?? [] } catch { return [] } })()
const subs = new Set()
const emit = () => subs.forEach((f) => f())
const pushRecent = (hex) => { if (!hex) return; recent = [hex, ...recent.filter((h) => h !== hex)].slice(0, RECENT_MAX); emit() }
const addCustom = (hex) => {
  if (!hex || custom.includes(hex)) return
  custom = [...custom, hex]
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom)) } catch { /* quota or private mode */ }
  emit()
}
const useSwatchStore = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => recent + '|' + custom)

/* a 16 chip: a color, or None on the checker */
const Chip = ({ hex, name, onClick }) => (
  <Tooltip variant="kolbox" label={name}>
    <button type="button" aria-label={name} onClick={onClick} data-swatch-fixed={name}
      className={`size-4 shrink-0 rounded-xs outline-none ring-1 ring-border ring-inset focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${hex ? '' : 'kol-kolbox-checker'}`}
      style={hex ? { background: hex } : undefined} />
  </Tooltip>
)

export default function WindowSwatches({ onClose }) {
  const target = useColorTarget()
  const currentHex = target.hex
  const [palette, setPalette] = useState('ac')
  const [query, setQuery] = useState('')
  useSwatchStore()

  const swatches = useMemo(() => {
    if (palette === 'ac') {
      const bank = (stops, v, label) => stops.map((st) => ({ hex: resolveCssVar(v(st)), name: `${label} ${st}` }))
      return [
        ...bank(FG_STOPS, (st) => `--kol-fg-${st}`, 'fg'),
        ...bank(RED_STOPS, (st) => `--kol-color-red-${st}`, 'red'),
        ...bank(CREAM_STOPS, (st) => `--kol-color-cream-${st}`, 'cream'),
        ...bank(GREY_STOPS, (st) => `--grey-${st}`, 'grey'),
        { hex: '#FFFFFF', name: 'white' }, { hex: '#000000', name: 'black' },
      ].filter((x) => x.hex && x.hex.startsWith('#'))
    }
    if (palette === 'custom') return custom.map((hex) => ({ hex, name: hex }))
    return STANDARD_SWATCHES.map((hex) => ({ hex, name: hex }))
  }, [palette, custom]) // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase()
  const shown = q ? swatches.filter((x) => x.name.toLowerCase().includes(q) || x.hex.toLowerCase().includes(q)) : swatches
  const pick = (hex) => { pushRecent(hex); target.onChange(hex ? hex.toUpperCase() : null) }

  return (
    <WindowPane title="Swatches" name="swatches" onClose={onClose}>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-help text-muted">Recent</span>
        <div className="flex h-5 min-w-0 flex-1 items-center gap-1 rounded-xs bg-field px-0.5" data-swatch-recent>
          {recent.map((hex) => <Chip key={hex} hex={hex} name={hex} onClick={() => pick(hex)} />)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Dropdown variant="kolbox" ariaLabel="Palette" options={PALETTES} value={palette} onChange={setPalette} className="min-w-0 flex-1" />
        <span className={currentHex ? 'contents' : 'invisible pointer-events-none'}>
          <Button variant="kolbox" iconOnly="plus" aria-label="Add swatch" onClick={() => { if (currentHex) { addCustom(currentHex); setPalette('custom') } }}/>
        </span>
        {FIXED.map((f) => <Chip key={f.name} hex={f.hex} name={f.name} onClick={() => pick(f.hex)} />)}
      </div>
      <SwatchGrid colors={[...new Set(shown.map((x) => x.hex))]} value={currentHex?.toUpperCase()} onChange={pick} />
      {palette === 'custom' && custom.length === 0 && <span className="text-help text-muted">Add the current colour with +</span>}
      <Input variant="kolbox" size="md" iconLeft="search" type="search" aria-label="Search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)}/>
    </WindowPane>
  )
}
