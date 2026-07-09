/**
 * Handrolled YAML-subset frontmatter parser — no gray-matter / js-yaml.
 * Handles `key: value`, block lists (`  - item`), and inline `[a, b]` arrays.
 * Keys are lowercased. Lifted verbatim from the monorepo.
 */
export const parseFrontmatter = (raw) => {
  const metadata = {}
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return metadata

  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kvMatch = lines[i].match(/^([A-Za-z][A-Za-z0-9 -]*):\s*(.*)$/)
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase()
      const value = kvMatch[2].trim()
      if (!value) {
        // YAML block-list continuation lines (  - item)
        const items = []
        while (i + 1 < lines.length && lines[i + 1].match(/^\s+-\s+/)) {
          i++
          items.push(lines[i].replace(/^\s+-\s+/, '').trim())
        }
        metadata[key] = items.length ? items : ''
      } else {
        metadata[key] = value
      }
    }
  }

  // Parse tags array from YAML "[foo, bar, baz]" string into JS array
  if (typeof metadata.tags === 'string' && metadata.tags.startsWith('[')) {
    metadata.tags = metadata.tags
      .slice(1, -1)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }

  return metadata
}
