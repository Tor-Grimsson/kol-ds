import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from '../vendor/SearchInput.jsx'

const HighlightMatch = ({ label, query }) => {
  const idx = label.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{label}</span>
  return (
    <>
      <span>{label.slice(0, idx)}</span>
      <span style={{ color: 'var(--kol-surface-on-primary)', textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '3px' }}>
        {label.slice(idx, idx + query.length)}
      </span>
      <span>{label.slice(idx + query.length)}</span>
    </>
  )
}

const ShellSearchOverlay = ({ isOpen, onClose, routes = [], basePath = '/', items }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Use provided items directly, or flatten from routes
  const allItems = items ?? routes.flatMap((section) =>
    (section.children || []).map((child) => ({
      ...child,
      sectionLabel: section.label,
    }))
  )

  // Reset query when overlay closes
  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  const results = query.length > 0
    ? allItems
        .map((item) => {
          const q = query.toLowerCase()
          const labelMatch = item.label.toLowerCase().includes(q)
          const tagMatch = (item.tags || []).some(tag => tag.toLowerCase().includes(q))
          const headingMatch = (item.headings || []).find(h => h.toLowerCase().includes(q))
          const keywordMatch = (item.keywords || []).find(k => k.toLowerCase().includes(q))
          if (!labelMatch && !tagMatch && !headingMatch && !keywordMatch) return null
          return { ...item, matchedHeading: headingMatch || null, matchedKeyword: (!labelMatch && !headingMatch && keywordMatch) ? keywordMatch : null }
        })
        .filter(Boolean)
    : []

  const handleSelect = (path) => {
    navigate(`${basePath}/${path}`)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].path)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="bg-surface-primary border border-fg-08"
        style={{ position: 'relative', width: '100%', maxWidth: '32rem', margin: '0 1rem', borderRadius: '22px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}
      >
        <SearchInput
          bare
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {results.length > 0 && (
          <ul className="border-t border-fg-08" style={{ maxHeight: '320px', overflowY: 'auto', padding: '4px 0' }}>
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="shell-nav-item"
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleSelect(item.path)}
                >
                  <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <HighlightMatch label={item.label} query={query} />
                    {item.matchedHeading && (
                      <span style={{ fontSize: '11px', opacity: 0.48 }}>§ {item.matchedHeading}</span>
                    )}
                    {item.matchedKeyword && (
                      <span style={{ fontSize: '11px', opacity: 0.48 }}>⤷ {item.matchedKeyword}</span>
                    )}
                  </span>
                  <span style={{ marginLeft: 'auto', opacity: 0.48, fontSize: '11px', flexShrink: 0 }}>{item.sectionLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ShellSearchOverlay
