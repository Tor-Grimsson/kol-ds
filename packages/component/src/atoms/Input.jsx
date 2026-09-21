import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
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
 *
 * Chrome (bg/border/padding/transition/disabled) comes from .kol-control;
 * Input owns prefix/suffix/icon layout + the inner <input> styling.
 */

const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }

export default function Input({
  type = 'text',
  value,
  onChange,
  onCommit,
  variant,
  tone = 'default',
  size = 'md',
  chars,
  prefix,
  suffix,
  slotLeft,
  affordance,
  unit,
  iconLeft,
  iconSize = null,
  placeholder,
  disabled = false,
  width,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
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

  const propertyLen = Math.max(String(value ?? placeholder ?? '').length, 1)

  /* Pin inner input height to the typography token's line-height. Without
   * this the `<input>` renders ~0.5px taller than the equivalent <button>
   * or <label> at the same kol-mono-N — Chromium computes input height
   * from the font's ascender+descender (font-metric), not strictly from
   * CSS line-height. Result: kol-control-sm ends up 26.5px instead of 26.
   * h-4 / h-[18px] / h-[22px] match the kol-mono-12 / -14 / -16 line-heights. */
  const heightCls = size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : size === 'md' ? 'h-[18px]' : 'h-[22px]'

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

  return (
    <label
      className={shellCls}
      style={width ? { width: typeof width === 'number' ? `${width}px` : width } : undefined}
      aria-disabled={disabled || undefined}
    >
      {slotLeft && (
        <span className="flex items-center shrink-0 pr-2">{slotLeft}</span>
      )}
      {iconLeft && (
        <span aria-hidden="true" className="flex items-center text-auto opacity-50 shrink-0 pr-2">
          <Icon name={iconLeft} size={resolvedIconSize} />
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
    </label>
  )
}
