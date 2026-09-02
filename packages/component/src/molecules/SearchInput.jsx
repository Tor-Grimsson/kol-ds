import { useEffect, useRef, useState } from 'react'
import { toneClass } from '../utilities/tone.js'
import { Icon } from '@kolkrabbi/kol-icons'
import { glyphSize } from '../hooks/glyphLadders.js'

/**
 * SearchInput — controlled search field on the .kol-control shell. The
 * search-flavored sibling of Input (same variant/size chrome + inner-input
 * treatment), standalone because atoms can't nest atoms. Leading search
 * icon, then two mutually exclusive trailing affordances: a caller-authored
 * shortcut kbd chip while the value is empty, a clear × while it isn't.
 *
 * `expanding` is the third body plan (after the shell and `bare`): a round
 * icon-button pill that animates open into an inline field — the /work
 * navbar pattern, extracted from kol-content's WorkViewToggle (2026-07-15).
 * `open` is controllable so a parent can choreograph siblings around it
 * (collapse a toggle, reveal a close button); uncontrolled works too.
 * Escape reports `onOpenChange(false)` — clearing on close stays the
 * parent's call.
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
 * @param {string}   size         'xs' | 'sm' | 'md' — kol-control size + matched mono type class (xs = the panel rung, 2026-09-01)
 * @param {string}   variant      'filled' | 'ghost' | 'outline' — kol-control variant, same chrome as Input (ignored when bare/expanding)
 * @param {string}   tone         'default' | 'inverse' — the dark chip for a washed plane (ControlToneInverse, 2026-08-27); on the expanding pill it is the OPEN fill
 * @param {boolean}  bare         borderless inline field for overlay panels (full width, no shell chrome; keeps icon/clear/chip slots)
 * @param {boolean}  expanding    round icon-button pill that animates open into an inline field
 * @param {boolean}  open         (expanding) controlled open state; omit for internal state
 * @param {Function} onOpenChange (expanding) (bool) => void — trigger click / Escape
 * @param {number}   expandedWidth (expanding) open pill width in px (default 280)
 * @param {string}   triggerLabel (expanding) aria-label on the icon trigger (default 'Open search')
 * @param {string}   className    extra classes on the shell
 */

/* ONE type system and ONE glyph system for the whole component.
 *
 * It had two of each. The chromed path typed on `kol-mono-*` while the
 * expanding path typed on `kol-helper-*`; the chromed path drew a FLAT 14px
 * glyph at every size (`{ sm: 14, md: 14 }` — a size table that does not size)
 * while the expanding path read the SOLO ladder. So the same component
 * rendered two different fields depending on which branch you hit, and neither
 * matched the IconFrame sitting next to it.
 *
 * Type is the mono ramp — a search field holds a query that can wrap, and
 * `kol-helper-*` is line-height-1 chrome.
 *
 * The GLYPH READS BOTH LADDERS, because this component has both cases and they
 * are the exact split `glyphLadders.js` exists for:
 *
 *   SOLO      the collapsed `expanding` trigger — a glyph ALONE in a pinned
 *             square, nothing beside it. 16 / 20 / 24.
 *   ADJACENT  the leading glyph inside an open field, sitting in the input's
 *             line box beside the query text. 14 / 16 / 18.
 *
 * The flat `{ sm: 14, md: 14 }` it used to carry was the ADJACENT sm rung
 * frozen for both sizes — right ladder, no size. */
const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14' }

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search…',
  onClear,
  shortcutHint,
  onFocus,
  size = 'md',
  variant = 'filled',
  tone = 'default',
  bare = false,
  expanding = false,
  open,
  onOpenChange,
  expandedWidth = 280,
  iconSize,
  fieldHeight,
  triggerLabel = 'Open search',
  className = '',
  ...inputProps
}) {
  /* expanding body plan — hooks stay unconditional (expanding never flips at runtime) */
  const [internalOpen, setInternalOpen] = useState(false)
  const inputRef = useRef(null)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = (next) => {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (expanding && isOpen) inputRef.current?.focus()
  }, [expanding, isOpen])

  /* the pinned squares, 05-control-chrome.md — sm 28 · md 32 · lg 36 */
  const square = { sm: 28, md: 32, lg: 36 }[size] ?? 32
  /* THE OPEN FIELD'S HEIGHT IS ITS OWN KNOB, defaulting to the square.
   *
   * /work's pill is `h-9` open AND closed, sitting level with a 36px toggle —
   * that is the shipped design and the default must reproduce it. But a field
   * beside two BARE 32px glyphs (ContentFilters) read as chunky at the full
   * square, so that surface asks for a shorter one. Deriving it (`square - 4`)
   * served the second case and silently broke the first. */
  const fieldH = fieldHeight ?? square

  /* THE GLYPH WAITS FOR THE COLLAPSE. Mounting it the instant `isOpen` flips
   * put a search icon inside a 200px pill that was still shrinking around it —
   * the one frame of the animation that looks like a bug. It reappears at
   * 520ms, just under the 600ms `.kol-expand` width transition, so it lands as
   * the pill arrives rather than riding it down. Opening hides it immediately:
   * the field should take the space at once. */
  const [glyphIn, setGlyphIn] = useState(!open)
  useEffect(() => {
    if (!expanding) return undefined
    if (isOpen) { setGlyphIn(false); return undefined }
    const t = setTimeout(() => setGlyphIn(true), 520)
    return () => clearTimeout(t)
  }, [expanding, isOpen])

  /* Escape closes, and so does clicking away — a field that can only be closed
   * by emptying it and blurring is a trap, and this one had neither wired. The
   * listener only exists while open. */
  const shellRef = useRef(null)
  useEffect(() => {
    if (!expanding || !isOpen) return undefined
    const away = (e) => { if (shellRef.current && !shellRef.current.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [expanding, isOpen])

  if (expanding) {
    return (
      <div
        ref={shellRef}
        /* THE FILL BELONGS TO THE FIELD, NOT THE TRIGGER. At rest this is a
           glyph you click, and it must read as one — bare, exactly like the
           filter icon it sits beside. `bg-fg-04` was unconditional, so the
           collapsed pill rendered as a filled circle next to a bare glyph and
           the pair looked like two different kinds of control. */
        /* THE SQUARE FOLLOWS THE LADDER, and it follows `size` like every other
           control: sm 28 · md 32 · lg 36 (hooks/glyphLadders.js). This was a
           hardcoded 36 — the LG square — so an expanding search sat beside a
           `kol-btn-md` filter button at two different sizes. */
        className={`kol-expand flex items-center rounded-full ${isOpen ? (toneClass(tone) ? 'kol-tone-sunken' : 'bg-fg-04') : ''} ${className}`.trim()}
        style={{ height: isOpen ? fieldH : square, width: isOpen ? expandedWidth : square }}
      >
        {/* THE GLYPH IS THE CLOSED STATE, and only that (user ruling
            2026-08-15). Once the field is open the caret is the affordance;
            keeping the magnifier there spends the widest part of the pill
            restating what the blinking cursor already says. */}
        {glyphIn && !isOpen && (
          <button
            type="button"
            className="flex items-center justify-center rounded-full text-auto flex-shrink-0 border border-transparent transition-colors hover:border-oq-08"
            style={{ width: square, height: square }}
            onClick={() => setOpen(true)}
            aria-label={triggerLabel}
            aria-expanded={false}
          >
            {/* SOLO ladder, and NO ink class — it inherits from its chrome
                exactly as IconFrame's glyph does, so it cannot drift from the
                icon beside it. */}
            <Icon name="search" size={iconSize ?? glyphSize(size, true)} />
          </button>
        )}
        {isOpen && (
          <input
            ref={inputRef}
            type="search"
            value={value ?? ''}
            onChange={onChange}
            readOnly={!onChange || undefined}
            placeholder={placeholder}
            spellCheck={false}
            className={`bg-transparent outline-none ${SIZE_TYPE[size] ?? SIZE_TYPE.md} flex-1 text-oq-80 caret-current px-4 min-w-0 appearance-none [&::-webkit-search-cancel-button]:hidden`}
            onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
            {...inputProps}
          />
        )}
      </div>
    )
  }
  const shellCls = [
    bare
      /* kol-control--bare: zero-chrome marker so the theme's coarse-pointer
       * 16px floor covers this body plan too (OverlaySearchFieldZoomsIOS) */
      ? 'kol-control--bare flex w-full gap-2.5 px-4 py-3'
      : `kol-control kol-control--${variant} kol-control-${size} gap-2${toneClass(tone) ? ' kol-tone-sunken' : ''}`,
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
        {/* ADJACENT — this glyph sits in the field's line box beside the query */}
        <Icon name="search" size={iconSize ?? glyphSize(size)} />
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
          className="inline-flex items-center justify-center shrink-0 h-4 min-w-4 px-1 rounded-[var(--kol-radius-xs)] bg-fg-08 kol-helper-10 text-fg-48"
        >
          {shortcutHint}
        </kbd>
      ) : null}
    </label>
  )
}
