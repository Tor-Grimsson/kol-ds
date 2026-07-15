import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { SearchInput, ShellSearchOverlay } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import NavDrawer from './NavDrawer.jsx'
import { COMPONENTS_AZ, CATEGORY_LABELS } from './registry.js'

/**
 * TopBar — the site-wide top navigation (shadcn-style): hamburger (<lg),
 * wordmark, section links (≥lg), component search (⌘K), GitHub, theme toggle.
 * Shared by the Home landing and every DocLayout page; active link derived
 * from the current path. Below lg the section links live in the NavDrawer —
 * the full link row + search + icons needs ~850px, so md was too early a
 * reveal. Search runs on the DS's own ShellSearchOverlay over the barrel-
 * derived roster (2026-07-15 audit P1-1: the field used to be a dead stub).
 */

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

const LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/docs/shell-and-layout', label: 'Docs', prefix: '/docs' },
  { to: '/foundations', label: 'Foundations' },
  { to: '/icons', label: 'Icons' },
  { to: '/components', label: 'Components' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/sets', label: 'Sets' },
  /* maintainer tooling — dev server only, never the deployed site (audit P1-3) */
  ...(import.meta.env.DEV ? [{ to: '/lobby', label: 'Lobby' }] : []),
]

const MAX_RESULTS = 12

export default function TopBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const isActive = (l) => (l.exact ? pathname === l.to : pathname.startsWith(l.prefix ?? l.to))

  /* ⌘K / Ctrl-K — the overlay itself is binding-free by design */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return COMPONENTS_AZ
      .filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
      .map((c) => ({
        id: c.slug,
        label: c.name,
        group: CATEGORY_LABELS[c.category] ?? c.category,
        hint: c.description,
      }))
  }, [query])

  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <header className="sticky top-0 z-40 border-b border-fg-08 bg-surface-primary/90 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 lg:gap-6 lg:px-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="inline-flex h-8 w-8 items-center justify-center text-meta transition-colors hover:text-emphasis lg:hidden"
        >
          <Icon name="menu" size={18} />
        </button>
        <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Link to="/" className="kol-mono-13 tracking-tight text-emphasis">Kolkrabbi</Link>
        <nav className="hidden items-center gap-5 kol-mono-12 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={isActive(l) ? 'text-emphasis' : 'text-meta hover:text-emphasis transition-colors'}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {/* display-only trigger (no onChange → readOnly by SearchInput's
            * convention); focus/click opens the real overlay */}
          <SearchInput
            size="sm"
            shortcutHint="⌘K"
            onFocus={() => setSearchOpen(true)}
            className="hidden sm:inline-flex"
          />
          <ShellSearchOverlay
            open={searchOpen}
            onClose={closeSearch}
            results={results}
            query={query}
            onQueryChange={setQuery}
            onSelect={(item) => { closeSearch(); navigate(`/components/${item.id}`) }}
            placeholder="Search components…"
          />
          {/* 32px hit-box to align with ThemeToggle's w-8 h-8. */}
          <a
            href={REPO}
            className="inline-flex h-8 w-8 items-center justify-center text-meta hover:text-emphasis transition-colors"
            aria-label="GitHub"
          >
            <Icon name="social-github" size={18} />
          </a>
          <ThemeToggle variant="icon" />
        </div>
      </div>
    </header>
  )
}
