/**
 * @kolkrabbi/kol-workshop — docs viewer (render layer).
 *
 * Lifted from the monorepo's `apps/web` docs surface and decoupled from Vite:
 * the reader takes its markdown `modules` + `inventory` as props and derives all
 * routes from `docHref` / `routes` (no `import.meta.glob`, no hardcoded
 * `/workshop/*` paths). The pure parser lives in `../engine`; tag mode in
 * `../tags`; the shell TOC injection context in `../shell`.
 */
export { default as DocumentationReader } from './DocumentationReader.jsx'
export { default as DocsArticle } from './DocsArticle.jsx'
export { default as DocsHeader } from './DocsHeader.jsx'
export { default as DocsFrontmatter } from './DocsFrontmatter.jsx'
export { renderInlineTokens } from './render-tokens.jsx'
