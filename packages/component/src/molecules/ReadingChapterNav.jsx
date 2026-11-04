import { Icon } from '@kolkrabbi/kol-icons'

/**
 * ReadingChapterNav — The chapters either side, as two capsules. `‹ Previous interlude · Second interlude` /
 * `Next interlude · Fourth interlude ›` (float-everything W11 row 148, 2026-11-04 — kol-float--style W2.9 `Previous and
 * next interlude`). Two 56 capsules on `surface-secondary`, 60 apart on a wide column (12 on a phone): the direction in
 * `kol-float-ruler` (uppercase, fg-64) over the title in `kol-float-hint`, the chevron (oq-64) at the outer end. The
 * hover is the float's fg-08 lift over the ground; a missing side leaves its cell empty.
 *
 * @param {{ label?: string, title: ReactNode, href?: string, onClick?: Function }} [prev]  label default `Previous`
 * @param {{ label?: string, title: ReactNode, href?: string, onClick?: Function }} [next]  label default `Next`
 * @param {string} [className]
 */
function Side({ dir, item }) {
  if (!item) return <span />
  const El = item.href ? 'a' : 'button'
  const next = dir === 'next'
  return (
    <El {...(item.href ? { href: item.href } : { type: 'button' })} onClick={item.onClick}
      className={`flex h-14 min-w-0 items-center gap-3 rounded-full bg-surface-secondary text-left no-underline cursor-pointer hover:shadow-[inset_0_0_0_999px_var(--kol-fg-08)] focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${next ? 'pl-5 pr-4' : 'pl-4 pr-5'}`}>
      {!next && <Icon name="chevron-left" size="var(--kol-float-ic)" className="shrink-0 text-oq-64" />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="kol-float-ruler truncate uppercase text-fg-64">{item.label ?? (next ? 'Next' : 'Previous')}</span>
        <span className="kol-float-hint truncate text-fg-emphasis">{item.title}</span>
      </span>
      {next && <Icon name="chevron-right" size="var(--kol-float-ic)" className="shrink-0 text-oq-64" />}
    </El>
  )
}

export default function ReadingChapterNav({ prev, next, className = '' }) {
  return (
    <nav aria-label="Chapters" className={`grid grid-cols-2 gap-3 sm:gap-[60px] ${className}`.trim()}>
      <Side dir="prev" item={prev} />
      <Side dir="next" item={next} />
    </nav>
  )
}
