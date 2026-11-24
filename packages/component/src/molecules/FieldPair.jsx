import Input from '../atoms/Input.jsx'

/**
 * FieldPair — Two fields on one line. `X 1471 · Y 516` (float-everything W3 row 38, 2026-11-04 — the exploration's
 * two-up position fields). Two `Input`s 8 apart, each led by its letter (`prefix`), sharing one `variant` and `size`;
 * the pair fills its row, each field half. A position, a size, a range — any two values that are read together.
 *
 * `variant="kolbox"` (kolbox's PropertyRow, Figma 70:12121, plan-2026-11-18-kolbox-system W31.2, 2026-11-18, carried
 * class for class): two slots instead of two Inputs' props, `first` and `second`, then `trailing` (icons or a tag). THE
 * RAIL'S ONE GRID (plan-2026-11-19-kolbox-whats-left R3.1): the row is a grid on `--kol-kolbox-row-cols`, the tracks
 * LabeledControlSection kolbox sets for every row it holds: two field columns and two 16 icon columns, 8 apart (in the
 * 240 rail: 76, 76, 16, 16, his design's Stroke row, 149:26890). `first` takes column 1 (`span`: columns 1 and 2, a
 * row of one field), `second` column 2, `trailing` the icon columns from the right, so a lone icon sits on the last and
 * a pair on both. Outside a section the tracks are two equal columns and the trailing's own width. Each control fills
 * its cell. It draws nothing of its own; the wrapper carries `data-property-row`.
 *
 * `variant="folio"` (Folio's SettingPair, Folio batch C, 2026-11-22, carried class for class): two 32 fields 8 apart at
 * radius 4, padded 16, Folio's hairline round each (green while it has focus), each led by its `prefix` in the muted
 * ink; the value in mono 12 / 16. `fields` as the default's, each a plain input's props. Chrome in kol-theme
 * `.kol-field-pair--folio`.
 *
 * @param {Array}  fields   two Input prop sets — `[{ prefix: 'X', value, onChange, ... }, { prefix: 'Y', ... }]`
 * @param {'float'|'filled'|'outline'|'kolbox'|'folio'} [variant]  passed to both Inputs; `kolbox` takes the slots below
 * @param {'sm'|'md'|'lg'} [size]  passed to both
 * @param {ReactNode} [first]  kolbox: the left cell
 * @param {ReactNode} [second]  kolbox: the right cell
 * @param {ReactNode} [trailing]  kolbox: the icon columns
 * @param {boolean} [span]  kolbox: `first` spans both field columns
 * @param {string} [className]
 */
export default function FieldPair({ fields = [], variant, size, first, second, trailing, span = false, className = '', ...rest }) {
  if (variant === 'kolbox') {
    return (
      <div {...rest} className={`grid min-w-0 grid-cols-[var(--kol-kolbox-row-cols,minmax(0,1fr)_minmax(0,1fr)_auto)] items-center gap-2 ${className}`.trim()} data-property-row>
        <div className={`flex min-w-0 ${span ? 'col-span-2' : ''}`}>{first}</div>
        {!span && <div className="flex min-w-0">{second}</div>}
        {trailing && <div className="col-start-3 -col-end-1 flex items-center justify-end gap-2">{trailing}</div>}
      </div>
    )
  }
  if (variant === 'folio') {
    return (
      <div {...rest} className={`kol-field-pair--folio flex items-center gap-[8px] ${className}`.trim()}>
        {fields.map(({ prefix, ...f }) => (
          <label key={prefix} className="kol-field-pair-field flex h-[32px] min-w-0 flex-1 items-center rounded-[4px] border px-[16px]">
            <span className="kol-field-pair-prefix shrink-0 pr-[4px]">{prefix}</span>
            <input {...f} className="min-w-0 flex-1 bg-transparent outline-none" />
          </label>
        ))}
      </div>
    )
  }
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {fields.slice(0, 2).map((f, i) => (
        <Input key={f.key ?? f.prefix ?? i} variant={variant} size={size} width="100%" className="flex-1 min-w-0" {...f} />
      ))}
    </div>
  )
}
