import { CodeBlock } from '@kolkrabbi/kol-component'
import ImageBlock from './ImageBlock.jsx'
import QuoteBlock from './QuoteBlock.jsx'
import TableBlock from './TableBlock.jsx'
import VideoBlock from './VideoBlock.jsx'

// Helper to generate ID from heading text
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim();
};

/**
 * PortableText component mapping for blog/Stack content
 *
 * Maps Sanity Portable Text block types to React components with proper styling.
 * All components automatically inherit prose.css styling when wrapped in .kol-prose
 *
 * CARRIED FROM kol-website (ArticleRendererHomeHeroSelection, 2026-10-28 — *"copy web's, don't redesign"*):
 * `components/prose/core/PortableTextBlog.jsx`, the map that renders kolkrabbi.io's /stack/:slug over Sanity's real Portable
 * Text, verbatim. The one seam is the image source: `createPortableTextComponents({ imageUrl })` binds the consumer's
 * `(image, { width, height }) => src` (its own Sanity builder); `portableTextComponents` uses the asset's `url`.
 * The map is plain components — render it with `@portabletext/react`'s `<PortableText>` in your app.
 *
 * Usage:
 *   import { PortableText } from '@portabletext/react'
 *   import { createPortableTextComponents } from '@kolkrabbi/kol-content'
 *   const components = createPortableTextComponents({ imageUrl: (img, o) => urlFor(img).width(o.width).auto('format').url() })
 *   <div className="kol-prose"><PortableText value={content} components={components} /></div>
 */
export const createPortableTextComponents = ({ imageUrl } = {}) => ({
  types: {
    // Code blocks with syntax highlighting (using @sanity/code-input type)
    code: CodeBlock,

    // Images with optional label and caption
    image: imageUrl ? (props) => <ImageBlock {...props} imageUrl={imageUrl} /> : ImageBlock,

    // Divider
    dividerBlock: () => <hr />,

    // Structured tables managed via Sanity block
    tableBlock: TableBlock,

    // Uploaded videos
    videoBlock: VideoBlock
  },

  marks: {
    // Links with proper external link handling
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    segmentTitle: ({ children }) => (
      <span className="kol-segment-title">{children}</span>
    )
  },

  block: {
    // Normal paragraphs - handled by .kol-prose p
    normal: ({ children }) => <p>{children}</p>,

    // Headings - handled by .kol-prose h2, h3, h4
    h2: ({ children, value }) => {
      const text = value?.children?.map(child => child.text).join(' ') || '';
      const id = slugify(text);
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const text = value?.children?.map(child => child.text).join(' ') || '';
      const id = slugify(text);
      return <h3 id={id}>{children}</h3>;
    },
    h4: ({ children }) => <h4>{children}</h4>,

    // Blockquotes - handled by .kol-prose blockquote
    blockquote: QuoteBlock,

    // Caption style - handled by .kol-prose .caption
    caption: ({ children }) => <p className="caption">{children}</p>,
  },

  list: {
    // Lists - handled by .kol-prose ul, ol
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },

  listItem: {
    // List items - wrapped in span to work with flex layout in prose.css
    bullet: ({ children }) => <li><span>{children}</span></li>,
    number: ({ children }) => <li><span>{children}</span></li>,
  },
})

export const portableTextComponents = createPortableTextComponents()
export { slugify as slugifyHeading }

export default portableTextComponents
