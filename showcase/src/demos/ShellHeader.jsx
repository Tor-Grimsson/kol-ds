import { useState } from 'react'
import { ShellHeader } from '@kolkrabbi/kol-framework'

export const stage = 'full'

const NAV = [
  { label: 'Overview', href: '#overview', icon: 'book-open' },
  { label: 'Components', href: '#components', icon: 'grid-02' },
  { label: 'Icons', href: '#icons', icon: 'library' },
  { label: 'Tokens', href: '#tokens' },
]

export default function ShellHeaderDemo() {
  const [active, setActive] = useState('#overview')
  const [query, setQuery] = useState('')
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)

  return (
    <ShellHeader
      brand={<span className="kol-sans-heading-03 text-emphasis">Kolkrabbi</span>}
      nav={NAV}
      isActive={(href) => href === active}
      onNavigate={(event, item) => {
        event.preventDefault()
        setActive(item.href)
      }}
      search={{
        value: query,
        onChange: (e) => setQuery(e.target.value),
        onClear: () => setQuery(''),
        placeholder: 'Search the system…',
        shortcutHint: '/',
      }}
      onMenuClick={() => {}}
      onNavToggle={() => setNavCollapsed((v) => !v)}
      onTocToggle={() => setTocCollapsed((v) => !v)}
      navCollapsed={navCollapsed}
      tocCollapsed={tocCollapsed}
    />
  )
}
