const join = (...classes) => classes.filter(Boolean).join(' ')

const DocsHeader = ({ title, subtitle, meta = [], className }) => (
  <header className={join('docs-header', className)}>
    {title ? <h1 className="kol-sans-heading-02 text-strong">{title}</h1> : null}
    {subtitle ? <p className="kol-mono-14 text-meta">{subtitle}</p> : null}
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
