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

/* THE kol-docs contract, in reading order — `.kol/docs-framework/01-conventions.md`:
 * required (title/type/status/updated/tags) then recommended (description,
 * aliases). `related` is excluded on purpose: the rail renders it as links.
 *
 * This list read ['title','category','date','tags','modified'] — the
 * workshop-SAMPLE dialect. No kol-docs document carries category/date/modified,
 * so the filter below admitted title + tags and silently dropped the other
 * seven fields the parser had already handed it. The panel wasn't missing data;
 * it was screening for the wrong schema. Sample-dialect keys stay at the tail
 * so those docs keep rendering. */
const FIELD_ORDER = [
  'title', 'type', 'status', 'updated', 'created', 'verified',
  'description', 'audience', 'aliases', 'tags',
  'category', 'date', 'modified',
]

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

  const fields = FIELD_ORDER.filter(key => metadata[key] != null && metadata[key] !== '')

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
