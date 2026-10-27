import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 21 — the site rail's chevron inset (user 2026-10-27, after Round 20 was rejected: *"my original point was just that
 * there was a bit padding right missing"*). `.kol-sidenav-hop-caret` in kol-framework.css moved from `right: 0.75rem` (12) to
 * `right: 1rem` (16), where the app rail's chevron glyph ends. Unpublished until he approves. "Before" pins the old 12 inline;
 * "after" is the live rule. Also the pages (user 2026-10-27: *"why does sub not align to page title?"*): every page on the
 * title column. */
export const meta = {
  round: 21,
  date: '2026-10-27',
  title: 'The site rail: chevron inset and page alignment',
  status: 'answered',
}

/* before: the chevron 12 from the edge, pages on --kol-pad-chrome-x (24) + 32, a group's pages a further 12 + 2.
 * after: the live rules — the chevron 16, a section's own pages 2px right of its title (the rail's gutter 20 + 32 + 2 = 54),
 * a group's pages unchanged. APPROVED 2026-10-27 ("exactly, approved"). The first after (every page on 52, the group's too)
 * was REJECTED the same day: "before was correct … the ONLY thing I was pointing to" was Compare, Sheet and Boards. */
const BEFORE = {
  caret: { right: '0.75rem' },
  page: { paddingLeft: 'calc(var(--kol-pad-chrome-x) + 2rem)', '--kol-sidenav-dot-left': 'calc(var(--kol-pad-chrome-x) + 1.125rem)' },
  groupPage: { paddingLeft: 'calc(var(--kol-pad-chrome-x) + 2rem + var(--kol-spacing-3) + 2px)', '--kol-sidenav-dot-left': 'calc(var(--kol-pad-chrome-x) + 1.125rem + 2px + var(--kol-spacing-3))' },
}
const AFTER = {
  caret: undefined,
  page: { paddingLeft: 'calc(var(--kol-sidenav-pad-x) + 2rem + 2px)', '--kol-sidenav-dot-left': 'calc(var(--kol-sidenav-pad-x) + 1.125rem + 2px)' },
  groupPage: BEFORE.groupPage,
}

function SiteRail({ geo }) {
  const glyph = (name) => (
    <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true"><Icon name={name} size={16} /></span>
  )
  const leaf = 'kol-sidenav-link kol-helper-10 block relative py-[4px] pr-6 no-underline text-strong'
  return (
    <div className="bg-surface-primary border border-fg-08 rounded overflow-hidden" style={{ width: 320, maxWidth: '100%' }}>
      <div className="pt-4 pb-4">
        <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
          <li className="relative"><a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline">{glyph('nav-home')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Home</span></a></li>
          <li className="relative">
            <a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline">{glyph('book-open')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Research</span></a>
            <span className="kol-sidenav-hop-caret text-emphasis" style={geo.caret}><Icon name="chevron-down" size={12} /></span>
            <ul className="kol-sidenav-list">
              {['Compare', 'Sheet', 'Boards'].map((l) => <li key={l}><a className={leaf} style={geo.page}>{l}</a></li>)}
            </ul>
          </li>
          <li className="relative">
            <a className="kol-sidenav-hop kol-helper-12 text-emphasis no-underline is-active">{glyph('drop')}<span className="kol-sidenav-hop-label flex-1 min-w-0">Kolkrabbi</span></a>
            <span className="kol-sidenav-hop-caret text-emphasis" style={geo.caret}><Icon name="chevron-down" size={12} /></span>
            <ul className="kol-sidenav-list">
              <li>
                <div className="kol-sidenav-group kol-helper-10 uppercase text-subtle">Identity</div>
                <ul className="kol-sidenav-list">
                  {['Moods', 'Colour', 'Type', 'Visual treatment'].map((l) => <li key={l}><a className={`${leaf}${l === 'Type' ? ' is-active' : ''}`} style={geo.groupPage}>{l}</a></li>)}
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

/* the app rail's row with a chevron, as NavRail's RailItem draws it — for the edge it lines up with */
function AppRail() {
  const ink = { color: 'var(--kol-oq-96)' }
  return (
    <div className="kol-shell-rail bg-surface-primary border border-fg-08 rounded overflow-hidden" style={{ width: 320, maxWidth: '100%' }}>
      <div className="flex flex-col items-start pt-4 pb-4 px-2 gap-2">
        <div className="flex items-center gap-3 w-full overflow-hidden shrink-0">
          <Button iconOnly="globe" iconSize={20} variant="nav" size="md" className="shrink-0" style={ink} aria-label="Labs" />
          <span className="kol-helper-12 uppercase text-oq-96 flex-1 min-w-0 truncate">Labs</span>
          <Button iconOnly="chevron-right" iconSize={16} variant="nav" size="md" className="shrink-0" style={ink} aria-label="Labs sub categories" />
        </div>
      </div>
    </div>
  )
}

const SPECIMENS = [
  { id: 'before', title: 'before', node: <SiteRail geo={BEFORE} /> },
  { id: 'after', title: 'after', node: <SiteRail geo={AFTER} /> },
  { id: 'app', title: 'app rail (16, the reference)', node: <AppRail /> },
]

export default function OpenQuestionsRound21() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 21 · 2026-10-27"
        title="The site rail: chevron inset and page alignment"
        lede="Approved 2026-10-27, shipped in kol-framework 0.57.0 and kol-component 0.303.0. Two fixes. The chevron moves from 12 to 16 from the right edge, where the app rail's chevron ends. A section's own pages (Compare, Sheet, Boards) start 2px right of its title (54); they sat at 56, 4px right. The pages under a group label do not move."
      />
      <DocSection id="specimens" title="Before and after">
        <div className="flex flex-wrap items-start gap-8">
          {SPECIMENS.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 shrink-0 max-w-full" data-specimen={s.id}>
              <span className="kol-doc-eyebrow">{s.title}</span>
              {s.node}
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  )
}
