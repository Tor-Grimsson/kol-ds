import { Fragment } from 'react'
import { CodeBlock } from '@kolkrabbi/kol-component'
import { ImageBlock } from '@kolkrabbi/kol-component'
import { VideoBlock } from '@kolkrabbi/kol-component'
import { Table } from '@kolkrabbi/kol-component'
import { Divider } from '@kolkrabbi/kol-component'

/**
 * slugify — heading text → anchor id (lowercase, non-word stripped, spaces to
 * dashes, repeats collapsed). Feeds the h2/h3 `id`s that power in-page anchors
 * / a table of contents. Kept from the source; it is the one bit of real logic.
 */
export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/* ── Inline marks ──────────────────────────────────────────────────────────
 * A block's `text` is either a plain string or an array of inline nodes:
 *   'plain text'
 *   { mark: 'link', href, text }         → <a> (http* → new tab + noopener)
 *   { mark: 'segmentTitle', text }       → <span class="kol-segment-title">
 */
function renderInline(text) {
  if (text == null) return null
  const nodes = Array.isArray(text) ? text : [text]
  return nodes.map((node, i) => {
    if (typeof node === 'string') return <Fragment key={i}>{node}</Fragment>
    if (node.mark === 'link') {
      const external = (node.href || '').startsWith('http')
      return (
        <a
          key={i}
          href={node.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {node.text}
        </a>
      )
    }
    if (node.mark === 'segmentTitle') {
      return <span key={i} className="kol-segment-title">{node.text}</span>
    }
    return <Fragment key={i}>{node.text}</Fragment>
  })
}

const plainText = (text) =>
  Array.isArray(text) ? text.map((n) => (typeof n === 'string' ? n : n.text)).join('') : String(text ?? '')

/* ── Block registry ────────────────────────────────────────────────────────
 * Maps a plain { type, ... } block to a DS component / prose tag. This is the
 * de-Sanitized counterpart to the app's Portable-Text components map: generic
 * block-type names (`heading`/`quote`/`divider`/`table`/`video`), no CMS
 * schema keys, no @portabletext/react host.
 */
const BLOCKS = {
  heading: ({ level = 2, text, id }) => {
    const Tag = `h${level}`
    const anchorId = id ?? (level === 2 || level === 3 ? slugify(plainText(text)) : undefined)
    return <Tag id={anchorId}>{renderInline(text)}</Tag>
  },
  paragraph: ({ text }) => <p>{renderInline(text)}</p>,
  caption: ({ text }) => <p className="caption">{renderInline(text)}</p>,
  quote: ({ text, cite }) => (
    <blockquote>
      <p>{renderInline(text)}</p>
      {cite && <cite>{cite}</cite>}
    </blockquote>
  ),
  code: ({ language, code }) => <CodeBlock language={language}>{code}</CodeBlock>,
  divider: () => <Divider className="my-10" />,
  image: (block) => <ImageBlock {...block} />,
  video: (block) => <VideoBlock {...block} />,
  table: ({ columns, rows, caption }) => <Table columns={columns} rows={rows} caption={caption} variant="simple" />,
  list: ({ style = 'bullet', items = [] }) => {
    const Tag = style === 'number' ? 'ol' : 'ul'
    return <Tag>{items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</Tag>
  },
}

/**
 * PortableTextRenderer — turns a plain block array into `.kol-prose`-styled
 * long-form markup via one block-type registry. The design system's CMS
 * renderer (the counterpart to ProseStylesViewer, which only *showcases* the
 * prose styles) — both plug into the same `.kol-prose` stylesheet.
 *
 * The block shape is a simple `{ type, ... }` — NOT Sanity Portable Text and
 * with no `@portabletext/react` host. Custom blocks (`image`/`video`/`table`/
 * `code`/`divider`) resolve to DS components; text blocks render bare tags the
 * `.kol-prose` sheet styles. Inline `link`/`segmentTitle` marks are supported
 * via the array `text` form (see `renderInline`). Unknown types are skipped.
 *
 * All content — headings, paragraphs, captions — is authored as-is; the map
 * applies no `text-transform`.
 *
 * @param {Array<{type:string}>} blocks  the document, in order
 * @param {boolean} prose      wrap output in a `.kol-prose` container (default true)
 * @param {string}  className  extra classes on the wrapper
 */
export default function PortableTextRenderer({ blocks = [], prose = true, className = '' }) {
  const rendered = blocks.map((block, i) => {
    const render = BLOCKS[block?.type]
    if (!render) return null
    return <Fragment key={block.key ?? i}>{render(block)}</Fragment>
  })

  if (!prose) return <>{rendered}</>
  return <div className={`kol-prose ${className}`.trim()}>{rendered}</div>
}
