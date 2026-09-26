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

/**
 * splitFrontmatter / joinFrontmatter — the EDITOR's pair (DocumentEditor, 2026-09-26). Where
 * `parseFrontmatter` reads for display (keys lowercased, lists flattened), these round-trip a file:
 * keys keep their case and their order, a list stays a list, and the body is untouched — so opening
 * and saving a document without touching the form changes nothing but what was edited.
 *
 * `fields` is `[[key, value]]`, value a string or an array of strings.
 */
const unquote = (v) => {
  if (v.length > 1 && v.startsWith('"') && v.endsWith('"')) { try { return JSON.parse(v) } catch { return v.slice(1, -1) } }
  if (v.length > 1 && v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'")
  return v
}

export function splitFrontmatter(raw = '') {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { has: false, fields: [], body: raw }
  const fields = []
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_][\w -]*):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    if (!value) {
      const items = []
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) { i++; items.push(lines[i].replace(/^\s+-\s+/, '').trim()) }
      value = items.length ? items : ''
    } else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((t) => unquote(t.trim())).filter(Boolean)
    } else {
      value = unquote(value)
    }
    fields.push([kv[1], value])
  }
  return { has: true, fields, body: raw.slice(match[0].length) }
}

/* bare when YAML reads it back as the same string; quoted otherwise (a colon, a leading #, quotes) */
const yamlScalar = (v) => (/^[\w./@+-][\w ./@+,-]*$/.test(v) || v === '' ? v : JSON.stringify(v))

export function joinFrontmatter(fields, body = '') {
  const rows = fields.filter(([key]) => String(key).trim())
  if (!rows.length) return body
  const yaml = rows.map(([key, v]) => (Array.isArray(v) ? `${key}: [${v.map(yamlScalar).join(', ')}]` : `${key}: ${yamlScalar(String(v ?? ''))}`)).join('\n')
  return `---\n${yaml}\n---\n${body.startsWith('\n') ? body.slice(1) : body}`
}
