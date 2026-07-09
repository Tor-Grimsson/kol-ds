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
 */
export const renderInlineTokens = (
  tokens,
  key = '',
  resolveDocLink = null,
  tagHref = (tag) => `/docs?tag=${encodeURIComponent(tag)}`
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
        return <code key={tokenKey}>{token.content}</code>

      case 'link': {
        // For .md links, try to resolve to an app route
        if (resolveDocLink && token.url.includes('.md')) {
          const route = resolveDocLink(token.url)
          if (route) {
            return (
              <Link key={tokenKey} to={route} className="docs-link">
                {token.text}
              </Link>
            )
          }
          // Dead .md link — render as plain text
          return token.text
        }
        return (
          <a key={tokenKey} href={token.url} className="docs-link">
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

      case 'hashtag':
        return (
          <Link
            key={tokenKey}
            to={tagHref(token.tag)}
            className="inline-tag-pill kol-helper-12 bg-fg-08 text-strong"
          >
            #{token.tag}
          </Link>
        )

      default:
        return null
    }
  })
}

export default renderInlineTokens
