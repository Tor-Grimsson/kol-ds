import { useState, useEffect } from 'react'

const DocsToc = ({ toc, onNavigate }) => {
  const [activeId, setActiveId] = useState('')

  const handleNavigate = (event) => {
    if (typeof onNavigate === 'function') {
      onNavigate(event)
    }
  }

  // Track active heading with IntersectionObserver
  useEffect(() => {
    const headingIds = toc.map(item => item.id)
    const headingElements = headingIds
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    headingElements.forEach(element => observer.observe(element))

    return () => {
      headingElements.forEach(element => observer.unobserve(element))
    }
  }, [toc])

  return (
    <nav>
      <ul className="space-y-0">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`shell-sidebar-link block ${activeId === item.id ? 'active' : ''}`}
              onClick={handleNavigate}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default DocsToc
