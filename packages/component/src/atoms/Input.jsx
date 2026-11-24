import { useEffect, useRef, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { toneClass } from '../utilities/tone.js'
import { glyphSize } from '../hooks/glyphLadders.js'

/**
 * Input — single-input atom built on the .kol-control shell.
 *
 *   variant unset (default)    — the nearest `kol-tone-*` wrapper's tone, else filled
 *   variant="filled"           — persistent solid bg (= button primary chrome)
 *   variant="outline"          — bordered, transparent bg — THE secondary
 *                                treatment (2026-07-08 chrome law: one
 *                                secondary, always subordinate to filled)
 *   variant="float"            — the floating style (round 3, W16 2026-10-31): a capsule on the float's well
 *                                (`--kol-float-well`), 16 in, sm · md · lg 28 · 36 · 44 (touch 36 · 44 · 52) with
 *                                12 · 13 · 14 (13 · 15 · 16) type; AccountForm's box passes it
 *   variant="kolbox"           — kolbox's field (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18), carried class
 *                                for class: the oq-16 fill, no outline. `size` sm (its default) the 28 field, radius 4,
 *                                8 in, 4 between, the value JetBrains Mono 12 / 16, the accent line inside the box when
 *                                focused; md the rail's search, 32, radius 8, 4 in, 8 between, the value 12 / 16 in the
 *                                row's family; lg the search modal's field, 44, radius 8, 12 in and between, a 20 glyph,
 *                                the value Inter 16 / 22 / 500, no ring. `prefix` is the 16 letter slot (mono 12, oq-64),
 *                                `iconLeft` the glyph, `suffix` a unit (mono 12, oq-64), `slotRight` a node at the right;
 *                                `hug` sizes the value to its text (a number field, its unit right after it);
 *                                the glyph is your icons with the stroke lift. The press that focuses the field selects
 *                                its whole value, a second press places the caret. With `onCommit` (the field's commit,
 *                                `(text) => void`) it is kolbox's field (`useKolboxField`): Enter or leaving commits a
 *                                changed value, Escape restores the value from before the edit and leaves, ArrowUp and
 *                                ArrowDown step a number by 1 (Shift 10) and commit. Chrome in kol-theme `.kol-input--kolbox`.
 *   variant="folio"            — Folio's field (Folio migration batch A, 2026-11-22), carried class for class: a bare
 *                                <input> 32 high, 16 in, radius 4, the rule line on the paper, the value JetBrains Mono
 *                                12 / 16 in the ink, the accent line focused; no shell, so the slots and `size` are not
 *                                read and the width is the caller's `className`. Chrome in kol-theme `.kol-input--folio`.
 *   tone="inverse"             — the dark chip (`fg-ab-24`) for a washed plane
 *                                (ControlToneInverse, 2026-08-27); same prop on ViewToggle · Dropdown
 *   size="xs"                  — the panel rung (ControlsXsRung, 2026-09-01):
 *                                kol-mono-8 in a 22px shell; opt-in by prop
 *   onCommit                   — `(trimmed) => void` on blur / Enter (Escape
 *                                restores): the rack commits a module name or a
 *                                scope expression, not every keystroke. With it
 *                                the field keeps a local draft seeded from
 *                                `value`; `onChange` still fires live if given.
 *                                After the commit the draft RE-SNAPS to `value`,
 *                                so a rejected commit falls back to the last
 *                                good value rather than lingering — which makes
 *                                `type="number"` + `onCommit` the draft/commit
 *                                number idiom outright (parse and clamp at the
 *                                call site; fxr's NumberField, retired 2026-09-03).
 *   variant="ghost"            — legacy alias, resolves to outline
 *   variant="property"         — the Figma property field (PropertyField,
 *                                2026-08-12): filled chrome, dim `affordance`
 *                                (letter or icon node) at a 6px gap, the value
 *                                HUGS its own length (mono ch-width — number-
 *                                safe, no `size` attr), and `unit` renders
 *                                IMMEDIATELY after the value (`0°`, `100%`).
 *                                Shell fills its cell, content left-packed.
 *                                Width tracks `value` — controlled usage only.
 *
 *   size="sm" / "md" (default) / "lg" — matched padding + type class
 *
 * Sizing:
 *   preset — `rail` (2026-10-25): the control in a rail's row — its rung's height, 8 at the sides instead of the
 *     rung's 12 (*"call it a variant or preset for input on rails"*); the Slider's readout passes it through
 *   chars — HTML `size` attribute on the inner input. When set, the inner
 *     <input> sizes to N characters and the shell hugs (padding + prefix +
 *     N chars + suffix + padding). Use for known-format values (hex,
 *     percentage, integer counts). Drops `flex-1` so the input doesn't
 *     overflow into empty trailing space.
 *   width — explicit shell width override (e.g. "100%", "240px"). For
 *     stretch behavior, set the shell width and let the inner input fill.
 *
 * Props:
 *   prefix / suffix — small static text (e.g. "#", "%") rendered inside
 *     the shell at text-meta. aria-hidden — affordances, not labels.
 *   iconLeft — name of a leading icon rendered inside the shell (e.g.
 *     "search-16"). iconSize overrides the size-derived default.
 *   slotLeft — arbitrary leading node rendered inside the shell, before
 *     iconLeft/prefix — the paint-bar anatomy ([swatch] FFFFFF is ONE
 *     container, not two boxes; ColorSwatchFieldSizing 2026-08-12). The
 *     consumer owns the node's sizing; the shell's padding frames it.
 *   slotRight — its trailing mirror: an interactive node inside the shell, after the unit /
 *     suffix — a combo field's chevron (the design editor's type size, 2026-09-27: the chevron
 *     sat OUTSIDE the field as a second control). Not aria-hidden: it is a control.
 *   error — the field's error (float-everything W3 row 36, 2026-11-04): `true` marks it (`aria-invalid`, the
 *     alert-triangle in the error ink at the trailing edge); a string is also the message under the field, in
 *     the float hint role (Inter 12) with the info glyph. On the float it is the field's third state beside focus
 *     (the 2px ring) and disabled (40%); on the default look the mark and the message are the same.
 *
 * Chrome (bg/border/padding/transition/disabled) comes from .kol-control;
 * Input owns prefix/suffix/icon layout + the inner <input> styling.
 */

/* kolbox: each size's box (radius, fill and type in the theme rule) and its glyph */
const KOLBOX_SIZE = {
  sm: { box: 'h-(--kol-kolbox-ctl) gap-1 px-2 focus-within:outline-1 focus-within:-outline-offset-1', icon: 16 },
  md: { box: 'h-8 gap-2 px-1 focus-within:outline-1 focus-within:-outline-offset-1', icon: 18 },
  lg: { box: 'h-11 gap-3 px-3', icon: 20 },
}

const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }

/* kolbox's fields: the press that focuses a field selects its whole value; a press in a focused field places the caret.
   A mousedown handler for any kolbox <input> (ColorInputRow's hex and opacity take it too). */
export function selectOnFirstPress(e) {
  const el = e.currentTarget
  if (e.button !== 0 || document.activeElement === el || el.disabled || el.readOnly) return
  e.preventDefault()
  el.focus()
  el.select()
}

/* kolbox's arrow step: a number, alone or with a unit after it (12, -4.5, 45°, 50%), moves by `by`; anything else
   (a hex, a word, empty) does not step and gives null */
const STEPPABLE = /^\s*(-?\d*\.?\d+)\s*(°|%|px|pt|ms|s|x)?\s*$/
export function stepText(text, by) {
  const m = STEPPABLE.exec(String(text ?? ''))
  if (!m) return null
  const places = (m[1].split('.')[1] ?? '').length
  return `${Number((parseFloat(m[1]) + by).toFixed(places))}${m[2] ?? ''}`
}

/* kolbox's field behaviour, one place for every kolbox field (Input's own, ColorInputRow's hex and opacity): a draft
   while editing; Enter or leaving commits it, when it differs; Escape puts back the value from before the edit and
   leaves the field; ArrowUp and ArrowDown step a number by 1, with Shift by 10, and commit at once (`step: false`
   for a value that is not a number). `commit(text)` gets the trimmed text. Returns the <input>'s props. */
export function useKolboxField(value, commit, { step = true } = {}) {
  const shown = value == null ? '' : String(value)
  const [draft, setDraft] = useState(null)
  const live = useRef(null)
  const end = (text) => { live.current = null; setDraft(null); if (text != null && text.trim() !== shown) commit?.(text.trim()) }
  return {
    value: draft ?? shown,
    onChange: (e) => { live.current = e.target.value; setDraft(e.target.value) },
    onBlur: () => end(live.current),
    onKeyDown: (e) => {
      if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() }
      else if (e.key === 'Escape') {
        /* the field takes this Escape: a window or the editor hears the next one */
        e.preventDefault(); e.stopPropagation()
        live.current = null; setDraft(null); e.currentTarget.blur()
      } else if (step && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const next = stepText(live.current ?? shown, (e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1))
        if (next == null) return
        e.preventDefault(); e.stopPropagation()
        const el = e.currentTarget
        live.current = null; setDraft(null); commit?.(next)
        requestAnimationFrame(() => { if (document.activeElement === el) el.select() })
      }
    },
  }
}

export default function Input({
  type = 'text',
  value,
  onChange,
  onCommit,
  variant,
  preset,
  tone = 'default',
  size: sizeProp,
  chars,
  prefix,
  suffix,
  slotLeft,
  slotRight,
  affordance,
  unit,
  iconLeft,
  iconSize = null,
  placeholder,
  disabled = false,
  error,
  width,
  className = '',
  inputClassName = '',
  hug = false,
  ...inputProps
}) {
  /* kolbox's field is its own default size (sm); every other look defaults to md */
  const size = sizeProp ?? (variant === 'kolbox' ? 'sm' : 'md')
  const isNumber = type === 'number'
  const fixedChars = typeof chars === 'number'
  // The text-adjacent ladder — an Input's icon sits in the rung's line box
  // beside the value, exactly like a labelled Button's. `.kol-control-*` and
  // `.kol-btn-*` carry identical padding + type per rung, so the glyph is the
  // same too. This was a local ICON_SIZE with `md: 14` until 0.20.1, the last
  // of the four transcriptions (sm and lg had always agreed).
  const resolvedIconSize = iconSize ?? glyphSize(size)

  // ghost folds into outline (2026-07-08 chrome law): one secondary treatment.
  // property rides the filled chrome — it is a behaviour variant, not new paint.
  const isProperty = variant === 'property'
  const resolvedVariant = variant === 'ghost' ? 'outline' : isProperty ? 'filled' : variant

  const shellCls = [
    'kol-control',
    /* no variant → no modifier: the shell inherits a wrapper's tone, else filled (2026-09-03) */
    resolvedVariant && `kol-control--${resolvedVariant}`,
    `kol-control-${size}`,
    /* the rail preset (2026-10-25): 8 at the sides for a rail row's chip — `.kol-control--rail` */
    preset && `kol-control--${preset}`,
    SIZE_TYPE[size],
    'cursor-text',
    /* the dark chip on a washed plane (ControlToneInverse, kol-website 2026-08-27) */
    toneClass(tone),
    isProperty && 'w-full',
    className,
  ].filter(Boolean).join(' ')

  /* Property width: the shell type is mono, so every glyph is exactly 1ch —
   * `${len}ch` hugs the value with no probe element, and stays number-safe
   * where the HTML `size` attr is ignored (<input type="number">). +2px keeps
   * the caret from clipping at the end. Tracks `value` → controlled only. */
  /* commit-on-blur/Enter (ControlsXsRung, 2026-09-01 — kol-monitor's panel
   * TextInput collapsing onto this atom): a local draft, seeded from `value`,
   * committed trimmed; Escape restores. Only when `onCommit` is given. */
  const [draft, setDraft] = useState(value ?? '')
  /* the ref mirrors the draft so a blur that lands in the same tick as the
   * last keystroke commits what was typed, not the last RENDER's draft */
  const draftRef = useRef(value ?? '')
  const kolboxField = useKolboxField(value, onCommit)
  useEffect(() => { if (onCommit) { setDraft(value ?? ''); draftRef.current = value ?? '' } }, [value, onCommit])
  const commitProps = onCommit
    ? {
        value: draft,
        onChange: (e) => { draftRef.current = e.target.value; setDraft(e.target.value); onChange?.(e) },
        /* RE-SNAP AFTER EVERY COMMIT, not only when `value` changes. The
         * effect above re-syncs the draft on a value change — so a commit the
         * caller REJECTED (invalid input, value kept) left the bad draft on
         * screen, and `1` → `19` → `19x` showed `19x` after blur. kol-fxr's
         * `NumberField` existed for exactly this line (34 lines wrapping this
         * atom: commit, then `setDraft(String(value))`); with the re-snap here
         * it is `<Input type="number" onCommit>` and no component
         * (editor-panels-the-held-specs A8, 2026-09-03). The order matters —
         * commit first, so a caller that DOES accept the value re-renders
         * with the new prop and the effect wins over this fallback. */
        onBlur: () => { onCommit(String(draftRef.current).trim()); draftRef.current = value ?? ''; setDraft(value ?? '') },
        onKeyDown: (e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') { draftRef.current = value ?? ''; setDraft(value ?? ''); e.currentTarget.blur() }
        },
      }
    : null

  /* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's Input carried class for
   * class, the chrome in kol-theme `.kol-input--kolbox`. Its sizes are its three fields: sm the field (`--kol-kolbox-ctl`, 24), md the rail's
   * search (32), lg the search modal's (44). A slot that holds nothing is not drawn, so it takes no space. */
  if (variant === 'kolbox') {
    const k = KOLBOX_SIZE[size] ?? KOLBOX_SIZE.sm
    return (
      <label className={`kol-input--kolbox kol-input--kolbox-${KOLBOX_SIZE[size] ? size : 'sm'} flex min-w-0 items-center has-disabled:opacity-40 ${k.box} ${className}`}>
        {iconLeft && <IconLoader name={iconLeft} size={k.icon} className="kol-input-icon kol-kolbox-icon shrink-0" />}
        {prefix !== undefined && <span className="kol-input-lead w-4 shrink-0">{prefix}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className={`kol-input-value min-w-0 ${hug ? 'field-sizing-content' : 'flex-1'} bg-transparent text-left outline-none`} {...inputProps}
          {...(onCommit ? kolboxField : null)}
          onMouseDown={(e) => { inputProps.onMouseDown?.(e); selectOnFirstPress(e) }} />
        {suffix !== undefined && <span className="kol-input-suffix shrink-0">{suffix}</span>}
        {slotRight}
      </label>
    )
  }

  /* `variant="folio"` (Folio migration batch A, 2026-11-22): Folio's text field carried class for class (apps/folio
   * EditorChrome.jsx Input), the bare field with no shell, the chrome in kol-theme `.kol-input--folio`. The width is the
   * caller's `className`. */
  if (variant === 'folio') {
    return <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} {...inputProps} className={`kol-input--folio h-[32px] rounded-[4px] border px-[16px] outline-none ${className}`} />
  }

  const propertyLen = Math.max(String(value ?? placeholder ?? '').length, 1)

  /* the error: a mark inside, a message under (row 36) */
  const errorMark = error ? <span aria-hidden="true" className="kol-control-error flex items-center shrink-0 pl-2 text-[var(--ui-error)]"><IconLoader name="alert-triangle" size={14} /></span> : null
  const errorText = typeof error === 'string' && error ? (
    <span role="alert" className={`flex items-center gap-1.5 ${resolvedVariant === 'float' ? 'kol-float-label' : 'kol-mono-10'} text-fg-64`}>
      <IconLoader name="info" size={12} />{error}
    </span>
  ) : null

  /* Pin inner input height to the typography token's line-height. Without
   * this the `<input>` renders ~0.5px taller than the equivalent <button>
   * or <label> at the same kol-mono-N — Chromium computes input height
   * from the font's ascender+descender (font-metric), not strictly from
   * CSS line-height. Result: kol-control-sm ends up 26.5px instead of 26.
   * h-4 / h-[18px] / h-[22px] match the kol-mono-12 / -14 / -16 line-heights; on touch every size is
   * the 16 / 22 rung (D5, 2026-09-29 — see SearchInput) — except inside a hardware panel
   * (`.kol-hw-panel`, 2026-10-02): a module's field keeps its desk height on touch, as the rest of
   * the plate does (kol-components-controls.css). The type still goes to 16px there, so iOS does
   * not zoom into it. */
  const heightCls = `${size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : size === 'md' ? 'h-[18px]' : 'h-[22px]'} pointer-coarse:not-[.kol-hw-panel_*]:h-[22px]`

  const inputCls = [
    'min-w-0 bg-transparent border-none outline-none text-auto',
    heightCls,
    !fixedChars && !isProperty && 'flex-1',
    /* Balance the dim prefix/suffix visual weight with extra inner padding
     * on the opposite side. Without this the bright value sits closer to
     * the affordance than to the empty edge, reads off-balance. */
    prefix !== undefined && 'pr-1',
    suffix !== undefined && 'pl-1',
    isNumber && 'hide-number-spinners',
    inputClassName,
  ].filter(Boolean).join(' ')

  const shell = (
    <label
      className={shellCls}
      style={width ? { width: typeof width === 'number' ? `${width}px` : width } : undefined}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? true : undefined}
    >
      {slotLeft && (
        <span className="flex items-center shrink-0 pr-2">{slotLeft}</span>
      )}
      {iconLeft && (
        <span aria-hidden="true" className="flex items-center text-auto opacity-50 shrink-0 pr-2">
          <IconLoader name={iconLeft} size={resolvedIconSize} />
        </span>
      )}
      {prefix !== undefined && (
        <span aria-hidden="true" className="text-meta pr-1 shrink-0">{prefix}</span>
      )}
      {affordance !== undefined && (
        <span aria-hidden="true" className="text-meta pr-1.5 shrink-0 inline-flex items-center">{affordance}</span>
      )}
      {/* Controlled only when a `value` prop is passed — otherwise stay
        * uncontrolled so prop-less usages (search stubs, quick demos) type
        * normally instead of freezing on a value-without-onChange input.
        * Controlled + no onChange = deliberate display-only → readOnly. */}
      <input
        type={type}
        {...(commitProps
          ? commitProps
          : value !== undefined
            ? { value: value ?? '', onChange, readOnly: !onChange || undefined }
            : { onChange })}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        size={fixedChars ? chars : undefined}
        className={inputCls}
        style={isProperty ? { width: `calc(${propertyLen}ch + 2px)` } : undefined}
        {...inputProps}
        /* the commit pair LAST, so nothing spread above it can shadow onBlur / onKeyDown */
        {...(commitProps || {})}
      />
      {unit !== undefined && (
        <span aria-hidden="true" className="text-meta shrink-0">{unit}</span>
      )}
      {suffix !== undefined && (
        <span aria-hidden="true" className="text-meta pl-1 shrink-0">{suffix}</span>
      )}
      {slotRight && (
        <span className="flex items-center shrink-0 pl-1 ml-auto">{slotRight}</span>
      )}
      {errorMark}
    </label>
  )
  /* a message under the field wraps the shell; without one the shell is the whole atom, as before */
  return errorText ? <span className="inline-flex flex-col gap-1.5" style={width ? { width: typeof width === 'number' ? `${width}px` : width } : undefined}>{shell}{errorText}</span> : shell
}
