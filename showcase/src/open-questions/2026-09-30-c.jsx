import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, IconFrame, SegmentedToggle, SettingsSections, SettingsSwitch, ToggleSwitch, Tooltip } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 3 — the visual calls the showcase build (2026-09-30) could not make without the user:
 * the header's right-hand cluster, the settings drawer, the rails' states, and the editor items
 * parked on his rulings. Drawn, not described. */
export const meta = {
  round: 3,
  date: '2026-09-30',
  title: 'Header cluster, settings, rail states, editor',
  status: 'answered',
}

const card = 'flex min-w-0 flex-col gap-3 rounded border border-fg-08 p-4'
const name = 'kol-doc-body text-emphasis'
const note = 'kol-mono-12 text-subtle'
/* the agent decided these on the recommendations while the user slept (2026-09-30); each is built
 * and reversible, and stays here for review */
const Decided = ({ children }) => (
  <p className="kol-doc-body rounded border border-fg-16 px-4 py-3">
    <span className="text-emphasis">Decided on the recommendation, for review — </span>{children}
  </p>
)

/* Q1 — the header's right cluster. `nav` icon frames at md, as the header draws them. */
const I = ({ n, tip }) => (
  <Tooltip label={tip}><IconFrame name={n} variant="nav" size="md" aria-label={tip} /></Tooltip>
)
const CLUSTERS = [
  { label: 'Today', note: 'GitHub · search · settings · theme · the rails menu', icons: [['social-github', 'GitHub'], ['search', 'Search'], ['settings-01', 'Settings'], ['mode-toggle-01', 'Theme'], ['hamburger', 'Menu']] },
  { label: 'Three', note: 'search · settings · theme — GitHub moves into Settings; the rails keep their own toggles in the tab row', icons: [['search', 'Search'], ['settings-01', 'Settings'], ['mode-toggle-01', 'Theme']] },
  { label: 'Two', note: 'search · settings — theme and GitHub move into Settings', icons: [['search', 'Search'], ['settings-01', 'Settings']] },
]

/* Q2 — the settings drawer: today's rows, and the same rows in the body voice. */
function SettingsToday() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(true)
  return (
    <SettingsSections sections={[
      { label: 'Layout', rows: [
        { id: 'l', label: 'Left rail', render: () => <SettingsSwitch on={a} onChange={setA} /> },
        { id: 'r', label: 'Right rail', render: () => <SettingsSwitch on={b} onChange={setB} /> },
      ] },
    ]} />
  )
}
function SettingsBody() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(true)
  return (
    <div className="flex flex-col gap-3">
      <span className="kol-doc-eyebrow">Layout</span>
      {[['Left rail', a, setA], ['Right rail', b, setB]].map(([label, on, set]) => (
        <div key={label} className="flex items-center justify-between">
          <span className="kol-doc-body">{label}</span>
          <SettingsSwitch on={on} onChange={set} />
        </div>
      ))}
    </div>
  )
}

/* Q3 — the rails' states, drawn as columns. */
const col = 'rounded border border-dashed border-fg-16 p-2 kol-mono-12 text-meta'
function RailState({ variant }) {
  return (
    <div className="flex h-40 gap-2">
      {variant === 'visible' && <div className={`${col} w-24`}>Category<br />Chapter (4)<br />Page</div>}
      {variant === 'strip' && (
        <div className={`${col} flex w-10 flex-col items-center gap-3 px-1`}>
          <Icon name="component-01" size={16} /><Icon name="layout" size={16} /><Icon name="book-open" size={16} />
        </div>
      )}
      <div className={`${col} flex-1`}>page</div>
      {variant !== 'hidden' && variant !== 'strip' && <div className={`${col} w-16`}>right</div>}
    </div>
  )
}
const RAILS = [
  { id: 'visible', label: 'Visible', note: 'today — 256px, `[` and `]` hide them' },
  { id: 'hidden', label: 'Hidden', note: 'today — gone, the page takes the width' },
  { id: 'strip', label: 'Icon strip', note: 'proposed — collapsed to one icon per chapter, like the app rail; hover opens it' },
]

/* Q4 — the editor items parked on his rulings (W7). */
const GLYPHS = ['align-horizontal-left', 'align-horizontal-center', 'align-horizontal-right', 'align-vertical-top', 'align-vertical-center', 'align-vertical-bottom', 'rotate-left', 'rotate-right', 'flip-horizontal', 'flip-vertical']

export default function OpenQuestionsRound3() {
  usePageMeta({ tags: [], related: [] })
  const [bool, setBool] = useState(true)
  const [seg, setSeg] = useState('on')
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 3 · 2026-09-30"
        title="Header cluster, settings, rail states, editor"
        lede="The calls the showcase build left for you. Hover and click — everything here is live."
      />

      <DocSection id="q1" title="Header cluster">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CLUSTERS.map((c) => (
            <div key={c.label} className={card}>
              <span className={name}>{c.label}</span>
              <div className="flex items-center gap-1">{c.icons.map(([n, tip]) => <I key={n} n={n} tip={tip} />)}</div>
              <span className={note}>{c.note}</span>
            </div>
          ))}
        </div>
        <Decided><strong>Three.</strong> Search · settings · theme. GitHub is a row in Settings › Links, and the hamburger shows only below the desktop width (the tab row&rsquo;s rail toggles and <code>[</code> <code>]</code> do its job).</Decided>
      </DocSection>

      <DocSection id="q2" title="Settings drawer">
        <p className="kol-doc-body">You said the drawer&rsquo;s layout is wrong without saying what. My reading of the screenshot: the row labels are set in the eyebrow voice — tiny uppercase mono — so the rows read as headings. B sets them in the body voice. If it is something else, name it here.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={card}><span className={name}>A · Today</span><SettingsToday /></div>
          <div className={card}><span className={name}>B · Body labels</span><SettingsBody /></div>
        </div>
        <Decided><strong>Corrected 2026-09-30:</strong> the answer was already shipped — kol-component&rsquo;s <code>SettingsPanel</code>, the drawer media&rsquo;s Display settings and Trash wear (locked 2026-08-27). The showcase hand-built its own; it now uses <code>SettingsPanel</code>. A and B above were the wrong comparison.</Decided>
      </DocSection>

      <DocSection id="q3" title="Rail states">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RAILS.map((r) => (
            <div key={r.id} className={card}>
              <span className={name}>{r.label}</span>
              <RailState variant={r.id} />
              <span className={note}>{r.note}</span>
            </div>
          ))}
        </div>
        <p className="kol-doc-body">And: rails draggable to resize, on the gsap system the app sidenav already uses — yes or no.</p>
        <Decided><strong>Resizable, yes; icon strip, not built.</strong> Drag a rail&rsquo;s inner edge to resize it (200–420px, remembered), double-click to reset. The icon strip needs an icon per chapter, which has no data yet; hidden and visible stay as they were.</Decided>
      </DocSection>

      <DocSection id="q4" title="Editor">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={card}>
            <span className={name}>#14 · the align, rotate, flip glyphs at 16px</span>
            <div className="flex flex-wrap gap-3">{GLYPHS.map((g) => <Tooltip key={g} label={g}><span className="inline-flex"><Icon name={g} size={16} /></span></Tooltip>)}</div>
            <div className="flex flex-wrap gap-3">{GLYPHS.map((g) => <Icon key={g} name={g} size={32} />)}</div>
            <span className={note}>redrawing them is design work — send drawings, or say which read weakest</span>
          </div>
          <div className={card}>
            <span className={name}>#15 · primary hover — shipped, check it</span>
            <div className="flex gap-2"><Button tone="primary">Shape parameters</Button><Button tone="primary">Hover me</Button></div>
            <span className={note}>hover goes deeper (oq-ab-96), active deeper again (88) — your 2026-09-03 ruling. Still wrong?</span>
          </div>
          <div className={card}>
            <span className={name}>Panels · a boolean parameter</span>
            <div className="flex items-center justify-between"><span className="kol-doc-body">Invert</span><ToggleSwitch checked={bool} onChange={setBool} /></div>
            <div className="flex flex-col gap-1"><span className="kol-doc-eyebrow">Invert</span><SegmentedToggle value={seg} onChange={setSeg} options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]} size="sm" /></div>
            <span className={note}>inline switch, or an Off/On strip with the label above — one</span>
          </div>
          <div className={card}>
            <span className={name}>#12 · asset thumbnails</span>
            <span className="kol-doc-body">The Assets panel lists logomark, wordmark and lockups as text rows; you asked for bucket thumbnails you can drag onto the canvas. Which bucket feeds it — the brand&rsquo;s assets folder, or any bucket the media client reaches?</span>
          </div>
        </div>
        <Decided><strong>#14</strong> redrawn — see Round 4. <strong>#15</strong> shipped already. <strong>Panels bool:</strong> one look, the switch, label left. <strong>#12</strong> built: twelve bucket thumbnails under Logos, click to insert.</Decided>
      </DocSection>
    </div>
  )
}
