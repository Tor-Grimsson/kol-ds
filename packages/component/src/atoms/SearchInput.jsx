import { Icon } from '@kolkrabbi/kol-icons'

/**
 * SearchInput — controlled search field on the .kol-control shell. The
 * search-flavored sibling of Input (same variant/size chrome + inner-input
 * treatment), standalone because atoms can't nest atoms. Leading search
 * icon, then two mutually exclusive trailing affordances: a caller-authored
 * shortcut kbd chip while the value is empty, a clear × while it isn't.
 *
 * Always controlled (`value` defaults to ''). Controlled + no onChange =
 * deliberate display-only → readOnly, same convention as Input. Extra props
 * (onKeyDown, autoFocus, role, aria-*) spread onto the inner <input> —
 * ShellSearchOverlay drives its combobox wiring through that seam.
 *
 * `type="search"` for semantics (searchbox role, mobile "search" enter key);
 * the native WebKit cancel button is hidden so the × stays the only clear
 * affordance.
 *
 * @param {string}   value        controlled value
 * @param {Function} onChange     (event) => void — input change
 * @param {string}   placeholder  placeholder text
 * @param {Function} onClear      () => void — trailing × click; × renders only when set and value is non-empty
 * @param {string}   shortcutHint caller-authored kbd chip (e.g. "⌘K"); shown while the value is empty
 * @param {Function} onFocus      (event) => void — input focus
 * @param {string}   size         'sm' | 'md' — kol-control size + matched mono type class
 * @param {string}   variant      'filled' | 'ghost' | 'outline' — kol-control variant, same chrome as Input (ignored when bare)
 * @param {boolean}  bare         borderless inline field for overlay panels (full width, no shell chrome; keeps icon/clear/chip slots)
 * @param {string}   className    extra classes on the shell
 */

const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14' }
const ICON_SIZE = { sm: 14, md: 14 }

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search…',
  onClear,
  shortcutHint,
  onFocus,
  size = 'md',
  variant = 'filled',
  bare = false,
  className = '',
  ...inputProps
}) {
  const shellCls = [
    bare
      ? 'flex w-full gap-2.5 px-4 py-3'
      : `kol-control kol-control--${variant} kol-control-${size} gap-2`,
    'items-center cursor-text',
    SIZE_TYPE[size],
    className,
  ].filter(Boolean).join(' ')

  /* Same height pin as Input: Chromium sizes an <input> from font metrics,
   * not CSS line-height, so without this the shell lands ~0.5px tall.
   * h-4 / h-[18px] match the kol-mono-12 / -14 line-heights. */
  const heightCls = size === 'sm' ? 'h-4' : 'h-[18px]'

  const inputCls = [
    'min-w-0 flex-1 bg-transparent border-none outline-none text-auto',
    'appearance-none [&::-webkit-search-cancel-button]:hidden',
    heightCls,
  ].join(' ')

  return (
    <label className={shellCls}>
      <span
        aria-hidden="true"
        className={`flex items-center shrink-0 ${bare ? 'text-fg-48' : 'text-auto opacity-50'}`}
      >
        <Icon name="search" size={ICON_SIZE[size] ?? 14} />
      </span>
      <input
        type="search"
        value={value ?? ''}
        onChange={onChange}
        readOnly={!onChange || undefined}
        onFocus={onFocus}
        placeholder={placeholder}
        spellCheck={false}
        className={inputCls}
        {...inputProps}
      />
      {onClear && value ? (
        <button
          type="button"
          aria-label="Clear"
          /* preventDefault on mousedown keeps focus in the input across the clear */
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          className="inline-flex items-center justify-center shrink-0 cursor-pointer text-fg-48 hover:text-fg-96 transition-colors"
        >
          <Icon name="x" size={12} />
        </button>
      ) : shortcutHint ? (
        /* aria-hidden — affordance, not a label (same stance as Input's prefix/suffix) */
        <kbd
          aria-hidden="true"
          className="inline-flex items-center justify-center shrink-0 h-4 min-w-4 px-1 rounded-[3px] bg-fg-08 kol-helper-10 text-fg-48"
        >
          {shortcutHint}
        </kbd>
      ) : null}
    </label>
  )
}
