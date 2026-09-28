/**
 * @kolkrabbi/kol-markdown — the markdown engine. Plain ESM: no React, no DOM, no Vite.
 * Engine tier (ARCHITECTURE §3): one copy of what kol-workshop, kol-component and kol-notes
 * each carried for themselves.
 */
export { parseDocsMarkdown, extractHashtags, processInlineMarkdown } from './parse-markdown.js'
export { parseFrontmatter, splitFrontmatter, joinFrontmatter } from './frontmatter.js'
export { buildInventory, buildInventoryCounts } from './build-inventory.js'
export { buildTagCounts, buildTagCooccurrence } from './tags.js'
export {
  capitalise,
  isIndexFile,
  extractDocNumber,
  kolkrabbiPages,
  subsectionPrefixes,
  categoryLabels,
  cleanTitle,
  fileLabel,
  getTagColor,
  groupDocsByMajor,
} from './doc-helpers.js'
