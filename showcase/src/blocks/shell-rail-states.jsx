import { useState } from 'react'
import { ShellHeader } from '@kolkrabbi/kol-framework'
import { ShellNavColumn, ShellSidebar, RightRail } from '@kolkrabbi/kol-workshop'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const meta = {
  title: 'Shell rail states',
  description: 'The real shell chrome in three rail states',
  category: 'navigation',
  type: 'reference',
  status: 'active',
  updated: '2026-10-02',
  tags: ['domain/app-shell', 'domain/navigation', 'pattern/blocks'],
}
export const stage = 'full'

/* THE REAL CHROME, nothing else (user ruling 2026-10-02): kol-framework's ShellHeader, the workshop
 * shell's left rail in its own column (ShellNavColumn + ShellSidebar) and its right rail
 * (RightRail), over placeholder content. The left rail has three states — open, icons only (a strip
 * that opens on hover) and hidden; the switch above the frame picks one. Every link is a `#` on
 * this page, so nothing routes away. */
const HERE = '/modules/shell-rail-states'
const at = (id) => `${HERE}#${id}`

const ROUTES = [
  { id: 'rs-guides', label: 'Guides', icon: 'book-open', path: at('guides'), children: [
    { id: 'rs-start', label: 'Getting started', path: at('getting-started') },
    { id: 'rs-theming', label: 'Theming', path: at('theming') },
    { id: 'rs-publishing', label: 'Publishing', path: at('publishing') },
  ] },
  { id: 'rs-reference', label: 'Reference', icon: 'library', path: at('reference'), children: [
    { id: 'rs-components', label: 'Components', path: at('components') },
    { id: 'rs-tokens', label: 'Tokens', path: at('tokens') },
    { id: 'rs-icons', label: 'Icons', path: at('icons') },
  ] },
  { id: 'rs-changelog', label: 'Changelog', icon: 'journal', path: at('changelog') },
]

const NAV = [
  { label: 'Docs', href: '#docs' },
  { label: 'Library', href: '#library' },
  { label: 'Search', href: '#search' },
]

const TOC = [
  { id: 'rs-overview', label: 'Overview' },
  { id: 'rs-install', label: 'Install' },
  { id: 'rs-usage', label: 'Usage' },
]

const STATES = [
  { value: 'open', label: 'Open' },
  { value: 'icons', label: 'Icons only' },
  { value: 'hidden', label: 'Hidden' },
]

/* the left track per state — the widths ShellLayout's own grid reads */
const COLS = {
  open: 'grid-cols-[var(--kol-shell-nav-w)_minmax(0,1fr)_var(--kol-shell-toc-w)]',
  icons: 'grid-cols-[var(--kol-sidenav-w-collapsed)_minmax(0,1fr)_var(--kol-shell-toc-w)]',
  hidden: 'grid-cols-[minmax(0,1fr)_var(--kol-shell-toc-w)]',
}

export default function ShellRailStates() {
  const [state, setState] = useState('open')
  const [tab, setTab] = useState('#docs')

  return (
    <div className="flex w-full flex-col gap-4">
      <SegmentedToggle options={STATES} value={state} onChange={setState} size="sm" />
      <div className="flex h-[640px] w-full flex-col overflow-hidden rounded border border-oq-08 bg-surface-primary">
        <ShellHeader
          brand={<span className="kol-sans-heading-05 text-emphasis">Kolkrabbi</span>}
          nav={NAV}
          isActive={(href) => href === tab}
          onNavigate={(event, item) => { event.preventDefault(); setTab(item.href) }}
        />
        <div className="shell-scroll min-h-0 flex-1 overflow-y-auto">
          <div className={`shell-content-grid grid px-6 ${COLS[state]}`}>
            {state !== 'hidden' && (
              <ShellNavColumn mode={state}>
                <ShellSidebar routes={ROUTES} basePath="/" label="Documentation" />
              </ShellNavColumn>
            )}
            <main className="shell-main min-w-0 px-8 py-8">
              <div className="flex flex-col gap-4">
                <div className="h-8 w-2/3 rounded bg-oq-08" />
                <div className="h-4 w-full rounded bg-oq-04" />
                <div className="h-4 w-5/6 rounded bg-oq-04" />
                <div className="h-48 w-full rounded bg-oq-04" />
                <div className="h-4 w-4/6 rounded bg-oq-04" />
              </div>
            </main>
            <aside aria-label="Table of contents" className="shell-rail shell-rail--toc shell-sidebar-sticky pt-8 pb-14">
              <RightRail toc={TOC} activeId="rs-overview" icon={Icon} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
