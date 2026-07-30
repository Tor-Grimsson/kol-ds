import { Icon } from '@kolkrabbi/kol-icons'
import { useTheme } from './theme.js'

/**
 * Theme toggle — two-position glyph-roll button (the approved 2-variant spec).
 *
 * Clicking cycles **light ↔ dark**. `system` is not a position — see the
 * ruling above MODE_LABEL. Alt- or shift-click clears the choice and hands the
 * page back to the OS (USER law: explicit choice > system > light).
 *
 * ONE glyph, ever (user ruling 2026-07-30): both positions in the roll strip
 * are `mode-toggle-01`, the split circle, told apart by the label / tooltip,
 * never by a second glyph. The strip rolls like a coin: rotation ACCUMULATES
 * −180° per slot on the same 500ms clock as the travel.
 *
 * THE SPEC (approved 2026-07-30 — variants are container GEOMETRY only;
 * everything else is a prop):
 *
 *   variant "button" — padded rung + corner radius (THE button container)
 *     fill       'none' (default) | 'subtle'   the one bg element — none = the
 *                                    invisible container (nav rows, sidebars,
 *                                    chrome) · subtle = the grey filled rung,
 *                                    for a toggle that IS a button on a page.
 *                                    The old default was 'subtle' and its
 *                                    docstring claimed the filled rung suited
 *                                    the brand sidebar; the ruling withdrew
 *                                    that — a sidebar row is not a button.
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
 * NO INTERACTIVE STATES, ANY VARIANT (user ruling 2026-07-30): *"REMOVE ALL
 * STATES, no fucking hover… no variant at all should have an interactive state
 * — it's just a click 1-2, and it's themed."* It emitted `.kol-btn` +
 * `.kol-btn-nav`/`.kol-btn-primary`, which dragged the button state machine
 * along (base transition + focus ring, per-variant :hover wash, [aria-current]
 * shift). Those three were the only state sources; it now emits
 * `.kol-theme-toggle{,-none,-subtle,-flush}` instead, which declare the same
 * resting appearance and have no state rules to inherit. The SIZE classes
 * (`kol-btn-{sm,md,lg}`, `kol-btn-icon`) are pure padding/geometry and stay.
 * The glyph roll stays too — that animates a state CHANGE, it is not a state.
 *
 * Theme state lives in useTheme (./theme.js); this component is only the
 * glyph-roll UI on top of it.
 */
/* TWO positions (user ruling 2026-07-30, lobby/ThemeToggleSystemState.md):
 *   "I see three states… dark mode system light mode, why the fuck is system
 *    there, that is not a state."
 *
 * `system` is the ABSENCE of a choice — theme.js says so in its own words — so
 * it can never be a labelled rung a click walks into. Promoting it made the
 * control lie twice: it claimed a mode called "System", and it stopped being
 * able to tell you what the next click would do, because from system the
 * result depends on the OS.
 *
 * What ships now: the toggle cycles light ↔ dark and LABELS WHAT RENDERS. When
 * the page is unset, the label reads the resolved theme (which is what the eye
 * sees) and one click commits it. The reset lives behind a modifier — alt- or
 * shift-click — which is the "separate affordance" the ruling allows, with no
 * new chrome and no third stop. */
const MODE_LABEL = { light: 'Light mode', dark: 'Dark mode' }
const SLOT = { dark: 0, light: 1 }

export default function ThemeToggle({
  variant = 'button',
  /* DEFAULT FLIPPED subtle → none (user ruling 2026-07-30, finding #2): a bare
   * <ThemeToggle /> was taking the grey filled rung, which is why the brand
   * sidebar rendered a filled button nobody asked for. `none` is the quiet
   * container — identical geometry, hover wash, no box. Consumers that want
   * the fill now say so. */
  fill = 'none',
  size = 'md',
  label = true,
  iconRight = false,
  fullWidth = false,
  className = '',
}) {
  const { theme, mode, cycle, clear } = useTheme()

  /* Label and slot follow the RESOLVED theme, not the stored choice: when the
   * page is unset, what the user is looking at is the OS's answer, and the
   * button must describe that or it can't say what the next click does. */
  const shown = theme === 'dark' ? 'dark' : 'light'
  const next = shown === 'dark' ? 'light' : 'dark'

  /* The ROLL — wheel mechanics (2026-07-30, one-glyph ruling): two copies of
   * the split circle; rotation accumulates with the slot (−180° per
   * glyph-width) on the same 500ms/ease clock as the strip's translateX, so
   * light→dark rolls one way and dark→light rolls back. */
  const slot = SLOT[shown]
  const iconSwap = (px) => (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      <span
        className="flex transition-transform duration-500 ease-in-out"
        style={{ width: px * 2, transform: `translateX(-${slot * px}px)` }}
      >
        {[0, 1].map((i) => (
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

  /* alt/shift-click = the reset. A modifier, not a rung — the ruling's
   * "separate affordance", costing no chrome and no third stop. Announced in
   * the title so it's discoverable without being in the way. */
  const onClick = (e) => (e.altKey || e.shiftKey ? clear() : cycle())
  const resetHint = mode === 'system' ? ' · following your system' : ' · alt-click to follow your system'

  const shared = {
    type: 'button',
    onClick,
    'aria-label': `Switch to ${next} mode`,
    title: `Switch to ${next} mode${resetHint}`,
  }

  /* ── DEPRECATED aliases — old chrome verbatim (0.6.x) ── */
  if (variant === 'icon') {
    return (
      <button {...shared} className={`kol-theme-toggle kol-theme-toggle-none kol-btn-${size} kol-btn-icon ${className}`.trim()}>
        {iconSwap(glyphSolo)}
      </button>
    )
  }
  if (variant === 'hop' || variant === 'hop-bare') {
    const bare = variant === 'hop-bare'
    const chromeCls = bare
      ? 'w-full inline-flex items-center justify-start gap-2 py-1.5 px-6 kol-mono-14 bg-transparent text-emphasis'
      : 'kol-theme-toggle kol-theme-toggle-subtle kol-btn-md kol-mono-14 w-full justify-start gap-2'
    return (
      <button {...shared} className={`${chromeCls} ${className}`.trim()}>
        <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
          {iconSwap(glyphSolo)}
        </span>
        <span className="kol-sidenav-hop-label flex-1 min-w-0 text-left">
          {MODE_LABEL[shown]}
        </span>
      </button>
    )
  }

  /* ── THE SPEC ── */
  const width = fullWidth ? 'w-full justify-start' : ''

  if (variant === 'flush') {
    const glyph = label ? glyphWithText : glyphSolo
    const cls = `kol-theme-toggle kol-theme-toggle-flush gap-2 ${mono} ${width} ${className}`
    return (
      <button {...shared} className={cls.replace(/\s+/g, ' ').trim()}>
        {!iconRight && iconSwap(glyph)}
        {label && <span className={fullWidth ? 'flex-1 min-w-0 text-left' : ''}>{MODE_LABEL[shown]}</span>}
        {iconRight && iconSwap(glyph)}
      </button>
    )
  }

  /* variant === 'button' (default) — the padded rung. fill is the one bg
   * element: subtle = the grey fill, none = the invisible container. Geometry
   * identical; no hover wash on either — see the no-states note below. */
  const fillCls = fill === 'none' ? 'kol-theme-toggle-none' : 'kol-theme-toggle-subtle'
  if (!label) {
    // icon-only pins the square box per rung — geometry condition, not a variant
    return (
      <button {...shared} className={`kol-theme-toggle ${fillCls} kol-btn-${size} kol-btn-icon ${width} ${className}`.replace(/\s+/g, ' ').trim()}>
        {iconSwap(glyphSolo)}
      </button>
    )
  }
  return (
    <button {...shared} className={`kol-theme-toggle ${fillCls} kol-btn-${size} ${mono} gap-2 ${width} ${className}`.replace(/\s+/g, ' ').trim()}>
      {!iconRight && iconSwap(glyphWithText)}
      <span className={fullWidth ? 'flex-1 min-w-0 text-left' : ''}>{MODE_LABEL[shown]}</span>
      {iconRight && iconSwap(glyphWithText)}
    </button>
  )
}
