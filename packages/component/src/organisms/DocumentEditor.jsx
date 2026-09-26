/* taxonomy-ok: organism — composes QuickLookFrame, FullscreenOverlay, Input, Textarea, ViewToggle, Button and KindPreview into one editing surface. */
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'
import Textarea from '../atoms/Textarea.jsx'
import ViewToggle from '../atoms/ViewToggle.jsx'
import QuickLookFrame from '../molecules/QuickLookFrame.jsx'
import KindPreview from '../molecules/KindPreview.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import { splitFrontmatter, joinFrontmatter } from '../utilities/frontmatter.js'
import { readDraft, writeDraft, clearDraft } from '../utilities/localDrafts.js'

/**
 * DocumentEditor — write a text file: open one, or make a new one (media D1 plan v2, 2026-09-26).
 *
 * The concept is kol-olina's brand notes page (NoteEdit): a title, a markdown body, Write / Preview,
 * attachments from the bucket, a page for writing something NEW rather than a button hidden in a
 * list. Here the document is a FILE in the bucket, so it takes any text kind, and a markdown file's
 * frontmatter gets a form instead of a YAML fence to hand-edit.
 *
 *   markdown   a FIELDS form (title · description · date · tags suggested, any key allowed) over
 *              the body; Write · Split · Preview; Attach inserts a bucket file as a link / image
 *   svg        text with a live picture beside it
 *   the rest   text (json · yaml · csv · txt · code) with Split / Preview through KindPreview
 *
 * TWO TIERS, as NoteEdit had them: the DRAFT is browser memory (`localDrafts`, every pause, no
 * network — the user's ruling), the SAVE is explicit (`onSave` / ⌘S). A draft is restored only if it
 * is newer than the saved file (`savedAt`), so a file saved since is never overwritten by an old
 * draft. Revert drops the draft.
 *
 * @param {'edit'|'new'} mode        `new` shows the name + type row and calls `onCreate`
 * @param {string}   name            the file's name (edit) or a starting name (new)
 * @param {string}   kind            markdown · text · json · yaml · code · svg (edit); new picks it
 * @param {string}   text            the saved text; `null` while it loads
 * @param {number}   savedAt         epoch ms of the saved file — a draft older than this is ignored
 * @param {Object}   draft           `{ bucket, key }` — where the draft lives; omit for no drafts
 * @param {Function} onSave          `(text) => Promise` — edit mode
 * @param {Function} onCreate        `({ name, text }) => Promise` — new mode; the name carries the extension
 * @param {string}   folder          new mode: where the file will be made (shown, not edited)
 * @param {Array}    assets          `[{ key, name, url, contentType }]` — the files markdown's Attach offers; a
 *                                   searchable list inside the editor inserts the pick at the caret
 * @param {Function} onPickAsset     `() => Promise<{ name, url, contentType } | null>` — a consumer's own picker instead
 * @param {Function} onClose
 * @param {boolean}  inline          render IN the page, filling its container, instead of over it (the notes
 *                                   page, media-shell 2026-09-26: the editor is the page's content there,
 *                                   not a window over a list). No scrim, no Escape-to-close; the X still closes
 */
const TYPES = [
  { value: 'md', label: 'MD', kind: 'markdown' },
  { value: 'txt', label: 'TXT', kind: 'text' },
  { value: 'json', label: 'JSON', kind: 'json' },
  { value: 'yaml', label: 'YAML', kind: 'yaml' },
  { value: 'csv', label: 'CSV', kind: 'text' },
]
const today = () => new Date().toISOString().slice(0, 10)
const STARTER = {
  md: (title) => joinFrontmatter([['title', title], ['date', today()], ['tags', []]], `\n# ${title}\n\n`),
  txt: () => '',
  json: () => '{\n  \n}\n',
  yaml: () => '',
  csv: () => 'name,value\n',
}
/* the keys a document usually carries, offered as one-click rows — any other key is typed */
const SUGGESTED = ['title', 'description', 'date', 'tags']
const DRAFT_PAUSE = 400 // browser memory is free — a short pause, not D1's write budget

export default function DocumentEditor({
  mode = 'edit', name: nameProp = '', kind: kindProp, text, savedAt = 0, draft,
  onSave, onCreate, folder = '', assets, onPickAsset, onClose,
  inline = false,
}) {
  const [picking, setPicking] = useState(false)
  const [pickQuery, setPickQuery] = useState('')
  const isNew = mode === 'new'
  const [name, setName] = useState(isNew ? (nameProp || 'untitled') : nameProp)
  const [type, setType] = useState('md')
  const kind = isNew ? TYPES.find((t) => t.value === type).kind : kindProp
  const [value, setValue] = useState(null)
  const [base, setBase] = useState(null)
  const [status, setStatus] = useState(isNew ? 'Not created yet' : 'Loading…')
  const [view, setView] = useState(kind === 'markdown' || kind === 'svg' ? 'split' : 'write')
  const timer = useRef(null)
  const bodyRef = useRef(null)
  const latest = useRef('')

  /* load: the saved text, or a newer draft; a new document starts from its type's starter */
  useEffect(() => {
    if (isNew) {
      const d = draft ? readDraft(draft.bucket, draft.key) : null
      const start = d?.text ?? STARTER.md(name)
      setValue(start); latest.current = start; setBase('')
      if (d) setStatus('Draft restored')
      return
    }
    if (text == null) return
    const d = draft ? readDraft(draft.bucket, draft.key) : null
    const useDraft = d && d.at > savedAt && d.text !== text
    setBase(text)
    setValue(useDraft ? d.text : text); latest.current = useDraft ? d.text : text
    setStatus(useDraft ? 'Draft restored — not saved to the file' : 'Saved')
    if (d && !useDraft && draft) clearDraft(draft.bucket, draft.key)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  const flush = () => {
    if (timer.current == null || !draft) return
    clearTimeout(timer.current); timer.current = null
    if (latest.current === base && !isNew) clearDraft(draft.bucket, draft.key)
    else writeDraft(draft.bucket, draft.key, latest.current)
  }
  useEffect(() => () => flush(), []) // eslint-disable-line react-hooks/exhaustive-deps
  const change = (next) => {
    setValue(next); latest.current = next
    setStatus(isNew ? 'Not created yet' : next === base ? 'Saved' : 'Edited — not saved')
    clearTimeout(timer.current)
    timer.current = setTimeout(flush, DRAFT_PAUSE)
  }

  const dirty = value != null && (isNew || value !== base)
  const save = async () => {
    if (!dirty) return
    clearTimeout(timer.current); timer.current = null
    setStatus(isNew ? 'Creating…' : 'Saving…')
    try {
      if (isNew) {
        const file = name.trim().replace(/\.[^./]+$/, '') || 'untitled'
        await onCreate?.({ name: `${file}.${type}`, text: latest.current })
      } else {
        await onSave?.(latest.current)
        setBase(latest.current)
      }
      if (draft) clearDraft(draft.bucket, draft.key)
      setStatus('Saved')
    } catch (e) { setStatus(`Not saved: ${e.message}`) }
  }
  const revert = () => {
    clearTimeout(timer.current); timer.current = null
    if (draft) clearDraft(draft.bucket, draft.key)
    const back = isNew ? STARTER[type](name) : base
    setValue(back); latest.current = back; setStatus(isNew ? 'Not created yet' : 'Saved')
  }
  /* ⌘S anywhere while the editor is open */
  const saveRef = useRef(save)
  saveRef.current = save
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveRef.current() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* markdown: the fields form and the body are one text, split for editing and joined on change */
  const md = kind === 'markdown'
  const parts = useMemo(() => (md && value != null ? splitFrontmatter(value) : null), [md, value])
  const setFields = (fields) => change(joinFrontmatter(fields, parts.body))
  const setBody = (body) => change(parts.has || parts.fields.length ? joinFrontmatter(parts.fields, body) : body)

  const insertAsset = (a) => {
    const link = (a.contentType ?? '').startsWith('image/') ? `![${a.name}](${a.url})` : `[${a.name}](${a.url})`
    const el = bodyRef.current?.querySelector('textarea')
    const body = parts.body
    const at = el ? el.selectionStart : body.length
    setBody(`${body.slice(0, at)}${link}${body.slice(at)}`)
    setPicking(false)
  }
  const attach = async () => {
    if (!onPickAsset) { setPicking((p) => !p); return }
    const a = await onPickAsset()
    if (a) insertAsset(a)
  }
  /* images first — Attach is mostly "put this picture in the document" */
  const pickList = (assets ?? [])
    .filter((a) => !pickQuery || a.key.toLowerCase().includes(pickQuery.toLowerCase()))
    .sort((a, b) => Number(!(a.contentType ?? '').startsWith('image/')) - Number(!(b.contentType ?? '').startsWith('image/')) || a.key.localeCompare(b.key))
    .slice(0, 60)

  /* THE NAME CARRIES THE TITLE while the title is still the starter's — the first thing typed names
   * both, as NoteEdit's title named the note; once the title is edited it is left alone */
  const rename = (next) => {
    const was = name
    setName(next)
    if (!md || !parts) return
    const title = parts.fields.find(([k]) => k.toLowerCase() === 'title')
    if (!title || title[1] !== was) return
    const heading = `# ${was}`
    const body = parts.body.startsWith(`\n${heading}`) || parts.body.startsWith(heading) ? parts.body.replace(heading, `# ${next}`) : parts.body
    change(joinFrontmatter(parts.fields.map(([k, v]) => (k === title[0] ? [k, next] : [k, v])), body))
  }
  const close = () => { flush(); onClose?.() }
  const views = [{ value: 'write', label: 'Write' }, { value: 'split', label: 'Split' }, { value: 'preview', label: 'Preview' }]
  const preview = value == null ? null : kind === 'svg'
    ? <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(value)}`} alt="" className="max-w-full max-h-full object-contain m-auto" />
    : <KindPreview o={{ key: name || 'document' }} text={value} kind={kind} />

  const frame = (
      <QuickLookFrame className={inline ? 'kol-quicklook--inline' : ''} title={isNew ? `New document${folder ? ` in ${folder}` : ''}` : name} meta={status} onClose={close}
        actions={(
          <span className="flex items-center gap-2">
            <ViewToggle variant="text" viewMode={view} onViewChange={setView} options={views} />
            {md && (onPickAsset || assets?.length > 0) && <Button variant="nav" size="sm" iconLeft="image" onClick={attach} aria-pressed={picking}>Attach</Button>}
            {!isNew && value !== base && value != null && <Button variant="nav" size="sm" onClick={revert}>Revert</Button>}
            <Button variant="secondary" size="sm" onClick={save} disabled={!dirty}>{isNew ? 'Create' : 'Save'}</Button>
          </span>
        )}>
        {/* the window's own caps, inline — Tailwind does not generate arbitrary values from package source */}
        <div className="kol-doc-editor flex flex-col" style={inline ? { width: '100%', height: '100%' } : { width: 'min(1200px, var(--kol-ql-max-w))', height: 'min(760px, var(--kol-ql-media-h))' }}>
          {isNew && (
            <div className="flex flex-wrap items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--kol-oq-08)' }}>
              <Input variant="filled" size="sm" value={name} aria-label="File name" placeholder="File name"
                onChange={(e) => rename(e.target.value)} className="min-w-0 flex-1" />
              <ViewToggle variant="text" viewMode={type} options={TYPES.map(({ value: v, label }) => ({ value: v, label }))}
                onViewChange={(t) => { setType(t); const s = STARTER[t](name); setValue(s); latest.current = s; setView(t === 'md' ? 'split' : 'write') }} />
            </div>
          )}
          <div className="flex flex-1 min-h-0">
            {view !== 'preview' && (
              <div ref={bodyRef} className="flex flex-col gap-4 p-4 min-w-0 overflow-y-auto" style={{ flex: '1 1 0' }}>
                {md && parts && <FieldsForm fields={parts.fields} onChange={setFields} />}
                {picking && (
                  <div className="flex flex-col gap-2 border rounded p-2" style={{ borderColor: 'var(--kol-oq-08)' }}>
                    <Input variant="filled" size="xs" value={pickQuery} placeholder="Find a file to attach" aria-label="Find a file to attach"
                      onChange={(e) => setPickQuery(e.target.value)} autoFocus />
                    <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 200 }}>
                      {pickList.length === 0 && <span className="kol-mono-12 text-fg-48 p-2">No file matches.</span>}
                      {pickList.map((a) => (
                        <button key={a.key} type="button" onClick={() => insertAsset(a)}
                          className="kol-mono-12 text-left px-2 py-1 rounded text-fg-default hover:bg-oq-04 truncate">{a.key}</button>
                      ))}
                    </div>
                  </div>
                )}
                {value == null
                  ? <p className="kol-mono-12 text-fg-48">Loading…</p>
                  : <Textarea variant="filled" size="md" rows={18} axis="vertical" className="w-full flex-1 kol-mono-12"
                      value={md ? parts.body : value} onChange={(e) => (md ? setBody(e.target.value) : change(e.target.value))}
                      spellCheck={kind === 'markdown' || kind === 'text'} aria-label="Document text"
                      placeholder={md ? 'Write in markdown — # heading, **bold**, - list' : ''} />}
              </div>
            )}
            {view !== 'write' && (
              <div className="p-4 min-w-0 overflow-auto border-l" style={{ flex: '1 1 0', borderColor: 'var(--kol-oq-08)' }}>
                {preview}
              </div>
            )}
          </div>
        </div>
      </QuickLookFrame>
  )
  return inline ? frame : <FullscreenOverlay open onClose={close} closeButton={false} scrim>{frame}</FullscreenOverlay>
}

/* THE FRONTMATTER AS FIELDS. One row per key; a list value (tags) is typed comma-separated. The
 * suggested keys a document has not got yet are one click away; any other key is typed. */
function FieldsForm({ fields, onChange }) {
  const set = (i, key, v) => onChange(fields.map((f, j) => (j === i ? [key, v] : f)))
  const missing = SUGGESTED.filter((s) => !fields.some(([k]) => k.toLowerCase() === s))
  return (
    <div className="flex flex-col gap-2">
      <span className="kol-mono-12 text-fg-48">Fields</span>
      {fields.map(([key, v], i) => (
        <div key={i} className="flex items-center gap-2">
          <Input variant="filled" size="xs" value={key} aria-label="Field name" className="w-28 shrink-0"
            onChange={(e) => set(i, e.target.value, v)} />
          {Array.isArray(v) || key.toLowerCase() === 'tags' ? (
            /* a list commits on Enter / blur — re-deriving it per keystroke would eat the comma you just typed */
            <Input variant="filled" size="xs" className="flex-1 min-w-0" aria-label={`${key || 'Field'} value`}
              value={Array.isArray(v) ? v.join(', ') : v} placeholder="comma, separated"
              onCommit={(raw) => set(i, key, raw.split(',').map((t) => t.trim()).filter(Boolean))} />
          ) : (
            <Input variant="filled" size="xs" className="flex-1 min-w-0" aria-label={`${key || 'Field'} value`}
              value={v} onChange={(e) => set(i, key, e.target.value)} />
          )}
          <Button variant="nav" size="xs" iconOnly="x" aria-label={`Remove ${key}`} onClick={() => onChange(fields.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-1">
        {missing.map((s) => (
          <Button key={s} variant="nav" size="xs" iconLeft="plus" onClick={() => onChange([...fields, [s, s === 'tags' ? [] : s === 'date' ? today() : '']])}>{s}</Button>
        ))}
        <Button variant="nav" size="xs" iconLeft="plus" onClick={() => onChange([...fields, ['', '']])}>Field</Button>
      </div>
    </div>
  )
}
