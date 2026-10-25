import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { MenuCtx, useAsk, glyph } from '../molecules/AppItem.jsx'
import ContextMenu, { useContextMenu } from '../molecules/ContextMenu.jsx'
import { MenuDropdownItem } from '../molecules/MenuItem.jsx'
import ActionButton from '../molecules/ActionButton.jsx'
import Tag from '../atoms/Tag.jsx'
import Input from '../atoms/Input.jsx'
import Textarea from '../atoms/Textarea.jsx'
import IconFrame from '../atoms/IconFrame.jsx'
import Button from '../atoms/Button.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { pickImage } from '../utilities/imageToDataUrl.js'
import SettingsPanel, { SettingsFooter, LabeledControlSection } from './SettingsPanel.jsx'
import SettingsSections from './SettingsSections.jsx'
import { MediaInspector } from './MediaLibraryPages.jsx'

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
 *
 * FILES (FileRailImages, kol-monitor 2026-10-24 — user: *"it should show images associated with file … literally the
 * files that you could click and view with quicklook (like media) and you can remove them and upload new … You would
 * rather click/select which file or files go to thumbnail"*): a file that carries `images` `[{ id, src, label? }]` gets
 * a FILES section between the fields and Details — the images as square thumbnails, two across; a click opens them in
 * `MediaInspector`, the quicklook apps/media uses. Edit mode adds × on each and an Upload tile (the DS picker), both
 * writing `onImages(next)` — the WHOLE list, the rail naming a new image's id, so the consumer stores it and reads
 * nothing back (the item is a snapshot; add / remove by id would have the consumer's handler closing over a stale
 * file) — and the cover is PICKED, not uploaded: Cover and Back on each caption (`onCover(src)` · `onBack(src)`, the
 * picked image's src — one argument type, the one `onCover` always took; `null` when the image that was it is removed),
 * the marks reading which image is which from the card's own `media` and `back`. With `images`, the Cover row's Upload
 * image goes (the tile is the upload); without `images`, the rail is as it was. Storage is the consumer's.
 * THE PENCIL IS A FOOT VERB (same ticket: *"the edit icon should move to the bottom row next to download duplicate and
 * trash icons"*): it leads the foot row's verbs; the header keeps only the ×.
 */
/* the quicklook's file shape over an image: a key with the right extension (the inspector reads the kind off it),
 * the label as its name, the mime from a data URL when there is one */
const extOfSrc = (src = '') => {
  const m = /^data:image\/([a-z0-9+.-]+)/i.exec(src)
  if (m) return m[1] === 'svg+xml' ? 'svg' : m[1]
  const base = src.split(/[?#]/)[0].split('/').pop() ?? ''
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : 'png'
}
const EMPTY_KEYS = new Set()

/* the FILES section — thumbnails, quicklook, and in edit mode remove · upload · the Cover and Back picks */
function FileImages({ images, cover, back, editing, onImages, onCover, onBack }) {
  const [look, setLook] = useState(null)
  /* DRAFTS, as the tags and the note keep theirs: the item is a snapshot taken when the rail opened, so the list, the
   * cover and the back the rail shows are its own until the next open; every change is written out the same moment */
  const [draft, setDraft] = useState(images)
  const [dCover, setDCover] = useState(cover)
  const [dBack, setDBack] = useState(back)
  const files = draft.map((img, i) => ({ key: `${img.id}.${extOfSrc(img.src)}`, displayName: img.label ?? `Image ${i + 1}`, contentType: `image/${extOfSrc(img.src) === 'svg' ? 'svg+xml' : extOfSrc(img.src)}` }))
  const srcOf = Object.fromEntries(draft.map((img, i) => [files[i].key, img.src]))
  const canEdit = editing && !!onImages
  if (!draft.length && !canEdit) return null
  const step = (d) => setLook((i) => (i + d + draft.length) % draft.length)
  const setImages = (next) => { setDraft(next); onImages(next) }
  const pickCover = (src) => { setDCover(src); onCover?.(src) }
  const pickBack = (src) => { setDBack(src); onBack?.(src) }
  /* a removed image that was the cover or the back clears it — `null` to the consumer, the placeholder on the card */
  const remove = (img) => {
    setImages(draft.filter((x) => x.id !== img.id))
    if (dCover === img.src) pickCover(null)
    if (dBack === img.src) pickBack(null)
  }
  const add = async () => { const src = await pickImage(); if (src) setImages([...draft, { id: `img-${Date.now().toString(36)}`, src, label: `Image ${draft.length + 1}` }]) }
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {draft.map((img, i) => {
          const isCover = !!dCover && img.src === dCover
          const isBack = !!dBack && img.src === dBack
          const label = img.label ?? `Image ${i + 1}`
          const role = [isCover && 'Cover', isBack && 'Back'].filter(Boolean).join(', ')
          return (
            <figure key={img.id} className="flex min-w-0 flex-col gap-1.5">
              <div className="relative">
                <button type="button" className="block aspect-square w-full overflow-hidden rounded-[var(--kol-radius-sm)] bg-fg-04" onClick={() => setLook(i)} aria-label={`Open ${label}`}>
                  <img src={img.src} alt="" className="size-full object-cover" style={{ objectPosition: 'var(--kol-media-focus, center)' }} />
                </button>
                {/* the × in the card's own media-corner chrome (the download's plate), so it reads on a dark picture —
                  * a bare xs glyph vanished on the rack screenshots */}
                {canEdit && (
                  <div className="kol-frame-control">
                    <ActionButton chrome="media" icon="x" confirmIcon="x" label={`Remove ${label}`} onAction={() => remove(img)} />
                  </div>
                )}
              </div>
              <figcaption className="kol-mono-12 flex items-center justify-between gap-2">
                <span className="truncate text-body">{label}</span>
                {editing && (onCover || onBack) ? (
                  <span className="flex shrink-0 gap-1">
                    {onCover && <Button size="xs" tone="grey" pressed={isCover} onClick={() => pickCover(img.src)} aria-label={`Use ${label} as cover`}>Cover</Button>}
                    {onBack && <Button size="xs" tone="grey" pressed={isBack} onClick={() => pickBack(img.src)} aria-label={`Use ${label} as back`}>Back</Button>}
                  </span>
                ) : role ? <span className="shrink-0 text-meta">{role}</span> : null}
              </figcaption>
            </figure>
          )
        })}
        {canEdit && (
          <figure className="flex min-w-0 flex-col gap-1.5">
            <button type="button" onClick={add} aria-label="Upload image"
              className="flex aspect-square w-full items-center justify-center rounded-[var(--kol-radius-sm)] border border-dashed border-[var(--kol-fg-24)] bg-[var(--kol-fg-02)] text-fg-48">
              <Icon name="plus" size={20} />
            </button>
            <figcaption className="kol-mono-12 text-meta">Upload image</figcaption>
          </figure>
        )}
      </div>
      {/* PORTALLED to the body: the rail slides in on a transform, which makes it the containing block of any fixed
        * descendant — rendered in place, the quicklook's full-screen overlay was clipped to the rail's 380 column */}
      {look != null && draft[look] && createPortal(
        <MediaInspector files={files} index={look} onClose={() => setLook(null)} onPrev={() => step(-1)} onNext={() => step(1)}
          mediaUrl={(k) => srcOf[k]} downloadUrl={(k) => srcOf[k]} keySet={EMPTY_KEYS} showNav={draft.length > 1} />,
        document.body,
      )}
    </>
  )
}

/* the rail's body — READ MODE by default, the header's pencil opens EDIT MODE (user 2026-10-23: *"use the same edit icon
 * from create? to edit mode or read mode?"*): read shows the name, the tag chips and the note as text; edit swaps in the
 * Input, the chips with × over the add-a-tag Input, and the note's Textarea. Drafts are the rail's own, so what you typed
 * stays while the consumer's state catches up. ONE row per field, no section label over a lone row of the same name
 * (user 2026-10-23: the rail read NAME / NAME, TAGS / TAGS / ADD). */
function FileRailBody({ item, editing, onRenamed }) {
  const { name, verbs, tags, details, note, onTags, onNote, mark, date, size, onCover, images, cover, back, onImages, onBack } = item
  const hasImages = Array.isArray(images)
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
    /* edit mode, a file with no `images`: the cover — Upload image hands the DS picker's data URL to `onCover`
     * (2026-10-24); with `images` the Files section's tile is the upload and the cover is a pick */
    ...((editing && onCover && !hasImages) ? [{ label: 'Cover', align: 'fill', render: () => (
      <Button size="sm" tone="grey" onClick={async () => { const src = await pickImage(); if (src) onCover(src) }}>Upload image</Button>
    ) }] : []),
  ]
  const detailSections = [
    ...((date || size || mark || details?.length) ? [{ label: 'Details', rows: [
      /* the card's own date and size first (user 2026-10-24) */
      ...(date ? [{ label: 'Date', text: true, value: text(date) }] : []),
      ...(size ? [{ label: 'Size', text: true, value: text(size) }] : []),
      /* then the mark — FXR's chrome: Chrome, Editor (`of` names the axis; `label` the value) */
      ...(mark ? [{ label: mark.of ?? 'Kind', text: true, value: text(mark.label) }] : []),
      ...(details ?? []).map(({ label, value }) => ({ label, text: true, value: text(value) })),
    ] }] : []),
  ]
  /* the fields, then FILES (a file with `images`), then Details — one stack, the sections' gap and hairlines */
  const filesNode = hasImages ? <FileImages images={images} cover={cover} back={back} editing={editing} onImages={onImages} onCover={onCover} onBack={onBack} /> : null
  return (
    <div className="flex flex-col gap-6">
      <SettingsSections sections={[{ rows }]} divided />
      {filesNode && <LabeledControlSection label="Files" divided>{filesNode}</LabeledControlSection>}
      {detailSections.length > 0 && <SettingsSections sections={detailSections} divided />}
    </div>
  )
}

/* the foot: SettingsFooter's row — the pencil (edit · done) leading download, duplicate and delete, four icon buttons in
 * reset's control (the pencil moved here from the header line, FileRailImages 2026-10-24) */
function fileRailFoot(item, ask, onClose, edit) {
  const { name, verbs, download } = item
  if (!(edit || download || verbs?.duplicate || verbs?.remove)) return undefined
  const verb = (icon, label, onClick) => (
    <Tooltip label={label}><IconFrame name={icon} variant="nav" size="sm" onClick={onClick} aria-label={label} /></Tooltip>
  )
  return (
    <SettingsFooter>
      {edit && verb('edit', edit.editing ? 'Done editing' : 'Edit', edit.toggle)}
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
  const editable = !!(info?.verbs?.rename || info?.onTags || info?.onNote || info?.onCover || info?.onImages || info?.onBack)
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
        open={!!info} variant="rail" title="File" onClose={close}
        /* the pencil leads the foot row (FileRailImages 2026-10-24) — bare, the rows' `sm` frame (26), as the other verbs;
         * the header keeps only the × */
        footer={info ? fileRailFoot(info, ask, close, editable ? { editing, toggle: () => setEditing((v) => !v) } : null) : undefined}
      >
        {/* `key` resets the drafts per file */}
        {info && <FileRailBody key={info.openId} item={info} editing={editing} onRenamed={(name) => setInfo((i) => i && { ...i, name })} />}
      </SettingsPanel>
    </MenuCtx.Provider>
  )
}
