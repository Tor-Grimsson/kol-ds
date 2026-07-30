const join = (...classes) => classes.filter(Boolean).join(' ')

/* NOT .kol-prose (wave-4 retype, 2026-07-30 — user law: one layout = one style
 * system; prose is the blog/CMS voice, never docs surfaces). Every element the
 * reader renders is typed explicitly through the kol-doc-* roles, mirroring
 * showcase/src/lib/mdx-components.jsx — the SAME dialect MDX pages speak.
 * Vertical rhythm comes from the flex gap (the MdxDoc content idiom), not
 * prose margins. */
const DocsArticle = ({ children, className }) => (
  <article className={join('docs-article flex w-full min-w-0 flex-col gap-6', className)}>{children}</article>
)

export default DocsArticle
