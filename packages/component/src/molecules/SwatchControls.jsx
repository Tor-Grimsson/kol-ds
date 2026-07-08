import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import ColorSwatch from './ColorSwatch.jsx'

/* taxonomy-ok: the default composed control nests the same-file SwatchStack
 * and EyedropPick (KOL named exports the relative-import check can't see);
 * both collapse the source's internal FramedSwatch onto the sibling molecule
 * ColorSwatch (a same-tier relative import). */

/*
 * SwatchControls — the Photoshop-style top row of the colour panel, in two
 * hand-tuned pieces plus the composed row. Hand-tuned visuals (fixed pixel
 * slots, the overlap-by-DOM-order trick, the double-ring halo, the red-slash
 * "none" marker). DO NOT refactor pieces to atoms — the look is intentional
 * and matches the Ref design; promote each piece WHOLE.
 *
 *   <SwatchControls ... />                                     (default export)
 *     — SwatchStack + EyedropPick laid out in a row.
 *
 *   <SwatchStack fillColor strokeColor activePaint onSwap onClear />
 *     — overlapping fill + stroke paint chips (fill upper-left, stroke
 *       lower-right) with a swap arrow and a "set to none" marker. `activePaint`
 *       flips which chip renders SECOND, so the active paint wins the overlap.
 *       No z-index, no transform — DOM order alone stacks them.
 *
 *   <EyedropPick sampleColor onPick disabled />
 *     — eyedropper icon button + a small sample chip of the sampled colour.
 *       The button is feature-gated: it is hidden entirely when the browser
 *       EyeDropper API is unavailable, and `disabled` dims it when supported
 *       but unusable. The actual EyeDropper call + canvas sampling live at the
 *       call site behind `onPick`.
 *
 * The paint chips and the sample chip collapse onto ColorSwatch's `halo`
 * variant (`variant="halo"` supplies the exact tuned `0 0 0 1px #000,
 * 0 0 0 2px #505050` double-ring); the source's redundant FramedSwatch is
 * dropped. The swap / eyedrop glyphs route through the DS Icon.
 */

/* Fixed chip slots inside the 44×44 stack — identical in both variants; only
 * the render order changes. Positions live on absolutely-placed wrappers so
 * ColorSwatch keeps its own `relative` root (its box-shadow halo needs it). */
const FILL_SLOT   = 'left-[5px] top-[6px]'
const STROKE_SLOT = 'left-[15px] top-[16px]'

/* One 22px paint chip: a halo ColorSwatch pinned to its slot. Click → onSwap
 * (either chip signals swap intent; the app decides fill↔active). */
function PaintChip({ id, label, color, slot, onSwap }) {
  return (
    <span className={`absolute ${slot}`}>
      <ColorSwatch
        hex={color}
        size={22}
        radius="full"
        variant="halo"
        hoverable={false}
        onClick={onSwap}
        data-id={id}
        aria-label={label}
      />
    </span>
  )
}

/**
 * SwatchStack — the overlapping fill + stroke paint chips. `activePaint`
 * selects which chip renders second (topmost in the overlap) purely via DOM
 * order — no z-index, no transform. Clicking either chip, or the swap arrow,
 * fires `onSwap`; the slash-circle marker fires `onClear`.
 *
 * @param {string}   fillColor    fill chip background (css color). Default '#FFFFFF'
 * @param {string}   strokeColor  stroke chip background (css color). Default '#000000'
 * @param {'fill'|'stroke'} activePaint  which chip paints on top. Default 'fill'
 * @param {Function} onSwap       () => void — either chip or the swap arrow
 * @param {Function} onClear      () => void — the "set to none" marker
 */
export function SwatchStack({
  fillColor = '#FFFFFF',
  strokeColor = '#000000',
  activePaint = 'fill',
  onSwap,
  onClear,
}) {
  const fill   = <PaintChip key="fill"   id="fill"   label="Fill color"   color={fillColor}   slot={FILL_SLOT}   onSwap={onSwap} />
  const stroke = <PaintChip key="stroke" id="stroke" label="Stroke color" color={strokeColor} slot={STROKE_SLOT} onSwap={onSwap} />

  /* Active paint is rendered SECOND so it paints on top in the overlap. */
  const chips = activePaint === 'fill' ? [stroke, fill] : [fill, stroke]

  return (
    <div className="relative shrink-0 w-11 h-11">
      {chips}
      <SwapButton onSwap={onSwap} />
      <NoneMarker onClear={onClear} />
    </div>
  )
}

/**
 * EyedropPick — eyedropper icon button + a sample chip of the sampled colour.
 * The button is hidden when the browser EyeDropper API is unavailable (no
 * affordance for an action that can't run); when supported but unusable pass
 * `disabled` to dim it. `onPick` is the app seam where EyeDropper + canvas
 * sampling run.
 *
 * @param {string}   sampleColor  sample chip background (css color)
 * @param {Function} onPick       () => void — eyedropper button click
 * @param {boolean}  disabled     dim + disable the button (default false)
 */
export function EyedropPick({ sampleColor, onPick, disabled = false }) {
  const supported = useEyeDropperSupported()

  return (
    <div className="flex items-start gap-1 shrink-0">
      {supported && (
        <button
          type="button"
          onClick={onPick}
          disabled={disabled}
          aria-label="Eyedropper"
          title="Pick a color from the canvas"
          className="inline-flex cursor-pointer text-fg hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="eyedrop" size={24} />
        </button>
      )}
      <ColorSwatch
        hex={sampleColor}
        size={16}
        radius="full"
        variant="halo"
        title="Sampled color"
        className="mt-1"
      />
    </div>
  )
}

/* ────────── Internal helpers (not exported) ────────── */

/* EyeDropper support, resolved after mount so SSR / first paint stays stable
 * (starts false, flips true only where the API exists). */
function useEyeDropperSupported() {
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'EyeDropper' in window)
  }, [])
  return supported
}

/* Swap arrow, pinned top-right of the stack. Same intent as clicking a chip. */
function SwapButton({ onSwap }) {
  return (
    <button
      type="button"
      onClick={onSwap}
      aria-label="Swap colors"
      className="absolute left-[28px] top-0 inline-flex cursor-pointer text-fg hover:opacity-80"
    >
      <Icon name="swap" size={16} />
    </button>
  )
}

/* "Set to none" marker, pinned bottom-left of the stack. The red diagonal
 * slash + token ring live in `.kol-swatch-none-marker` (chrome the JSX can't
 * express — a two-stop gradient over a themed box-shadow ring). */
function NoneMarker({ onClear }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear color"
      className="kol-swatch-none-marker absolute left-[1px] top-[32px] w-2.5 h-2.5 rounded-full overflow-hidden cursor-pointer"
    />
  )
}

/**
 * SwatchControls — the composed colour-panel top row: SwatchStack (fill /
 * stroke paint chips + swap + none) alongside EyedropPick (eyedropper +
 * sample chip). Fully controlled and store-free; the app owns the swap, clear,
 * and pick handlers.
 *
 * @param {string}   fillColor      fill chip background (css color)
 * @param {string}   strokeColor    stroke chip background (css color)
 * @param {'fill'|'stroke'} activePaint  which chip paints on top. Default 'fill'
 * @param {Function} onSwap         () => void — swap fill ↔ active
 * @param {Function} onClear        () => void — set active paint to none
 * @param {string}   sampleColor    eyedropper sample chip background (css color)
 * @param {Function} onPick         () => void — invoke EyeDropper at the call site
 * @param {boolean}  eyedropDisabled  dim + disable the eyedropper button
 * @param {string}   className      extra classes on the row wrapper
 */
export default function SwatchControls({
  fillColor,
  strokeColor,
  activePaint = 'fill',
  onSwap,
  onClear,
  sampleColor,
  onPick,
  eyedropDisabled = false,
  className = '',
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <SwatchStack
        fillColor={fillColor}
        strokeColor={strokeColor}
        activePaint={activePaint}
        onSwap={onSwap}
        onClear={onClear}
      />
      <EyedropPick sampleColor={sampleColor} onPick={onPick} disabled={eyedropDisabled} />
    </div>
  )
}
