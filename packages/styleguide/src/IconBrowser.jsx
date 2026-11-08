import { useEffect, useMemo, useRef, useState } from 'react'
import { ContentFilters, ContentCollection, ContentRow, ViewToggle, Dropdown, Divider, IconPlate, IconToggle, TabsRow, Tooltip, Slider, ToggleCheckbox, Menu, MenuRow, MenuDivider } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: organism — an icon set's browser: the filter row with its size · ground · guide · LIST / GRID controls over the collection */

/**
 * IconBrowser — an icon set laid out to browse: ContentFilters (title, the filter chips, search; size, ground, keyline
 * guide and LIST / GRID in the one control row) over ContentCollection, each tile an IconPlate with the whole name and
 * its group under it; click copies the name. The showcase's icon gallery (ui.kolkrabbi.io/icons, showcase
 * pages/IconsGallery.jsx), exported as a component (LayoutGroup, 2026-10-31 — kol-atlas's Icons-2 view was a second copy
 * of it). The page around it — its title, intro, the set's groups — is the page's.
 *
 * An item is a kol-icons name, or raw SVG: `{ name, group, type?, tags?, svg? }` (`tags` feed the search). With an `svg` key the glyph is that markup
 * sized to the plate, and `svg: null` is a gap — an empty dashed plate.
 *
 * @param {Array}  items         the icons, `{ name, group, type?, svg? }` — `group` is the label the chips read
 * @param {Array}  filterGroups  ContentFilters' chip groups (default Tags over the items' groups)
 * @param {string} title         the filter row's title (default 'Icons')
 * @param {string} defaultGround `light` (default) · `dark`
 * @param {string} filters       `chips` (default) — ContentFilters' chip groups · `dropdown` — one multi-select menu a group,
 *                               all in one row under the header that the filter glyph shows and hides; every value starts
 *                               ticked, `All` (`group.all` names it) ticks or clears them, a row toggles and keeps the panel
 *                               open; the trigger reads All · the one value · `N of M` · None. An item passes when its
 *                               value, or any member of an array value, is ticked.
 * @param {boolean} labels       the name and group under each plate on first paint (default true)
 * @param {boolean} labelToggle  a Labels toggle in the control row (default false); with labels off the tiles are bare plates
 *                               in a dense grid, the name on a Tooltip
 * An item may carry `meta: [[key, value], …]` — listed under the name in the plate's Tooltip on hover (labels on or off).
 * @param {boolean} selectable   a Select toggle in the control row (default false). Select on: click toggles a plate,
 *                               shift-click selects the range from the last click in the shown order, cmd/ctrl-click
 *                               toggles, Escape clears, the row reads `N selected`; each plate shows the media library's
 *                               ToggleCheckbox top-left, and an All shown ToggleCheckbox takes every shown icon. Select off:
 *                               click copies the name.
 * @param {Array}  selected      the selected names, controlled (optional — the browser keeps its own without it)
 * @param {Function} onSelect    `(names) => …`, every change of the selection
 * @param {Function} onContextMenu `(selectedItems, event) => …` — right-click on a plate; an unselected plate becomes the
 *                               selection first. The browser draws no menu: the page opens its own (ContextMenu).
 * @param {string} persistKey    opt-in: the controls (ticked facet values, per row, size, ground, guide, labels, layout,
 *                               select mode, facets open) are kept in sessionStorage under `kol-icon-browser:<key>`, so a
 *                               reload comes back as it was. The selection is the page's (controlled `selected`).
 */

/* sessionStorage can throw (private mode, blocked storage) — the browser then just starts fresh */
const readSaved = (key) => {
  if (!key) return {}
  try { return JSON.parse(sessionStorage.getItem(`kol-icon-browser:${key}`)) ?? {} } catch { return {} }
}

/* FIT is the default (2026-10-09 — user: "why is the guide and icons not using the available space?
 * hard to visualise margins like this"): the 24 grid spans the whole tile, so the keylines read
 * edge to edge; a number still shows the glyph at that px */
const SIZES = [{ value: 'fit', label: 'Fit' }, ...[16, 20, 24, 32, 48, 64, 128].map((v) => ({ value: v, label: String(v) }))]
const GROUNDS = [
  { value: 'dark', label: 'Dark ground', icon: 'mode-toggle-01' },
  { value: 'light', label: 'Light ground', icon: 'brightness' },
]
const LAYOUTS = [{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]

/* The name steps down with the plate so the column can follow the size and the name still never breaks
 * mid-word: each floor is the set's longest unbroken run with its hyphen (`highlighter-`) measured at that
 * type, +2 (mono: 6 · 7.2 · 8.4 px a character). */
const nameType = (size) => (size !== 'fit' && size <= 20 ? ['kol-mono-10', 74] : size !== 'fit' && size <= 24 ? ['kol-mono-12', 89] : ['kol-mono-14', 103])

/* the glyph: a kol-icons name, or raw SVG sized to the plate (kol-atlas's icons are SVG strings); `svg: null` is a gap */
function Glyph({ item, size }) {
  if (!('svg' in item)) return <IconLoader name={item.name} size={size} />
  const box = size === '100%' ? '100%' : size
  return item.svg
    ? <span className="flex [&>svg]:size-full" style={{ width: box, height: box }} dangerouslySetInnerHTML={{ __html: item.svg }} />
    : <span className="border border-dashed border-current opacity-30" style={{ width: size === '100%' ? '50%' : size, height: size === '100%' ? '50%' : size }} />
}

/* THE TILE IS THE GALLERY'S OWN (2026-10-17): the DS plate — the box IS the size, guide and glyph fill it — with the
 * whole name and its group under it, in the catalog card's own voices. Click copies the name; nothing moves on hover. */
/* THE SELECT INDICATOR IS THE MEDIA LIBRARY'S (2026-10-31 — user: "we have a toggle component, why didnt you use that??"):
 * ToggleCheckbox variant="media" in the frame's top-left corner, `.kol-frame-control--top-left`, as MediaLibraryPages
 * puts it on ContentCard's `controlStart`. A sibling of the plate's button, never inside it. Its click carries the
 * modifiers (shift range, cmd toggle), so it goes through `onCopy` like the plate and the box's own toggle is held. */
function Check({ item, selected, onPick }) {
  return (
    <div className="kol-frame-control kol-frame-control--top-left">
      <ToggleCheckbox variant="media" checked={selected} onChange={() => {}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPick(item.name, e) }} aria-label={`Select ${item.name}`} />
    </div>
  )
}

/* META ON HOVER (2026-10-31 — user: "I dont see what group an icon is in … meta info about the icon"): an item's
 * `meta` — `[[key, value], …]` — listed under the name in the DS Tooltip, one fact a line, key in meta ink, value in
 * body ink, in the tooltip's own type. An array value joins with commas; empty and `none` values are left out. */
function tipOf(item, copied) {
  if (copied === item.name) return 'copied!'
  const rows = (item.meta ?? []).map(([k, v]) => [k, [].concat(v).filter((x) => x != null && x !== '' && x !== 'none').join(', ')]).filter(([, v]) => v)
  if (!rows.length) return item.name
  return (
    <span className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 leading-normal">
      <span className="col-span-2 text-emphasis">{item.name}</span>
      {rows.map(([k, v]) => <span key={k} className="contents"><span className="text-meta">{k}</span><span className="text-body">{v}</span></span>)}
    </span>
  )
}

function Tile({ item, size, ground, guide, copied, onCopy, labels = true, selecting = false, selected = false, onContextMenu }) {
  const check = selecting && <Check item={item} selected={selected} onPick={onCopy} />
  /* LABELS OFF (IconTreatment, 2026-10-31 — user: "I really just need to see the icons"): the bare plate, its name on the DS Tooltip */
  if (!labels) return (
    <div className="relative">
    <Tooltip label={tipOf(item, copied)} triggerClassName="flex">
      <button type="button" onClick={(e) => onCopy(item.name, e)} onContextMenu={onContextMenu && ((e) => onContextMenu(item, e))} aria-label={item.name} aria-pressed={selected || undefined} className="flex w-full cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-2">
        <IconPlate size={size === 'fit' ? 'fill' : size} ground={ground} guide={guide && item.svg !== null} >
          <Glyph item={item} size={size === 'fit' ? '100%' : size} />
        </IconPlate>
      </button>
    </Tooltip>
    {check}
    </div>
  )
  return (
    <div className="relative">
      <button type="button" onClick={(e) => onCopy(item.name, e)} onContextMenu={onContextMenu && ((e) => onContextMenu(item, e))} aria-pressed={selected || undefined} className="flex w-full flex-col items-start gap-3 text-left cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-2">
        <Tooltip label={item.meta ? tipOf(item, copied) : null} triggerClassName="flex w-full">
          <IconPlate size={size === 'fit' ? 'fill' : size} ground={ground} guide={guide && item.svg !== null} >
            <Glyph item={item} size={size === 'fit' ? '100%' : size} />
          </IconPlate>
        </Tooltip>
        <span className="flex flex-col gap-1">
          <span className={`${nameType(size)[0]} text-emphasis`}>{copied === item.name ? 'copied!' : item.name}</span>
          <span className="kol-mono-10 text-meta">{item.group}</span>
        </span>
      </button>
      {check}
    </div>
  )
}

/* The LIST row's thumb follows the size control too (2026-10-17); Fit keeps the row's own square. */
function RowGlyph({ item, size, ground, guide }) {
  return (
    <IconPlate size={size === 'fit' ? 'fill' : size} ground={ground} guide={guide && item.svg !== null}>
      <Glyph item={item} size={size === 'fit' ? 20 : size} />
    </IconPlate>
  )
}

/* A FACET IS A SET OF TOGGLES (2026-10-31 — user: "this should be a toggle, so if all then everything toggled on.. then I
 * could toggle away the group Im trying to sort into"). The Menu family's panel and rows with its ✓; a row's click
 * stops at the row so the panel stays open for the next one (Menu closes on a click bubbling from a row). The trigger
 * wears the Dropdown's own classes, so the row of facets looks as it did. */
const ROW = 'kol-menu-row kol-helper-12'
function FacetMenu({ group: g, off, onOff }) {
  const offSet = new Set(off)
  const on = g.values.filter((v) => !offSet.has(v))
  const text = on.length === g.values.length ? g.all ?? 'All' : on.length === 0 ? 'None' : on.length === 1 ? on[0] : `${on.length} of ${g.values.length}`
  const keep = (fn) => (e) => { e.stopPropagation(); fn() }
  return (
    <Menu
      className="w-full min-w-0"
      minWidth={200}
      items={[]}
      trigger={({ open, props }) => (
        <button type="button" {...props} aria-label={`${g.label}, ${text}`} data-state={open ? 'open' : 'closed'} className={`kol-btn kol-btn-sm kol-mono-12 kol-dd-trigger kol-tone-primary w-full ${open ? 'kol-dd-trigger--open' : ''}`}>
          <span className="kol-dd-label"><span>{text}</span></span>
          <IconLoader name="chevron-down" size={12} className="kol-dd-caret" />
        </button>
      )}
    >
      <MenuRow rowClass={ROW} onClick={keep(() => onOff(on.length === g.values.length ? [...g.values] : []))} indicator={on.length === g.values.length ? 'check' : undefined}>{g.all ?? 'All'}</MenuRow>
      <MenuDivider className="kol-menu-rule" />
      <div className="max-h-[60vh] overflow-y-auto">
        {g.values.map((v) => (
          <MenuRow key={v} rowClass={ROW} onClick={keep(() => onOff(offSet.has(v) ? off.filter((x) => x !== v) : [...off, v]))} indicator={offSet.has(v) ? undefined : 'check'}>{v}</MenuRow>
        ))}
      </div>
    </Menu>
  )
}

/* reports the shown names upward after paint — renders nothing */
function ShownRows({ rows, onRows }) {
  const key = rows.map((r) => r.name).join('\n')
  useEffect(() => { onRows(key ? key.split('\n') : []) }, [key, onRows])
  return null
}

export default function IconBrowser({ items = [], filterGroups, title = 'Icons', defaultGround = 'light', filters = 'chips', labels: labelsDefault = true, labelToggle = false, perRowControl = false, actions = null, selectable = false, selected: selectedProp, onSelect, onContextMenu, persistKey, className = '' }) {
  const [saved] = useState(() => readSaved(persistKey))
  /* light ground by default (2026-10-09 — user: "make light ground default") */
  const [ground, setGround] = useState(saved.ground ?? defaultGround)
  const [guide, setGuide] = useState(saved.guide ?? false)
  const [layout, setLayout] = useState(saved.layout ?? 'grid')
  const [size, setSize] = useState(saved.size ?? 'fit')
  const [copied, setCopied] = useState(null)
  const [labels, setLabels] = useState(saved.labels ?? labelsDefault)
  /* perRowControl: a Slider sets the grid's count per row (2026-10-31 — user: "give me input or slider for icon per row") */
  const [perRow, setPerRow] = useState(saved.perRow ?? 12)
  /* filters="dropdown": the values a group has TICKED OFF (none = all on), the row open on first paint */
  const [off, setOff] = useState(saved.off ?? {})
  const [facetsOpen, setFacetsOpen] = useState(saved.facetsOpen ?? true)

  /* SELECTION — controlled through `selected` / `onSelect`, or the browser's own */
  const [selecting, setSelecting] = useState(saved.selecting ?? false)
  /* persistKey: every control change is written back (2026-10-31 — user: "I cant do anything, it keeps refreshing") */
  useEffect(() => {
    if (!persistKey) return
    try { sessionStorage.setItem(`kol-icon-browser:${persistKey}`, JSON.stringify({ ground, guide, layout, size, labels, perRow, off, facetsOpen, selecting })) } catch { /* storage blocked — nothing kept */ }
  }, [persistKey, ground, guide, layout, size, labels, perRow, off, facetsOpen, selecting])
  const [ownSelected, setOwnSelected] = useState([])
  const selected = selectedProp ?? ownSelected
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const setSelected = (names) => { if (selectedProp === undefined) setOwnSelected(names); onSelect?.(names) }
  const anchor = useRef(null)
  /* Escape clears — not while a menu or dialog is open over it, so the Escape that closes one keeps the selection
   * (capture phase: the menu is still in the DOM when this runs) */
  const clearRef = useRef(null)
  clearRef.current = () => { if (selected.length) setSelected([]) }
  useEffect(() => {
    if (!selectable) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape' || document.querySelector('[role="menu"], [role="dialog"]') || e.target.closest?.('input, textarea')) return
      clearRef.current()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [selectable])
  /* a click in select mode: toggle · shift = the range from the last click, in the shown order · cmd/ctrl = toggle */
  const pick = (name, e, rows) => {
    if (e?.shiftKey && anchor.current != null) {
      const at = rows.map((r) => r.name)
      const [a, b] = [at.indexOf(anchor.current), at.indexOf(name)].sort((x, y) => x - y)
      if (a !== -1) { setSelected([...new Set([...selected, ...at.slice(a, b + 1)])]); return }
    }
    anchor.current = name
    setSelected(selectedSet.has(name) ? selected.filter((n) => n !== name) : [...selected, name])
  }
  /* the names the filters and the search show — reported from renderItem's rows after paint, so "All shown" takes
   * exactly what is on screen through ContentFilters' own search engine */
  const [visible, setVisible] = useState([])
  const visibleSet = useMemo(() => new Set(visible), [visible])
  const allShown = visible.length > 0 && visible.every((n) => selectedSet.has(n))
  const contextMenu = onContextMenu && ((item, e) => {
    e.preventDefault()
    const names = selectedSet.has(item.name) ? selected : [item.name]
    if (names !== selected) { anchor.current = item.name; setSelected(names) }
    const set = new Set(names)
    onContextMenu(items.filter((i) => set.has(i.name)), e)
  })

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const groups = filterGroups ?? [{ label: 'Tags', key: 'group', values: [...new Set(items.map((i) => i.group))] }]
  const dropdown = filters === 'dropdown'
  /* an item passes a facet when its value — or any of its array values — is still ticked */
  const shown = useMemo(() => {
    if (!dropdown) return items
    const on = Object.entries(off).filter(([, v]) => v.length).map(([k, v]) => [k, new Set(v)])
    return on.length ? items.filter((i) => on.every(([k, o]) => [].concat(i[k]).some((v) => !o.has(v)))) : items
  }, [dropdown, items, off])
  const facets = dropdown && facetsOpen ? (
    /* ONE ROW (2026-10-31 — user: "why are you breaking a new line"): every group an equal share of the width */
    <div className="grid w-full items-center gap-3" style={{ gridAutoFlow: 'column', gridAutoColumns: 'minmax(0, 1fr)' }}>
      {groups.map((g) => <FacetMenu key={g.key} group={g} off={off[g.key] ?? []} onOff={(v) => setOff((o) => ({ ...o, [g.key]: v }))} />)}
    </div>
  ) : null

  return (
    <ContentFilters
      className={className}
      items={shown}
      title={title}
      totalCount={items.length}
      /* `tags` (kol-icons KOL_ICON_TAGS, 2026-11-05): search finds an icon by what it is for — "lab" finds the flasks */
      searchKeys={['name', 'tags']}
      filterGroups={dropdown ? [] : groups}
      mutuallyExclusiveFilters={groups.map((g) => g.key)}
      showCountOnlyWhenFiltering
      {...(dropdown ? { filtersOpen: facetsOpen, onFiltersOpenChange: setFacetsOpen, leadingActions: facets } : null)}
      layout={layout}
      onLayoutChange={setLayout}
      /* ONE CONTROL ROW (2026-10-17): size · ground · guide │ LIST GRID, and no strip under the divider */
      trailingActions={
        <div className="flex items-center gap-6">
          {perRowControl && layout === 'grid' && <Slider label="Per row" min={2} max={32} value={perRow} onChange={setPerRow} size={120} formatValue={(v) => String(v)} displayWidth={3} />}
          <Dropdown tone="primary" options={SIZES} value={size} onChange={setSize} className="w-24" />
          <ViewToggle tone="primary" variant="icon" options={GROUNDS} viewMode={ground} onViewChange={setGround} />
          <IconToggle icon="grid" label="Guide" title="Keyline guide" pressed={guide} onChange={setGuide} size="md" />
          {labelToggle && <IconToggle icon="font-01" label="Labels" title="Names under the plates" pressed={labels} onChange={setLabels} size="md" />}
          {selectable && <IconToggle icon="pointer" label="Select" title="Select plates — click, shift-click a range, Escape clears" pressed={selecting} onChange={setSelecting} size="md" />}
          {selectable && (selecting || selected.length > 0) && <span className="kol-mono-12 text-meta tabular-nums">{selected.length} selected</span>}
          {selectable && selecting && <ToggleCheckbox label="All shown" checked={allShown} onChange={(on) => setSelected(on ? [...new Set([...selected, ...visible])] : selected.filter((n) => !visibleSet.has(n)))} />}
          <Divider variant="vertical" />
          <TabsRow variant="text" tabs={LAYOUTS} value={layout} onChange={setLayout} tracked className="gap-6" />
          {actions && <><Divider variant="vertical" />{actions}</>}
        </div>
      }
      renderItem={(rows) => {
        /* A NUMBER SIZES THE COLUMN (2026-10-17): the column is twice the plate, never under the name's floor; Fit keeps six across */
        /* labels off packs the wall: no name floor, the plate and a little air */
        const onTile = selecting ? (name, e) => pick(name, e, rows) : copy
        /* the reporter sits BESIDE the wall, never in it: ContentCollection wraps every child in a grid <li>, so a
         * child that renders nothing still took the first slot (the gallery's empty first tile, 2026-11-05) */
        const report = selectable && <ShownRows rows={rows} onRows={setVisible} />
        const cols = !labels
          ? { min: size === 'fit' ? '88px' : `${Math.round(size * 1.5)}px`, gap: 12 }
          : size === 'fit' ? { cols: 6, minCol: '160px' } : { min: `${Math.max(size * 2, nameType(size)[1])}px` }
        return <>{report}{layout === 'list' ? (
          <ContentCollection form="list">
            {rows.map((item) => (
              <ContentRow
                key={item.name}
                variant="catalog"
                title={copied === item.name ? 'copied!' : item.name}
                detail={item.group}
                thumb={size === 'fit' ? undefined : size}
                minHeight={size === 'fit' ? undefined : Math.max(36, size + 8)}
                media={<RowGlyph item={item} size={size} ground={ground} guide={guide} />}
                onClick={() => copy(item.name)}
              />
            ))}
          </ContentCollection>
        ) : perRowControl ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}>
            {rows.map((item) => <Tile key={item.name} item={item} size={size} ground={ground} guide={guide} copied={copied} onCopy={onTile} labels={labels} selecting={selecting} selected={selectedSet.has(item.name)} onContextMenu={contextMenu} />)}
          </div>
        ) : (
          <ContentCollection form="grid" {...cols}>
            {rows.map((item) => <Tile key={item.name} item={item} size={size} ground={ground} guide={guide} copied={copied} onCopy={onTile} labels={labels} selecting={selecting} selected={selectedSet.has(item.name)} onContextMenu={contextMenu} />)}
          </ContentCollection>
        )}</>
      }}
    />
  )
}
