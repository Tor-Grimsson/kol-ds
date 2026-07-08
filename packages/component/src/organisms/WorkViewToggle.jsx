import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: composites a segmented toggle + an inline search into one
 * space-trading control (organism); nests kol-icons's Icon (infrastructure). */

const CUBIC_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
/* The pill uses a springier overshoot ease, distinct from CUBIC_EASE. */
const PILL_EASE = 'cubic-bezier(0.34, 1.2, 0.64, 1)'

/**
 * WorkViewToggle — the `/work` header control: a pill-shaped segmented
 * **Shelf ⟷ List** view switch with a sliding-pill highlight, beside an
 * expandable inline search. Resting: the two-option toggle + a collapsed
 * search icon-button. Opening search collapses the toggle to zero width (fades
 * out) and expands the field to full width, revealing a round close button on
 * the left — the three siblings trade horizontal space via animated
 * width/margin/opacity.
 *
 * Its own component, not a variant of DS ViewToggle / SegmentedToggle: the
 * animated sliding pill, the expanding active-option icon, and the embedded
 * search choreography are materially different. All animated numerics are
 * inline `style` (width/left/margin/opacity + the two eases).
 *
 * Controlled seam replacing the app's WorkViewContext: `view`/`onView` +
 * `query`/`onQuery`. `searchOpen` is internal state (open on the search icon,
 * close on the × / Escape); closing clears the controlled query via
 * `onQuery('')`. No router, no context.
 *
 * Text casing: labels are authored data (`shelfLabel`/`listLabel`), no
 * text-transform.
 *
 * @param {string}   view        'shelf' | 'list' — active view; positions the pill + swaps icon/color
 * @param {Function} onView      (mode) => void — fires on Shelf/List click
 * @param {string}   query       controlled search value (default '')
 * @param {Function} onQuery     (value) => void — fires on input change; called with '' on close
 * @param {string}   shelfLabel  first option label (default 'Shelf')
 * @param {string}   listLabel   second option label (default 'List')
 * @param {string}   shelfIcon   first option icon name (default 'library')
 * @param {string}   listIcon    second option icon name (default 'list')
 * @param {string}   placeholder search input placeholder (default '')
 * @param {string}   className   extra classes on the root
 */
export default function WorkViewToggle({
  view = 'shelf',
  onView,
  query = '',
  onQuery,
  shelfLabel = 'Shelf',
  listLabel = 'List',
  shelfIcon = 'library',
  listIcon = 'list',
  placeholder = '',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const closeSearch = () => {
    setOpen(false)
    onQuery?.('')
  }

  const isShelf = view === 'shelf'
  const isList = view === 'list'

  const collapse = `width 600ms ${CUBIC_EASE}, margin 600ms ${CUBIC_EASE}, opacity 300ms ${CUBIC_EASE}`
  const inactiveColor = 'color-mix(in srgb, var(--kol-surface-on-primary) 80%, transparent)'

  const optionIcon = (name, on) => (
    <span
      className="inline-flex overflow-hidden flex-shrink-0"
      style={{ width: on ? 20 : 0, marginRight: on ? 8 : 0, opacity: on ? 1 : 0, transition: collapse }}
    >
      <Icon name={name} size={20} />
    </span>
  )

  return (
    <div className={`flex items-center ${className}`.trim()}>
      {/* Close button — appears when search is open */}
      <span
        className="inline-flex overflow-hidden flex-shrink-0"
        style={{ width: open ? 36 : 0, marginRight: open ? 12 : 0, opacity: open ? 1 : 0, transition: collapse }}
      >
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-fg-96 transition-colors hover:bg-fg-88"
          style={{ color: 'var(--kol-surface-primary)' }}
          onClick={closeSearch}
          aria-label="Close search"
        >
          <Icon name="cross" size={20} />
        </button>
      </span>

      {/* Toggle — collapses when search is open */}
      <div
        className="relative flex items-center rounded-full bg-fg-04 h-9 overflow-hidden"
        style={{ width: open ? 0 : 176, marginRight: open ? 0 : 12, opacity: open ? 0 : 1, transition: collapse }}
      >
        <div
          className="absolute top-0 h-9 rounded-full bg-fg-96"
          style={{ width: 96, left: isShelf ? 0 : 80, transition: `left 600ms ${PILL_EASE}` }}
        />

        <button
          type="button"
          className="relative z-10 flex items-center justify-center rounded-full h-9 kol-helper-14 transition-colors duration-300"
          style={{
            width: 96,
            letterSpacing: 0,
            color: isShelf ? 'var(--kol-surface-primary)' : inactiveColor,
            paddingRight: isShelf ? undefined : 8,
          }}
          onClick={() => onView?.('shelf')}
          aria-pressed={isShelf}
        >
          {optionIcon(shelfIcon, isShelf)}
          {shelfLabel}
        </button>
        <button
          type="button"
          className="relative z-10 flex items-center justify-center rounded-full h-9 -ml-4 kol-helper-14 transition-colors duration-300"
          style={{
            width: 96,
            letterSpacing: 0,
            color: isList ? 'var(--kol-surface-primary)' : inactiveColor,
            paddingLeft: isList ? undefined : 8,
          }}
          onClick={() => onView?.('list')}
          aria-pressed={isList}
        >
          {optionIcon(listIcon, isList)}
          {listLabel}
        </button>
      </div>

      {/* Search — icon button expands to a search field */}
      <div
        className="flex items-center bg-fg-04 rounded-full h-9"
        style={{ width: open ? 280 : 36, transition: `width 600ms ${CUBIC_EASE}` }}
      >
        <button
          type="button"
          className={`flex items-center justify-center w-9 h-9 rounded-full text-auto flex-shrink-0 border border-transparent ${open ? '' : 'transition-colors hover:border-fg-12'}`}
          onClick={() => !open && setOpen(true)}
          aria-label="Search projects"
        >
          <Icon name="search" size={16} className="text-fg-80" />
        </button>
        {open && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQuery?.(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent outline-none kol-helper-14 flex-1 text-fg-80 caret-current pr-4 min-w-0"
            onKeyDown={(e) => { if (e.key === 'Escape') closeSearch() }}
          />
        )}
      </div>
    </div>
  )
}
