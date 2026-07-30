import { Link } from 'react-router-dom'

/**
 * React render layer for inline markdown tokens.
 *
 * The PURE token producer (`processInlineMarkdown` / `parseDocsMarkdown`) lives
 * in `../engine/parse-markdown.js` with zero React/router deps. This module is
 * the render half that was split off from it — it needs react-router `Link`, so
 * it can't live in the engine.
 *
 * @param {Array}    tokens        Inline token array from parseDocsMarkdown.
 * @param {string}   key           Key prefix for the emitted React nodes.
 * @param {Function} resolveDocLink (url) => route|null for `.md` cross-links.
 * @param {Function} tagHref       (tag) => href for `#hashtag` pills. Default
 *                                 keeps hashtags route-agnostic (`/docs?tag=…`);
 *                                 the reader passes a configured href in.
 * @param {Function} onTagClick    (tag) => void — when provided, hashtag pills
 *                                 render as buttons (tag mode) instead of Links;
 *                                 a consumer without a tag route stops shipping
 *                                 dead `/docs?tag=…` links (wave-4 parity).
 */
export const renderInlineTokens = (
  tokens,
  key = '',
  resolveDocLink = null,
  tagHref = (tag) => `/docs?tag=${encodeURIComponent(tag)}`,
  onTagClick = null
) => {
  if (!Array.isArray(tokens)) return null

  return tokens.map((token, index) => {
    const tokenKey = `${key}-${index}`

    switch (token.type) {
      case 'text':
        return token.content

      case 'bold':
        return <strong key={tokenKey}>{token.content}</strong>

      case 'italic':
        return <em key={tokenKey}>{token.content}</em>

      case 'code':
        return <code key={tokenKey} className="kol-doc-code-inline">{token.content}</code>

      case 'link': {
        /* One link idiom across doc surfaces (wave-4 retype): the anchor
         * treatment from showcase mdx-components.jsx — colorless per the
         * link law, emphasis + quiet underline. */
        const linkCls = 'text-emphasis underline decoration-fg-16 underline-offset-2 hover:decoration-current'
        // For .md links, try to resolve to an app route
        if (resolveDocLink && token.url.includes('.md')) {
          const route = resolveDocLink(token.url)
          if (route) {
            return (
              <Link key={tokenKey} to={route} className={linkCls}>
                {token.text}
              </Link>
            )
          }
          // Dead .md link — render as plain text
          return token.text
        }
        return (
          <a key={tokenKey} href={token.url} className={linkCls}>
            {token.text}
          </a>
        )
      }

      case 'image':
        return (
          <img
            key={tokenKey}
            src={token.src}
            alt={token.alt}
            className="docs-image"
          />
        )

      case 'colorswatch':
        return (
          <code key={tokenKey} className="docs-color-swatch">
            <span className="docs-color-swatch-dot" style={{ background: token.color }} />
            {token.color}
          </code>
        )

      case 'hashtag': {
        const pillCls = 'inline-tag-pill kol-helper-12 bg-fg-08 text-strong'
        if (onTagClick) {
          return (
            <button
              key={tokenKey}
              type="button"
              className={pillCls}
              onClick={() => onTagClick(token.tag)}
            >
              #{token.tag}
            </button>
          )
        }
        return (
          <Link key={tokenKey} to={tagHref(token.tag)} className={pillCls}>
            #{token.tag}
          </Link>
        )
      }

      default:
        return null
    }
  })
}

export default renderInlineTokens
