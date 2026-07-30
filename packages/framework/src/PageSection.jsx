import { Divider } from '@kolkrabbi/kol-component'

export default function PageSection({ id, label, title, body, children, className = '', fullbleed = false, divider = false }) {
  const hasHead = label || title || body
  const cls = [
    'kol-page',
    'kol-page-section',
    fullbleed && 'kol-page--fullbleed',
    className,
  ].filter(Boolean).join(' ')
  return (
    <section id={id} className={cls}>
      {divider && <Divider className="kol-page-section-divider" />}
      {hasHead && (
        /* head widths read the scale instead of transcribing it. `960px` was
         * exactly the panel token; `720px` was an improvised near-miss and
         * becomes the column token — 768px, so section heads widen by 48px. */
        <header className={fullbleed ? 'max-w-[var(--kol-content-panel)]' : 'max-w-[var(--kol-content-column)]'}>
          {label && <p  className="kol-prose-label">{label}</p>}
          {title && <h2 className="kol-prose-title">{title}</h2>}
          {body  && <p  className="kol-prose-lede">{body}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
