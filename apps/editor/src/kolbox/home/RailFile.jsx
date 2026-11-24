import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '@design-editor-src/editor/kolbox/ui/Icon.jsx'
import { Button, Input, LabeledControl, Tooltip, Rail, RailHeader, LabeledControlSection } from '@kolkrabbi/kol-component'

/* The FILE rail (round 4, W13): the real file rail (kol-component AppItemMenuProvider, the drawer a card's cog opens)
   on kolbox's Rail shell at the right edge, over the dim, as the real one sits over its scrim. Read mode first: Name,
   Tags and Note when the file has them, then Details (Date, Size, Chrome, Layers, Aspect). The foot's pencil toggles
   edit mode ("Edit", "Done editing"): the Name field (Enter or leaving it renames), Tags (each with its ×, then "Add a
   tag"), Note ("Add a note", kept on leaving it) and Cover ("Upload image"). The foot: the pencil, Download, Duplicate,
   Delete (its confirm is the caller's; the rail closes when it happens). Escape (when it is the last overlay) and a
   press on the dim close it.
   file: { id, name, tags, note, details: [{ label, value }] }; onRename(name), onTags(tags), onNote(text),
   onCover(), onDownload(), onDuplicate(), onRemove() → true when it happened; onClose(). */
const Value = ({ children }) => <span className="min-w-0 flex-1 truncate text-right font-mono text-value text-text">{children}</span>
const Chip = ({ children, onRemove }) => (
  <span className="inline-flex h-6 items-center gap-1 rounded-control bg-field px-2 font-mono text-meta text-text" data-file-tag>
    {children}
    {onRemove && <button type="button" aria-label={`Remove ${children}`} onClick={onRemove} className="-mr-1 inline-flex text-muted outline-none hover:text-text focus-visible:text-accent"><Icon name="x" size={12} /></button>}
  </span>
)

export default function RailFile({ file, onClose, onRename, onTags, onNote, onCover, onDownload, onDuplicate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(file.name)
  const [tags, setTags] = useState(file.tags ?? [])
  const [tag, setTag] = useState('')
  const [note, setNote] = useState(file.note ?? '')
  const layer = useRef(null)

  useEffect(() => {
    const key = (e) => {
      const all = document.querySelectorAll('[data-kolbox-overlay]')
      if (e.key === 'Escape' && all[all.length - 1] === layer.current) onClose()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [onClose])

  const commitName = () => { const n = name.trim(); if (n && n !== file.name) onRename(n); else setName(file.name) }
  const putTags = (next) => { setTags(next); onTags(next) }
  const addTag = () => { const t = tag.trim(); if (t && !tags.includes(t)) putTags([...tags, t]); setTag('') }
  const commitNote = () => { if (note.trim() !== (file.note ?? '').trim()) onNote(note.trim()) }
  const verb = (icon, label, run) => <Tooltip variant="kolbox" label={label}><Button variant="kolbox" iconOnly={icon} aria-label={label} onClick={run}/></Tooltip>

  return createPortal(
    <div
      ref={layer}
      data-kolbox-overlay="rail"
      className="fixed inset-0 z-40 flex justify-end bg-dim"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Rail variant="kolbox"
        side="right"
        aria-label="File"
        header={<RailHeader variant="kolbox" title="File" actions={<Button variant="kolbox" iconOnly="x" aria-label="Close" onClick={onClose}/>} />}
        footer={(
          <div className="relative flex h-12 items-center justify-end gap-1 px-4 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border" data-rail-file-foot>
            {verb('edit', editing ? 'Done editing' : 'Edit', () => setEditing((v) => !v))}
            {verb('download', 'Download', onDownload)}
            {verb('copy', 'Duplicate', onDuplicate)}
            {verb('trash', 'Delete', async () => { if (await onRemove()) onClose() })}
          </div>
        )}
      >
        <div data-rail-file={file.id}>
          <LabeledControlSection variant="kolbox">
            <LabeledControl variant="kolbox" horizontal label="Name">
              {editing
                ? <Input variant="kolbox" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} className="flex-1" />
                : <Value>{name}</Value>}
            </LabeledControl>
            {(editing || tags.length > 0) && (
              <LabeledControl variant="kolbox" horizontal={!(editing)} label="Tags">
                {editing ? (
                  <div className="flex w-full flex-col gap-2">
                    {tags.length > 0 && <div className="flex flex-wrap gap-1">{tags.map((t) => <Chip key={t} onRemove={() => putTags(tags.filter((x) => x !== t))}>{t}</Chip>)}</div>}
                    <Input variant="kolbox" aria-label="Add a tag" placeholder="Add a tag" value={tag} onChange={(e) => setTag(e.target.value)} onBlur={addTag} onKeyDown={(e) => e.key === 'Enter' && addTag()} />
                  </div>
                ) : <span className="flex min-w-0 flex-1 flex-wrap justify-end gap-1">{tags.map((t) => <Chip key={t}>{t}</Chip>)}</span>}
              </LabeledControl>
            )}
            {(editing || note.trim()) && (
              <LabeledControl variant="kolbox" horizontal={!(editing)} label="Note">
                {editing
                  ? <textarea aria-label="Note" rows={3} placeholder="Add a note" value={note} onChange={(e) => setNote(e.target.value)} onBlur={commitNote} className="w-full resize-y rounded-control border border-border bg-field px-2 py-1 font-mono text-value text-text outline-none placeholder:text-muted focus:border-accent" />
                  : <span className="min-w-0 flex-1 text-right font-mono text-value whitespace-pre-wrap text-text">{note.trim()}</span>}
              </LabeledControl>
            )}
            {editing && (
              <LabeledControl variant="kolbox" horizontal label="Cover">
                <Button variant="kolbox" onClick={onCover}>Upload image</Button>
              </LabeledControl>
            )}
          </LabeledControlSection>
          <LabeledControlSection variant="kolbox" label="Details">
            {(file.details ?? []).map((d) => (
              <LabeledControl variant="kolbox" horizontal key={d.label} label={d.label}><Value>{d.value}</Value></LabeledControl>
            ))}
          </LabeledControlSection>
        </div>
      </Rail>
    </div>,
    document.body,
  )
}
