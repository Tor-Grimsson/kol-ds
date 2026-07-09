/**
 * The pure docs engine — zero dependencies, no React, no Vite.
 * Everything here is a plain function over strings/data.
 */
export { parseDocsMarkdown, extractHashtags } from './parse-markdown.js'
export { parseFrontmatter } from './frontmatter.js'
export { buildInventory, buildInventoryCounts } from './build-inventory.js'
export { matchSearchItems } from './search.js'
export { buildTagCounts, buildTagCooccurrence } from './tags.js'
export {
  capitalise,
  isIndexFile,
  extractDocNumber,
  kolkrabbiPages,
  subsectionPrefixes,
  categoryLabels,
  cleanTitle,
  getTagColor,
  groupDocsByMajor,
} from './doc-helpers.js'
