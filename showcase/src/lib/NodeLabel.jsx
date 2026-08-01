import { Link } from 'react-router-dom'

/**
 * NodeLabel / NodePreview — the shared cell renderers for anything the
 * reference graph or the search results can point at.
 *
 * Both surfaces list the same universe of things (components, custom
 * properties, utility classes) and both were about to render them as one
 * undifferentiated mono string, which is what made the reference table
 * unreadable: `--kol-surface-primary`, `kol-mono-12` and `Button` are three
 * different KINDS of thing and looked identical.
 *
 * The treatment is by kind, not by decoration:
 *   component  — a name. Sentence weight, linked to its page.
 *   token      — a custom property. Code treatment, dimmed `--` prefix so the
 *                readable part of the name carries the ink.
 *   class      — a selector. Code treatment, dimmed `.` prefix, same rule.
 *
 * Shared deliberately: References and SearchResults must not grow two copies
 * of this, which is the whole reason it lives in lib/ rather than in a page.
 */

const KIND_LABEL = { component: 'Component', token: 'Token', class: 'Class' }

/** Human name for a node kind — the category axis the filters group on. */
export const kindLabel = (kind) => KIND_LABEL[kind] ?? kind

export function NodeLabel({ name, kind, to }) {
  if (kind === 'token' || kind === 'class') {
    const prefix = kind === 'token' ? '--' : '.'
    const bare = name.startsWith(prefix) ? name.slice(prefix.length) : name
    const body = (
      <code className="kol-mono-12">
        <span className="text-fg-32">{prefix}</span>
        <span className="text-emphasis">{bare}</span>
      </code>
    )
    return to ? <Link to={to}>{body}</Link> : body
  }

  const body = <span className="kol-mono-12 text-emphasis font-medium">{name}</span>
  return to ? <Link to={to}>{body}</Link> : body
}

/**
 * NodePreview — a placeholder slot that renders ONLY when the node's kind and
 * concern support one. A colour token shows its colour, a type class shows
 * itself applied. Everything else renders nothing at all — an empty preview
 * box on 500 of 663 rows is noise, not a column.
 */
export function NodePreview({ name, kind, concern }) {
  if (kind === 'token' && concern === 'color') {
    return (
      <span
        className="inline-block align-middle w-6 h-4 rounded-xs border border-fg-08"
        style={{ background: `var(${name})` }}
        title={name}
      />
    )
  }

  if (kind === 'class' && concern === 'type') {
    const cls = name.startsWith('.') ? name.slice(1) : name
    return <span className={`${cls} text-emphasis`}>Ag</span>
  }

  return null
}

/** True when a node has a preview to show — lets a caller skip the column. */
export const hasPreview = (kind, concern) =>
  (kind === 'token' && concern === 'color') || (kind === 'class' && concern === 'type')
