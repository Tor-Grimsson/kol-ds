const join = (...classes) => classes.filter(Boolean).join(' ')

/* Doc voice (wave-4 retype, 2026-07-30): title/subtitle ride the DocHeader
 * contract roles (kol-doc-heading / kol-doc-lede) instead of the old
 * kol-sans-heading-02 + kol-mono-14 pair — one header voice across the
 * reader, MDX pages and the Doc* kit. */
const DocsHeader = ({ title, subtitle, meta = [], className }) => (
  <header className={join('docs-header flex flex-col gap-3', className)}>
    {title ? <h1 className="kol-doc-heading">{title}</h1> : null}
    {subtitle ? <p className="kol-doc-lede">{subtitle}</p> : null}
    {Array.isArray(meta) && meta.length > 0 ? (
      <div className="docs-meta kol-helper-10 text-body">
        {meta.map(({ label, value }) => (
          <span key={label}>
            <strong>{label}</strong> {value}
          </span>
        ))}
      </div>
    ) : null}
  </header>
)

export default DocsHeader
