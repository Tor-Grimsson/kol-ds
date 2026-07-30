import { Icon } from '@kolkrabbi/kol-icons'
import { useTheme } from './theme.js'

/**
 * Theme toggle — tri-state glyph-roll button (0.9.0, the approved 2-variant spec).
 *
 * Clicking CYCLES light → dark → system → light. 'system' is the no-choice
 * state: the stamp + saved key are cleared and the page follows
 * prefers-color-scheme live (USER law: explicit choice > system > light).
 *
 * ONE glyph, ever (user ruling 2026-07-30): every position in the roll strip
 * is `mode-toggle-01`, the split circle — the system state wears it too, told
 * apart by the label / tooltip, never by a third glyph. The strip rolls like
 * a coin: rotation ACCUMULATES −180° per slot on the same 500ms clock as the
 * travel, so one lap shows both directions.
 *
 * THE SPEC (approved 2026-07-30 — variants are container GEOMETRY only;
 * everything else is a prop):
 *
 *   variant "button" — padded rung + corner radius (THE button container)
 *     fill       'subtle' | 'none'   the one bg element — subtle = grey fill
 *                                    (brand sidebar) · none = the invisible
 *                                    container (nav-bar chrome)
 *     iconRight  bool                glyph right of the text (left default)
 *     label      bool                text on/off — off pins the square box
 *                                    per rung (28/32/36; icon-only is a
 *                                    geometry condition, not a variant)
 *     fullWidth  bool                stretches to a sidenav row
 *     size       'sm' | 'md' | 'lg'  moves pad + text + glyph together
 *
 *   variant "flush" — no pad, no radius, no fill, ever
 *     same prop list minus `fill`; no square pinning (there is no box);
 *     size scales text + glyph only.
 *
 * Glyph law: text-adjacent 14/16/18 (stays inside the rung line box);
 * solo 16/20/24 (the pinned-square pairing).
 *
 * DEPRECATED aliases (0.6.x variants) — render their old chrome verbatim so
 * no consumer shifts a pixel; migrate at your own pace:
 *   icon     → button + fill none + label off
 *   hop      → button + fill subtle + fullWidth (old: chrome pinned md)
 *   hop-bare → flush + fullWidth (old: 6/24 padding kept)
 *
 * Theme state lives in useTheme (./theme.js); this component is only the
 * glyph-roll UI on top of it.
 */
const MODE_LABEL = { light: 'Light mode', dark: 'Dark mode', system: 'System' }
const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' }
const SLOT = { dark: 0, light: 1, system: 2 }

export default function ThemeToggle({
  variant = 'button',
  fill = 'subtle',
  size = 'md',
  label = true,
  iconRight = false,
  fullWidth = false,
  className = '',
}) {
  const { mode, cycle } = useTheme()

  const next = NEXT_MODE[mode]
  const nextLabel = next === 'system' ? 'system theme' : `${next} mode`

  /* The ROLL — wheel mechanics (2026-07-30, one-glyph ruling): three copies
   * of the split circle; rotation accumulates with the slot (−180° per
   * glyph-width) on the same 500ms/ease clock as the strip's translateX.
   * light→dark rolls one way, dark→system rolls back two half-turns,
   * system→light forward again — both directions in one lap. */
  const slot = SLOT[mode]
  const iconSwap = (px) => (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      <span
        className="flex transition-transform duration-500 ease-in-out"
        style={{ width: px * 3, transform: `translateX(-${slot * px}px)` }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-flex transition-transform duration-500 ease-in-out"
            style={{ transform: `rotate(${slot * -180}deg)`, lineHeight: 0 }}
          >
            <Icon name="mode-toggle-01" size={px} />
          </span>
        ))}
      </span>
    </span>
  )

  const mono = size === 'sm' ? 'kol-mono-12' : size === 'lg' ? 'kol-mono-16' : 'kol-mono-14'
  /* Glyph law: text-adjacent stays inside the rung line box; solo takes the
   * pinned-square pairing sizes. */
  const glyphWithText = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
  const glyphSolo = size === 'sm' ? 16 : size === 'lg' ? 24 : 20

  const shared = {
    type: 'button',
    onClick: cycle,
    'aria-label': `Switch to ${nextLabel}`,
    title: `Switch to ${nextLabel}`,
  }

  /* ── DEPRECATED aliases — old chrome verbatim (0.6.x) ── */
  if (variant === 'icon') {
    return (
      <button {...shared} className={`kol-btn kol-btn-nav kol-btn-${size} kol-btn-icon ${className}`.trim()}>
        {iconSwap(glyphSolo)}
      </button>
    )
  }
  if (variant === 'hop' || variant === 'hop-bare') {
    const bare = variant === 'hop-bare'
    const chromeCls = bare
      ? 'w-full inline-flex items-center justify-start gap-2 py-1.5 px-6 kol-mono-14 bg-transparent text-emphasis transition-colors'
      : 'kol-btn kol-btn-primary kol-btn-md kol-mono-14 w-full justify-start gap-2'
    return (
      <button {...shared} className={`${chromeCls} ${className}`.trim()}>
        <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
          {iconSwap(glyphSolo)}
        </span>
        <span className="kol-sidenav-hop-label flex-1 min-w-0 text-left">
          {MODE_LABEL[mode]}
        </span>
      </button>
    )
  }

  /* ── THE SPEC ── */
  const width = fullWidth ? 'w-full justify-start' : ''

  if (variant === 'flush') {
    const glyph = label ? glyphWithText : glyphSolo
    const cls = `inline-flex items-center gap-2 ${mono} bg-transparent text-emphasis transition-colors ${width} ${className}`
    return (
      <button {...shared} className={cls.replace(/\s+/g, ' ').trim()}>
        {!iconRight && iconSwap(glyph)}
        {label && <span className={fullWidth ? 'flex-1 min-w-0 text-left' : ''}>{MODE_LABEL[mode]}</span>}
        {iconRight && iconSwap(glyph)}
      </button>
    )
  }

  /* variant === 'button' (default) — the padded rung. fill is the one bg
   * element: subtle = the grey fill (kol-btn-primary), none = the invisible
   * container (kol-btn-nav — quiet ink + hover wash, geometry identical). */
  const fillCls = fill === 'none' ? 'kol-btn-nav' : 'kol-btn-primary'
  if (!label) {
    // icon-only pins the square box per rung — geometry condition, not a variant
    return (
      <button {...shared} className={`kol-btn ${fillCls} kol-btn-${size} kol-btn-icon ${width} ${className}`.replace(/\s+/g, ' ').trim()}>
        {iconSwap(glyphSolo)}
      </button>
    )
  }
  return (
    <button {...shared} className={`kol-btn ${fillCls} kol-btn-${size} ${mono} gap-2 ${width} ${className}`.replace(/\s+/g, ' ').trim()}>
      {!iconRight && iconSwap(glyphWithText)}
      <span className={fullWidth ? 'flex-1 min-w-0 text-left' : ''}>{MODE_LABEL[mode]}</span>
      {iconRight && iconSwap(glyphWithText)}
    </button>
  )
}
