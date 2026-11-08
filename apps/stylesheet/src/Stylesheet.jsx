import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Avatar, Badge, BentoCard, Button, ColorRamp, ContentCard, Dropdown, Input, Kbd, LabeledControl, LabeledControlSection,
  MenuDropdownDivider, MenuDropdownItem, MenuItem, OptionRow, Pill, ProfileCard, ProgressBar, SearchInput, ButtonGroup,
  SettingsChoice, SettingsRow, SettingsSwitch, Slider, Tag, TabsRow, Textarea, ToggleCheckbox, ToggleSwitch, Tooltip,
} from '@kolkrabbi/kol-component'
import { AppFloatNav } from '@kolkrabbi/kol-shell'
import { IconLoader, KOL_ICON_SET_INTERFACE } from '@kolkrabbi/kol-icons'
import { BRAND_INFO, COLLABORATIONS, MARKS, MOOD, SOCIAL, TIMELINE } from 'voyager-fixture'

/* THE UI STYLE GUIDE SHEET (2026-10-30). The well-known pattern — one wide page, the sections side by side, every
 * sample captioned — drawn with what KOL ships today: the type classes and color tokens the theme declares, the
 * interface icon set, and the shipped components at their shipped variants. Nothing is styled by hand; every
 * specimen sits on the page's own ground. A caption is the component, the props it was given and what it measures. */

/* ── live reads ──────────────────────────────────────────────────────────── */

/* bumps when the theme flips, so live token reads (ColorRamp's values, the type metrics) re-resolve */
function useThemeKey() {
  const [k, setK] = useState(0)
  useEffect(() => {
    const bump = () => setK((n) => n + 1)
    const mo = new MutationObserver(bump)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', bump)
    return () => { mo.disconnect(); mq.removeEventListener('change', bump) }
  }, [])
  return k
}

/* the rendered box of an element, kept current */
function useBox(ref, read) {
  const [v, setV] = useState('')
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const run = () => setV(read(el))
    run()
    const ro = new ResizeObserver(run)
    ro.observe(el)
    return () => ro.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return v
}

const dims = (el) => {
  const t = el.firstElementChild ?? el
  return `${Math.round(t.offsetWidth)} × ${Math.round(t.offsetHeight)} px`
}

/* ── sheet anatomy ───────────────────────────────────────────────────────── */

function Section({ title, children, className = '' }) {
  return (
    <section className={`flex min-w-0 break-inside-avoid flex-col gap-6 pb-16 ${className}`}>
      <h2 className="kol-doc-section-title">{title}</h2>
      {children}
    </section>
  )
}

function Group({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="kol-eyebrow text-meta">{title}</span>
      <div className="flex flex-wrap items-start gap-x-8 gap-y-6">{children}</div>
    </div>
  )
}

/* one sample: the thing, then its name, the props it was given, and its measured box (or a given value) */
function Sample({ name, spec, value, measure = true, children, className = '' }) {
  const ref = useRef(null)
  const box = useBox(ref, measure ? dims : () => '')
  return (
    <figure className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <div ref={ref} className="flex min-w-0 items-start">{children}</div>
      <figcaption className="flex min-w-0 flex-col gap-0.5">
        <span className="kol-mono-12 text-emphasis">{name}</span>
        {spec && <span className="kol-helper-10 text-meta">{spec}</span>}
        {(value ?? box) && <span className="kol-helper-10 text-meta">{value ?? box}</span>}
      </figcaption>
    </figure>
  )
}

/* ── 1 · Typography ──────────────────────────────────────────────────────── */

const SANS = ['display-01', 'display-02', 'display-03', 'display-04', 'heading-01', 'heading-02', 'heading-03', 'heading-04', 'heading-05', 'body-01', 'body-02', 'body-03']
  .map((s) => [`kol-sans-${s}`, `--kol-text-${s}`])
const MONO = ['mono-display-02', 'mono-display-03', 'mono-heading-03', 'mono-20', 'mono-16', 'mono-14', 'mono-12', 'mono-10', 'mono-8', 'helper-20', 'helper-16', 'helper-14', 'helper-12', 'helper-10', 'helper-8']
  .map((s) => [`kol-${s}`])
const PANGRAM = 'Sphinx of black quartz, judge my vow'

const metrics = (el) => {
  const s = getComputedStyle(el)
  const family = s.fontFamily.split(',')[0].replace(/["']/g, '')
  return `${family}, ${s.fontSize} / ${s.lineHeight}, ${s.fontWeight}`
}

function TypeLine({ cls, token }) {
  const ref = useRef(null)
  const m = useBox(ref, metrics)
  return (
    <div className="flex min-w-0 flex-col gap-1 py-3">
      <p ref={ref} className={`${cls} truncate`}>{PANGRAM}</p>
      <span className="kol-helper-10 text-meta">.{cls}{token ? `, ${token}` : ''}, {m}</span>
    </div>
  )
}

function Typography() {
  const k = useThemeKey()
  return (
    <Section title="Typography">
      <Group title="Right Grotesk">
        <div className="flex w-full min-w-0 flex-col">{SANS.map(([c, t]) => <TypeLine key={`${c}${k}`} cls={c} token={t} />)}</div>
      </Group>
      <Group title="Mono">
        <div className="flex w-full min-w-0 flex-col">{MONO.map(([c]) => <TypeLine key={`${c}${k}`} cls={c} />)}</div>
      </Group>
    </Section>
  )
}

/* ── 2 · Color ───────────────────────────────────────────────────────────── */

/* a token's resolved color as hex (8-digit when it carries alpha) — ColorRamp prints the raw declaration, which for
 * the fg and oq ladders is a color-mix() string; the sheet wants the value the token paints */
function resolveHex(token) {
  const probe = document.createElement('i')
  probe.style.color = `var(${token})`
  document.body.appendChild(probe)
  const c = getComputedStyle(probe).color
  probe.remove()
  const n = c.match(/[\d.]+/g)?.map(Number) ?? []
  const [r, g, b, a = 1] = c.startsWith('color(') ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] : n
  const hex = (x) => Math.round(x).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}${a < 1 ? hex(a * 255) : ''}`.toUpperCase()
}

const STOPS = ['01', '02', '04', '08', '12', '16', '24', '32', '40', '48', '64', '72', '80', '88', '96']
/* [label, the ladder's prefix, its stops] — a chip is captioned with its stop, the row with the prefix */
const RAMPS = [
  ['Surface', '--kol-surface-', ['primary', 'secondary', 'tertiary', 'sunken', 'inverse', 'contrast', 'on-primary', 'on-secondary', 'on-tertiary', 'on-inverse']],
  ['Foreground', '--kol-fg-', STOPS],
  ['Opaque', '--kol-oq-', STOPS],
  ['Accent', '--kol-accent-', ['primary', 'on-primary', 'primary-strong']],
  ['Error', '--ui-', ['error']],
]

function Color() {
  const k = useThemeKey()
  return (
    <Section title="Color">
      <div className="flex flex-col">
        {/* ColorRamp spreads its chips over its width (ten a row at most) — a short ladder takes its share of a
          * ten-wide row, so a chip is the same size in every ladder */}
        {RAMPS.map(([label, prefix, stops]) => (
          <div key={`${label}${k}`} style={{ width: `${Math.min(stops.length, 10) * 10}%` }} className="min-w-[200px]">
            <ColorRamp label={`${label} ${prefix}*`} colors={stops.map((st) => [st, resolveHex(prefix + st)])} />
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── 3 · Iconography ─────────────────────────────────────────────────────── */

/* the set's own group index (kol-icons builds it from the SVG folders, as the showcase Icons page reads it) */
function Iconography() {
  const groups = Object.entries(KOL_ICON_SET_INTERFACE).sort(([a], [b]) => a.localeCompare(b))
  const count = groups.reduce((n, [, names]) => n + names.length, 0)
  return (
    <Section title="Iconography">
      <span className="kol-helper-10 text-meta">kol-icon-set-interface, {count} icons, Icon size=24</span>
      <div className="columns-[150px] gap-8 sm:columns-[200px]">
        {groups.map(([group, names]) => (
          <div key={group} className="flex break-inside-avoid flex-col gap-2 pb-6">
            <span className="kol-eyebrow text-meta">{group}</span>
            {names.map((n) => (
              <div key={n} className="flex min-w-0 items-center gap-3">
                <IconLoader name={n} size={24} className="shrink-0" />
                <span className="kol-helper-10 truncate text-meta">{n}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── 4 · Buttons ─────────────────────────────────────────────────────────── */

const TONES = ['primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
const INTENTS = ['accent', 'danger', 'nav', 'tab', 'tab-filled']
const SIZES = ['xs', 'sm', 'md', 'lg']

function Buttons() {
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)
  return (
    <Section title="Buttons">
      <Group title="Tone">
        {TONES.map((t) => <Sample key={t} name="Button" spec={`tone="${t}", size="md"`}><Button tone={t}>Button</Button></Sample>)}
      </Group>
      <Group title="Variant">
        {INTENTS.map((v) => <Sample key={v} name="Button" spec={`variant="${v}"`}><Button variant={v}>Button</Button></Sample>)}
        <Sample name="Button" spec={'variant="tab", pressed'}><Button variant="tab" pressed>Button</Button></Sample>
      </Group>
      <Group title="Size">
        {SIZES.map((s) => <Sample key={s} name="Button" spec={`tone="primary", size="${s}"`}><Button tone="primary" size={s}>Button</Button></Sample>)}
      </Group>
      <Group title="Icon">
        <Sample name="Button" spec={'iconLeft="plus"'}><Button tone="primary" iconLeft="plus">With icon</Button></Sample>
        <Sample name="Button" spec={'iconRight="arrow-right"'}><Button tone="primary" iconRight="arrow-right">With icon</Button></Sample>
        {SIZES.map((s) => <Sample key={s} name="Button" spec={`iconOnly="settings-01", size="${s}"`}><Button tone="primary" size={s} iconOnly="settings-01" aria-label="Settings" /></Sample>)}
        <Sample name="Button" spec={'iconOnly="plus", radius="full"'}><Button tone="primary" iconOnly="plus" radius="full" aria-label="Add" /></Sample>
      </Group>
      <Group title="Disabled">
        {['primary', 'inverted', 'outline'].map((t) => <Sample key={t} name="Button" spec={`tone="${t}", disabled`}><Button tone={t} disabled>Disabled</Button></Sample>)}
      </Group>
      <Group title="ToggleSwitch">
        {['md', 'sm'].map((s) => (
          <Sample key={s} name="ToggleSwitch" spec={`checked, size="${s}"`}><ToggleSwitch label="On" checked={on} onChange={setOn} size={s} /></Sample>
        ))}
        {['md', 'sm'].map((s) => (
          <Sample key={s} name="ToggleSwitch" spec={`unchecked, size="${s}"`}><ToggleSwitch label="Off" checked={off} onChange={setOff} size={s} /></Sample>
        ))}
        <Sample name="ToggleSwitch" spec={'checked, variant="outline"'}><ToggleSwitch label="On" checked={on} onChange={setOn} variant="outline" /></Sample>
      </Group>
    </Section>
  )
}

/* ── 5 · Bars & Tabs ─────────────────────────────────────────────────────── */

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'home-01' },
  { id: 'specimens', label: 'Specimens', icon: 'grid' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
]
const NAV = [
  { path: '/', icon: 'home-01', label: 'Home' },
  { path: '/library', icon: 'nav-library', label: 'Library' },
  { path: '/editor', icon: 'desktop', label: 'Editor' },
  { path: '/settings', icon: 'nav-settings', label: 'Settings' },
]
const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play' },
  { id: 'stop', icon: 'stop', label: 'Stop' },
  { id: 'loop', icon: 'refresh', label: 'Loop', selected: true },
]
const SEG = [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'feed', label: 'Feed' }]

/* the nav is fixed to the viewport; a transformed frame is its containing block, so it can be seen on the sheet
 * (apps/style's NavFrame) — the photo is what the pill floats over */
function NavFrame({ children }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[var(--kol-radius-sm)] [--kol-shell-rail-width:0px] [&_.kol-mobile-tabbar]:!flex" style={{ height: 200, transform: 'translateZ(0)' }}>
      <img src="/kol-images/tt-01.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      {children}
    </div>
  )
}

function Bars() {
  const [t, setT] = useState('overview')
  const [s, setS] = useState('grid')
  return (
    <Section title="Bars & Tabs">
      <Group title="TabsRow">
        {['underline', 'chip', 'text', 'stacked'].map((v) => (
          <Sample key={v} name="TabsRow" spec={`variant="${v}"`}><TabsRow variant={v} tabs={TABS} value={t} onChange={setT} /></Sample>
        ))}
        <Sample name="TabsRow" spec={'variant="chip", filled'}><TabsRow variant="chip" filled tabs={TABS} value={t} onChange={setT} /></Sample>
        <Sample name="TabsRow" spec={'type="sans"'}><TabsRow type="sans" tabs={TABS} value={t} onChange={setT} /></Sample>
      </Group>
      <Group title="SegmentedToggle">
        {['default', 'filled', 'tonal'].map((v) => (
          <Sample key={v} name="SegmentedToggle" spec={`variant="${v}", size="md"`}>
            <ButtonGroup layout="joined" {...(v === 'default' ? {} : { variant: v })} value={s} onChange={setS} options={SEG} size="md" />
          </Sample>
        ))}
        <Sample name="SegmentedToggle" spec={'tone="sunken", size="sm"'}><ButtonGroup layout="joined" tone="sunken" value={s} onChange={setS} options={SEG} size="sm" /></Sample>
      </Group>
      <Group title="AppFloatNav">
        {[
          ['mobile', { shape: 'pill' }],
          ['dock', { shape: 'pill' }],
          ['panel', { shape: 'pill' }],
          ['transport', { items: TRANSPORT }],
        ].map(([v, p]) => (
          <Sample key={v} className="w-full" measure={false} name="AppFloatNav (kol-shell)" spec={`variant="${v}"${p.shape ? `, shape="${p.shape}"` : ''}`}>
            <NavFrame><AppFloatNav items={NAV} currentPath="/library" onNavigate={() => {}} variant={v} {...p} /></NavFrame>
          </Sample>
        ))}
      </Group>
    </Section>
  )
}

/* ── 6 · Input fields ────────────────────────────────────────────────────── */

const SORT = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'A → Z' },
]

function Inputs() {
  const [q, setQ] = useState('')
  const [hex, setHex] = useState('AD5038')
  const [sort, setSort] = useState('newest')
  const [v, setV] = useState(40)
  const [lo, setLo] = useState(20)
  const [hi, setHi] = useState(80)
  return (
    <Section title="Input fields">
      <Group title="Input">
        {['filled', 'outline'].map((variant) => (
          <Sample key={variant} name="Input" spec={`variant="${variant}", size="md"`}><Input variant={variant} placeholder="Email" aria-label="Email" /></Sample>
        ))}
        {['sm', 'lg'].map((s) => <Sample key={s} name="Input" spec={`size="${s}"`}><Input size={s} placeholder="Email" aria-label="Email" /></Sample>)}
        <Sample name="Input" spec={'iconLeft="search"'}><Input iconLeft="search" placeholder="Filter" aria-label="Filter" /></Sample>
        <Sample name="Input" spec={'prefix="#", chars={6}'}><Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} aria-label="Hex" /></Sample>
        <Sample name="Input" spec="disabled"><Input disabled placeholder="Email" aria-label="Email" /></Sample>
        <Sample name="LabeledControl + Input" spec={'label="HEX", hint="6-char"'}>
          <LabeledControl label="HEX" hint="6-char"><Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} /></LabeledControl>
        </Sample>
      </Group>
      <Group title="Textarea">
        {['filled', 'outline'].map((variant) => (
          <Sample key={variant} name="Textarea" spec={`variant="${variant}", size="sm", rows={3}`}><Textarea variant={variant} size="sm" placeholder="Notes" /></Sample>
        ))}
      </Group>
      <Group title="SearchInput">
        <Sample name="SearchInput" spec={'shortcutHint="⌘K", size="md"'}><SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} shortcutHint="⌘K" /></Sample>
        <Sample name="SearchInput" spec={'variant="outline", size="sm"'}><SearchInput variant="outline" size="sm" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} /></Sample>
      </Group>
      <Group title="Dropdown">
        {['primary', 'grey', 'outline'].map((variant) => (
          <Sample key={variant} name="Dropdown" spec={`variant="${variant}", size="sm"`}><Dropdown variant={variant} value={sort} onChange={setSort} options={SORT} ariaLabel="Sort" /></Sample>
        ))}
      </Group>
      <Group title="Slider">
        <Sample className="w-full max-w-[360px]" name="Slider" spec={'variant="minimal", label="Opacity"'} value={`value ${v}, min 0, max 100`}>
          <div className="w-full"><Slider className="w-full" label="Opacity" min={0} max={100} value={v} onChange={setV} /></div>
        </Sample>
        <Sample className="w-full max-w-[360px]" name="Slider" spec={'variant="dual", label="Trim"'} value={`value ${lo}, value2 ${hi}`}>
          <div className="w-full"><Slider className="w-full" label="Trim" variant="dual" min={0} max={100} value={lo} onChange={setLo} value2={hi} onChange2={setHi} /></div>
        </Sample>
        <Sample className="w-full max-w-[360px]" name="Slider" spec={'variant="scrub", readout="none"'} value={`value ${v}`}>
          <div className="w-full"><Slider className="w-full" variant="scrub" readout="none" min={0} max={100} value={v} onChange={setV} aria-label="Scrub" /></div>
        </Sample>
      </Group>
    </Section>
  )
}

/* ── 7 · Lists ───────────────────────────────────────────────────────────── */

/* the More sheet's rows as kol-shell's MoreRows draws them (apps/style's menu rows) */
const MORE = [
  { icon: 'plus', label: 'New File' },
  { icon: 'book-open', label: 'Walkthrough' },
  { icon: 'user', label: 'Sign in' },
]

function Lists() {
  const [sw, setSw] = useState(true)
  const [cb, setCb] = useState(true)
  const [ch, setCh] = useState('newest')
  return (
    <Section title="Lists">
      <Group title="Menu rows">
        <Sample name="MoreRows (kol-shell)" spec={'Button variant="nav", size="lg", in .kol-more-sheet'}>
          <div className="kol-more-sheet min-w-[220px]">
            {MORE.map((r) => <Button key={r.label} variant="nav" size="lg" iconLeft={r.icon} iconSize={22} className="h-11 w-full justify-start gap-3">{r.label}</Button>)}
          </div>
        </Sample>
        <Sample name="MenuItem + MenuDropdownItem" spec={'size="sm", shortcut, disabled'}>
          <div className="flex flex-col gap-2">
            <MenuItem label="File">{null}</MenuItem>
            <div className="min-w-[200px] py-1">
              <MenuDropdownItem iconLeft={<IconLoader name="file" size={14} />} onClick={() => {}}>New file</MenuDropdownItem>
              <MenuDropdownItem iconLeft={<IconLoader name="save" size={14} />} shortcut="⌘S" onClick={() => {}}>Save</MenuDropdownItem>
              <MenuDropdownDivider />
              <MenuDropdownItem iconLeft={<IconLoader name="trash" size={14} />} disabled onClick={() => {}}>Delete</MenuDropdownItem>
            </div>
          </div>
        </Sample>
      </Group>
      <Group title="OptionRow">
        <Sample className="w-full max-w-[360px]" name="OptionRow" spec={'size="md", active, selected, trail, rest'}>
          <div className="flex w-full flex-col">
            <OptionRow active icon="grid" label="Components" hint="every component, on the atomic ladder" />
            <OptionRow selected icon="folder" label="brand" />
            <OptionRow trail icon="folder" label="og" />
            <OptionRow icon="file" label="olina-productions-og.png" />
          </div>
        </Sample>
      </Group>
      <Group title="Rows with controls">
        <Sample className="w-full max-w-[360px]" name="LabeledControlSection + SettingsRow" spec="ToggleSwitch, ToggleCheckbox, Dropdown" measure={false}>
          <div className="w-full">
            <LabeledControlSection label="Settings">
              <SettingsRow label="Autosave"><SettingsSwitch on={sw} onChange={setSw} label="Autosave" /></SettingsRow>
              <SettingsRow label="Accept"><ToggleCheckbox checked={cb} onChange={setCb} aria-label="Accept" /></SettingsRow>
              <SettingsRow label="Sort"><SettingsChoice options={SORT} value={ch} onChange={setCh} ariaLabel="Sort" /></SettingsRow>
            </LabeledControlSection>
          </div>
        </Sample>
        <Sample name="ToggleCheckbox" spec="checked, label"><ToggleCheckbox label="ACCEPT" checked={cb} onChange={setCb} /></Sample>
      </Group>
    </Section>
  )
}

/* ── 8 · Cards ───────────────────────────────────────────────────────────── */

/* VOYAGER (apps/voyager-fixture) — the apps tier's invented client: nobody here is a real person */
const lockup = MARKS.find((m) => m.id === 'lockup-vertical-01')
const SOCIAL_ICON = { Instagram: 'social-instagram-2', YouTube: 'social-youtube', Newsletter: 'email-01' }
const PROFILE = {
  image: MOOD[0].url,
  alt: BRAND_INFO.identity.founder,
  logo: <img src={lockup.url} alt={BRAND_INFO.identity.name} className="h-full w-auto" />,
  name: BRAND_INFO.identity.founder,
  email: BRAND_INFO.contact.email,
  socials: SOCIAL.map((s) => ({ icon: SOCIAL_ICON[s.platform], href: s.url, label: s.platform })),
}
const press = TIMELINE.filter((t) => t.kind === 'press')

function Cards() {
  return (
    <Section title="Cards">
      <Group title="ContentCard">
        <Sample className="w-[240px]" name="ContentCard" spec={'variant="file", media'}>
          <div className="w-full"><ContentCard variant="file" title={press[0].title} date={String(press[0].year)} size={MOOD[0].format.toUpperCase()} media={<img src={MOOD[0].url} alt="" />} /></div>
        </Sample>
        <Sample className="w-[240px]" name="ContentCard" spec={'variant="file", selected, media'}>
          <div className="w-full"><ContentCard variant="file" selected title={press[1].title} date={String(press[1].year)} size={MOOD[1].format.toUpperCase()} media={<img src={MOOD[1].url} alt="" />} /></div>
        </Sample>
        <Sample className="w-[240px]" name="ContentCard" spec={'variant="article", media'}>
          <div className="w-full"><ContentCard variant="article" kicker={press[2].org} title={press[2].title} body={COLLABORATIONS[0].notes} date={String(press[2].year)} media={<img src={MOOD[2].url} alt="" />} /></div>
        </Sample>
        <Sample className="w-[240px]" name="ContentCard" spec={'variant="showcase", pad="sm"'}>
          <div className="w-full"><ContentCard variant="showcase" pad="sm" title={BRAND_INFO.identity.name} body={BRAND_INFO.labels.manifesto} meta={BRAND_INFO.identity.established} media={<img src={MOOD[3].url} alt="" />} /></div>
        </Sample>
      </Group>
      <Group title="ProfileCard">
        <Sample className="w-[280px]" name="ProfileCard" spec={'size="lg", orientation="vertical"'} measure={false}>
          <ProfileCard {...PROFILE} size="lg" className="w-full" />
        </Sample>
        <Sample className="w-[240px]" name="ProfileCard" spec={'size="sm", shelfTheme="light", defaultOpen'} measure={false}>
          <ProfileCard {...PROFILE} size="sm" shelfTheme="light" defaultOpen />
        </Sample>
      </Group>
      <Group title="BentoCard">
        {[MOOD[1], MOOD[3]].map((m, i) => (
          <Sample key={m.id} className="w-full max-w-[360px]" name="BentoCard" spec={`className="h-72"${i ? ', overlayOpacity={72}' : ''}`}>
            <div className="w-full">
              <BentoCard className="h-72" src={m.url} title={TIMELINE[i + 2].title} subtitle={TIMELINE[i + 2].org} description={TIMELINE[i + 2].notes} overlayOpacity={i ? 72 : 60} />
            </div>
          </Sample>
        ))}
      </Group>
    </Section>
  )
}

/* ── 9 · Other ───────────────────────────────────────────────────────────── */

function Other() {
  return (
    <Section title="Other">
      <Group title="Tag">
        {['primary', 'secondary', 'inverse'].map((v) => <Sample key={v} name="Tag" spec={`variant="${v}", size="sm"`}><Tag variant={v}>design</Tag></Sample>)}
        <Sample name="Tag" spec="onRemove"><Tag onRemove={() => {}}>removable</Tag></Sample>
      </Group>
      <Group title="Pill">
        {['primary', 'secondary', 'outline', 'subtle', 'inverse'].map((v) => <Sample key={v} name="Pill" spec={`variant="${v}", size="sm"`}><Pill variant={v}>Category</Pill></Sample>)}
      </Group>
      <Group title="Badge">
        {['default', 'secondary', 'outline', 'success', 'warning', 'error', 'info'].map((v) => <Sample key={v} name="Badge" spec={`variant="${v}", size="md"`}><Badge variant={v}>Badge</Badge></Sample>)}
        <Sample name="Badge" spec={'icon="check"'}><Badge icon="check">With icon</Badge></Sample>
      </Group>
      <Group title="Kbd">
        {['md', 'sm'].map((s) => <Sample key={s} name="Kbd" spec={`size="${s}", icon="command"`}><Kbd size={s} icon="command">K</Kbd></Sample>)}
        <Sample name="Kbd" spec={'size="md"'}><Kbd>Esc</Kbd></Sample>
      </Group>
      <Group title="Avatar">
        {['sm', 'md', 'lg', 'xl'].map((s) => <Sample key={s} name="Avatar" spec={`size="${s}", initial`}><Avatar initial="HS" size={s} /></Sample>)}
        <Sample name="Avatar" spec={'size="lg", src'}><Avatar src={MOOD[0].url} alt={BRAND_INFO.identity.founder} size="lg" /></Sample>
      </Group>
      <Group title="Tooltip">
        <Sample name="Tooltip" spec={'placement="bottom", shortcut="N", on hover'}>
          <Tooltip label="Add item" shortcut="N" placement="bottom"><Button tone="outline" iconOnly="plus" aria-label="Add item" /></Tooltip>
        </Sample>
        <Sample name="Tooltip" spec={'placement="top", on hover'}>
          <Tooltip label="Settings" placement="top"><Button tone="ghost" iconOnly="settings-01" aria-label="Settings" /></Tooltip>
        </Sample>
      </Group>
      <Group title="ProgressBar">
        <Sample className="w-[240px]" name="ProgressBar" spec="value={3}, max={7}, caption"><div className="w-full"><ProgressBar value={3} max={7} caption={(v, m) => `${v}/${m} done`} /></div></Sample>
        <Sample className="w-[240px]" name="ProgressBar" spec={'value={7}, max={7}, tone="success"'}><div className="w-full"><ProgressBar value={7} max={7} tone="success" caption /></div></Sample>
      </Group>
      <Group title="Overlay">
        <Sample className="w-full max-w-[420px]" name="useModal().confirm" spec=".kol-modal on .kol-overlay-scrim" value="scrim: --kol-color-ab-black 48%" measure={false}>
          {/* Modal is imperative and portals a fixed scrim over the whole viewport, so the sheet carries its
            * dialog class-for-class from molecules/Modal.jsx (ModalView) inside a frame instead */}
          <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[var(--kol-radius-sm)]">
            <img src={MOOD[2].url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
            <div className="kol-overlay-scrim absolute inset-0" />
            <div
              role="alertdialog"
              aria-label="Modal"
              className="kol-modal relative flex flex-col gap-4 p-5 rounded border border-fg-08"
              style={{ background: 'var(--kol-surface-primary)', color: 'var(--kol-surface-on-primary)', minWidth: 280 }}
            >
              <p className="kol-mono-12 text-emphasis whitespace-pre-line">Discard unsaved changes?</p>
              <div className="flex gap-2 justify-end">
                <Button size="sm">Cancel</Button>
                <Button tone="inverted" size="sm">OK</Button>
              </div>
            </div>
          </div>
        </Sample>
        <Sample name="--kol-shadow-float" spec="kol-theme, kol-design-tokens.css" value="0 8px 24px -8px rgba(0,0,0,.4), 0 2px 6px -2px rgba(0,0,0,.3)" measure={false}>
          <div className="m-4 size-32 rounded-[var(--kol-radius-sm)] bg-surface-primary" style={{ boxShadow: 'var(--kol-shadow-float)' }} />
        </Sample>
        <Sample name=".kol-overlay-scrim" spec="the dimming overlay" value="--kol-color-ab-black 48%" measure={false}>
          <div className="relative size-40 overflow-hidden rounded-[var(--kol-radius-sm)]">
            <img src={MOOD[1].url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
            <div className="kol-overlay-scrim absolute inset-x-0 bottom-0 top-1/2" />
          </div>
        </Sample>
      </Group>
    </Section>
  )
}

/* ── the sheet ───────────────────────────────────────────────────────────── */

/* three bands: the foundations side by side, the icon set across the width, then the component families flowing
 * in columns — at 2000 four of them; narrower they wrap, down to one on a phone */
export default function Stylesheet() {
  return (
    <div className="flex flex-col">
      <div className="grid gap-x-16 xl:grid-cols-2">
        <Typography />
        <Color />
      </div>
      <Iconography />
      <div className="columns-[440px] gap-x-16">
        <Buttons />
        <Bars />
        <Inputs />
        <Lists />
        <Cards />
        <Other />
      </div>
    </div>
  )
}
