import { Divider, SectionText } from '@kolkrabbi/kol-component'

/* The chapter section of the brand-book page kit — `PageHero` · `PageSection`
 * · `PageLayout`. Its head COMPOSES `SectionText` (page-family-is-not-a-set,
 * 2026-09-03) instead of hand-stacking label / title / lede: the voices are the
 * same `.kol-prose-*` trio as before, passed as the base's seams, and each class
 * carries its own bottom margin, so the block's gap is 0 and nothing moved. */
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
          <SectionText
            eyebrow={label}
            eyebrowClass="kol-prose-label"
            headline={title}
            headlineAs="h2"
            headlineClass="kol-prose-title"
            body={body}
            bodyClass="kol-prose-lede"
            gap="gap-0"
          />
        </header>
      )}
      {children}
    </section>
  )
}
