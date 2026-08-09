import { Icon, Tag } from '@kolkrabbi/kol-component'
import { useTagMode } from '../tags'
import TagPath from '../tags/TagPath.jsx'

/* EVERY field carries an icon (user ruling 2026-08-01). Ten of these were
 * hard-coded `null`, so two rows had a glyph and the rest sat at a ragged left
 * edge — a column that is sometimes iconned is worse than one that never is.
 * Every name below is verified present in kol-icon-set-v1. */
const FIELD_ICONS = {
  file: 'file',
  title: 'type',
  type: 'library',
  status: 'check',
  updated: 'refresh',
  created: 'plus',
  verified: 'shield-check',
  description: 'message',
  audience: 'user',
  aliases: 'repeat',
  sources: 'code',
  superseded_by: 'arrow-right',
  drift: 'alert-triangle',
  version: 'hash-01',
  tags: 'hash-02',
  /* 2026-08-01: these three rendered iconless while the rule above promised
   * every field carries one — the exact ragged edge that rule exists to stop.
   * All verified present in kol-icon-set-v1. */
  id: 'hash-01',
  reuses: 'repeat',
  slug: 'external-link',
  /* provenance — folded in from the retired MetaRows panel 2026-08-01 */
  source: 'code',
  imported_from: 'arrow-right',
  type_styles: 'type',
  classes: 'library',
  tokens: 'hash-01',
  composes: 'component-01',
  in_sets: 'grid',
  used_in: 'layers',
  /* legacy dialect (workshop-sample docs) — kept so those still render */
  date: 'journal',
  category: 'folder',
  modified: 'edit',
}

/* AUTHORED labels, not the raw key (user ruling 2026-08-01). The row printed
 * `{key}` straight from the frontmatter, so the column read lowercase and
 * snake_cased. KOL forbids `text-transform` on a component — casing is a
 * content decision — so the strings are written here in the case they render.
 * A key with no entry falls back to its own name rather than vanishing. */
const FIELD_LABELS = {
  file: 'File',
  title: 'Title',
  type: 'Type',
  status: 'Status',
  updated: 'Updated',
  created: 'Created',
  verified: 'Verified',
  description: 'Description',
  audience: 'Audience',
  aliases: 'Aliases',
  sources: 'Sources',
  superseded_by: 'Superseded by',
  drift: 'Drift',
  version: 'Version',
  tags: 'Tags',
  source: 'Source',
  imported_from: 'Imported from',
  type_styles: 'Type styles',
  classes: 'Classes',
  tokens: 'Tokens',
  composes: 'Composes',
  in_sets: 'In sets',
  used_in: 'Used in',
  date: 'Date',
  category: 'Category',
  modified: 'Modified',
}

/* THE FALLBACK IS A LABEL TOO (user ruling 2026-08-01). `FIELD_LABELS[key] ??
 * key` printed an unnamed key raw, so a doc carrying `imported_from` before it
 * was listed rendered the row as `imported_from` — snake_case and lowercase, in
 * a column where every neighbour is sentence case. *"its very amateur that you
 * cant start a sentence or word with a Capital?"*
 *
 * Casing is authored at the data layer, never by CSS (the no-auto-text-transform
 * law) — so the fallback authors it here, where the string is made. */
const humanise = (key) => {
  const words = String(key).replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
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
  /* `created` sits ABOVE `updated` (user ruling 2026-08-01) — a document's age
   * reads oldest-first, and `updated` on its own says nothing about how long
   * the thing has existed. */
  'title', 'type', 'status', 'created', 'updated', 'tags',
  'description', 'aliases', 'sources',
  'verified', 'audience', 'superseded_by', 'drift',
  'category', 'date', 'modified', 'version',
]

/* `related` — the rail renders it as live links; printing the raw wikilinks
 * here would be the same thing twice.
 *
 * `aliases` — user ruling 2026-08-01: *"why is this a category in frontmatter?
 * what purpose … its just not relevant"*. It is an OBSIDIAN field, not a tag
 * and not a document fact: `.kol/docs-framework/01-conventions.md:65` says it
 * feeds the Quick Switcher and search autocomplete and explicitly does **not**
 * affect wikilink resolution. Nothing in this app reads it. It stays in the
 * file for Obsidian and stops taking a row in a panel that renders facts. */
const HIDDEN = new Set(['related', 'aliases'])

/* VALUES ARE SENTENCE CASE TOO (user ruling 2026-08-01). The labels were fixed
 * and the values were not, so the panel read `Type  reference` / `Status
 * active` — a capitalised label pointing at a lowercase word. These two fields
 * carry closed enums from the kol-docs contract, so the case is authored here
 * against the key, never with a text-transform. Every other value is content
 * and is printed exactly as written. */
const CASED_VALUE_FIELDS = new Set(['type', 'status'])

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
              {FIELD_LABELS[key] ?? humanise(key)}
            </span>
            <span className="docs-frontmatter-value kol-mono-12 text-strong">
              {key === 'tags' && Array.isArray(value) ? (
                /* `naked`, the SAME Tag rendering the rail's own tag list uses
                 * (DocReaderSidebar). This was the default filled variant, so
                 * the one concept rendered as a solid pill here and as plain
                 * coloured text six inches to the right.
                 *
                 * NO `color` (user ruling 2026-08-01): passing one swaps the
                 * base class from `tag-control` to `tag tag--{color}`, and
                 * only `tag-control` has a `:hover` rule — so a coloured Tag
                 * silently loses its interaction state. Right component first;
                 * colour is its own decision, later.
                 * `size` is omitted: `sm` is the default and the only size. */
                <span className="flex flex-wrap gap-1.5">
                  {value.map((tag) => (
                    <Tag key={tag} onClick={() => openTagMode(tag)}>
                      {/* the path renderer, not the raw string — namespace dims,
                        * leaf carries. Shared with the tag overlay so the two
                        * surfaces cannot spell a tag two ways. */}
                      <TagPath tag={tag} />
                    </Tag>
                  ))}
                </span>
              ) : DATE_FIELDS.has(key) ? (
                formatDate(String(value))
              ) : CASED_VALUE_FIELDS.has(key) ? (
                humanise(String(value))
              ) : Array.isArray(value) ? (
                /* STACKED, ONE PER LINE (user ruling 2026-08-01). Arrays were
                 * `value.join(' · ')` — a single run-on string, so `sources`
                 * with three file paths ran straight off the right edge of the
                 * panel and the reader could not tell where one path ended and
                 * the next began. A list of paths IS a list; the dot-join was
                 * printing it as a sentence.
                 *
                 * `break-all` because these are paths, not words: a wrapped
                 * path must break at the character, never leave a gap and drop
                 * the whole segment to the next line.
                 *
                 * THE LIST SCROLLS PAST ITS CAP (user question 2026-08-01:
                 * "I just wonder what it will be when the sources are f.e. more
                 * then 15?"). Unbounded, fifteen paths push the article fifteen
                 * lines down and the metadata panel becomes the page. No
                 * file-type icons — a path already ends in its own extension,
                 * and a glyph restating it is decoration. */
                <span className="docs-frontmatter-list">
                  {value.map((item, i) => (
                    <span key={i} className="break-all">{String(item)}</span>
                  ))}
                </span>
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
