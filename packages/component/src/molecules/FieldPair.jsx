import Input from '../atoms/Input.jsx'

/**
 * FieldPair — Two fields on one line. `X 1471 · Y 516` (float-everything W3 row 38, 2026-11-04 — the exploration's
 * two-up position fields). Two `Input`s 8 apart, each led by its letter (`prefix`), sharing one `variant` and `size`;
 * the pair fills its row, each field half. A position, a size, a range — any two values that are read together.
 *
 * @param {Array}  fields   two Input prop sets — `[{ prefix: 'X', value, onChange, ... }, { prefix: 'Y', ... }]`
 * @param {'float'|'filled'|'outline'} [variant]  passed to both
 * @param {'sm'|'md'|'lg'} [size]  passed to both
 * @param {string} [className]
 */
export default function FieldPair({ fields = [], variant, size, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      {fields.slice(0, 2).map((f, i) => (
        <Input key={f.key ?? f.prefix ?? i} variant={variant} size={size} width="100%" className="flex-1 min-w-0" {...f} />
      ))}
    </div>
  )
}
