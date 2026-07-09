/**
 * SourcesReferences — an end-of-article sources / references block. Each source
 * is a numbered box: a two-digit index, the source title (a link when `href` is
 * set — external opens in a new tab), and an optional note. KOL-native type +
 * fg-opacity tokens; authored-case strings, no text-transform. Renders nothing
 * when `sources` is empty.
 *
 * @param {{title:string, href?:string, note?:string, index?:number}[]} sources
 * @param {string} title      heading (default 'Sources & references'; '' hides it)
 * @param {string} className  extra classes on the root
 */
export default function SourcesReferences({ sources = [], title = 'Sources & references', className = '' }) {
  if (!sources.length) return null
  return (
    <section className={`flex flex-col gap-4 ${className}`.trim()}>
      {title && <h3 className="kol-sans-heading-05 text-fg-88">{title}</h3>}
      <ol className="flex flex-col gap-3">
        {sources.map((s, i) => {
          const external = (s.href || '').startsWith('http')
          const num = String(s.index ?? i + 1).padStart(2, '0')
          const box = (
            <div className="flex items-start gap-4 p-4 rounded border border-fg-08 hover:border-fg-16 transition-colors">
              <span className="kol-helper-12 text-fg-48 shrink-0">{num}</span>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="kol-mono-14 text-fg-88">{s.title}</span>
                {s.note && <span className="kol-mono-12 text-fg-48">{s.note}</span>}
              </div>
              {s.href && <span className="kol-helper-12 text-fg-32 shrink-0">↗</span>}
            </div>
          )
          return (
            <li key={i}>
              {s.href ? (
                <a
                  href={s.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer noopener' : undefined}
                  className="block"
                >
                  {box}
                </a>
              ) : box}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
