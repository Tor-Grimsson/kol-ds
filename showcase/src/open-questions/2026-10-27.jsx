import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 20 — one row geometry for both nav rails (user 2026-10-27, on the app and site presets side by side: *"Im just
 * wondering why the div structure and padding is so wildly different in setup?"*). `NavRail preset="site"` is kol-framework's
 * `SideNav` carried class-for-class (2026-10-22), so the two presets are two rails under one name: the app row is 32px
 * Buttons in the rail's 8px pad, the chevron its own 32 button with a 16 glyph; the site row is CSS padding (20 left, 40
 * right), a 16 glyph in a 20 span, the chevron a bare 12 glyph pinned 12 from the edge, its pages on --kol-pad-chrome-x.
 * The recommendation: the site rail's tree on the app rail's row. Specimens are the rails' own markup and classes, drawn
 * static so neither rail's root-level state (the grab, `data-sidenav`) touches this page.
 * ANSWERED 2026-10-27 — REJECTED (user: *"whats the point of having SITE if it looks exactly like app??? also children are super
 * spaced"*, *"my original point was just that there was a bit padding right missing"*). The site rail keeps its own look; the
 * ask was the chevron's right inset alone. */
export const meta = {
  round: 20,
  date: '2026-10-27',
  title: 'One row geometry for both nav rails',
  status: 'answered',
}

const ink = { color: 'var(--kol-oq-96)' }

/* the app rail's row, as NavRail's RailItem draws it */
function AppRow({ icon, label, chevron, depth = 0, children }) {
  return (
    <div className="flex items-center gap-3 w-full overflow-hidden shrink-0" style={depth ? { paddingLeft: depth * 38 } : undefined}>
      {icon ? <Button iconOnly={icon} iconSize={20} variant="nav" size={depth ? 'sm' : 'md'} className="shrink-0" style={ink} aria-label={label} /> : null}
      {children ?? <span className="kol-helper-12 uppercase text-oq-96 flex-1 min-w-0 truncate">{label}</span>}
      {chevron && <Button iconOnly={chevron} iconSize={16} variant="nav" size="md" className="shrink-0" style={ink} aria-label={`${label} sub categories`} />}
    </div>
  )
}

function Frame({ width, children }) {
  return (
    <div className="kol-shell-rail bg-surface-primary border border-fg-08 rounded overflow-hidden" style={{ width, maxWidth: '100%' }}>
      {children}
    </div>
  )
}

function AppCurrent() {
  return (
    <Frame width={380}>
      <div className="flex flex-col items-start pt-4 pb-4 px-2 gap-2">
        <AppRow icon="library" label="Library" />
        <AppRow icon="globe" label="Labs" chevron="chevron-right" />
        <AppRow icon="refresh" label="Randomiser" />
      </div>
    </Frame>
  )
}

/* the site rail's tree, in NavRailSite's classes */
function SiteCurrent() {
  const glyph = (name) => (
    <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true"><Icon name={name} size={16} /></span>
  )
  const leaf = 'kol-sidenav-link kol-helper-10 block relative py-[4px] pl-[calc(var(--kol-pad-chrome-x)+2rem)] pr-6 no-underline text-strong'
  return (
    <Frame width={320}>
      <div className="pt-4 pb-4">
        <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
          <li className="relative"><a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline">{glyph('nav-home')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Home</span></a></li>
          <li className="relative">
            <a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline">{glyph('book-open')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Research</span></a>
            <span className="kol-sidenav-hop-caret text-emphasis -rotate-90"><Icon name="chevron-down" size={12} /></span>
          </li>
          <li className="relative">
            <a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline is-active">{glyph('drop')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Kolkrabbi</span></a>
            <span className="kol-sidenav-hop-caret text-emphasis"><Icon name="chevron-down" size={12} /></span>
            <ul className="kol-sidenav-list">
              <li>
                <div className="kol-sidenav-group kol-helper-10 uppercase text-subtle">Identity</div>
                <ul className="kol-sidenav-list">
                  {['Moods', 'Colour', 'Type', 'Visual treatment'].map((l) => <li key={l}><a className={leaf}>{l}</a></li>)}
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Frame>
  )
}

/* the same tree on the app rail's row: glyph rung, label column, chevron button; the pages and the group on the label
 * column (the 8 pad + the 32 rung + the 12 gap = 52), on the expanded group's sm rung and 4 gap */
function SiteProposed() {
  const page = (l) => (
    <div key={l} className="flex h-[26px] items-center w-full" style={{ paddingLeft: 44 }}>
      <span className="kol-helper-10 text-strong truncate">{l}</span>
    </div>
  )
  return (
    <Frame width={320}>
      <div className="flex flex-col items-start pt-4 pb-4 px-2 gap-2">
        <AppRow icon="nav-home" label="Home" />
        <AppRow icon="book-open" label="Research" chevron="chevron-right" />
        <AppRow icon="drop" label="Kolkrabbi" chevron="chevron-down" />
        <div className="kol-rail-group flex w-full flex-col items-start gap-1">
          <div className="flex h-[26px] items-center w-full" style={{ paddingLeft: 44 }}>
            <span className="kol-helper-10 uppercase text-subtle">Identity</span>
          </div>
          {['Moods', 'Colour', 'Type', 'Visual treatment'].map(page)}
        </div>
      </div>
    </Frame>
  )
}

const SPECIMENS = [
  { id: 'site', title: 'site (today)', lede: 'NavRail preset="site", SideNav carried class-for-class. CSS padding 20 left, 40 right; the glyph 16 in a 20 span at 20; the chevron a bare 12 glyph pinned 12 from the edge; pages on the chrome inset (24); rows on a 2 gap.', node: <SiteCurrent /> },
  { id: 'proposed', title: 'site (proposed, rejected)', lede: 'Rejected: it made site look like app, and the pages spread too far apart. The site tree on the app row: the same rung, glyph, label column and chevron button as app, the group and its pages on the label column at the expanded rung (26, 4 gap). Copy and ink unchanged; only the box moves.', node: <SiteProposed /> },
  { id: 'app', title: 'app (today, the reference)', lede: 'NavRail preset="app". 32px buttons in an 8px pad; the glyph 14 in, the chevron a 16 glyph in its own 32 button, 16 from the edge; rows on an 8 gap.', node: <AppCurrent /> },
]

export default function OpenQuestionsRound20() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 20 · 2026-10-27"
        title="One row geometry for both nav rails"
        lede="Answered 2026-10-27: rejected. The site rail keeps its own look; the ask was only the missing right padding on its chevron. The two presets are two rails under one name: app rows are buttons, site rows are SideNav's CSS, so the glyph, the chevron, the insets and the row gap all differ. The recommendation is the site tree on the app row. Nothing changes in the packages until you pick."
      />
      <DocSection id="specimens" title="Side by side" lede="Each is the rail's own markup and classes, at its own width (app 380, site 320).">
        <div className="flex flex-wrap items-start gap-8">
          {SPECIMENS.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 shrink-0 max-w-full" data-specimen={s.id}>
              <span className="kol-doc-eyebrow">{s.title}</span>
              {s.node}
              <p className="kol-mono-12 text-meta max-w-[380px]">{s.lede}</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  )
}
