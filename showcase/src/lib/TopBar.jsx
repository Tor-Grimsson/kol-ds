import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { Input } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import NavDrawer from './NavDrawer.jsx'

/**
 * TopBar — the site-wide top navigation (shadcn-style): hamburger (<lg),
 * wordmark, section links (≥lg), search stub, GitHub, theme toggle. Shared by
 * the Home landing and every DocLayout page; active link derived from the
 * current path. Below lg the section links live in the NavDrawer — the full
 * link row + search + icons needs ~850px, so md was too early a reveal.
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
  { to: '/lobby', label: 'Lobby' },
]

export default function TopBar() {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isActive = (l) => (l.exact ? pathname === l.to : pathname.startsWith(l.prefix ?? l.to))

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
          {/* KOL Input (primary/filled), not a hand-rolled outline box. */}
          <Input variant="filled" size="sm" placeholder="Search…" iconLeft="search" className="hidden sm:block" />
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
