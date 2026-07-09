const join = (...classes) => classes.filter(Boolean).join(' ')

const DocsArticle = ({ children, className }) => (
  <article className={join('docs-article kol-prose', className)}>{children}</article>
)

export default DocsArticle
