/* taxonomy-ok: molecule — a listbox of swatches, the current one ringed */

/**
 * SwatchGrid — Pick one color from a grid of swatches (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18;
 * kolbox's, the swatches under "On this page" in its color popover). Squares at radius 2, 8 across, 8 apart; each ringed
 * by a 1px oq-24 line inside it, the current one by a 2px accent ring 1 off the secondary surface. A listbox of options,
 * each named by its color. Its one look. Input.
 *
 * @param {string[]} colors     any CSS colors
 * @param {string}   [value]    the current one
 * @param {Function} [onChange] `(color)`
 * @param {string}   [className]
 * @param {'folio'|'kolbox'}  [variant]  `folio` (Folio's Swatches, Folio batch C, 2026-11-22, carried class for class): a row of
 *   the caller's swatches (`children`, each a `ColorSwatch variant="folio"`), 8 apart, a group named by `aria-label`;
 *   `colors`, `value` and `onChange` are not read. `kolbox` with `children` (Folio on kolbox, 2026-11-22): the same row of
 *   the caller's swatches (`ColorSwatch variant="kolbox"`), 8 apart; without children, kolbox's grid as above.
 */
export default function SwatchGrid({ colors = [], value, onChange, className = '', variant, children, ...rest }) {
  /* kolbox (Folio on kolbox, 2026-11-22) with `children`: a row of the caller's swatches (`ColorSwatch variant="kolbox"`),
     8 apart as the grid's, wrapping; a group named by `aria-label` */
  if (variant === 'kolbox' && children) return <div role="group" aria-label={rest['aria-label']} className={`flex flex-wrap gap-2 ${className}`.trim()}>{children}</div>
  if (variant === 'folio') return <div role="group" aria-label={rest['aria-label']} className={`flex gap-[8px] ${className}`.trim()}>{children}</div>
  return (
    <div role="listbox" aria-label="Swatches" className={`grid grid-cols-8 gap-2 ${className}`}>
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          role="option"
          aria-label={c}
          aria-selected={c === value}
          onClick={() => onChange?.(c)}
          className={`kol-swatch-grid-cell${c === value ? ' is-current ring-2 ring-offset-1' : ' ring-1 ring-inset'} aspect-square outline-none`}
          style={{ background: c }}
        />
      ))}
    </div>
  )
}
