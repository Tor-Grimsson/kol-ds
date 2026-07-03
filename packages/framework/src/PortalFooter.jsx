/**
 * PortalFooter — site footer chrome.
 *
 * Zero-prop: the Kolkrabbi favicon mark + credit line (portal default,
 * unchanged). Opt-in slots turn it into a full site footer:
 *   brand    node — brand block (wordmark/logo), top-left.
 *   columns  [{ title, links: [{ label, href }] }] — link columns, top-right.
 *   socials  [{ label, href, icon? }] — bottom-bar strip; icon node optional,
 *            label renders as text when no icon (and feeds aria-label).
 *   note     node — bottom-bar legal/credit line.
 *   children node — escape hatch, rendered between columns and the bottom bar.
 * Links are plain <a href> — router-agnostic. Strings render as authored.
 */
export default function PortalFooter({ brand, columns, socials, note, children }) {
  const year = new Date().getFullYear()
  const hasColumns = columns?.length > 0
  const hasSocials = socials?.length > 0

  if (!brand && !hasColumns && !hasSocials && !note && !children) {
    return (
      <footer className="kol-portal-footer">
        <a
          href="https://kolkrabbi.io"
          target="_blank"
          rel="noopener"
          aria-label="Kolkrabbi Vinnustofa"
        >
          <img src="/favicon/favicon.svg" alt="" width="32" height="32" />
        </a>
        <p className="kol-helper-12 text-meta">
          <a href="https://kolkrabbi.io" target="_blank" rel="noopener" className="hover:text-strong">
            Kolkrabbi Vinnustofa
          </a>
          {' · '}
          {year}
        </p>
      </footer>
    )
  }

  const hasTop = Boolean(brand || hasColumns)

  return (
    <footer className="kol-portal-footer">
      <div className="w-full flex flex-col gap-12">
        {hasTop && (
          <div className="flex flex-col md:flex-row md:justify-between items-start gap-10 md:gap-12">
            {brand}
            {hasColumns && (
              <nav className="flex flex-wrap items-start gap-12 md:gap-16 lg:gap-20">
                {columns.map((column) => (
                  <div key={column.title} className="flex flex-col gap-4">
                    <p className="kol-helper-12 tracking-widest text-meta">{column.title}</p>
                    <ul className="m-0 p-0 list-none flex flex-col gap-1 lg:gap-2">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href} className="kol-sans-heading-03 text-auto">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
          </div>
        )}

        {children}

        {(note || hasSocials) && (
          <div className="flex flex-col gap-3">
            {(hasTop || children) && <div className="border-t border-[var(--kol-fg-08)]" />}
            <div className="flex flex-wrap justify-between items-center gap-4">
              {note && <p className="kol-helper-12 text-meta">{note}</p>}
              {hasSocials && (
                <div className="flex items-center gap-4">
                  {socials.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener"
                      aria-label={label}
                      className="kol-helper-12 text-meta hover:text-strong inline-flex items-center gap-2"
                    >
                      {icon ?? label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
