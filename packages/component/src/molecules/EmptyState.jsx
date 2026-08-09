/**
 * EmptyState — a stacked "nothing here yet / nothing selected" text block
 * for inspectors, empty rails and unshipped panels. Ported from the brand
 * editor's inspector Placeholder (renamed: AssetPlaceholder already owns
 * the placeholder name). All lines render as authored — no auto casing
 * (the source's `uppercase` on the eyebrow was dropped per KOL rules).
 *
 * @param {string} eyebrow  kicker line above the title
 * @param {string} title    headline
 * @param {string} body     optional supporting line
 * @param {string} footer   optional note above a top hairline
 */
export default function EmptyState({ eyebrow, title, body, footer }) {
  return (
    <div>
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
