import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-loader'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { componentsByCategory, CATEGORY_LABELS } from './registry.js'

/**
 * DocLayout — the shadcn-style doc chrome, shared by every component page:
 * full-bleed top bar (nav / search / GitHub / theme) + component sidebar +
 * centred content + on-this-page TOC. Page content is passed as children;
 * `toc` drives the right rail; `activeSlug` highlights the sidebar.
 */

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

function TopBar() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-40 border-b border-fg-08 bg-surface-primary/90 backdrop-blur">
      <div className="flex h-14 items-center gap-6 px-6">
        <button type="button" onClick={() => navigate('/')} className="kol-mono-13 tracking-tight text-emphasis">Kolkrabbi</button>
        <nav className="hidden items-center gap-5 kol-mono-12 md:flex">
          <Link to="/" className="text-meta hover:text-emphasis transition-colors">Home</Link>
          <Link to="/foundations" className="text-meta hover:text-emphasis transition-colors">Foundations</Link>
          <Link to="/icons" className="text-meta hover:text-emphasis transition-colors">Icons</Link>
          <Link to="/components" className="text-emphasis">Components</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-[var(--kol-radius-sm)] border border-fg-12 px-2.5 py-1.5 text-meta sm:flex">
            <Icon name="search" size={14} />
            <span className="kol-mono-12">Search…</span>
          </div>
          <a href={REPO} className="text-meta hover:text-emphasis transition-colors" aria-label="GitHub"><Icon name="code" size={16} /></a>
          <ThemeToggle variant="icon" />
        </div>
      </div>
    </header>
  )
}

function ComponentSidebar({ activeSlug }) {
  const groups = componentsByCategory()
  return (
    <aside className="hidden w-56 shrink-0 border-r border-fg-08 lg:block">
      <div className="sticky top-14 flex max-h-[calc(100vh-3.5rem)] flex-col gap-6 overflow-y-auto px-5 py-8">
        {groups.map(([cat, items]) => (
          <div key={cat}>
            <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">{CATEGORY_LABELS[cat] ?? cat}</p>
            <nav className="flex flex-col">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  to={`/components/${c.slug}`}
                  className={`kol-sans-body-02 py-1 transition-colors ${c.slug === activeSlug ? 'text-emphasis' : 'text-meta hover:text-emphasis'}`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}

function Toc({ items }) {
  if (!items?.length) return null
  return (
    <aside className="hidden w-56 shrink-0 py-12 pr-8 xl:block">
      <div className="sticky top-20">
        <p className="kol-helper-10 uppercase tracking-widest text-meta mb-3">On this page</p>
        <nav className="flex flex-col gap-2">
          {items.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={`kol-mono-12 text-meta hover:text-emphasis transition-colors ${t.sub ? 'pl-3' : ''}`}>
              {t.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default function DocLayout({ activeSlug, toc, children }) {
  return (
    <div>
      <TopBar />
      <div className="flex">
        <ComponentSidebar activeSlug={activeSlug} />
        <div className="flex min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 justify-center px-8 py-12 lg:px-12">
            <main className="flex w-full min-w-0 max-w-3xl flex-col gap-10">{children}</main>
          </div>
          <Toc items={toc} />
        </div>
      </div>
    </div>
  )
}
