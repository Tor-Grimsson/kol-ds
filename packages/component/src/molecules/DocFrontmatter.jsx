import { Icon } from '@kolkrabbi/kol-icons'
import Tag from '../atoms/Tag.jsx'

/* taxonomy-ok: molecule — nests Tag (atom) + kol-icons' Icon. */

/* the workshop's DocsFrontmatter, ported minus the cap/expand and tag mode
 * (DocPageAndKindShowcase, kol-r2b2 2026-08-27): every field carries an icon and
 * an AUTHORED label (the no-auto-casing law — the fallback humanises the key
 * where the string is made), reading order is the kol-docs contract, `related`
 * and `aliases` are the deliberate omissions */
const FIELD_ICONS = {
  file: 'file', title: 'type', type: 'library', status: 'check', updated: 'refresh', created: 'plus',
  verified: 'shield-check', description: 'message', audience: 'user', aliases: 'repeat', sources: 'code',
  superseded_by: 'arrow-right', drift: 'alert-triangle', version: 'hash-01', tags: 'hash-02', id: 'hash-01',
  reuses: 'repeat', slug: 'external-link', source: 'code', imported_from: 'arrow-right', type_styles: 'type',
  classes: 'library', tokens: 'hash-01', composes: 'component-01', in_sets: 'grid', used_in: 'layers',
  date: 'journal', category: 'folder', modified: 'edit',
}
const FIELD_LABELS = {
  file: 'File', title: 'Title', type: 'Type', status: 'Status', updated: 'Updated', created: 'Created',
  verified: 'Verified', description: 'Description', audience: 'Audience', aliases: 'Aliases', sources: 'Sources',
  superseded_by: 'Superseded by', drift: 'Drift', version: 'Version', tags: 'Tags', source: 'Source',
  imported_from: 'Imported from', type_styles: 'Type styles', classes: 'Classes', tokens: 'Tokens',
  composes: 'Composes', in_sets: 'In sets', used_in: 'Used in', date: 'Date', category: 'Category', modified: 'Modified',
}
const FIELD_ORDER = [
  'title', 'type', 'status', 'created', 'updated', 'tags', 'description', 'aliases', 'sources',
  'verified', 'audience', 'superseded_by', 'drift', 'category', 'date', 'modified', 'version',
]
const HIDDEN = new Set(['related', 'aliases'])
const CASED_VALUE_FIELDS = new Set(['type', 'status'])
const DATE_FIELDS = new Set(['updated', 'created', 'verified', 'date', 'modified'])

const humanise = (key) => {
  const words = String(key).replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
const formatDate = (s) => {
  const d = new Date(s)
  if (isNaN(d)) return s
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}
const orderFields = (metadata) => {
  const present = Object.keys(metadata).filter(
    (k) => !HIDDEN.has(k) && metadata[k] != null && metadata[k] !== '' && !(Array.isArray(metadata[k]) && metadata[k].length === 0),
  )
  const known = FIELD_ORDER.filter((k) => present.includes(k))
  const rest = present.filter((k) => !FIELD_ORDER.includes(k)).sort()
  return [...known, ...rest]
}

/**
 * DocFrontmatter — the frontmatter block above a markdown document's prose: the
 * `FRONTMATTER` eyebrow, icon + label keys, mono values, tags as `Tag` chips,
 * arrays stacked, a hairline below. A member of `DocPage`.
 *
 * @param {Object} metadata  the parsed frontmatter (`parseFrontmatter`)
 */
export default function DocFrontmatter({ metadata }) {
  const fields = metadata ? orderFields(metadata) : []
  if (fields.length === 0) return null
  return (
    <div className="kol-doc-frontmatter border-b border-fg-08 pb-5 mb-6">
      <div className="kol-doc-eyebrow mb-2">Frontmatter</div>
      {fields.map((key) => {
        const value = metadata[key]
        const icon = FIELD_ICONS[key]
        return (
          <div key={key} className="flex items-baseline gap-4 py-1">
            <span className="flex items-center gap-2 min-w-[120px] kol-helper-12 text-meta">
              {icon && <Icon name={icon} size={14} />}
              {FIELD_LABELS[key] ?? humanise(key)}
            </span>
            <span className="flex-1 min-w-0 [overflow-wrap:anywhere] kol-mono-12 text-strong">
              {key === 'tags' && Array.isArray(value) ? (
                <span className="flex flex-wrap gap-1.5">{value.map((tag) => <Tag key={tag}>{tag}</Tag>)}</span>
              ) : DATE_FIELDS.has(key) ? formatDate(String(value))
                : CASED_VALUE_FIELDS.has(key) ? humanise(String(value))
                : Array.isArray(value) ? (
                  <span className="flex flex-col gap-1">{value.map((item, i) => <span key={i} className="break-all">{String(item)}</span>)}</span>
                ) : String(value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
