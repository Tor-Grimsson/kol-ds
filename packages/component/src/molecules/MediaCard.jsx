import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: nests kol-icons's Icon (a package import the relative-import
 * check can't see) plus the same-file SelectIndicator. */

/**
 * SelectIndicator — passive square check indicator for multi-select rows and
 * cards. `on` = checked. Deliberately NOT ToggleCheckbox: that is a labeled
 * form control with a real <input>, which double-fires inside a click-target
 * card and misleads assistive tech — here the CARD is the toggle, this is
 * only its visual state. Inline CSS vars because `bg-fg-default` isn't a
 * generated Tailwind utility; the checked fill reads from
 * `--kol-surface-on-primary` (solid fg, theme-correct).
 *
 * Shared by MediaCard and MediaRow; not exported from the package barrel.
 */
export function SelectIndicator({ on = false }) {
  return (
    <span
      className="w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors"
      style={
        on
          ? { background: 'var(--kol-surface-on-primary)', borderColor: 'var(--kol-surface-on-primary)' }
          : { background: 'var(--kol-fg-absolute-16, rgba(0,0,0,0.15))', borderColor: 'var(--kol-fg-absolute-48, rgba(0,0,0,0.4))' }
      }
      aria-hidden="true"
    >
      {on && <Icon name="check" size={11} style={{ color: 'var(--kol-surface-primary)' }} />}
    </span>
  )
}

/**
 * MediaCard — grid tile for one media object: square thumbnail with a
 * top-right download overlay (or a top-left select checkbox in select mode),
 * then name / meta / actions stacked below. The grid-view counterpart to
 * MediaRow (same slot contract).
 *
 * Presentational — the parent supplies rendered slots; no media loading,
 * fetch, or rename logic lives here. Grid track sizing belongs to the parent
 * list; the card just fills its cell.
 *
 * @param {ReactNode} thumb        square thumbnail (image/video/placeholder)
 * @param {ReactNode} name         name cell (plain text or an inline editor)
 * @param {string}    meta         one-line secondary text (e.g. "1.2 MB · 2026-06-19")
 * @param {ReactNode} actions      row of action buttons (hidden in select mode)
 * @param {string}    downloadHref href for the overlay download button (omit to hide)
 * @param {boolean}   selectMode   selection mode on → checkbox replaces download, whole card toggles
 * @param {boolean}   selected     this card is selected (stronger border + checked box)
 * @param {Function}  onSelect     (event) => void — card click in select mode; gets shiftKey for range
 */
export default function MediaCard({
  thumb,
  name,
  meta,
  actions,
  downloadHref,
  selectMode = false,
  selected = false,
  onSelect,
}) {
  return (
    <li
      onClick={selectMode ? onSelect : undefined}
      className={`flex flex-col rounded overflow-hidden border bg-fg-02 ${selectMode ? 'cursor-pointer select-none' : ''}`}
      style={{ borderColor: selected ? 'var(--kol-fg-64)' : 'var(--kol-fg-12)' }}
    >
      <div className="aspect-square relative">
        {thumb}
        {selectMode ? (
          <span
            className="absolute top-3 left-3 rounded p-1"
            style={{ background: 'var(--kol-fg-absolute-12, rgba(0,0,0,0.4))', backdropFilter: 'blur(4px)' }}
          >
            <SelectIndicator on={selected} />
          </span>
        ) : downloadHref ? (
          <a
            href={downloadHref}
            aria-label="Download"
            title="Download"
            className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded text-emphasis hover:bg-fg-absolute-24 transition-colors"
            style={{ background: 'var(--kol-fg-absolute-12, rgba(0,0,0,0.4))', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="download" size={16} />
          </a>
        ) : null}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {name}
        <p className="kol-mono-12 text-fg-48">{meta}</p>
        {!selectMode && actions}
      </div>
    </li>
  )
}
