/**
 * ColorSwatch — fixed-size color chip atom.
 *
 *   onClick provided → renders <button> with hover + selected states
 *   onClick omitted  → renders <span aria-hidden> — non-interactive preview
 *
 * Pass `showTransparent` to render the TransparentX overlay (for null /
 * unset color slots). When true, bg goes transparent regardless of `hex`.
 *
 * Props:
 *   hex             — color string, e.g. '#FF6F00'. Ignored if showTransparent.
 *   selected        — adds active border + ring (border-fg-64 ring-1).
 *   size            — number (px) for fixed-size, 'fill' (w-full aspect-square,
 *                     for grid cells that should stay square), 'stretch'
 *                     (w-full h-full, for grid cells that stretch to row height),
 *                     or 'control-sm' (26px — the kol-control-sm row height, so
 *                     a swatch sits flush beside sm input chrome in a paint bar;
 *                     ColorSwatchFieldSizing 2026-08-12). Default 24.
 *   radius          — 'sm' (4px, default) | 'tight' (2px) | 'none' | 'full' (circle).
 *                     Default was 'tight' until 2026-08-12 — flipped to 'sm' per
 *                     the system radius law (containers are 4px everywhere);
 *                     square-corner contexts opt out via 'tight'/'none'.
 *   frame           — boolean (default true). When false, no border drawn —
 *                     used by tightly-packed grid layouts.
 *   variant         — 'default' (border-based chrome) |
 *                     'halo' (macOS-port double box-shadow halo). Halo
 *                     overrides `frame` since it provides its own ring.
 *   hoverable       — boolean (default true). When false, no hover border
 *                     state is applied even if `onClick` is set. For static
 *                     chips that just open a popover (e.g. inspector fill /
 *                     stroke swatches).
 *   showTransparent — universal "disabled / no value / unset" indicator.
 *                     Renders white background + TransparentX diagonal
 *                     stroke; rounded corners clip the line cleanly via
 *                     `overflow-hidden` on the swatch root.
 *   transparentTone — tone of the TransparentX stroke when `showTransparent`
 *                     is true: 'warning' (default) | 'error' | 'info' |
 *                     'success'. Maps through to `var(--ui-{tone})`.
 *   onClick         — if provided, renders as <button>; else <span>.
 *   title           — passes through.
 */
import TransparentX from '../utilities/TransparentX'

const SIZE_CLASSES = {
  fill:    'w-full aspect-square',
  stretch: 'w-full h-full',
}

/* Named px sizes that track the control ladder — inline style, not a
 * utility class (package chrome never rides arbitrary utilities). */
const NAMED_PX = {
  'control-sm': 26, // kol-control-sm outer height — paint-bar swatch flush with sm input chrome
}

const RADIUS_CLASSES = {
  none:  'rounded-none',
  tight: 'rounded-[var(--kol-radius-xs)]',
  sm:    'rounded',
  full:  'rounded-full',
}

/* The halo ring is THEME-AWARE. It was the literal `0 0 0 1px #000, 0 0 0 2px
 * #505050` carried in from the macOS port, which put a pure-black ring on a
 * rgb(250,250,250) page in light theme — measured by kol-fxr on the swatch
 * chips (`editor-set-is-behind-its-source`, 2026-09-03). These are the two
 * tokens its own SwatchControls draws, and in dark they resolve to ≈ the
 * port's original values, so the look the variant was named for is unchanged
 * where it was correct. */
const HALO_SHADOW = '0 0 0 1px var(--kol-surface-primary), 0 0 0 2px var(--kol-fg-32)'

export default function ColorSwatch({
  hex,
  selected = false,
  size = 24,
  radius = 'sm',
  frame = true,
  variant = 'default',
  hoverable = true,
  showTransparent = false,
  transparentTone = 'warning',
  onClick,
  title,
  className = '',
  ...rest
}) {
  const interactive = typeof onClick === 'function'
  const resolvedSize = NAMED_PX[size] ?? size
  const isNamed = typeof resolvedSize === 'string'
  const sizeCls   = isNamed ? (SIZE_CLASSES[resolvedSize] ?? '') : ''
  const sizeStyle = isNamed ? null : { width: resolvedSize, height: resolvedSize }

  const isHalo  = variant === 'halo'
  const radiusCls = RADIUS_CLASSES[radius] ?? RADIUS_CLASSES.sm

  /* Halo provides its own ring via box-shadow → no border classes.
   * frame=false → consumer wants a borderless chip (e.g. swatch grids
   * that tile edge-to-edge). */
  const showBorder = !isHalo && frame

  /* Border policy:
   *   default state (not selected) — no border, clean chip
   *   selected                     — 2px border-fg-64 (the selection chrome)
   *   halo variant                 — handled separately via box-shadow
   * `frame` and `hoverable` are kept on the API but no longer drive a
   * default-state border; they're advisory for future variants. */
  const cls = [
    'relative shrink-0 inline-flex overflow-hidden',
    radiusCls,
    !isHalo && selected ? 'border-2 border-fg-64' : '',
    interactive ? 'cursor-pointer' : '',
    sizeCls,
    className,
  ].filter(Boolean).join(' ')

  const style = {
    background: showTransparent ? '#FFFFFF' : (hex || 'transparent'),
    ...(isHalo && { boxShadow: HALO_SHADOW }),
    ...sizeStyle,
  }

  const inner = showTransparent ? <TransparentX tone={transparentTone} /> : null

  if (interactive) {
    return (
      <button
        {...rest}
        type="button"
        onClick={onClick}
        title={title}
        aria-label={rest['aria-label'] ?? hex ?? 'transparent'}
        aria-pressed={selected}
        className={cls}
        style={style}
      >
        {inner}
      </button>
    )
  }

  return (
    <span {...rest} aria-hidden="true" title={title} className={cls} style={style}>
      {inner}
    </span>
  )
}
