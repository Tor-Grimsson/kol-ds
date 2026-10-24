import { useState } from 'react'
import { MenuCtx, useAsk, glyph } from '../molecules/AppItem.jsx'
import ContextMenu, { useContextMenu } from '../molecules/ContextMenu.jsx'
import { MenuDropdownItem } from '../molecules/MenuItem.jsx'
import Tag from '../atoms/Tag.jsx'
import Input from '../atoms/Input.jsx'
import Textarea from '../atoms/Textarea.jsx'
import IconFrame from '../atoms/IconFrame.jsx'
import Button from '../atoms/Button.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { pickImage } from '../utilities/imageToDataUrl.js'
import SettingsPanel, { SettingsFooter } from './SettingsPanel.jsx'
import SettingsSections from './SettingsSections.jsx'

/**
 * AppItemMenuProvider — One menu and one file rail. the page's ONE right-click menu and ONE file
 * rail for every `app` card and row (AppItem.jsx). CatalogPage and HubHome mount it.
 *
 * THE FILE RAIL IS THE SETTINGS DRAWER (studio-hub review 2, § 2.1 — user: *"why is there border on the siderail? …
 * rethink this entire siderail based on settings rail and based on labs rail, convention, standards, padding,
 * width"*). It was a bare `Rail` with `backdrop={false}` (hence the edge) and its own section labels and buttons;
 * it is now `SettingsPanel variant="rail" title="File"` — the drawer the settings gear opens, 380 wide, the scrim, no
 * edge, the header row with its × — holding `SettingsSections divided`: Name (an `Input` committing through
 * `verbs.rename` on Enter or blur), Tags (the chips with ×, then the add-a-tag `Input`, both through `onTags`),
 * Details (one row per `{ label, value }`). The foot is `SettingsFooter` with three icon buttons in reset's control —
 * download, duplicate, delete; Delete confirms through `useModal`. It lives here, an organism, because the drawer is
 * one; the card and row keep reading the context from the molecule.
 *
 * READ AND EDIT (user 2026-10-23): the rail opens read-only — name, tags, note, details as text — and the pencil on its
 * header line (Create's rename glyph, `IconFrame nav`) toggles edit mode. `note` / `onNote` arrived the same day: a plain
 * description on a file, HubHome's `note` and `onNote(file, text)`.
 *
 * DATE · SIZE · COVER (user 2026-10-24: *"why is date and size not included in file info? same with upload image?"* ·
 * *"why is edit 32px icon when others are 26px??"*): Details opens with the card's own Date and Size; in edit mode a
 * Cover row offers Upload image — the DS picker, a webp data URL, handed to the file's `onCover(src)` (HubHome's
 * `onCover(file, src)`); and the pencil is the rows' `sm` frame (26), as the × beside it.
 */
/* the rail's body — READ MODE by default, the header's pencil opens EDIT MODE (user 2026-10-23: *"use the same edit icon
 * from create? to edit mode or read mode?"*): read shows the name, the tag chips and the note as text; edit swaps in the
 * Input, the chips with × over the add-a-tag Input, and the note's Textarea. Drafts are the rail's own, so what you typed
 * stays while the consumer's state catches up. ONE row per field, no section label over a lone row of the same name
 * (user 2026-10-23: the rail read NAME / NAME, TAGS / TAGS / ADD). */
function FileRailBody({ item, editing, onRenamed }) {
  const { name, verbs, tags, details, note, onTags, onNote, mark, date, size, onCover } = item
  const [draftName, setDraftName] = useState(name ?? '')
  const [draftTags, setDraftTags] = useState(tags ?? [])
  const [newTag, setNewTag] = useState('')
  const [draftNote, setDraftNote] = useState(note ?? '')
  const commitName = (v) => {
    const next = (v ?? draftName).trim()
    if (next && next !== name && verbs?.rename) { verbs.rename(next); onRenamed?.(next) }
  }
  const setTags = (next) => { setDraftTags(next); onTags?.(next) }
  const addTag = (v) => {
    const t = (v ?? newTag).trim()
    if (t && !draftTags.includes(t)) setTags([...draftTags, t])
    setNewTag('')
  }
  const commitNote = () => { const next = draftNote.trim(); if (next !== (note ?? '').trim()) onNote?.(next) }
  const editName = editing && !!verbs?.rename
  const editTags = editing && !!onTags
  const editNote = editing && !!onNote
  const text = (v, cls = '') => <span className={`kol-mono-12 text-body ${cls}`.trim()}>{v}</span>
  /* READ MODE RIGHT-ALIGNS (user 2026-10-24: *"why is tags in the middle"*): every value — the name, the tag chips, the
   * note — sits on the value column's right edge, as a text row does; in edit mode the rows fill with their controls */
  const rows = [
    editName
      ? { label: 'Name', align: 'fill', render: () => <Input size="sm" className="w-full" value={draftName} onChange={(e) => setDraftName(e.target.value)} onCommit={commitName} aria-label="Name" /> }
      : { label: 'Name', text: true, value: text(name, 'truncate') },
    ...((editTags || draftTags.length > 0) ? [editTags
      ? { label: 'Tags', align: 'fill', render: () => (
        <div className="flex w-full flex-col gap-2">
          {draftTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draftTags.map((t) => <Tag key={t} size="sm" hash={false} onRemove={() => setTags(draftTags.filter((x) => x !== t))}>{t}</Tag>)}
            </div>
          )}
          <Input size="sm" className="w-full" placeholder="Add a tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} onCommit={addTag} aria-label="Add a tag" />
        </div>
      ) }
      : { label: 'Tags', text: true, value: (
        <span className="flex flex-wrap justify-end gap-2">
          {draftTags.map((t) => <Tag key={t} size="sm" hash={false}>{t}</Tag>)}
        </span>
      ) }] : []),
    /* read mode shows the DRAFT, as the tags do — the item is a snapshot, so a note just committed would read stale */
    ...((editNote || draftNote.trim()) ? [editNote
      ? { label: 'Note', align: 'fill', render: () => <Textarea size="sm" rows={3} value={draftNote} onChange={(e) => setDraftNote(e.target.value)} onBlur={commitNote} placeholder="Add a note" aria-label="Note" /> }
      : { label: 'Note', text: true, value: text(draftNote.trim(), 'text-right') }] : []),
    /* edit mode: the cover — Upload image hands the DS picker's data URL to `onCover` (2026-10-24) */
    ...((editing && onCover) ? [{ label: 'Cover', align: 'fill', render: () => (
      <Button size="sm" tone="grey" onClick={async () => { const src = await pickImage(); if (src) onCover(src) }}>Upload image</Button>
    ) }] : []),
  ]
  const sections = [
    { rows },
    ...((date || size || mark || details?.length) ? [{ label: 'Details', rows: [
      /* the card's own date and size first (user 2026-10-24) */
      ...(date ? [{ label: 'Date', text: true, value: text(date) }] : []),
      ...(size ? [{ label: 'Size', text: true, value: text(size) }] : []),
      /* then the mark — FXR's chrome: Chrome, Editor (`of` names the axis; `label` the value) */
      ...(mark ? [{ label: mark.of ?? 'Kind', text: true, value: text(mark.label) }] : []),
      ...(details ?? []).map(({ label, value }) => ({ label, text: true, value: text(value) })),
    ] }] : []),
  ]
  return <SettingsSections sections={sections} divided />
}

/* the foot: SettingsFooter's row, three icon buttons in reset's control */
function fileRailFoot(item, ask, onClose) {
  const { name, verbs, download } = item
  if (!(download || verbs?.duplicate || verbs?.remove)) return undefined
  const verb = (icon, label, onClick) => (
    <Tooltip label={label}><IconFrame name={icon} variant="nav" size="sm" onClick={onClick} aria-label={label} /></Tooltip>
  )
  return (
    <SettingsFooter>
      {download && verb('download', 'Download', download)}
      {verbs?.duplicate && verb('copy', 'Duplicate', verbs.duplicate)}
      {verbs?.remove && verb('trash', 'Delete', async () => { if (await ask.remove(name, verbs)) onClose() })}
    </SettingsFooter>
  )
}

export default function AppItemMenuProvider({ children }) {
  const menu = useContextMenu()
  const ask = useAsk()
  /* the file whose rail is open — a snapshot of its handlers; the rail keeps its own drafts */
  const [info, setInfo] = useState(null)
  const [editing, setEditing] = useState(false)
  const close = () => setInfo(null)
  const editable = !!(info?.verbs?.rename || info?.onTags || info?.onNote || info?.onCover)
  return (
    /* each open is stamped, so the rail keeps its drafts across a rename (the key no longer follows the name) and the
     * foot's Delete confirm names the file as renamed, not as opened */
    <MenuCtx.Provider value={{ menu, openInfo: (item) => { setEditing(false); setInfo(item && { ...item, openId: Date.now() }) } }}>
      {children}
      <ContextMenu menu={menu}>
        {(item) => item && (
          <>
            {item.verbs?.rename && <MenuDropdownItem iconLeft={glyph('edit')} onClick={() => ask.rename(item.name, item.verbs)}>Rename</MenuDropdownItem>}
            {item.verbs?.duplicate && <MenuDropdownItem iconLeft={glyph('copy')} onClick={item.verbs.duplicate}>Duplicate</MenuDropdownItem>}
            {item.verbs?.remove && <MenuDropdownItem iconLeft={glyph('trash')} onClick={() => ask.remove(item.name, item.verbs)}>Delete</MenuDropdownItem>}
            {item.menuItems}
          </>
        )}
      </ContextMenu>
      <SettingsPanel
        open={!!info} variant="rail" title="File" onClose={close} footer={info ? fileRailFoot(info, ask, close) : undefined}
        /* the pencil — bare, as Create's rename is; the rows' `sm` frame (26), the same box as the × beside it (user
         * 2026-10-24: *"why is edit 32px icon when others are 26px??"*) */
        headerActions={editable ? <IconFrame name="edit" variant="nav" size="sm" onClick={() => setEditing((v) => !v)} aria-label={editing ? 'Done editing' : 'Edit'} /> : undefined}
      >
        {/* `key` resets the drafts per file */}
        {info && <FileRailBody key={info.openId} item={info} editing={editing} onRenamed={(name) => setInfo((i) => i && { ...i, name })} />}
      </SettingsPanel>
    </MenuCtx.Provider>
  )
}
