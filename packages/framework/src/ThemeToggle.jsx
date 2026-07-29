import { Icon } from '@kolkrabbi/kol-icons'
import { useTheme } from './theme.js'

/**
 * Theme toggle — horizontal icon-swap button, tri-state (0.6.0).
 *
 * Clicking CYCLES light → dark → system → light. 'system' is the no-choice
 * state: the stamp + saved key are cleared and the page follows
 * prefers-color-scheme live (USER law: explicit choice > system/auto > light).
 * The glyph shows the current mode — the split-circle `mode-toggle-01` for
 * light/dark (rolling + spinning exactly as before), the v1 `desktop` glyph
 * for system.
 *
 * Variants:
 *   icon     — icon-only button on the DS button ladder: `size` 'sm'|'md'|'lg'
 *              → 14/16/18px glyph, square box + quiet states from the
 *              .kol-btn-nav chrome (theme ≥0.11.4), so the toggle sits flush
 *              with sibling navigation buttons in a bar.
 *   button   — a REAL ladder button (2026-07-29, user-ordered): glyph + label
 *              inside plain `.kol-btn .kol-btn-primary .kol-btn-{size}` with
 *              the rung's mono type and pairing-law glyph (16/20/24) — no
 *              width/justify overrides, so it measures exactly like any
 *              other kol-btn on the rung.
 *   hop      — full-width labeled Button-primary-styled sidenav row
 *              (bg-fg-04, on-primary text). For sidenav rows where it pairs
 *              with other Button-primary "hop" entries.
 *   hop-bare — same shape + padding as hop, but fully transparent (no rest
 *              bg, no hover bg). For sidenav rows where the row should read
 *              as plain text + icon, not a button.
 *
 * Theme state lives in useTheme (./theme.js) — the exported machinery
 * (initial-state resolution, saved-choice re-stamp, system-follow, cross-
 * instance sync). This component is only the glyph-roll UI on top of it.
 */
const MODE_LABEL = { light: 'Light mode', dark: 'Dark mode', system: 'System' }
const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' }

export default function ThemeToggle({ variant = 'icon', size = 'md', className = '' }) {
  const { isDark, mode, cycle } = useTheme()

  const next = NEXT_MODE[mode]
  const nextLabel = next === 'system' ? 'system theme' : `${next} mode`
  const handleToggle = cycle

  /* The roll: the strip slides one glyph-width per mode while the split-circle
   * glyphs spin 180° in the same clock — dark→light rolls forward (>>),
   * light→dark rolls back (<<), system slides on to the desktop glyph. */
  const glyphSpin = {
    transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
    lineHeight: 0,
  }
  const slot = mode === 'dark' ? 0 : mode === 'light' ? 1 : 2
  const iconSwap = (size) => (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="flex transition-transform duration-500 ease-in-out"
        style={{ width: size * 3, transform: `translateX(-${slot * size}px)` }}
      >
        <span className="inline-flex transition-transform duration-500 ease-in-out" style={glyphSpin}>
          <Icon name="mode-toggle-01" size={size} />
        </span>
        <span className="inline-flex transition-transform duration-500 ease-in-out" style={glyphSpin}>
          <Icon name="mode-toggle-01" size={size} />
        </span>
        <span className="inline-flex" style={{ lineHeight: 0 }}>
          <Icon name="desktop" size={size} />
        </span>
      </span>
    </span>
  )

  if (variant === 'button') {
    const mono = size === 'sm' ? 'kol-mono-12' : size === 'lg' ? 'kol-mono-16' : 'kol-mono-14'
    /* Text-adjacent glyph law: the glyph must never exceed the rung's mono
     * line box (16/18/22), or it inflates the button past the ladder height —
     * playwright-measured against a same-rung kol-btn: 14/16/18 keeps them
     * pixel-equal. (The 16/20/24 pairing law is for pinned icon-only squares.) */
    const glyph = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Switch to ${nextLabel}`}
        className={`kol-btn kol-btn-primary kol-btn-${size} ${mono} gap-2 ${className}`.trim()}
      >
        {iconSwap(glyph)}
        <span>{MODE_LABEL[mode]}</span>
      </button>
    )
  }

  if (variant === 'hop' || variant === 'hop-bare') {
    const bare = variant === 'hop-bare'
    const chromeCls = bare
      ? 'w-full inline-flex items-center justify-start gap-2 py-1.5 px-6 kol-mono-14 bg-transparent text-emphasis transition-colors'
      : 'kol-btn kol-btn-primary kol-btn-md kol-mono-14 w-full justify-start gap-2'
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Switch to ${nextLabel}`}
        className={`${chromeCls} ${className}`.trim()}
      >
        <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
          {iconSwap(size === "sm" ? 16 : size === "lg" ? 24 : 20)}
        </span>
        {/* kol-sidenav-hop-label keeps the responsive label-hide rule firing
         * at narrow viewports without subjecting the button to the muted
         * sidenav-hop text-color override. */}
        <span className="kol-sidenav-hop-label flex-1 min-w-0 text-left">
          {MODE_LABEL[mode]}
        </span>
      </button>
    )
  }

  // variant === 'icon' (default) — geometry from the DS button ladder
  // (sm 16 / md 20 / lg 24 glyph — 2026-07-28 pairing law), chrome = ghost icon-only .kol-btn.
  // Overrules the 2026-07-15 "36×36/20 reference" one-off (user ruling
  // 2026-07-28: the button ladder is the reference, bar icons included).
  const glyph = size === 'sm' ? 16 : size === 'lg' ? 24 : 20
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${nextLabel}`}
      title={`Switch to ${nextLabel}`}
      className={`kol-btn kol-btn-nav kol-btn-${size} kol-btn-icon ${className}`.trim()}
    >
      {iconSwap(glyph)}
    </button>
  )
}
