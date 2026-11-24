import { useEffect, useRef, useState } from 'react'
import { isTyping, layerFamily, matchCombo, useComposeState } from '../engine.js'
import { createFolder, DRAFTS, KEEP_DEFAULT, keepOf, listFolders, placeOf, usePlaces } from '../../files/places.js'
import { useFileVerbs } from '../../files/useFileVerbs.js'
import { askPrompt } from '../../ui/ask.js'
import { Button, Dropdown, Input, LabeledControl, ModalDialog, ToggleCheckbox } from '@kolkrabbi/kol-component'

/* SAVE AS (plan-2026-11-19-kolbox-whats-left C8, W30.3): a small window in the family of the others (ModalDialog kolbox,
   movable by its header, Cancel and the primary at its foot). The name; where it goes (a folder on Home, Drafts by
   default, or a new folder made here); what is kept with it: its media (photos written into the file as data, so they
   open on any machine) and its theme (the palette; off, the file opens in whatever palette is current). Fonts are a
   line, not a choice: every face the editor sets ships with KOL, so a file always opens with its fonts.
   Opened by File › Save as…, the file name's menu, ⇧⌘S, and Save on a file never saved (⌘S too). */
const NEW = '__new'

function Keep({ label, hint, checked, onChange }) {
  return (
    <label className="flex min-w-0 cursor-pointer items-start gap-2" data-keep={label}>
      <ToggleCheckbox variant="kolbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className="text-label text-text">{label}</span>
        <span className="text-help text-muted">{hint}</span>
      </span>
    </label>
  )
}

function fontsOf(layers) {
  const out = new Set()
  const walk = (ls) => (ls ?? []).forEach((l) => { if (l.type === 'text' || l.type === 'kinetic') { const f = layerFamily(l); if (f) out.add(f) } walk(l.children) })
  walk(layers)
  return [...out]
}

export default function WindowSaveAs({ onClose }) {
  const { layers, currentPresetId, currentPresetName } = useComposeState()
  const { saveAs } = useFileVerbs()
  usePlaces()
  const [name, setName] = useState(currentPresetName ? `${currentPresetName} copy` : '')
  const [folder, setFolder] = useState(currentPresetId ? placeOf(currentPresetId) : DRAFTS.id)
  const [keep, setKeep] = useState(currentPresetId ? keepOf(currentPresetId) : KEEP_DEFAULT)
  const [busy, setBusy] = useState(false)
  const fonts = fontsOf(layers)
  const folders = [...listFolders().map((f) => ({ value: f.id, label: f.name })), { value: NEW, label: 'New folder…' }]

  const pick = async (v) => {
    if (v !== NEW) { setFolder(v); return }
    const n = (await askPrompt({ title: 'New folder', value: '', placeholder: 'Folder name', action: 'Create' }))?.trim()
    if (n) setFolder(createFolder(n))
  }
  const submit = async () => {
    if (busy) return
    setBusy(true)
    try { if (await saveAs({ name, folder, keep })) onClose() } finally { setBusy(false) }
  }

  return (
    <ModalDialog variant="kolbox"
      open
      movable="save-as"
      onClose={onClose}
      title="Save as"
      footer={(
        <>
          <span className="flex-1" />
          <Button variant="kolbox" onClick={onClose}>Cancel</Button>
          <Button variant="kolbox" tone="primary" disabled={busy} onClick={submit}>Save</Button>
        </>
      )}
    >
      <form className="flex flex-col gap-4 px-4 pb-4" data-window="save-as" onSubmit={(e) => { e.preventDefault(); submit() }}>
        <LabeledControl variant="kolbox" label="Name">
          <Input variant="kolbox" aria-label="Name" placeholder="Untitled" value={name} onChange={(e) => setName(e.target.value)} autoFocus className="w-full" />
        </LabeledControl>
        <LabeledControl variant="kolbox" label="Location">
          <Dropdown variant="kolbox" ariaLabel="Location" options={folders} value={folder} onChange={pick} className="w-full" />
        </LabeledControl>
        <div className="flex flex-col gap-3" data-keeps>
          <span className="text-label text-muted">Keep with the file</span>
          <Keep label="Media" hint="Photos and video clips are written into the file, so it opens anywhere." checked={keep.media} onChange={(v) => setKeep((k) => ({ ...k, media: v }))} />
          <Keep label="Theme" hint="The palette travels with the file. Off, it opens in the current palette." checked={keep.theme} onChange={(v) => setKeep((k) => ({ ...k, theme: v }))} />
          <p className="text-help text-muted" data-keep="Fonts">
            {fonts.length ? `Fonts: ${fonts.join(', ')}. They ship with KOL, so the file always opens with them.` : 'Fonts: no text in this file.'}
          </p>
        </div>
        <button type="submit" hidden />
      </form>
    </ModalDialog>
  )
}

/* the host: open on `kolbox:save-as`. The keys are the one model's, caught on the capture phase before the engine's own
   (its Files window and its name prompt): ⇧⌘S opens this window, ⌘S saves (a file never saved opens this window) */
export function SaveAsHost() {
  const [open, setOpen] = useState(false)
  const { save } = useFileVerbs()
  const saveRef = useRef(save); saveRef.current = save
  useEffect(() => {
    const on = () => setOpen(true)
    const onKey = (e) => {
      if (isTyping(e) || e.repeat) return
      const as = matchCombo(e, 'Mod+Shift+S')
      if (!as && !matchCombo(e, 'Mod+S')) return
      e.preventDefault(); e.stopImmediatePropagation()
      if (as) setOpen(true); else saveRef.current()
    }
    window.addEventListener('kolbox:save-as', on)
    window.addEventListener('keydown', onKey, true)
    return () => { window.removeEventListener('kolbox:save-as', on); window.removeEventListener('keydown', onKey, true) }
  }, [])
  return open && <WindowSaveAs onClose={() => setOpen(false)} />
}
