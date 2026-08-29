/**
 * parseFrontmatter — the workshop engine's handrolled YAML-subset parser,
 * verbatim (`packages/workshop/src/engine/frontmatter.js`; DocPageAndKindShowcase,
 * kol-r2b2 2026-08-27): `key: value`, block lists (`  - item`), inline `[a, b]`
 * tags. Keys are lowercased. No gray-matter / js-yaml.
 */
export function parseFrontmatter(raw) {
  const metadata = {}
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return metadata
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z][A-Za-z0-9 -]*):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1].toLowerCase()
    const value = kv[2].trim()
    if (!value) {
      const items = []
      while (i + 1 < lines.length && lines[i + 1].match(/^\s+-\s+/)) { i++; items.push(lines[i].replace(/^\s+-\s+/, '').trim()) }
      metadata[key] = items.length ? items : ''
    } else {
      metadata[key] = value
    }
  }
  if (typeof metadata.tags === 'string' && metadata.tags.startsWith('[')) {
    metadata.tags = metadata.tags.slice(1, -1).split(',').map((t) => t.trim()).filter(Boolean)
  }
  return metadata
}
