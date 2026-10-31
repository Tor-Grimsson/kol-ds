/* One specimen: what it is, where it ships, where the same thing is still hand-built.
 * The stage is the surface consumers mount on — kol-monitor's modules sit on bg-surface-secondary
 * (modules/utility/Module.jsx). `--kol-ctl-hw-case` is a fixed #141414 and the labels follow the
 * page theme, so it is not a stage.
 * `handBuilt` is the adoption list (plan §6) — the repos a lobby ticket goes to when this ships. */
export default function Specimen({ title, ships, handBuilt = [], children }) {
  return (
    <section className="flex flex-col gap-3 border-t border-fg-08 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="kol-doc-section-title">{title}</h2>
        {ships && <code className="kol-doc-code-inline">{ships}</code>}
      </div>
      <div
        className="flex flex-wrap items-start gap-4 overflow-x-auto rounded-[var(--kol-radius-sm)] bg-surface-secondary p-4"
      >
        {children}
      </div>
      {handBuilt.length > 0 && (
        <ul className="kol-doc-caption flex flex-col gap-1">
          {handBuilt.map((h) => <li key={h}>Hand-built · {h}</li>)}
        </ul>
      )}
    </section>
  )
}
