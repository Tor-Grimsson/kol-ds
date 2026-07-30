import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ShellLayout, ShellSidebar, buildTagCounts, useTagMode } from '@kolkrabbi/kol-workshop'
import { Asset } from '@kolkrabbi/kol-brand/svg'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping } from './grouping.jsx'
import { SHELL_ROUTES, isShellTabActive, buildShellSearchItems, componentTreeRoutes } from './shell-nav.js'
import { VAULT_TREE, TAG_INVENTORY } from './vault.js'
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
       * skip headings with no anchor anywhere (nothing to link to).
       *
       * SPECIMENS ARE NOT THE PAGE (2026-07-30). A heading rendered INSIDE a
       * demo or a type specimen is sample content — it describes the component
       * being shown, not the document showing it. Two leaks came from counting
       * them: the typography page's `<h2>Sample display-md</h2>` specimens sat
       * inside `DocSection id="prose"`, so three TOC rows appeared all pointing
       * at `#prose`; and the DocsToc demo renders its own `<section id>` + h3,
       * injecting four rows named after another component's fake TOC. Anything
       * inside a preview stage or a demo is excluded at the source. */
      const found = [...main.querySelectorAll('h2, h3')]
        .filter((h) => !h.closest('[data-toc-skip], .kol-doc-figure, .kol-demo-stage'))
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
  const [collapsed, setCollapsed] = useState(false)
  /* ONE rail system (user 2026-07-30): the right rail IS the left rail —
   * identical row idiom (shell-nav-item + kol-mono-14), identical section
   * label (kol-doc-eyebrow), and identical HEADER — rotating chevron, label,
   * count. This section was a bare <p>: no chevron, no count, and not
   * collapsible at all, while the vault reader's equivalent collapsed with no
   * indicator. Two right rails, two behaviours, neither matching the left. */
  const row = 'shell-nav-item block kol-mono-14 text-body transition-colors hover:text-emphasis'
  if (headings.length === 0) return null
  return (
    <div className="flex flex-col gap-6 pr-2">
      <div>
        <button
          type="button"
          className="shell-nav-group-header w-full text-left shell-sidebar-label kol-doc-eyebrow"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          <span className="flex items-center gap-2">
            <Icon name="chevron-right" size={12} className={`transition-transform ${collapsed ? '' : 'rotate-90'}`} />
            On this page
          </span>
          <span className="kol-mono-14 text-subtle">({headings.length})</span>
        </button>
        {!collapsed && (
          <nav className="flex flex-col">
            {headings.map((h) => (
              <a key={h.id} href={`#${h.id}`} className={`${row} ${h.sub ? 'pl-3' : ''}`}>
                {h.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}

/* The brand pair: KOLKRABBI wordmark in the logo slot (reserves the 256px rail
 * column, links home) + the WORKSHOP wordmark as the surface mark — the same
 * pair ShellLayout ships as its package default.
 *
 * This slot held a typed `KOL DS` span, on a comment claiming no drawn asset
 * existed. One did: `wordmark-workshop.svg`, in kol-brand the whole time,
 * auto-registered by AssetLoader's glob. The typed placeholder wrapped to two
 * lines in the header. Drawn asset over typed text, always. */
function ShowcaseBrand() {
  return (
    <>
      <Link to="/" className="shell-header-logo hidden md:flex shrink-0 items-center text-emphasis lg:w-64">
        <Asset name="kol-wordmark" title="Kolkrabbi" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
      <Link to="/" className="shell-header-logo flex items-center text-emphasis">
        <Asset name="wordmark-workshop" title="Workshop" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
    </>
  )
}

function ShowcaseSidebar({ onNavigate }) {
  const { mode, setMode } = useGrouping()
  const cmpRoutes = useMemo(() => componentTreeRoutes(mode), [mode])
  return (
    <div className="flex flex-col gap-6">
      <ShellSidebar routes={SHELL_ROUTES} basePath="/" label="Showcase" labelTo="/" onNavigate={onNavigate} />
      <div>
        <p className="shell-sidebar-label kol-doc-eyebrow">Group by</p>
        <SegmentedToggle
          options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]}
          value={mode}
          onChange={setMode}
          size="sm"
        />
      </div>
      <ShellSidebar routes={cmpRoutes} basePath="/" label="Components" labelTo="/components" onNavigate={onNavigate} />
      {/* THE VAULT — the repo's docs/ library, grouped by folder (vault.js). */}
      <ShellSidebar routes={VAULT_TREE} basePath="/" label="Documentation" onNavigate={onNavigate} />
    </div>
  )
}

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

export default function ShellChrome() {
  const { pathname } = useLocation()
  const embedded = useEmbed()
  const { openTagMode } = useTagMode()

  /* ONE search (2026-07-30 reachability rule). Tags used to live in a second,
   * separate search box inside the tag overlay — a global search NUMBER 2 that
   * knew nothing about this one, and that you could only reach by first
   * clicking a tag somewhere. Tags are rows here now, carrying an `action`
   * instead of an `href` because selecting one toggles state rather than
   * navigating. Built HERE rather than in shell-nav.js because the closure
   * needs the tag context, and a plain module can't hold a hook. */
  const searchItems = useMemo(() => {
    const tags = buildTagCounts(TAG_INVENTORY).map(({ tag, count }) => ({
      id: `tag-${tag}`,
      label: tag,
      sectionLabel: 'Tags',
      keywords: [`${count} docs`],
      action: () => openTagMode(tag),
    }))
    return [...buildShellSearchItems(), ...tags]
  }, [openTagMode])

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
