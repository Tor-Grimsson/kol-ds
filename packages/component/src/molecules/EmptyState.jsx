/**
 * EmptyState — What a panel shows when it has nothing. a stacked "nothing here yet / nothing selected" text block
 * for inspectors, empty rails and unshipped panels. Ported from the brand
 * editor's inspector Placeholder (renamed: AssetPlaceholder already owns
 * the placeholder name). All lines render as authored — no auto casing
 * (the source's `uppercase` on the eyebrow was dropped per KOL rules).
 *
 * `gated` (GatedEmptyState, kol-fxr 2026-08-15) opts this instance into the
 * app-wide placeholder switch — see usePlaceholders(). It is OPT-IN, not the
 * default, on purpose: the ruling that placeholder prose defaults to hidden is
 * the filing app's, and flipping it here would silently blank every surface
 * already shipping an EmptyState. A consumer that wants the gate asks for it.
 *
 * @param {string}  eyebrow  kicker line above the title
 * @param {string}  title    headline
 * @param {string}  body     optional supporting line
 * @param {string}  footer   optional note above a top hairline
 * @param {boolean} gated    hide unless placeholders are switched on (default false)
 * @param {string}  className extra classes on the wrapper
 * @param {'float'} [variant]  `float` (float-everything W6 row 92, 2026-11-04 — kol-float--style 46:3073): the empty panel
 *                   on a float — the title in `kol-float-window` (Inter 18), the body in `kol-float-body` on fg-64, the
 *                   footer pinned to the panel's foot in `kol-float-hint` (`Panel stays open.`), no rule above it. It
 *                   fills its panel's height (`flex-1`) so the footer lands at the bottom.
 */
export default function EmptyState({ eyebrow, title, body, footer, gated = false, variant, className = '' }) {
  if (variant === 'float') {
    return (
      <div className={`flex min-h-0 flex-1 flex-col${gated ? ' kol-placeholder' : ''} ${className}`.trim()}>
        {eyebrow && <p className="kol-float-label mb-1 text-fg-64">{eyebrow}</p>}
        {title && <p className="kol-float-window mb-3 text-fg-emphasis">{title}</p>}
        {body && <p className="kol-float-body whitespace-pre-line text-fg-64">{body}</p>}
        {footer && <p className="kol-float-hint mt-auto pt-6 text-fg-64">{footer}</p>}
      </div>
    )
  }
  return (
    <div className={`${gated ? 'kol-placeholder' : ''}${className ? ` ${className}` : ''}` || undefined}>
      {/* helper (line-height 1) is single-line chrome ONLY — title and footer
        * can wrap, so they ride the line-height-bearing kol-mono-* scale
        * (the type-conform fault line; user, 2026-08-09). Eyebrow stays
        * helper: a one-line kicker. */}
      {eyebrow && <p className="kol-helper-10 text-meta mb-1">{eyebrow}</p>}
      {title && <p className="kol-mono-16 text-emphasis mb-3">{title}</p>}
      {body && <p className="kol-sans-body-03 text-body mb-4">{body}</p>}
      {footer && <p className="kol-mono-12 text-meta pt-3 border-t border-fg-08">{footer}</p>}
    </div>
  )
}
