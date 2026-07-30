import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ShellLayout, ShellSidebar } from '@kolkrabbi/kol-workshop'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping } from './grouping.jsx'
import { SHELL_ROUTES, isShellTabActive, buildShellSearchItems, componentTreeRoutes } from './shell-nav.js'
import useEmbed from './useEmbed.js'

/**
 * ShellChrome — the showcase's chrome, mounted ONCE as a route-level layout.
 *
 * Replaces the old per-page model where 11 pages imported DocLayout (which
 * itself rendered TopBar + sidebar + TOC) and 3 imported TopBar directly:
 * fourteen copies of the same decision, which is how they drifted. Pages are
 * now content only and render into the shell's <Outlet/>.
 *
 * The TOC is DERIVED, never passed. Every docs framework (Docusaurus, Nextra,
 * Starlight) walks the rendered headings instead of asking each page for an
 * array — the hand-written arrays here went stale against their own headings.
 */

/* Auto-TOC: read the headings the page actually rendered. Runs after paint on
 * every navigation, and again when the main column mutates (async demos,
 * lazily-mounted sections). ids are required — a heading without one can't be
 * linked, so it's skipped rather than silently mis-anchored. */
function useHeadings() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return undefined

    const read = () => {
      /* The anchor can sit on the heading OR on its wrapping section — DocKit's
       * DocSection puts the id on <section> and the h2 inside it. Take either;
       * skip headings with no anchor anywhere (nothing to link to). */
      const found = [...main.querySelectorAll('h2, h3')]
        .map((h) => {
          const id = h.id || h.closest('section[id]')?.id
          return id ? { id, label: h.textContent.trim(), sub: h.tagName === 'H3' } : null
        })
        .filter(Boolean)
      setItems((prev) =>
        prev.length === found.length && prev.every((p, i) => p.id === found[i].id) ? prev : found
      )
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  return items
}

function AutoToc() {
  const headings = useHeadings()
  const row = 'kol-mono-13 py-1 text-meta transition-colors hover:text-emphasis'
  if (headings.length === 0) return null
  return (
    <div className="flex flex-col gap-6 pr-2">
      <div>
        <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">On this page</p>
        <nav className="flex flex-col">
          {headings.map((h) => (
            <a key={h.id} href={`#${h.id}`} className={`${row} ${h.sub ? 'pl-3' : ''}`}>
              {h.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

function ShowcaseBrand() {
  return (
    <Link to="/" className="shell-header-logo flex shrink-0 items-center text-emphasis lg:w-64">
      <span className="kol-mono-13 tracking-tight">Kolkrabbi</span>
    </Link>
  )
}

function ShowcaseSidebar({ onNavigate }) {
  const { mode, setMode } = useGrouping()
  const cmpRoutes = useMemo(() => componentTreeRoutes(mode), [mode])
  return (
    <div className="flex flex-col gap-6">
      <ShellSidebar routes={SHELL_ROUTES} basePath="/" label="Showcase" labelTo="/" onNavigate={onNavigate} />
      <div>
        <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">Group by</p>
        <SegmentedToggle
          options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]}
          value={mode}
          onChange={setMode}
          size="sm"
        />
      </div>
      <ShellSidebar routes={cmpRoutes} basePath="/" label="Components" labelTo="/components" onNavigate={onNavigate} />
    </div>
  )
}

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

export default function ShellChrome() {
  const { pathname } = useLocation()
  const embedded = useEmbed()
  const searchItems = useMemo(() => buildShellSearchItems(), [])

  /* ?embed=1 — main content only, for iframing showcase pages into other
   * repos. The shell is fixed inset-0 with its own scroll regions, so embed
   * bypasses it entirely rather than trying to hide its parts. */
  if (embedded) {
    return (
      <main id="main" className="min-h-dvh w-full">
        <div
          className="mx-auto w-full min-w-0 max-w-[var(--kol-content-shell)]"
          style={{ padding: 'var(--kol-pad-section-y) var(--kol-pad-section-x)' }}
        >
          <Outlet />
        </div>
      </main>
    )
  }

  return (
    <ShellLayout
      routes={SHELL_ROUTES}
      basePath="/"
      brand={<ShowcaseBrand />}
      isActive={isShellTabActive(pathname)}
      renderSidebar={({ onNavigate }) => <ShowcaseSidebar onNavigate={onNavigate} />}
      defaultTocContent={<AutoToc />}
      searchItems={searchItems}
      actions={
        <a
          href={REPO}
          className="inline-flex h-9 w-9 items-center justify-center rounded text-fg-64 transition-colors hover:bg-fg-08 hover:text-emphasis"
          aria-label="GitHub"
        >
          <Icon name="social-github" size={18} />
        </a>
      }
    />
  )
}
