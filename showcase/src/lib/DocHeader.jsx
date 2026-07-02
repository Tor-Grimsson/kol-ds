/**
 * DocHeader — the ONE page-header contract for every docs page.
 * eyebrow (mono, uppercase) → h1 (heading-03) → lede (body-01), fixed
 * spacing. No page rolls its own header; alignment comes from here.
 */
export default function DocHeader({ eyebrow, title, lede, children }) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <p className="kol-helper-10 uppercase tracking-widest text-meta">{eyebrow}</p>}
      <h1 className="kol-sans-heading-03 text-emphasis">{title}</h1>
      {lede && <p className="kol-sans-body-01 text-body max-w-[65ch]">{lede}</p>}
      {children}
    </header>
  )
}

/**
 * DocSection — the ONE section contract: anchored h2 (heading-04) + optional
 * lede + content, standard top rule + spacing. Replaces PageSection inside
 * the docs shell (PageSection is the brand-app chapter chrome — its own
 * width/padding world caused the cross-page misalignment).
 */
export function DocSection({ id, title, lede, children }) {
  return (
    <section id={id} className="flex flex-col gap-4 border-t border-fg-08 pt-8 scroll-mt-20">
      {title && <h2 className="kol-sans-heading-04 text-emphasis">{title}</h2>}
      {lede && <p className="kol-sans-body-02 text-body max-w-[65ch]">{lede}</p>}
      {children}
    </section>
  )
}
