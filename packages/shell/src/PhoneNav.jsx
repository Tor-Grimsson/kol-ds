import { useEffect, useState } from 'react'
import { TabsRow, TABBAR_H, TABBAR_PILL_INSET, tabbarPillWidth } from '@kolkrabbi/kol-component'
import MoreRows from './MoreSheet.jsx'

/* taxonomy-ok: molecule — MobileTabBar + a More sheet of Buttons */

/**
 * PhoneNav — The rail as a phone tab bar. the rail, on a phone, as a bottom bar (AppShell `touch="bar"`, apps review
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
 * @param {Array}    actions      `[{ label, icon?, onPress }]` — the page's own buttons, at the top of More (Home's New and
 *                                Walkthrough on a phone, user 2026-10-23); with any, More shows even with five or fewer rows
 * @param {'bar'|'pill'} shape    TabsRow's phone shape (AppShell `touch="pill"`); the More sheet floats above either
 */
const MORE = '__more'
const MAX = 5

const activePath = (items, path) => items
  .filter((i) => (i.path === '/' ? path === '/' : path === i.path || path.startsWith(`${i.path}/`)))
  .sort((a, b) => b.path.length - a.path.length)[0]?.path

export default function PhoneNav({ items = [], currentPath = '/', onNavigate, actions = [], shape = 'bar' }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [currentPath])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const overflow = items.length > MAX || (actions.length > 0 && items.length >= MAX)
  const hasMore = overflow || actions.length > 0
  const inBar = overflow ? items.slice(0, MAX - 1) : items
  const inMore = overflow ? items.slice(MAX - 1) : []
  const active = activePath(items, currentPath)
  const value = open || inMore.some((i) => i.path === active) ? MORE : active

  const tabs = inBar.map((i) => ({ value: i.path, label: i.label, icon: i.icon }))
  if (hasMore) tabs.push({ value: MORE, label: 'More', icon: 'more' })
  /* THE SHEET HUGS ITS WORDS AND SITS BESIDE THE × (user 2026-10-23, his reference: iOS Photos' menu next to its ×, *"but
   * align to bottom"*) — to the left of the collapsed ×, a 12px gap, the two bottom edges on one line */
  const pill = shape === 'pill'
  const sheetStyle = {
    left: 'auto',
    right: pill ? `calc(50% - ${tabbarPillWidth(tabs.length) / 2}px + ${TABBAR_H + 12}px)` : `calc(${100 / tabs.length}% + 8px)`,
    bottom: pill ? `calc(env(safe-area-inset-bottom, 0px) + ${TABBAR_PILL_INSET}px)` : 'env(safe-area-inset-bottom, 0px)',
    width: 'max-content', minWidth: 220, maxWidth: `calc(100vw - ${TABBAR_H + 36}px)`,
  }

  return (
    <>
      {open && (
        /* a BUTTON scrim — iOS does not bubble a tap from a div (OverlayScrimTapDismiss, 2026-09-01) */
        <button type="button" aria-label="Close more" className="kol-phone-nav-scrim kol-overlay-scrim" onClick={() => setOpen(false)} />
      )}
      {open && (
        <div className="kol-phone-nav-more kol-more-sheet" role="menu" aria-label="More" style={sheetStyle}>
          <MoreRows actions={actions} items={inMore} active={active} onPick={(x) => { setOpen(false); if (x.path) onNavigate?.(x.path) }} />
        </div>
      )}
      <TabsRow
        look="stacked"
        placement="phone"
        shape={shape}
        collapsed={open}
        onExpand={() => setOpen(false)}
        tabs={tabs}
        value={value}
        onChange={(v) => (v === MORE ? setOpen((o) => !o) : onNavigate?.(v))}
      />
    </>
  )
}
