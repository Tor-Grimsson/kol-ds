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
      {eyebrow && <p className="kol-helper-10 text-meta mb-1">{eyebrow}</p>}
      {title && <p className="kol-helper-16 text-emphasis mb-3">{title}</p>}
      {body && <p className="kol-sans-body-03 text-body mb-4">{body}</p>}
      {footer && <p className="kol-helper-12 text-meta pt-3 border-t border-fg-08">{footer}</p>}
    </div>
  )
}
