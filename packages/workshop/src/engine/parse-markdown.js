/**
 * Handrolled markdown parser for documentation pages.
 * Block-level + inline tokenizer — no remark/markdown-it/marked/MDX.
 * Lifted verbatim from the monorepo, minus the React render layer
 * (`renderInlineTokens` lives with the docs viewer in Phase 2).
 *
 * `parseDocsMarkdown(md)` → { sections, toc, introBlocks, inlineTags }
 */

/** Extract #hashtags from markdown content. */
export const extractHashtags = (content) => {
  // Strip markdown link targets (…) to avoid matching anchor fragments as tags
  const cleaned = content.replace(/\([^)]*\)/g, '')
  const regex = /#([a-z0-9-]+)/gi
  const matches = cleaned.match(regex)
  return matches ? [...new Set(matches.map((t) => t.slice(1).toLowerCase()))] : []
}

/**
 * Process inline markdown within text content.
 * Supports: bold, italic, inline code, links, images, color swatches, hashtags.
 * Returns a token array; the render layer turns tokens into elements.
 */
const processInlineMarkdown = (text) => {
  if (!text) return []

  const tokens = []
  let remaining = text

  while (remaining.length > 0) {
    // Image: ![alt](src)
    const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      tokens.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2] })
      remaining = remaining.slice(imageMatch[0].length)
      continue
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      tokens.push({ type: 'link', text: linkMatch[1], url: linkMatch[2] })
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // Color swatch: {#rrggbb}
    const swatchMatch = remaining.match(/^\{(#[0-9a-fA-F]{6})\}/)
    if (swatchMatch) {
      tokens.push({ type: 'colorswatch', color: swatchMatch[1] })
      remaining = remaining.slice(swatchMatch[0].length)
      continue
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      tokens.push({ type: 'code', content: codeMatch[1] })
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Bold: **text** (must check before italic)
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      tokens.push({ type: 'bold', content: boldMatch[1] })
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Italic: *text* (must not match list markers)
    const italicMatch = remaining.match(/^\*([^*\s][^*]*)\*/)
    if (italicMatch) {
      tokens.push({ type: 'italic', content: italicMatch[1] })
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Text followed by a hashtag (but not inside markdown links)
    const textBeforeHashtag = remaining.match(/^([^#[]+)(#([a-z0-9-]+))/i)
    if (textBeforeHashtag && !remaining.startsWith('[')) {
      if (textBeforeHashtag[1]) {
        tokens.push({ type: 'text', content: textBeforeHashtag[1] })
      }
      tokens.push({ type: 'hashtag', tag: textBeforeHashtag[3].toLowerCase() })
      remaining = remaining.slice(textBeforeHashtag[1].length + textBeforeHashtag[2].length)
      continue
    }

    // Standalone hashtag at start of remaining text
    const hashtagMatch = remaining.match(/^#([a-z0-9-]+)/i)
    if (hashtagMatch) {
      tokens.push({ type: 'hashtag', tag: hashtagMatch[1].toLowerCase() })
      remaining = remaining.slice(hashtagMatch[0].length)
      continue
    }

    // Regular text - take until next special character or end
    const textMatch = remaining.match(/^([^*`[\]!]+)/)
    if (textMatch) {
      tokens.push({ type: 'text', content: textMatch[1] })
      remaining = remaining.slice(textMatch[0].length)
      continue
    }

    // If no match, take one character as text
    tokens.push({ type: 'text', content: remaining[0] })
    remaining = remaining.slice(1)
  }

  return tokens
}

/**
 * Parse markdown text into structured blocks.
 * Returns { sections, toc, introBlocks, inlineTags }.
 */
export const parseDocsMarkdown = (markdown) => {
  if (!markdown) {
    return { sections: [], toc: [], introBlocks: [], inlineTags: [] }
  }

  const lines = markdown.split('\n')
  const sections = []
  const toc = []
  const introBlocks = []

  let current = null
  let inCode = false
  let inFrontmatter = false
  let paragraphBuffer = []

  const getTargetBlocks = () => (current ? current.blocks : introBlocks)

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim()
      if (text) {
        getTargetBlocks().push({
          type: 'paragraph',
          content: text,
          tokens: processInlineMarkdown(text),
        })
      }
      paragraphBuffer = []
    }
  }

  const startNewSection = (level, heading) => {
    flushParagraph()

    // H2 starts new section
    if (level === 2) {
      if (current) {
        sections.push(current)
      }
      const id = heading.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const tocLabel = heading.replace(/^[\d]+[a-z]?[.)]\s*/i, '')
      toc.push({ id, label: tocLabel, level: 2 })
      current = { heading, id, level: 2, blocks: [] }
      return
    }

    // H3/H4 added as blocks within current section (not in TOC)
    if (level === 3 || level === 4) {
      const id = heading.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (current) {
        current.blocks.push({ type: level === 3 ? 'heading3' : 'heading4', id, content: heading })
      } else {
        // H3/H4 before any H2 goes to intro
        introBlocks.push({ type: level === 3 ? 'heading3' : 'heading4', id, content: heading })
      }
    }
  }

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()

    // Code blocks - check first so content inside code blocks is preserved
    if (line.startsWith('```')) {
      if (inCode) {
        inCode = false
      } else {
        flushParagraph()
        const lang = line.replace(/^```/, '').trim()
        getTargetBlocks().push({ type: 'code', lang, lines: [] })
        inCode = true
      }
      return
    }

    // If inside a code block, add line as-is (preserves ---, #, etc.)
    if (inCode) {
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'code') {
        lastBlock.lines.push(line)
      }
      return
    }

    // Handle frontmatter (skip it) - only when not in code block
    if (trimmed === '---') {
      if (lineIndex === 0) {
        inFrontmatter = true
        return
      }
      if (inFrontmatter) {
        inFrontmatter = false
        return
      }
      // Otherwise it's a divider
      flushParagraph()
      getTargetBlocks().push({ type: 'divider' })
      return
    }

    if (inFrontmatter) {
      return
    }

    // H1 - Title (add to intro, not sections)
    if (line.startsWith('# ')) {
      flushParagraph()
      introBlocks.push({ type: 'heading1', content: line.replace(/^#\s+/, '') })
      return
    }

    // H2 - Main sections
    if (line.startsWith('## ')) {
      startNewSection(2, line.replace(/^##\s+/, ''))
      return
    }

    // H3 - Sub-sections
    if (line.startsWith('### ')) {
      startNewSection(3, line.replace(/^###\s+/, ''))
      return
    }

    // H4 - Sub-sub-sections
    if (line.startsWith('#### ')) {
      startNewSection(4, line.replace(/^####\s+/, ''))
      return
    }

    // Empty line
    if (trimmed === '') {
      flushParagraph()
      return
    }

    // Unordered list
    const unorderedMatch = line.match(/^[-*]\s+(.*)/)
    if (unorderedMatch) {
      flushParagraph()
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]
      const itemContent = unorderedMatch[1]
      if (lastBlock && lastBlock.type === 'list' && !lastBlock.ordered) {
        lastBlock.items.push({ content: itemContent, tokens: processInlineMarkdown(itemContent) })
      } else {
        blocks.push({
          type: 'list',
          ordered: false,
          items: [{ content: itemContent, tokens: processInlineMarkdown(itemContent) }],
        })
      }
      return
    }

    // Ordered list
    const orderedMatch = line.match(/^\d+\.\s+(.*)/)
    if (orderedMatch) {
      flushParagraph()
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]
      const itemContent = orderedMatch[1]
      if (lastBlock && lastBlock.type === 'list' && lastBlock.ordered) {
        lastBlock.items.push({ content: itemContent, tokens: processInlineMarkdown(itemContent) })
      } else {
        blocks.push({
          type: 'list',
          ordered: true,
          items: [{ content: itemContent, tokens: processInlineMarkdown(itemContent) }],
        })
      }
      return
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushParagraph()
      const content = line.replace(/^>\s?/, '')
      getTargetBlocks().push({ type: 'blockquote', content, tokens: processInlineMarkdown(content) })
      return
    }

    // Table row (starts with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushParagraph()
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]

      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim())

      // Separator row (|---|---|)
      const isSeparator = cells.every((cell) => /^:?-+:?$/.test(cell))

      if (isSeparator) {
        if (lastBlock && lastBlock.type === 'table') {
          lastBlock.hasSeparator = true
        }
        return
      }

      if (lastBlock && lastBlock.type === 'table') {
        if (!lastBlock.hasSeparator) {
          lastBlock.headers = cells
        } else {
          lastBlock.rows.push(cells.map((cell) => ({ content: cell, tokens: processInlineMarkdown(cell) })))
        }
      } else {
        blocks.push({ type: 'table', headers: cells, rows: [], hasSeparator: false })
      }
      return
    }

    // Regular text line - add to paragraph buffer
    paragraphBuffer.push(line)
  })

  flushParagraph()

  if (current) {
    sections.push(current)
  }

  // Extract hashtags from all content
  const allContent = [
    ...introBlocks.map((b) => b.content || ''),
    ...sections.flatMap((s) => [s.heading, ...s.blocks.map((b) => b.content || '')]),
  ].join(' ')
  const inlineTags = extractHashtags(allContent)

  return { sections, toc, introBlocks, inlineTags }
}

export default parseDocsMarkdown
