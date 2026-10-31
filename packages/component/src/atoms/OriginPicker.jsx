import { useRef } from 'react'
import { toneClass } from '../utilities/tone.js'

const STEPS = [0, 0.5, 1]
const X_NAME = ['left', 'center', 'right']
const Y_NAME = ['top', 'center', 'bottom']
const pointName = (xi, yi) => (xi === 1 && yi === 1 ? 'center' : `${X_NAME[xi]} ${Y_NAME[yi]}`)

/* box padding + cell + dot per rung: 2·pad + 3·cell = the field's height (22 · 26 · 32; touch 32 · 32 · 36).
 * The xs touch lift skips a hardware panel, as Input's does. */
const SIZE = {
  xs: 'p-[2px] [--op-cell:6px] [--op-dot:4px] rounded-[var(--kol-radius-xs)] pointer-coarse:not-[.kol-hw-panel_*]:p-px pointer-coarse:not-[.kol-hw-panel_*]:[--op-cell:10px] pointer-coarse:not-[.kol-hw-panel_*]:[--op-dot:6px]',
  sm: 'p-px [--op-cell:8px] [--op-dot:4px] rounded-[var(--kol-radius-sm)] pointer-coarse:[--op-cell:10px] pointer-coarse:[--op-dot:6px]',
  md: 'p-px [--op-cell:10px] [--op-dot:6px] rounded-[var(--kol-radius-sm)] pointer-coarse:p-[3px]',
}

/**
 * OriginPicker — Pick one of nine anchor points. a 3×3 transform-origin / anchor value picker.
 *
 * Lobby OriginPicker (kol-fxr, 2026-10-31): fxr's layer inspector hand-built it as `AnchorPicker`
 * (nine 6 px radio dots on surface-secondary) beside its X / Y fields. `AlignmentGrid` is not it —
 * that fires align actions and holds no value; this holds one.
 *
 * ON THE CONTROL RAMP. The square is exactly a field's height at the same `size`, so it sits beside
 * an `Input` without a step: xs 22 · sm 26 · md 32 (touch 32 · 32 · 36, as the fields grow). The
 * ground is the control's (`--kol-tone-bg`, else surface-secondary), so `tone` and a toned wrapper
 * reach it as they reach an Input. No border — the field family has none.
 *
 * INKS (the icon ink law — oq, never fg): a point rests at oq-24, a hovered one lifts to oq-48, the
 * selected one is the accent. Focus is the segmented strip's quiet ring, drawn on the square.
 *
 * A11y: a radiogroup of nine radios with a roving tabindex — Tab lands on the selected point,
 * ←/→ move x and ↑/↓ move y (selection and focus together, no wrap).
 *
 *   <OriginPicker value={anchor} onChange={setAnchor} ariaLabel="Transform origin" size="sm" />
 *
 * @param {[number, number]} value - The selected point `[x, y]`, each 0 · 0.5 · 1 (0 = left / top)
 * @param {(value:[number, number]) => void} onChange - Fired with the new `[x, y]` on click or arrow key
 * @param {'xs'|'sm'|'md'} [size='sm'] - The control rung — the square matches a field of this size
 * @param {string} [tone='default'] - The control set's tone (the ground); default inherits a wrapper's
 * @param {string} [ariaLabel='Origin'] - The group's accessible name
 * @param {string} [className] - Extra classes on the square
 */
export default function OriginPicker({
  value = [0.5, 0.5],
  onChange,
  size = 'sm',
  tone = 'default',
  ariaLabel = 'Origin',
  className = '',
}) {
  const refs = useRef([])
  const sel = [STEPS.indexOf(value?.[0]), STEPS.indexOf(value?.[1])]

  const pick = (xi, yi, focus) => {
    onChange?.([STEPS[xi], STEPS[yi]])
    if (focus) refs.current[yi * 3 + xi]?.focus()
  }

  const onKeyDown = (e, xi, yi) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
    if (!d) return
    e.preventDefault()
    const nx = Math.min(2, Math.max(0, xi + d[0]))
    const ny = Math.min(2, Math.max(0, yi + d[1]))
    if (nx !== xi || ny !== yi) pick(nx, ny, true)
  }

  /* nothing valid selected → the centre takes the tab stop, so the group is still reachable */
  const tabStop = sel[0] < 0 || sel[1] < 0 ? [1, 1] : sel

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={[
        'kol-origin-picker inline-grid grid-cols-3 shrink-0 bg-[var(--kol-tone-bg,var(--kol-surface-secondary))]',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-[var(--kol-focus-ring-quiet)] has-[:focus-visible]:-outline-offset-2',
        SIZE[size] ?? SIZE.sm,
        toneClass(tone),
        className,
      ].filter(Boolean).join(' ')}
    >
      {STEPS.map((_, yi) => STEPS.map((__, xi) => {
        const on = sel[0] === xi && sel[1] === yi
        const stop = tabStop[0] === xi && tabStop[1] === yi
        return (
          <button
            key={`${xi}${yi}`}
            ref={(el) => { refs.current[yi * 3 + xi] = el }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={pointName(xi, yi)}
            tabIndex={stop ? 0 : -1}
            onClick={() => pick(xi, yi, false)}
            onKeyDown={(e) => onKeyDown(e, xi, yi)}
            className={`group grid place-items-center p-0 border-0 bg-transparent cursor-pointer outline-none size-[var(--op-cell)]`}
          >
            <span
              aria-hidden="true"
              className={`block rounded-full transition-colors size-[var(--op-dot)] ${on
                ? 'bg-[var(--kol-accent-primary)]'
                : 'bg-[var(--kol-oq-24)] group-hover:bg-[var(--kol-oq-48)]'}`}
            />
          </button>
        )
      }))}
    </div>
  )
}
