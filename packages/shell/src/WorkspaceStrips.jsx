import { Avatar, Badge, Button, floatSurfaceClass } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — a workspace's strips: Avatar · Badge · float Buttons on the float type roles */

/**
 * AccountFooter — The account at the rail's foot (float-everything W9 row 132, 2026-11-04): the avatar (a picture or the
 * initial), the name (`kol-float-body`) over the workspace (`kol-float-hint`, oq-64); a press opens the account menu
 * the consumer owns. The exploration's `Account` (kol-float--style 9:1572).
 *
 * @param {string}   name · {string} workspace
 * @param {string}   src · {string} initial   Avatar's picture or glyph
 * @param {Function} onPress   the row's press; unset, it is a line, not a button
 * @param {string}   className
 */
export function AccountFooter({ name, workspace, src, initial, onPress, className = '' }) {
  const body = (
    <>
      <Avatar src={src} initial={initial ?? name?.[0]} alt="" size="sm" />
      <span className="flex flex-col gap-0.5 min-w-0 text-left">
        <span className="kol-float-body text-emphasis truncate">{name}</span>
        {workspace && <span className="kol-float-hint text-oq-64 truncate">{workspace}</span>}
      </span>
    </>
  )
  const cls = `kol-account-footer inline-flex items-center gap-2.5 ${className}`.trim()
  return onPress
    ? <button type="button" onClick={onPress} className={`${cls} bg-transparent border-0 p-0 cursor-pointer`}>{body}</button>
    : <div className={cls}>{body}</div>
}

/**
 * StatusStrip — The system's state as one line (float-everything W9 row 133, 2026-11-04): the outline Badge at its
 * smallest, the words verbatim ("ALL SYSTEMS OBSERVING"). The exploration's `Tracking status` (kol-float--style 9:1571).
 *
 * @param {string} label  the words
 * @param {string} className
 */
export function StatusStrip({ label, className = '' }) {
  return <Badge variant="outline" size="xs" className={`kol-status-strip ${className}`.trim()}>{label}</Badge>
}

/**
 * Breadcrumb — Where the page is (float-everything W9 row 136, 2026-11-04): the crumbs in `kol-float-timecode` (oq-64)
 * with a slash between; a crumb with `onPress` is a button, the last is the page. The exploration's `Breadcrumb and
 * disclosure` (kol-float--style 9:1579).
 *
 * @param {Array} items  `[{ label, onPress? }]` or strings, root first
 * @param {string} className
 */
export function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`kol-breadcrumb kol-float-timecode text-oq-64 flex items-center gap-2 ${className}`.trim()}>
      {items.map((raw, i) => {
        const it = typeof raw === 'string' ? { label: raw } : raw
        const last = i === items.length - 1
        return (
          <span key={i} className="inline-flex items-center gap-2">
            {it.onPress && !last
              ? <button type="button" onClick={it.onPress} className="bg-transparent border-0 p-0 cursor-pointer text-oq-64 hover:text-oq-96 font-[inherit] text-[length:inherit]">{it.label}</button>
              : <span aria-current={last ? 'page' : undefined}>{it.label}</span>}
            {!last && <span className="text-oq-48">/</span>}
          </span>
        )
      })}
    </nav>
  )
}

/**
 * FooterStrip — The page's foot line (float-everything W9 row 139, 2026-11-04): counts at the start, meta at the end,
 * both in `kol-float-timecode` (oq-64); an array joins with ` / `. The exploration's `Workspace footer`
 * (kol-float--style 9:13452).
 *
 * @param {ReactNode|string[]} start · {ReactNode|string[]} end
 * @param {string} className
 */
export function FooterStrip({ start, end, className = '' }) {
  const words = (x) => (Array.isArray(x) ? x.join('  /  ') : x)
  return (
    <div className={`kol-footer-strip kol-float-timecode text-oq-64 flex items-center justify-between gap-4 ${className}`.trim()}>
      <span>{words(start)}</span>
      <span>{words(end)}</span>
    </div>
  )
}

/**
 * PeriodNav — The period's ‹ › Today (float-everything W9 row 142, 2026-11-04): one 36 float capsule — the two chevrons
 * as quiet slots around the word (`kol-float-hint`), a press on it returns to now. The exploration's `Go to today`
 * (kol-float--style 9:13720).
 *
 * @param {string}   label     the word (default "Today")
 * @param {Function} onPrev · {Function} onNext · {Function} onToday
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the capsule is made of (default `solid`)
 * @param {string}   className
 */
export function PeriodNav({ label = 'Today', onPrev, onNext, onToday, surface = 'solid', className = '' }) {
  return (
    <div className={`kol-period-nav kol-float-chrome inline-flex items-center h-9 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
      <Button variant="float" tone="ghost" size="md" iconOnly="chevron-left" aria-label="Previous" onClick={onPrev} />
      <Button variant="float" tone="ghost" size="md" onClick={onToday} className="kol-float-hint px-3">{label}</Button>
      <Button variant="float" tone="ghost" size="md" iconOnly="chevron-right" aria-label="Next" onClick={onNext} />
    </div>
  )
}

/**
 * DataStatus — What the numbers are (float-everything W9 row 143, 2026-11-04): the disclosure Badge ("Demo data") and
 * when they were last refreshed in `kol-float-timecode` (oq-64). The exploration's `Data status` (kol-float--style 9:1581).
 *
 * @param {string} badge    the disclosure; unset, none
 * @param {string} updated  the refresh line, verbatim ("UPDATED 14:32 UTC")
 * @param {string} className
 */
export function DataStatus({ badge, updated, className = '' }) {
  return (
    <div className={`kol-data-status flex items-center gap-4 ${className}`.trim()}>
      {badge && <Badge variant="outline" size="sm">{badge}</Badge>}
      {updated && <span className="kol-float-timecode text-oq-64">{updated}</span>}
    </div>
  )
}
