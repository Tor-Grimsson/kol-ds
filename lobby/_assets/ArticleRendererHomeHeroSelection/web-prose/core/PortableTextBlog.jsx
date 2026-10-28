import { CodeBlock } from '@kolkrabbi/kol-component'
import ImageBlock from '../blocks/ImageBlock'
import QuoteBlock from '../blocks/QuoteBlock'
import TableBlock from '../blocks/TableBlock'
import VideoBlock from '../blocks/VideoBlock'

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
 * Usage:
 *   import { portableTextBlogComponents } from '@/components/prose/core/PortableTextBlog'
 *   <PortableText value={content} components={portableTextBlogComponents} />
 */
export const portableTextBlogComponents = {
  types: {
    // Code blocks with syntax highlighting (using @sanity/code-input type)
    code: CodeBlock,

    // Images with optional label and caption
    image: ImageBlock,

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
}

export default portableTextBlogComponents
