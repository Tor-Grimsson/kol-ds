import { useEffect, useState } from 'react'
import { Button, MobileTabBar } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — MobileTabBar + a More sheet of Buttons */

/**
 * PhoneNav — the rail, on a phone, as a bottom bar (AppShell `touch="bar"`, apps review
 * 2026-09-29). The user: *"what about when there are like 10 pages? … this seems like something
 * shell or hub should account for and ship, but not have per app fixes."*
 *
 * Up to FIVE destinations sit in the bar. More than five → the first FOUR, then **More**, a sheet
 * holding the rest (Settings included). Ten pages = four + More. The bar is kol-component's
 * `MobileTabBar` — the pill media already floated — not a second bar.
 *
 * Active = the rail's rule: `/` exact, anything else by prefix, the longest match wins. A
 * destination inside More lights More.
 *
 * @param {Array}    items        `{ icon, path, label }` in rail order, bottom rows last
 * @param {string}   currentPath
 * @param {Function} onNavigate   `(path) => void`
 */
const MORE = '__more'
const MAX = 5

const activePath = (items, path) => items
  .filter((i) => (i.path === '/' ? path === '/' : path === i.path || path.startsWith(`${i.path}/`)))
  .sort((a, b) => b.path.length - a.path.length)[0]?.path

export default function PhoneNav({ items = [], currentPath = '/', onNavigate }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [currentPath])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const overflow = items.length > MAX
  const inBar = overflow ? items.slice(0, MAX - 1) : items
  const inMore = overflow ? items.slice(MAX - 1) : []
  const active = activePath(items, currentPath)
  const value = open || inMore.some((i) => i.path === active) ? MORE : active

  const tabs = inBar.map((i) => ({ value: i.path, label: i.label, icon: i.icon }))
  if (overflow) tabs.push({ value: MORE, label: 'More', icon: 'more' })

  return (
    <>
      {open && (
        /* a BUTTON scrim — iOS does not bubble a tap from a div (OverlayScrimTapDismiss, 2026-09-01) */
        <button type="button" aria-label="Close more" className="kol-phone-nav-scrim kol-overlay-scrim" onClick={() => setOpen(false)} />
      )}
      {open && (
        <div className="kol-phone-nav-more" role="menu" aria-label="More">
          {inMore.map((i) => (
            <Button
              key={i.path}
              variant="nav"
              size="md"
              iconLeft={i.icon}
              aria-current={i.path === active ? 'page' : undefined}
              className="w-full justify-start"
              onClick={() => { setOpen(false); onNavigate?.(i.path) }}
            >
              {i.label}
            </Button>
          ))}
        </div>
      )}
      <MobileTabBar
        tabs={tabs}
        value={value}
        onChange={(v) => (v === MORE ? setOpen((o) => !o) : onNavigate?.(v))}
      />
    </>
  )
}
