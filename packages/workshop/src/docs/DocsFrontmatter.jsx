import { Icon, Tag } from '@kolkrabbi/kol-component'
import { getTagColor } from '../engine'
import { useTagMode } from '../tags'

const FIELD_ICONS = {
  file: 'file',
  title: null,
  type: 'folder',
  status: 'check',
  updated: null,
  created: null,
  verified: null,
  description: null,
  audience: null,
  aliases: null,
  version: 'hash-01',
  /* legacy dialect (workshop-sample docs) — kept so those still render */
  date: null,
  category: 'folder',
  tags: null,
  modified: null,
}

/* Reading ORDER, not an allowlist. The kol-docs contract first
 * (`.kol/docs-framework/01-conventions.md`: required title/type/status/updated/
 * tags, then recommended description/aliases, then optional), legacy
 * sample-dialect keys after, and ANY key not named here after that — so a field
 * can never be silently dropped for being unknown.
 *
 * This was a filter over ['title','category','date','tags','modified'] — the
 * workshop-SAMPLE dialect. No kol-docs document carries category/date/modified,
 * so it admitted title + tags and discarded the seven fields the parser had
 * already handed it. The panel wasn't missing data; it was screening for the
 * wrong schema, and screening is now the thing it doesn't do.
 *
 * `related` is the one deliberate omission — the rail renders it as live links,
 * so printing the raw wikilinks here would be the same thing twice. */
const FIELD_ORDER = [
  'title', 'type', 'status', 'updated', 'tags',
  'description', 'aliases',
  'created', 'verified', 'audience', 'superseded_by', 'drift',
  'category', 'date', 'modified', 'version',
]

const HIDDEN = new Set(['related'])

/** Contract order first, then anything else the doc carries, alphabetically. */
const orderFields = (metadata) => {
  const present = Object.keys(metadata).filter(
    (k) => !HIDDEN.has(k) && metadata[k] != null && metadata[k] !== '' &&
      !(Array.isArray(metadata[k]) && metadata[k].length === 0)
  )
  const known = FIELD_ORDER.filter((k) => present.includes(k))
  const rest = present.filter((k) => !FIELD_ORDER.includes(k)).sort()
  return [...known, ...rest]
}

/* Every field rendered as a date. `updated`/`created`/`verified` are the
 * kol-docs names; `date`/`modified` are the sample dialect's. */
const DATE_FIELDS = new Set(['updated', 'created', 'verified', 'date', 'modified'])

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}

const DocsFrontmatter = ({ metadata, docId }) => {
  const { openTagMode } = useTagMode()
  if (!metadata || Object.keys(metadata).length === 0) return null

  const fields = orderFields(metadata)

  if (fields.length === 0) return null

  return (
    <div className="docs-frontmatter">
      <p className="shell-sidebar-label kol-doc-eyebrow">Frontmatter</p>
      {fields.map((key) => {
        const value = metadata[key]
        const icon = FIELD_ICONS[key]

        return (
          <div key={key} className="docs-frontmatter-row">
            <span className="docs-frontmatter-key kol-helper-12 text-meta">
              {icon && <Icon name={icon} size={14} />}
              {key}
            </span>
            <span className="kol-mono-12 text-strong">
              {key === 'tags' && Array.isArray(value) ? (
                <span className="flex flex-wrap gap-1.5">
                  {value.map((tag) => (
                    <Tag
                      key={tag}
                      size="sm"
                      color={getTagColor(tag)}
                      onClick={() => openTagMode(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </span>
              ) : DATE_FIELDS.has(key) ? (
                formatDate(String(value))
              ) : Array.isArray(value) ? (
                value.join(' · ')
              ) : (
                String(value)
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default DocsFrontmatter
