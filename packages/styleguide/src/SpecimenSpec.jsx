/**
 * SpecimenSpec — Font metrics beside a live sample. The library master `SpecimenSpec` (Styleguide page, Samples
 * section; type-ramp plan 6.7): a two-column type-spec row, a left meta panel of key/value pairs (font metrics) beside
 * the `sample` slot on the right (a `SpecimenSample`), with an optional corner label. The "data-sheet" member of the
 * Specimen kit. Moved from kol-foundry's `TypeSpecCard` (2026-11-14, plan 7.5); `TypeSpecCard` is the alias on the
 * retirement ledger.
 *
 * Single column on mobile; `240px + fluid` two-column at lg. `meta` is
 * arbitrary tuples — no fixed metric schema. Sample paragraphs get 16px
 * rhythm via `.kol-type-spec-sample p` (Preflight zeroes <p> margins).
 *
 * @param {string}                label    corner caption, absolute top-left (omit to hide)
 * @param {Array<[string, ReactNode]>} meta key/value rows in the left panel
 * @param {ReactNode}             children the live type sample on the right (Figma slot `sample`: a SpecimenSample)
 */
export default function SpecimenSpec({ label, meta = [], children }) {
  return (
    <div className="kol-type-spec relative py-12 border-t border-fg-08">
      {label && (
        <span className="kol-type-spec-label kol-helper-12 tracking-widest text-meta absolute top-4 left-0">
          {label}
        </span>
      )}
      <div className="kol-type-spec-row grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 items-start pt-6">
        <div className="kol-type-spec-meta flex flex-col">
          {meta.map(([key, value]) => (
            <div
              key={key}
              className="kol-type-spec-meta-row grid grid-cols-[auto_minmax(0,1fr)] gap-4 items-baseline py-2 border-b border-[var(--kol-fg-04)] last:border-b-0"
            >
              <span className="kol-helper-10 text-meta">{key}</span>
              <span className="kol-helper-10 text-strong text-right [overflow-wrap:anywhere]">{value}</span>
            </div>
          ))}
        </div>
        <div className="kol-type-spec-sample min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
