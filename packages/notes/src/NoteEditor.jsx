import { PageShell } from '@kolkrabbi/kol-shell'
import { DocumentEditor } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — kol-component's DocumentEditor, inline in a PageShell, bound to one note row */

/**
 * NoteEditor — one note, open in the page (kol-olina's NoteEdit, on the DS editor).
 *
 * NoteEdit's two tiers are DocumentEditor's own: the DRAFT is browser memory (`localDrafts`, every
 * pause, keyed `notes:<slug>`), the SAVE is explicit (Save / ⌘S). A draft is restored only if it is
 * newer than the saved row — restoring an old draft over a note saved since is how you lose work.
 *
 * The title is the body's frontmatter `title` (DocumentEditor's fields form), so there is no second
 * field and no second save. NoteEdit's attachments are Attach: a bucket file inserted into the body
 * as a link or an image, which is where a markdown document keeps them anyway.
 *
 * @param {Object}   note     the loaded row `{ slug, title, body, updated_at }`; `null` while loading
 * @param {Function} onSave   (body) => Promise
 * @param {Function} onClose
 * @param {Array}    assets   `[{ key, name, url, contentType }]` — what Attach offers
 */
export default function NoteEditor({ note, onSave, onClose, assets }) {
  return (
    <PageShell mode="fixed">
      <div className="flex-1 min-h-0">
        {/* mounted once the row is here — the editor takes its name and draft key on mount */}
        {!note ? <p className="kol-mono-12 text-fg-48 pt-6">Loading…</p> : <DocumentEditor
          key={note.slug}
          inline
          name={note.title || 'Note'}
          kind="markdown"
          text={note.body ?? ''}
          savedAt={note.updated_at ? Date.parse(note.updated_at) : 0}
          draft={{ bucket: 'notes', key: note.slug }}
          assets={assets}
          onSave={onSave}
          onClose={onClose}
        />}
      </div>
    </PageShell>
  )
}
