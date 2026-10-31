/* /demo-7 — plan 2026-10-30-metric-style, W8: plausible.io/plausible.io is the spec for structure and behaviour, KOL is
 * the look. Live Umami data through api/demo7.js. Everything in src/demo7/ is local until he approves the look (8.0);
 * nothing else imports it. */
import { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, Tooltip, Input, SettingsPanel, SettingsRow, SettingsChoice, ToggleCheckbox, SettingsMulti, ShortcutsOverlay, CommandOverlay, IconFrame, SettingsSections, MenuFilter, MenuDatePicker, MenuMore } from '@kolkrabbi/kol-component'
import { Dialog } from '@kolkrabbi/kol-component'
import CalendarIcon from './CalendarIcon.jsx'
import TopStats, { Chart, seriesFor, METRICS } from './TopStats.jsx'
import { SourcesCard, PagesCard, LocationsCard, DevicesCard } from './Cards.jsx'
import BehavioursCard from './Behaviours.jsx'
import { Nine, Ten, Eleven } from './nine.js'
import { CodeSection11, DeploysSection11, StorageSection11, WeekdayGrid11 } from './Sections11.jsx'
import { HubSettingsRail } from '@kolkrabbi/kol-shell'
import { createIndex, search as searchIndex } from '@kolkrabbi/kol-search'
import { DEPLOY_STATE_LABELS, timeAgo } from '@kolkrabbi/kol-dashboards'
import { MILESTONES } from '../milestones.js'
import { SECTIONS, useLive, DeployLine, LiveSection, WeekdayGrid, SiteExtras, Editing, Sized } from './Sections.jsx'
import {
  umami, getJson, useAsync, RANGE_GROUPS, RANGES, periodOf, intervalsOf, comparisonOf, filterParams, OPS, FILTER_LABEL,
  fmtRange, fmtNum, isDevHost, countryName,
} from './data.js'

const UMAMI_SETTINGS = 'https://kol-umami.vercel.app/websites/fcd04534-5dcd-44a3-b7b1-256cbdf49ab9/settings'
/* Round 3: the repo (its git remote) and the page that documents this app */
const REPO_URL = 'https://github.com/Tor-Grimsson/kol-ds'
const DOCS_URL = 'https://ui.kolkrabbi.io/apps/metric'
const Visit = ({ href }) => <Button size="sm" iconRight="external-link" className="w-full" onClick={() => window.open(href, '_blank', 'noopener')}>Visit</Button>
const UNIT_LABEL = { minute: 'Minutes', hour: 'Hours', day: 'Days', week: 'Weeks', month: 'Months' }
const COMPARE = [
  { key: 'previous', label: 'Previous period' },
  { key: 'year', label: 'Year over year' },
  { key: 'custom', label: 'Custom period' },
]
/* W10 — plausible.io's menus in KOL's tones: every menu here is the KOL Menu* family (MenuFilter · MenuDatePicker ·
 * MenuMore, Round 4 2026-10-31) — this file holds their data and callbacks only */

/* plausible.io draws ‹ › only when the period is one calendar day, month or year */
const STEPPED = new Set(['day', 'yesterday', 'month', 'lastmonth', 'year'])
const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }

/* `eight` is /demo-8: the site picker moves into the settings rail (with Site settings), the toolbar shows the picked
 * site, a gear opens the rail, and the rail offers the colour tile row. /demo-7 is unchanged without it. */
export default function DemoSeven({ eight = false, nine = false, ten = false, eleven = false }) {
  /* /demo-11 (15.7): hour-based cards use this zone — the viewer's own by default, UTC an option */
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  /* /demo-9: the section (Site · Project · Infrastructure · Sessions, as the live page), several sites at once */
  const [section, setSection] = useState('site')
  const [sites, setSites] = useState([])
  const [editing, setEditing] = useState(false)
  /* /demo-9 wraps a card so Edit can resize it; elsewhere a card is itself */
  const S = (id, el, className) => (nine ? <Sized id={id} className={className}>{el}</Sized> : el)
  /* /demo-10 (13.7): the colour row is the default, Plausible's the second choice */
  const [tiles, setTiles] = useState(ten ? 'colour' : 'plausible')
  const [keysOpen, setKeysOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [range, setRange] = useState('28d')
  const [custom, setCustom] = useState(null)
  /* off until Compare is chosen — plausible.io loads with no comparison (9.3, P39) */
  const [compare, setCompare] = useState('off')
  const [customCompare, setCustomCompare] = useState(null)
  const [interval, setInterval_] = useState(null)
  const [weekStart, setWeekStart] = useState(1)
  const [metric, setMetric] = useState('visitors')
  const [site, setSite] = useState(null)
  const [filters, setFilters] = useState([])
  const [dates, setDates] = useState(null) /* 'range' | 'compare' — the custom dates dialog */
  const [filterOpen, setFilterOpen] = useState(null) /* the filter dialog: { group, field? } */
  const [settings, setSettings] = useState(false)
  const [tick, setTick] = useState(0)

  const realtime = range === 'realtime'
  /* fixed when picked (a range ending "now" would otherwise move on every render); realtime moves with the 30 s tick */
  const period = useMemo(() => (realtime ? { start: Date.now() - 30 * 60000, end: Date.now() } : periodOf(range, custom)), [range, custom, realtime && tick])
  const intervals = realtime ? ['minute'] : intervalsOf(range, period)
  const unit = intervals.includes(interval) ? interval : intervals[0]
  const comparison = realtime || compare === 'off' ? null : comparisonOf(compare, period, customCompare)
  const hostFilter = nine
    ? (sites.length ? [{ key: 'hostname', op: 'eq', value: sites.length === 1 ? sites[0] : sites }] : [])
    : (site ? [{ key: 'hostname', op: 'eq', value: site }] : [])
  const allFilters = [...hostFilter, ...filters]

  /* realtime and the live count refresh every 30 seconds, as Plausible's */
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 30000); return () => clearInterval(t) }, [])
  const live = useAsync(() => umami('/active', { t: tick }), tick, true)
  const total = useAsync(() => umami('/stats', { startAt: period.start, endAt: period.end, ...filterParams(allFilters) }), JSON.stringify([range, custom, allFilters, realtime && tick]))

  const pickRange = (key) => {
    if (key === 'custom') { setDates('range'); return }
    setRange(key)
    setInterval_(null)
  }
  const toggleCompare = () => setCompare((c) => (c === 'off' ? 'previous' : 'off'))
  const addFilter = (f) => setFilters((fs) => [...fs.filter((x) => x.key !== f.key), f])

  /* Plausible's keys: one letter per range, X compare; ours adds , for settings */
  useEffect(() => {
    const onKey = (e) => {
      /* ⌘, / Ctrl+, opens the settings rail, as on the live page */
      if ((e.metaKey || e.ctrlKey) && e.key === ',') { e.preventDefault(); setSettings(true); return }
      /* /demo-10 (13.5): ⌘K search */
      if (ten && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); return }
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input, textarea, select, [contenteditable]') || document.querySelector('[data-dialog]')) return
      if (e.key === ',') { e.preventDefault(); setSettings((s) => !s); return }
      /* /demo-10 (13.5, 13.6): E edits the layout (his key — so Yesterday gives up plausible's E), ? lists every key */
      if (ten && e.key.toLowerCase() === 'e') { setEditing((v) => !v); return }
      if (ten && e.key === '?') { setKeysOpen(true); return }
      if (e.key.toLowerCase() === 'x') { toggleCompare(); return }
      const r = RANGES.find((x) => x.k.toLowerCase() === e.key.toLowerCase())
      if (r) { pickRange(r.key); return }
      /* plausible.io's two keys that have no row in its list: T last 30 days, S last 6 months */
      const hidden = { t: 30, s: 182 }[e.key.toLowerCase()]
      if (hidden) { const end = dayStart(Date.now()) - 1; setCustom({ start: end + 1 - hidden * 86400000, end }); setRange('custom'); setInterval_(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* clicking a day / week / month on the chart opens that span */
  const onPickBucket = (t, u) => {
    const d = new Date(t)
    let end
    if (u === 'day') end = t + 86400000 - 1
    else if (u === 'week') end = t + 7 * 86400000 - 1
    else { d.setMonth(d.getMonth() + 1); end = d.getTime() - 1 }
    setCustom({ start: t, end: Math.min(end, Date.now()) })
    setRange('custom')
    setInterval_(null)
  }

  /* ‹ › beside the date picker: the same length, one step back or forward, never past now (plausible's MovePeriodArrows) */
  const movePeriod = (dir) => {
    const len = period.end - period.start + 1
    const start = period.start + dir * len
    if (start > Date.now()) return
    setCustom({ start, end: Math.min(start + len - 1, Date.now()) })
    setRange('custom')
  }
  const canForward = period.end < dayStart(Date.now()) - 1

  const exportStats = async () => {
    const { buckets, values } = await seriesFor('visitors', period, unit, allFilters, weekStart)
    const pv = await seriesFor('pageviews', period, unit, allFilters, weekStart)
    const csv = ['date,visitors,pageviews', ...buckets.map((b, i) => `${new Date(b).toISOString()},${values[i]},${pv.values[i]}`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `kolkrabbi-visitors-${new Date(period.start).toISOString().slice(0, 10)}-${new Date(period.end).toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const visitors = total.data?.visitors || 0
  const cardProps = { period, comparison, filters: allFilters, total: visitors, onFilter: addFilter }

  /* `lv` is the live page's data (/demo-9 only — its hook runs inside WithLive, never on /demo-7 or /demo-8) */
  const page = (lv) => (
    <>
    {/* /demo-11 (16.4): the DS page shell media stands in (`kol-shell-page` — its padding token), not a local p-10 */}
    <div className={eleven ? 'kol-shell-page text-fg-88 flex flex-col' : 'min-h-screen bg-surface-primary text-fg-88 p-4 md:p-10 flex flex-col'} style={{ gap: eleven ? 24 : 'var(--kol-gap-wall-grid)' }}>

      {/* the live page's title, back (user 2026-10-31): METRICS in the display face, going home; /demo-9 adds the
        * live page's section switcher on its right */}
      {/* /demo-11 (16.4): media's head — the title on a 1 line-height, 48 tall at 48 from the top */}
      <div className={`flex items-center justify-between gap-4 `}>
        <h1>
          <a href="https://kolkrabbi.io" className={`kol-sans-display-03 text-auto no-underline hover:opacity-80 transition-opacity ${eleven ? 'block leading-none' : ''}`}>METRICS</a>
        </h1>
        {nine && !ten && <Dropdown className="min-w-0 max-w-[45vw]" value={section} onChange={setSection} options={SECTIONS} ariaLabel="Dashboard section" />}
        {/* /demo-11 (16.4): the gear where media keeps it — the title row's right, KOL IconFrame as LibraryHeader's */}
        {eleven && (
          <div className="kol-tone-faint flex items-center gap-2 min-w-0">
          <SitesPicker period={period} sites={sites} setSites={setSites} />
          <Tooltip label="Settings">
            <IconFrame name="settings-01" size="sm" onClick={() => setSettings(true)} aria-label="Settings" />
          </Tooltip>
          </div>
        )}
      </div>
      {nine && !ten && lv && <DeployLine live={lv} />}

      {nine && !ten && section !== 'site' ? <LiveSection section={section} live={lv} /> : (<div className={eleven ? 'flex flex-col gap-3' : 'contents'}>
      {/* /demo-11: media's page — the head, 24, then ONE column: the crumb row, 12 (gap-3), the content; elsewhere
        * these wrappers are `contents`, so /demo-7…10 lay out exactly as before */}

      {/* ── toolbar: site and live count left; Filter, dates, vs, comparison, ⋮ right (8.1–8.6) ── */}
      {/* Round 6 (user 2026-10-31): the active filters live inside the Filter menu — the row reserves nothing */}
      <div id="section-site" className="flex flex-wrap items-center gap-2">
        {/* plausible.io: the site is plain text, no menu — a host is picked through Filter › Hostname */}
        {eleven ? (
          /* /demo-11 (16.5): media's crumb (MediaLibraryPages' crumbCls) — mono-12 caps, the site dim, a `/`, the live count
           * bright and still the way into realtime */
          <div className="flex items-center gap-2 kol-mono-12">
            <span className="text-[var(--kol-oq-48)]">{(sites.length === 1 ? sites[0] : sites.length > 1 ? `${sites.length} sites` : 'kolkrabbi.io').toUpperCase()}</span>
            <span className="text-[var(--kol-oq-32)]">/</span>
            <Tooltip label="Click to view realtime dashboard" placement="top">
              <Button variant="bare" onClick={() => pickRange('realtime')} className="inline-flex items-center gap-2 cursor-pointer select-none text-[var(--kol-oq-96)] hover:text-[var(--kol-oq-64)] transition-colors">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ui-success)' }} />
                {`${fmtNum(live.data?.visitors ?? live.data?.x ?? 0)} CURRENT VISITOR${(live.data?.visitors ?? live.data?.x) === 1 ? '' : 'S'}`}
              </Button>
            </Tooltip>
          </div>
        ) : (<>
        <span className="kol-helper-14 text-fg-96 px-1">{nine ? (sites.length === 1 ? sites[0] : sites.length > 1 ? `${sites.length} sites` : 'kolkrabbi.io') : eight && site ? site : 'kolkrabbi.io'}</span>
        <Tooltip label="Click to view realtime dashboard" placement="top">
        <Button tone="ghost" size="sm" onClick={() => pickRange('realtime')} className="whitespace-nowrap">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ui-success)' }} />
            {fmtNum(live.data?.visitors ?? live.data?.x ?? 0)} current visitor{(live.data?.visitors ?? live.data?.x) === 1 ? '' : 's'}
          </span>
        </Button>
        </Tooltip>
        </>)}
        <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">
        {/* Round 6 (user 2026-10-31): the active filters are the menu's "Active" section — a row edits, × removes; no
          * count, the trigger holds its pressed ground while any is set */}
        <MenuFilter onPick={setFilterOpen} onClear={() => setFilters([])} onRemove={(c) => setFilters((fs) => fs.filter((x) => x.key !== c.key))}
          groups={Object.entries(FILTER_GROUPS).flatMap(([key, g], i) => {
            const row = { key, label: g.label, icon: g.icon, more: g.more, fields: g.fields, disabled: !g.fields.length && FILTER_WHY(key) }
            return i === 0 ? [row, { divider: true }] : [row]
          })}
          active={filters.map((f) => {
            const [group, g] = Object.entries(FILTER_GROUPS).find(([, x]) => x.fields.some((y) => y.key === f.key)) || []
            return { key: f.key, group, field: g?.fields.length > 1 ? f.key : undefined, label: `${FILTER_LABEL[f.key]} ${OPS.find((o) => o.value === f.op).label} ${f.key === 'country' ? countryName(f.value) : f.value}` }
          })} />
        {STEPPED.has(range) && (
          <span className="inline-flex items-center">
            <Button tone="ghost" size="sm" iconOnly="chevron-left" aria-label="Previous period" onClick={() => movePeriod(-1)} />
            <Button tone="ghost" size="sm" iconOnly="chevron-right" aria-label="Next period" onClick={() => movePeriod(1)} disabled={!canForward} />
          </span>
        )}
        {/* the date, comparison and ⋮ menus: the KOL Menu* family, as plausible.io's (Round 4) */}
        <MenuDatePicker value={range} onChange={pickRange} iconComponent={<CalendarIcon />}
          label={RANGES.find((r) => r.key === range)?.key === 'custom' && custom ? fmtRange(custom) : RANGES.find((r) => r.key === range)?.label}
          groups={RANGE_GROUPS.map((g) => g.map((r) => ({ key: r.key, label: r.key === 'custom' && custom ? fmtRange(custom) : r.label, kbd: r.k })))}
          compare={{ label: compare === 'off' ? 'Compare' : 'Disable comparison', kbd: 'X', onClick: toggleCompare }} />
        {comparison && (
          <span className="inline-flex items-center gap-2">
            <span className="kol-helper-12 text-fg-64 px-1">vs</span>
            <MenuDatePicker value={compare} iconComponent={<CalendarIcon />}
              label={compare === 'custom' && customCompare ? fmtRange(customCompare) : COMPARE.find((c) => c.key === compare)?.label}
              groups={[COMPARE.map((c) => ({ key: c.key, label: c.key === 'custom' && customCompare ? fmtRange(customCompare) : c.label }))]}
              onChange={(key) => (key === 'custom' ? setDates('compare') : setCompare(key))} />
          </span>
        )}
        <MenuMore label="Graph settings" items={[
          { heading: 'Graph interval' },
          ...intervals.map((u) => ({ key: u, label: UNIT_LABEL[u], current: u === unit, indicator: u === unit ? 'dot' : undefined, onClick: () => setInterval_(u) })),
          { divider: true },
          { key: 'export', label: 'Export stats', trailing: 'download', onClick: exportStats },
        ]} />
        {nine && !ten && (
          <Button tone="ghost" size="sm" onClick={() => setEditing((v) => !v)}>{editing ? 'Done' : 'Edit'}</Button>
        )}
        {eight && !eleven && (
          <Button tone="ghost" size="sm" iconOnly="settings-01" aria-label="Settings" onClick={() => setSettings(true)} />
        )}
        </div>
      </div>

      <div className={eleven ? 'flex flex-col' : 'contents'} style={eleven ? { gap: 'var(--kol-gap-wall-grid)' } : undefined}>
      {realtime
        ? <Realtime period={period} filters={allFilters} live={live.data} tick={tick} metric={metric === 'pageviews' ? 'pageviews' : 'visitors'} setMetric={setMetric} />
        : S('stats', <TopStats variant={eight ? tiles : 'plausible'} period={period} comparison={comparison} unit={unit} filters={allFilters} metric={metric} setMetric={setMetric} onPickBucket={onPickBucket} weekStart={weekStart} traffic={lv?.siteData?.dailyVisits} />)}

      {nine && S('weekday', eleven ? <WeekdayGrid11 period={period} filters={allFilters} timezone={timezone} /> : <WeekdayGrid period={period} filters={allFilters} />)}

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--kol-gap-wall-grid)' }}>
        {S('sources', <SourcesCard {...cardProps} />)}
        {S('pages', <PagesCard {...cardProps} />)}
        {S('locations', <LocationsCard {...cardProps} />)}
        {S('devices', <DevicesCard {...cardProps} />)}
        {S('behaviours', <BehavioursCard {...cardProps} />, 'lg:col-span-2')}
      </div>
      {nine && !ten && lv && <SiteExtras live={lv} />}
      {/* /demo-10 (13.1): one page — /demo-6's Code · Deploys · Storage under Site, in this page's cards */}
      {ten && [['Code', <CodeSection11 key="c" sanity={lv?.sanityData} />], ['Deploys', <DeploysSection11 key="d" />], ['Storage', <StorageSection11 key="s" />]].map(([title, body]) => (
        <section key={title} id={`section-${title.toLowerCase()}`} className="flex flex-col gap-3 pt-6">
          <h2 className="kol-sans-display-04 text-fg-88">{title}</h2>
          {body}
        </section>
      ))}
      </div>
      </div>)}

      <DatesDialog
        open={dates != null}
        title={dates === 'compare' ? 'Compare with' : 'Custom range'}
        initial={dates === 'compare' ? customCompare : custom}
        onClose={() => setDates(null)}
        onApply={(p) => {
          if (dates === 'compare') { setCustomCompare(p); setCompare('custom') } else { setCustom(p); setRange('custom'); setInterval_(null) }
          setDates(null)
        }}
      />
      <FilterDialog open={filterOpen} period={period} filters={filters} onClose={() => setFilterOpen(null)}
        onApply={(next) => {
          const keys = filterOpen.field ? [filterOpen.field] : FILTER_GROUPS[filterOpen.group].fields.map((x) => x.key)
          setFilters((fs) => [...fs.filter((f) => !keys.includes(f.key)), ...next]); setFilterOpen(null)
        }} />
      {ten ? (
        <>
          <RailTen eleven={eleven} timezone={timezone} setTimezone={setTimezone} open={settings} onClose={() => setSettings(false)} period={period} sites={sites} setSites={setSites}
            tiles={tiles} setTiles={setTiles} weekStart={weekStart} setWeekStart={setWeekStart} editing={editing} setEditing={setEditing} deploys={lv?.deploys} />
          {/* /demo-11 (17.2): ? is the same CommandOverlay as ⌘K, in shortcuts mode — as ui.kolkrabbi.io */}
          {eleven
            ? <CommandOverlay open={keysOpen} mode="shortcuts" shortcuts={SHORTCUTS} onClose={() => setKeysOpen(false)} />
            : keysOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setKeysOpen(false)} />}
          <Search eleven={eleven} open={searchOpen} onClose={() => setSearchOpen(false)} period={period}
            onPick={(f) => { if (f.section) document.getElementById(`section-${f.section}`)?.scrollIntoView({ behavior: 'smooth' }); else addFilter(f); setSearchOpen(false) }} />
        </>
      ) : (
      <SettingsDialog open={settings} onClose={() => setSettings(false)} weekStart={weekStart} setWeekStart={setWeekStart}
        eight={eight} nine={nine} period={period} site={site} setSite={setSite} sites={sites} setSites={setSites} tiles={tiles} setTiles={setTiles} />
      )}
    </div>
    </>
  )
  return nine ? <Nine.Provider value><Ten.Provider value={ten}><Eleven.Provider value={eleven}><Editing.Provider value={editing}><WithLive render={page} /></Editing.Provider></Eleven.Provider></Ten.Provider></Nine.Provider> : page(null)
}

const WithLive = ({ render }) => render(useLive())

/* ── filter menu (8.5): Plausible's rows; rows Umami cannot filter by are disabled, never faked ── */
const FILTER_GROUPS = {
  segment: { label: 'Segment', icon: 'star', more: true, fields: [] },
  page: { label: 'Page', icon: 'file', more: true, fields: [{ key: 'path', type: 'path', label: 'Page' }] },
  hostname: { label: 'Hostname', icon: 'globe', fields: [{ key: 'hostname', type: 'hostname' }] },
  source: { label: 'Source', icon: 'external-link', more: true, fields: [{ key: 'referrer', type: 'referrer', label: 'Source' }] },
  utm: { label: 'UTM tags', icon: 'target', more: true, fields: [] },
  location: { label: 'Location', icon: 'pushpin', more: true, fields: [{ key: 'country', type: 'country', label: 'Country' }, { key: 'region', type: 'region', label: 'Region' }, { key: 'city', type: 'city', label: 'City' }] },
  /* Round 6: Umami's `device` (mobile · tablet · laptop · desktop) is its screen-size class — the Devices card's third tab */
  screen: { label: 'Screen size', icon: 'monitor', fields: [{ key: 'device', type: 'device', label: 'Device' }] },
  browser: { label: 'Browser', icon: 'layout', more: true, fields: [{ key: 'browser', type: 'browser', label: 'Browser' }] },
  os: { label: 'Operating system', icon: 'desktop', more: true, fields: [{ key: 'os', type: 'os', label: 'Operating system' }] },
  goal: { label: 'Goal', icon: 'check', fields: [{ key: 'event', type: 'event' }] },
  property: { label: 'Property', icon: 'hash-01', more: true, fields: [] },
}

/* plausible.io's Filter (MenuFilter): › rows open a menu beside the row with one entry per field (W10.2); a plain row
 * opens its filter. A › row left with no field Umami can filter by stays disabled, with its reason — never faked. */
const FILTER_WHY = (key) => (key === 'segment' ? 'No segments saved in Umami' : key === 'property' ? 'No properties recorded yet' : 'Umami cannot filter by this')

function FilterDialog({ open, period, filters, onClose, onApply }) {
  const group = open?.group
  const g0 = group ? FILTER_GROUPS[group] : null
  const g = g0 && open.field ? { ...g0, label: g0.fields.find((f) => f.key === open.field).label, fields: g0.fields.filter((f) => f.key === open.field) } : g0
  const [rows, setRows] = useState([])
  useEffect(() => {
    if (g) setRows(g.fields.map((f) => filters.find((x) => x.key === f.key) || { key: f.key, op: 'eq', value: '' }))
  }, [group, open?.field])
  const suggestions = useAsync(
    () => (g ? Promise.all(g.fields.map((f) => umami('/metrics', { startAt: period.start, endAt: period.end, type: f.type }))) : null),
    JSON.stringify([group, open?.field, period]),
  )
  const set = (i, patch) => setRows(rows.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  /* Round 6 (user: *"wrong dropdown"*, *"wrong search input"*, *"wrong buttons"*): the useModal prompt's own parts —
   * its p-5 · gap-4 box, its kol-mono-12 title, its `Input variant="outline" size="sm"`, its Cancel (`size="sm"`) and OK
   * (`tone="inverted" size="sm"`) right-aligned. `is` / `is not` pick a value the data carries from the same outline sm
   * Dropdown as the operator; `contains` / `does not contain` (or a field with no data) type into the prompt Input. */
  const listOf = (i) => (suggestions.data?.[i] || []).map((s) => s.x).filter((x) => x != null)
  const pickable = (r, i) => (r.op === 'eq' || r.op === 'neq') && listOf(i).length > 0
  const valueOf = (r, i) => (pickable(r, i) ? (listOf(i).includes(r.value) ? r.value : listOf(i)[0]) : r.value)
  return (
    <Dialog open={!!g} onClose={onClose} title={g ? `Filter by ${g.label}` : ''}>
      {g && (
        <form className="flex flex-col gap-4 p-5"
          onSubmit={(e) => { e.preventDefault(); onApply(rows.map((r, i) => ({ ...r, value: String(valueOf(r, i)).trim() })).filter((r) => r.value)) }}>
          <p className="kol-mono-12 text-emphasis">Filter by {g.label}</p>
          {rows.map((r, i) => (
            <div key={r.key} className="flex flex-col gap-2">
              <span className="kol-helper-12 text-fg-64">{FILTER_LABEL[r.key]}</span>
              <div className="flex gap-2">
                <Dropdown size="sm" variant="outline" ariaLabel="Operator" options={OPS} value={r.op} onChange={(op) => set(i, { op })} />
                {pickable(r, i) ? (
                  <Dropdown size="sm" variant="outline" className="flex-1 min-w-0" ariaLabel={FILTER_LABEL[r.key]} value={valueOf(r, i)} onChange={(value) => set(i, { value })}
                    options={listOf(i).map((x) => ({ value: x, label: r.key === 'country' ? `${countryName(x)} (${x})` : x }))} />
                ) : (
                  <Input variant="outline" size="sm" className="flex-1 min-w-0" aria-label={FILTER_LABEL[r.key]} value={r.value}
                    placeholder={`Select ${FILTER_LABEL[r.key].toLowerCase()}`} onChange={(e) => set(i, { value: e.target.value })} />
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={onClose}>Cancel</Button>
            <Button tone="inverted" size="sm" type="submit">Apply filter</Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}

/* ── custom range / custom comparison: two KOL date fields ── */
function DatesDialog({ open, title, initial, onClose, onApply }) {
  const iso = (t) => new Date(t - new Date(t).getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  useEffect(() => {
    if (!open) return
    const now = Date.now()
    setFrom(iso(initial?.start ?? now - 7 * 86400000))
    setTo(iso(initial?.end ?? now))
  }, [open])
  return (
    <Dialog open={open} onClose={onClose} title={title} width={420}>
      <form className="flex flex-col gap-4" style={{ padding: 'var(--kol-pad-card-lg)' }}
        onSubmit={(e) => {
          e.preventDefault()
          const s = dayStart(new Date(`${from}T00:00`).getTime())
          const t = dayStart(new Date(`${to}T00:00`).getTime()) + 86400000 - 1
          if (s <= t) onApply({ start: s, end: Math.min(t, Date.now()) })
        }}>
        <h2 className="kol-helper-14 uppercase tracking-wide text-fg-96">{title}</h2>
        <div className="flex gap-2">
          <Input type="date" variant="outline" size="sm" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="flex-1" />
          <Input type="date" variant="outline" size="sm" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="flex-1" />
        </div>
        <div className="flex gap-2">
          <Button tone="primary" size="sm" type="submit">Apply</Button>
          <Button tone="ghost" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Dialog>
  )
}

/* ── settings (⌘, or ,): the data settings, in KOL's settings rail — the same parts the live page uses
 * (src/MetricsDashboard.jsx), never a dialog (W10.4, P62) ── */
function SettingsDialog({ open, onClose, weekStart, setWeekStart, eight, nine, period, site, setSite, sites, setSites, tiles, setTiles }) {
  if (!open) return null
  return (
    <SettingsPanel variant="rail" title="Settings" onClose={onClose}>
      {nine ? <SiteToggles period={period} sites={sites} setSites={setSites} /> : eight && <SiteSettings period={period} site={site} setSite={setSite} />}
      <SettingsRow label="Week starts" align="fill">
        <SettingsChoice ariaLabel="Week starts" value={weekStart} onChange={setWeekStart} options={[{ value: 1, label: 'Monday' }, { value: 0, label: 'Sunday' }]} />
      </SettingsRow>
      {eight && (
        <SettingsRow label="Stat tiles" align="fill">
          <SettingsChoice ariaLabel="Stat tiles" value={tiles} onChange={setTiles} options={[{ value: 'plausible', label: 'Plausible' }, { value: 'colour', label: 'Colour' }]} />
        </SettingsRow>
      )}
    </SettingsPanel>
  )
}

/* /demo-9 (12.3, 12.4): Site as a list of toggles — any number of hosts, All sites clears them — and the Umami link
 * named Umami. KOL ToggleCheckbox rows. */
function SiteToggles({ period, sites, setSites }) {
  const hosts = useAsync(() => umami('/metrics', { startAt: period.start, endAt: period.end, type: 'hostname' }), JSON.stringify(period))
  const list = (Array.isArray(hosts.data) ? hosts.data : []).map((h) => h.x).filter((h) => !isDevHost(h))
  const flip = (h, on) => setSites((s) => (on ? [...s, h] : s.filter((x) => x !== h)))
  return (
    <>
      {/* a narrow label column, so the host names fit the rail (SettingsRow's own labelWidth) */}
      <SettingsRow label="Sites" align="fill" labelWidth={72}>
        <div className="flex flex-col gap-2">
          <ToggleCheckbox label="All sites" checked={!sites.length} onChange={() => setSites([])} />
          {list.map((h) => <ToggleCheckbox key={h} label={h} checked={sites.includes(h)} onChange={(on) => flip(h, on)} />)}
        </div>
      </SettingsRow>
      <SettingsRow label="Umami" align="fill">
        <Button tone="ghost" size="sm" iconOnly="external-link" aria-label="Umami site settings" onClick={() => window.open(UMAMI_SETTINGS, '_blank', 'noopener')} />
      </SettingsRow>
    </>
  )
}

/* /demo-8: the old site menu, in the rail — all sites or one host, then Umami's site settings */
function SiteSettings({ period, site, setSite }) {
  const hosts = useAsync(() => umami('/metrics', { startAt: period.start, endAt: period.end, type: 'hostname' }), JSON.stringify(period))
  const list = (Array.isArray(hosts.data) ? hosts.data : []).map((h) => h.x).filter((h) => !isDevHost(h))
  return (
    <>
      <SettingsRow label="Site" align="fill">
        <SettingsChoice ariaLabel="Site" value={site || '__all__'} onChange={(v) => setSite(v === '__all__' ? null : v)}
          options={[{ value: '__all__', label: 'All sites' }, ...list.map((h) => ({ value: h, label: h }))]} />
      </SettingsRow>
      <SettingsRow label="Site settings" align="fill">
        <Button tone="ghost" size="sm" iconOnly="external-link" aria-label="Site settings" onClick={() => window.open(UMAMI_SETTINGS, '_blank', 'noopener')} />
      </SettingsRow>
    </>
  )
}

/* ── realtime (8.8): current visitors, last 30 minutes, a minute chart ── */
function Realtime({ period, filters, live, tick, metric, setMetric }) {
  const f = filterParams(filters)
  const stats = useAsync(() => umami('/stats', { startAt: period.start, endAt: period.end, ...f }), JSON.stringify([filters, tick]), true)
  const series = useAsync(() => Promise.all([seriesFor(metric, period, 'minute', filters, 1), null]), JSON.stringify([filters, tick, metric]), true)
  const tabs = [
    { key: 'live', label: 'Current visitors', value: live?.visitors ?? 0, dot: true },
    { key: 'visitors', label: 'Unique visitors (last 30 min)', value: stats.data?.visitors ?? 0 },
    { key: 'pageviews', label: 'Total pageviews (last 30 min)', value: stats.data?.pageviews ?? 0 },
  ]
  return (
    <section className="bg-surface-secondary rounded" style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))' }}>
        {tabs.map((t) => {
          const sel = t.key === metric
          const click = t.key !== 'live'
          return (
            <Button variant="bare" key={t.key} disabled={!click} onClick={() => click && setMetric(t.key)}
              className={`text-left rounded px-3 py-3 ${sel ? 'bg-fg-08' : click ? 'hover:bg-fg-04' : 'cursor-default'}`}>
              <div className={`kol-helper-12 uppercase tracking-wide ${sel ? 'text-fg-96' : 'text-fg-56'}`}>{t.label}</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="kol-mono-20 text-fg-96">{fmtNum(t.value)}</span>
                {t.dot && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ui-success)' }} />}
              </div>
            </Button>
          )
        })}
      </div>
      <Chart metric={METRICS.find((m) => m.key === metric)} series={series.data} loading={series.loading} unit="minute" period={period} onPick={() => {}} />
    </section>
  )
}

/* ── /demo-10 (13.3, 13.5): the shortcut table — the keys, the rail's Shortcuts tab and the ? overlay read this one list ── */
const SHORTCUTS = [
  { section: 'Dates', items: [
    ...RANGES.filter((r) => r.key !== 'yesterday').map((r) => ({ id: r.key, label: r.label, combo: r.k })),
    { id: 't30', label: 'Last 30 days', combo: 'T' },
    { id: 's6m', label: 'Last 6 months', combo: 'S' },
    { id: 'cmp', label: 'Compare', combo: 'X' },
  ] },
  { section: 'Page', items: [
    { id: 'edit', label: 'Edit layout', combo: 'E' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'keys', label: 'Shortcuts', combo: '?' },
    { id: 'search', label: 'Search', combo: '⌘K' },
    { id: 'close', label: 'Close', combo: 'Esc' },
  ] },
]

/* the settings rail, studio-hub's (kol/SettingsRail.jsx): Settings and Shortcuts tabs, headed sections, the theme
 * toggle and reset in the foot. Site · View · Deploys — the deploy line lives here now (13.2) */
/* /demo-11: the sites pick on the title row beside the gear, as media keeps its source picker (LibraryHeader:
 * `min-w-0 max-w-[45vw] md:w-48`) — KOL SettingsMulti, out of the rail */
function SitesPicker({ period, sites, setSites }) {
  const hosts = useAsync(() => umami('/metrics', { startAt: period.start, endAt: period.end, type: 'hostname' }), JSON.stringify(period))
  const list = (Array.isArray(hosts.data) ? hosts.data : []).map((h) => h.x).filter((h) => !isDevHost(h))
  return (
    <SettingsMulti noun="sites" className="min-w-0 max-w-[45vw] md:w-48 md:max-w-none" options={list.map((h) => ({ value: h, label: h }))} selected={sites}
      onToggle={(h) => setSites((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h]))} />
  )
}

/* the zones offered: the viewer's own, UTC (Reykjavik keeps UTC all year), and a few the studio works across */
const TIMEZONES = (own) => [...new Set([own, 'UTC', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo'])].map((z) => ({ value: z, label: z === own ? `${z} (yours)` : z }))

function RailTen({ eleven, timezone, setTimezone, open, onClose, period, sites, setSites, tiles, setTiles, weekStart, setWeekStart, editing, setEditing, deploys }) {
  const hosts = useAsync(() => umami('/metrics', { startAt: period.start, endAt: period.end, type: 'hostname' }), JSON.stringify(period))
  const list = (Array.isArray(hosts.data) ? hosts.data : []).map((h) => h.x).filter((h) => !isDevHost(h))
  const latest = deploys?.[0]
  /* the deploys feed carries the url, the yearly feed the project — the same deployment ids join them (Round 3) */
  const yearly = useAsync(() => getJson(`/api/demo5-deploys?range=${365 * 86400000}`), 'deploys-365d')
  const projectOf = Object.fromEntries((yearly.data?.deploys ?? []).map((x) => [x.id, x.project]))
  const sections = [
    { label: 'Site', rows: [
      ...(eleven ? [] : [{ id: 'sites', label: 'Sites', render: () => <SettingsMulti noun="sites" options={list.map((h) => ({ value: h, label: h }))} selected={sites} onToggle={(h) => setSites((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h]))} /> }]),
      { id: 'umami', label: 'Umami', align: eleven ? 'fill' : undefined, render: () => (eleven
        /* /demo-11 (16.1): a Button that says Visit, with the external-link glyph — Round 3: as wide as the dropdowns below */
        ? <Visit href={UMAMI_SETTINGS} />
        : <Button tone="ghost" size="sm" iconOnly="external-link" aria-label="Umami site settings" onClick={() => window.open(UMAMI_SETTINGS, '_blank', 'noopener')} />) },
      /* Round 3 (user 2026-10-31): the repo apps/metric lives in, and its docs page, beside Umami */
      ...(eleven ? [
        { id: 'github', label: 'GitHub', align: 'fill', render: () => <Visit href={REPO_URL} /> },
        { id: 'docs', label: 'Docs', align: 'fill', render: () => <Visit href={DOCS_URL} /> },
      ] : []),
    ] },
    { label: 'View', rows: [
      { id: 'tiles', label: 'Stat tiles', type: 'choice', value: tiles, onChange: setTiles, options: [{ value: 'colour', label: 'Colour' }, { value: 'plausible', label: 'Plausible' }] },
      { id: 'week', label: 'Week starts', type: 'choice', value: weekStart, onChange: setWeekStart, options: [{ value: 1, label: 'Monday' }, { value: 0, label: 'Sunday' }] },
      ...(eleven ? [{ id: 'tz', label: 'Time zone', type: 'choice', value: timezone, onChange: setTimezone, options: TIMEZONES(timezone) }] : []),
      { id: 'edit', label: 'Edit layout', type: 'switch', on: editing, onChange: setEditing },
    ] },
    ...(eleven ? [] : [{ label: 'Deploys', rows: [
      { id: 'latest', label: 'Latest', value: latest ? `${DEPLOY_STATE_LABELS[latest.state] || latest.state} · ${timeAgo(latest.created)}` : '—' },
      ...MILESTONES.slice(0, 4).map((m, i) => ({ id: `m${i}`, label: m.date.slice(5), value: m.text })),
    ] }]),
  ]
  /* /demo-11 (16.2): Deploys is its own tab, read as a bulletin — the latest deploy, then each milestone, date over text */
  /* MetricRebuild (decided, for review): the tab's rows were a hand-set stack of mono text with its own gaps — it now
   * draws with the rail's own SettingsSections, as Settings and Shortcuts do: headed sections, label left, value right */
  const extra = eleven ? [{ id: 'deploys', label: 'Deploys', draw: () => (
    <SettingsSections divided sections={[
      ...(latest ? [{ label: 'Latest deploy', rows: [{ id: 'latest', label: DEPLOY_STATE_LABELS[latest.state] || latest.state, value: timeAgo(latest.created) }] }] : []),
      /* Round 3 (user 2026-10-31): the Vercel deploys, each a link to its deployment — project left, state · age right */
      ...(deploys?.length ? [{ label: 'Recent deploys', rows: deploys.slice(0, 10).map((d) => ({ id: d.id, label: projectOf[d.id] ?? d.url.split('-')[0], value: (
        <a href={`https://${d.url}`} target="_blank" rel="noopener noreferrer" className="kol-mono-12 text-body no-underline hover:text-fg-96 transition-colors">
          {`${DEPLOY_STATE_LABELS[d.state] || d.state} · ${timeAgo(d.created)}`}
        </a>
      ) })) }] : []),
      /* Round 3: each milestone stacks — date over text — as history, unlinked */
      { label: 'Deploys', rows: MILESTONES.map((m, i) => ({ id: `m${i}`, label: m.date, value: m.text, stack: true })) },
    ]} />
  ) }] : []
  return <HubSettingsRail open={open} onClose={onClose} sections={sections} shortcuts={SHORTCUTS} extra={extra} />
}

/* ⌘K — KOL's CommandOverlay over a kol-search index of what can be filtered: pages, sources, countries, browsers, OS */
const SEARCH_TYPES = [['path', 'path', 'Page'], ['referrer', 'referrer', 'Source'], ['country', 'country', 'Country'], ['browser', 'browser', 'Browser'], ['os', 'os', 'Operating system']]
function Search({ eleven, open, onClose, period, onPick }) {
  const [q, setQ] = useState('')
  const data = useAsync(() => (open ? Promise.all(SEARCH_TYPES.map(([type]) => umami('/metrics', { startAt: period.start, endAt: period.end, type }))) : null), JSON.stringify([open, period]))
  const index = useMemo(() => createIndex((data.data || []).flatMap((rows, i) => (Array.isArray(rows) ? rows : []).filter((r) => r.x).map((r) => {
    const [, key, kind] = SEARCH_TYPES[i]
    return { id: `${key}:${r.x}`, title: key === 'country' ? countryName(r.x) : r.x, kind, key, value: r.x }
  }))), [data.data])
  const results = q ? searchIndex(index, q, { limit: 30 }).results.map(({ item }) => ({ id: item.id, label: item.title, group: item.kind, item })) : []
  useEffect(() => { if (!open) setQ('') }, [open])
  /* /demo-11 (17.1): with nothing typed, the groups to browse — the page's sections, then one fold row per kind, as
   * ui.kolkrabbi.io's ⌘K shows its spaces */
  const suggestions = eleven ? [
    { id: 'sections', label: 'Sections', items: ['Site', 'Code', 'Deploys', 'Storage'].map((x) => ({ id: `section:${x}`, label: x, item: { section: x.toLowerCase() } })), open: true },
    ...SEARCH_TYPES.map(([type, key, kind], i) => ({
      id: `kind:${type}`, label: kind,
      items: (Array.isArray(data.data?.[i]) ? data.data[i] : []).filter((r) => r.x).slice(0, 12).map((r) => ({ id: `${key}:${r.x}`, label: key === 'country' ? countryName(r.x) : r.x, item: { key, value: r.x } })),
    })),
  ] : []
  return (
    <CommandOverlay open={open} onClose={onClose} query={q} onQueryChange={setQ} results={results} suggestions={suggestions} placeholder="Search"
      selectLabel={eleven ? 'Filter' : undefined}
      onSelect={(r) => onPick(r.item.section ? { section: r.item.section } : { key: r.item.key, op: 'eq', value: r.item.value })} />
  )
}
