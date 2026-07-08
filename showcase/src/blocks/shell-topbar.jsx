import { useState } from 'react'
import { ShellHeader } from '@kolkrabbi/kol-framework'
import { Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Shell topbar',
  description: 'The shell header with brand, section tabs, inline search, theme toggle and trailing actions',
  category: 'chrome',
  featured: true,
}
export const stage = 'full'

/* Self-contained shell chrome: local active-tab + query state, no-op nav so
 * nothing routes. The bar is stateless — every interaction is delegated up via
 * the callbacks below, which we resolve against component state here. Renders
 * over a product surface so the header reads in context, not as a floating strip. */
const NAV = [
  { label: 'Overview', href: '#overview' },
  { label: 'Prints', href: '#prints' },
  { label: 'Editions', href: '#editions' },
  { label: 'Studio', href: '#studio' },
  { label: 'Journal', href: '#journal' },
]

export default function ShellTopbar() {
  const [active, setActive] = useState('#prints')
  const [query, setQuery] = useState('')

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-surface-primary">
      <ShellHeader
        brand={
          <a
            href="#home"
            onClick={(event) => event.preventDefault()}
            className="kol-sans-heading-03 text-emphasis no-underline"
          >
            Kolkrabbi
          </a>
        }
        nav={NAV}
        isActive={(href) => href === active}
        onNavigate={(event, item) => {
          event.preventDefault()
          setActive(item.href)
        }}
        search={{
          value: query,
          onChange: (event) => setQuery(event.target.value),
          onClear: () => setQuery(''),
          placeholder: 'Search the catalogue…',
          shortcutHint: '⌘K',
        }}
        actions={
          <>
            <Button variant="ghost" size="sm" iconOnly="bell" aria-label="Notifications" onClick={() => {}} />
            <Button variant="ghost" size="sm" iconOnly="user" aria-label="Account" onClick={() => {}} />
            <Button variant="primary" size="sm" onClick={() => {}}>Sign in</Button>
          </>
        }
      />

      {/* Product surface beneath the chrome. */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[4/5] rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02" />
          ))}
        </div>
      </div>
    </div>
  )
}
