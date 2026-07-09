const join = (...classes) => classes.filter(Boolean).join(' ')

const DocsHeader = ({ title, subtitle, meta = [], className }) => (
  <header className={join('docs-header', className)}>
    {title ? <h1 className="docs-title">{title}</h1> : null}
    {subtitle ? <p className="docs-subtitle">{subtitle}</p> : null}
    {Array.isArray(meta) && meta.length > 0 ? (
      <div className="docs-meta">
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
