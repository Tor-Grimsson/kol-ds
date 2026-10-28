/**
 * Handrolled markdown parser for documentation pages.
 * Block-level + inline tokenizer — no remark/markdown-it/marked/MDX.
 * Lifted verbatim from the monorepo, minus the React render layer
 * (`renderInlineTokens` lives with the docs viewer in Phase 2).
 *
 * `parseDocsMarkdown(md)` → { sections, toc, introBlocks, inlineTags }
 *
 * THE DOCUMENT ADDITIONS (plan-2026-10-28-document W2, for kol-website's brand pages; the examples are
 * kol-atlas's documents, apps/document-fixture): heading anchors `{#id}`; numbered headings (`## M1 Title`,
 * `### 1.1 Title`, `####` items numbered `1.1.n`) → `num`; status marks ✋ 🅿️ (with their reason) 📍 ✓ →
 * `marks`; `Key: value` lines at the top of a section → one `meta` block; footnotes (`[^key]` inline,
 * `[^key]: text` → `footnote-def`); a `## Sources` / `## Heimildir` section → `sources: true`;
 * `> quote — who` → blockquote `cite`; `![[file|caption]]` → `media`; `\.` escapes; `%%` comment lines,
 * a `:::tabs` filmstrip is a `media` block too, its `::tab` labels the captions; generated lines (`@name`, `::name`,
 * `{{name}}`) dropped, `%% thumb:` kept as `thumb`; `{ numbered }` lets a `###` carry a bare integer; a line that is only `![caption](src)` is `media` too (a web link card when
 * `src` is a URL); headings carry `tokens` too; table `align` and `kv`.
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
/* EXPORTED 2026-08-01. The props table needs the token producer so its cells
 * can render `backticked` code as a chip instead of printing the backticks.
 * It was module-private, which is why the table had no way to do it and the
 * gap read as "the table is bad" rather than "the parser was unreachable". */
export const processInlineMarkdown = (text) => {
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

    // Wikilink: [[target]] / [[target|display]] / [[target#anchor|display]] (Obsidian).
    // Emitted as a .md link so it routes through the same resolveDocLink cross-link path.
    const wikiMatch = remaining.match(/^\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/)
    if (wikiMatch) {
      const target = wikiMatch[1].trim().replace(/\.md$/, '')
      const anchor = wikiMatch[2]
        ? wikiMatch[2].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        : ''
      const display = wikiMatch[3] ? wikiMatch[3].trim() : (wikiMatch[1].trim().split('/').pop())
      tokens.push({ type: 'link', text: display, url: `${target}.md${anchor ? `#${anchor}` : ''}` })
      remaining = remaining.slice(wikiMatch[0].length)
      continue
    }

    // Footnote reference: [^key]
    const fnMatch = remaining.match(/^\[\^([a-z0-9-]+)\]/i)
    if (fnMatch) {
      tokens.push({ type: 'footnote', key: fnMatch[1] })
      remaining = remaining.slice(fnMatch[0].length)
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
    // a link or code inside bold or italic (`*see [Implementation](#x) below*`) rides along as nested `tokens`
    const nested = (content) => (/[[`]/.test(content) ? { tokens: processInlineMarkdown(content) } : {})
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      tokens.push({ type: 'bold', content: boldMatch[1], ...nested(boldMatch[1]) })
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Italic: *text* (must not match list markers)
    const italicMatch = remaining.match(/^\*([^*\s][^*]*)\*/)
    if (italicMatch) {
      tokens.push({ type: 'italic', content: italicMatch[1], ...nested(italicMatch[1]) })
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

  /* backslash escapes read as the plain character (`18\. nóv` is a date, not a list) — in text only, never in code */
  return tokens.map((t) => (t.type === 'text' ? { ...t, content: t.content.replace(/\\([\\`*_{}[\]()#+\-.!|])/g, '$1') } : t))
}

/**
 * Parse markdown text into structured blocks.
 * Returns { sections, toc, introBlocks, inlineTags }.
 */
/* options — numbered: a numbered document (kol-atlas's Project and SEO + GEO, the engine's `proj` tabs): a `###` may be
 * numbered with a bare integer (`### 1 Search basics`) and its `####` items count `1.1`, `1.2`… */
export const parseDocsMarkdown = (markdown, { numbered = false } = {}) => {
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

  /* a heading's parts: `{#id}` anchor, leading number (M1 · 1.1 · 1.), status marks and their reasons, the title */
  const MARKS = { '✋': 'hand', '🅿️': 'park', '📍': 'pin', '✓': 'done', '✅': 'done' }
  const parseHeading = (raw, level) => {
    let text = raw.trim()
    const anchor = /\s*\{#([a-z0-9-]+)\}\s*$/i.exec(text)
    if (anchor) text = text.slice(0, anchor.index).trim()
    const marks = []
    /* a mark at the start names the item (📍 Sync); a mark after the title carries its reason (✋ to confirm) */
    const lead = /^(✋|🅿️|📍|✓|✅)\s*/.exec(text)
    if (lead) { marks.push({ kind: MARKS[lead[1]], reason: '' }); text = text.slice(lead[0].length) }
    const tail = /\s+(✋|🅿️|📍|✓|✅)\s*(.*)$/.exec(text)
    if (tail) { marks.push({ kind: MARKS[tail[1]], reason: tail[2].trim() }); text = text.slice(0, tail.index).trim() }
    const numRe = numbered && level === 3 ? /^(M\d+|\d+(?:\.\d+)*|\d+[a-z]?[.)])\s+(.*)$/ : /^(M\d+|\d+(?:\.\d+)+|\d+[a-z]?[.)])\s+(.*)$/
    const n = numRe.exec(text)
    const num = n ? n[1].replace(/[.)]$/, '') : null
    const title = n ? n[2].trim() : text
    return { id: anchor?.[1] ?? null, num, marks, title }
  }
  let phaseNum = null   // the last numbered ### — #### items count under it
  let itemCount = 0
  let inTabs = false
  let tabLabel = ''
  let thumb = null   // the page's `%% thumb:`

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

  const startNewSection = (level, raw) => {
    flushParagraph()
    const h = parseHeading(raw, level)
    const slug = (t) => t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // H2 starts new section
    if (level === 2) {
      if (current) {
        sections.push(current)
      }
      const id = h.id ?? slug(h.title)
      toc.push({ id, label: h.title, level: 2, ...(h.num ? { num: h.num } : {}) })
      current = { heading: h.title, id, level: 2, blocks: [], num: h.num, marks: h.marks, tokens: processInlineMarkdown(h.title), sources: /^(sources|heimildir)$/i.test(h.title) }
      phaseNum = null; itemCount = 0
      return
    }

    // H3/H4 added as blocks within current section (not in TOC)
    if (level === 3 || level === 4) {
      let num = h.num
      if (level === 3) { phaseNum = num; itemCount = 0 }
      else if (phaseNum) { itemCount += 1; num = num ?? `${phaseNum}.${itemCount}` }
      const id = h.id ?? slug(h.title)
      const block = { type: level === 3 ? 'heading3' : 'heading4', id, content: h.title, num, marks: h.marks, tokens: processInlineMarkdown(h.title) }
      if (current) {
        current.blocks.push(block)
      } else {
        // H3/H4 before any H2 goes to intro
        introBlocks.push(block)
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

    // Comments, the image-tab fences and generated lines are not content: `%% …`, `:::tabs … :::`, `@name`, `::name`, `{{name}}`
    // — except `%% thumb: file`, the page's (or the current section's) thumbnail for hover previews
    if (trimmed.startsWith('%%')) {
      const th = /^%%\s*thumb:\s*(\S+)/.exec(trimmed)
      if (th) { if (current) current.thumb = th[1]; else thumb = th[1] }
      return
    }
    if (trimmed.startsWith(':::')) { flushParagraph(); inTabs = trimmed !== ':::'; tabLabel = ''; return }
    /* inside `:::tabs`: `::tab Label` names the next images, every `![[file]]` is one; the fences and anything else are dropped */
    if (inTabs) {
      const tab = /^::tab\s+(.*)$/.exec(trimmed)
      if (tab) { tabLabel = tab[1].trim(); return }
      const items = [...trimmed.matchAll(/!\[\[([^\]|]+)(?:\|(.*?))?\]\](?=\s*(?:!\[\[|$))/g)].map((m) => { const c = (m[2] ?? tabLabel).trim(); return { file: m[1].trim(), caption: c, ...(c ? { captionTokens: processInlineMarkdown(c) } : {}) } })
      if (items.length) {
        const blocks = getTargetBlocks()
        const lastBlock = blocks[blocks.length - 1]
        if (lastBlock && lastBlock.type === 'media') lastBlock.items.push(...items)
        else blocks.push({ type: 'media', items })
      }
      return
    }
    if (/^(@[a-z][a-z-]*(\s|$)|::[a-z]|\{\{[^}]+\}\}\s*$)/.test(trimmed)) { flushParagraph(); return }

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

    // Empty line — ends a paragraph, a table (two tables with a blank line between them are two tables) and a meta run
    if (trimmed === '') {
      flushParagraph()
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && (lastBlock.type === 'table' || lastBlock.type === 'meta')) lastBlock.closed = true
      return
    }

    // Pop-out definition: [+key]: Title (its list follows; a page shows neither)
    const popMatch = trimmed.match(/^\[\+([a-z0-9-]+)\]:\s*(.*)$/i)
    if (popMatch) {
      flushParagraph()
      getTargetBlocks().push({ type: 'popout-def', key: popMatch[1], title: popMatch[2] })
      return
    }

    // Footnote definition: [^key]: text
    const fnDefMatch = trimmed.match(/^\[\^([a-z0-9-]+)\]:\s*(.*)$/i)
    if (fnDefMatch) {
      flushParagraph()
      getTargetBlocks().push({ type: 'footnote-def', key: fnDefMatch[1], content: fnDefMatch[2], tokens: processInlineMarkdown(fnDefMatch[2]) })
      return
    }

    // Media embeds: ![[file|caption]], or a line that is only ![caption](src) (kol-atlas's web link cards), one or more on a
    // line; a run of lines is one grid
    const wikiEmbeds = /^(!\[\[[^\]|]+(?:\|.*?)?\]\](?=\s*(?:!\[\[|$))\s*)+$/.test(trimmed)
    if (wikiEmbeds || /^(!\[[^\]]*\]\([^)\s]+\)\s*)+$/.test(trimmed)) {
      flushParagraph()
      const blocks = getTargetBlocks()
      const embed = (file, caption) => ({ file: file.trim(), caption: caption.trim(), ...(caption.trim() ? { captionTokens: processInlineMarkdown(caption.trim()) } : {}) })
      const items = wikiEmbeds
        ? [...trimmed.matchAll(/!\[\[([^\]|]+)(?:\|(.*?))?\]\](?=\s*(?:!\[\[|$))/g)].map((m) => embed(m[1], m[2] ?? ''))
        : [...trimmed.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map((m) => embed(m[2], m[1]))
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'media') lastBlock.items.push(...items)
      else blocks.push({ type: 'media', items })
      return
    }

    // Meta lines (kol-atlas's engine rule, render.js): a paragraph whose FIRST line is `Dates:` `Date:` `Phases:` `Pages:`
    // `Covers:` or `Acceptance:` is one `meta` block — every line of that paragraph a row, its leading `Key:` the key
    // (`Client:` and `Contact:` ride along under `Dates:`); a blank line ends it, the next such paragraph is a block of its own
    const metaStart = paragraphBuffer.length === 0 && /^(Dates|Date|Phases|Pages|Covers|Acceptance):\s+\S/.test(line)
    const blocksHere = getTargetBlocks()
    const openMeta = blocksHere[blocksHere.length - 1]?.type === 'meta' && !blocksHere[blocksHere.length - 1].closed ? blocksHere[blocksHere.length - 1] : null
    if (metaStart || (openMeta && paragraphBuffer.length === 0 && !/^(#{1,4}\s|>|```|\s*([-*]|\d+\.)\s+|\s*\|)/.test(line))) {
      const m = /^([^:]+):\s*(.*)$/.exec(line)
      const row = m ? { key: m[1].trim(), value: m[2].trim(), tokens: processInlineMarkdown(m[2].trim()) } : { key: '', value: line.trim(), tokens: processInlineMarkdown(line.trim()) }
      if (openMeta && !metaStart) openMeta.rows.push(row)
      else blocksHere.push({ type: 'meta', rows: [row] })
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
      const whole = line.replace(/^>\s?/, '')
      /* `> quote — who` is a pull quote with its cite */
      const dash = whole.lastIndexOf(' — ')
      const content = dash > 0 ? whole.slice(0, dash).trim() : whole
      const cite = dash > 0 ? whole.slice(dash + 3).trim() : undefined
      getTargetBlocks().push({ type: 'blockquote', content, tokens: processInlineMarkdown(content), ...(cite ? { cite, citeTokens: processInlineMarkdown(cite) } : {}) })
      return
    }

    // Table row (starts with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushParagraph()
      const blocks = getTargetBlocks()
      const lastBlock = blocks[blocks.length - 1]

      /* Split on UNESCAPED pipes only, then unescape: Obsidian tables carry
       * `[[target\|display]]` wikilinks, and a naive split('|') exploded the
       * link across two cells and left literal `\` in the text — the reason
       * hub INDEX pages (tables of wikilinks) rendered as junk (wave-4). */
      const cells = trimmed
        .slice(1, -1)
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim().replace(/\\\|/g, '|'))

      // Separator row (|---|---|)
      const isSeparator = cells.every((cell) => /^:?-+:?$/.test(cell))

      if (isSeparator) {
        if (lastBlock && lastBlock.type === 'table' && !lastBlock.closed) {
          lastBlock.hasSeparator = true
          lastBlock.align = cells.map((c) => (/^:-+:$/.test(c) ? 'center' : /-+:$/.test(c) ? 'right' : 'left'))
          /* an empty header row is a key–value table (kol-atlas's rule) */
          lastBlock.kv = lastBlock.headers.every((h) => h === '')
        }
        return
      }

      if (lastBlock && lastBlock.type === 'table' && !lastBlock.closed) {
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

  return { sections, toc, introBlocks, inlineTags, ...(thumb ? { thumb } : {}) }
}

export default parseDocsMarkdown
