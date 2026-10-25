import { createContext, useContext } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import ActionButton from './ActionButton.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { useModal } from './Modal.jsx'
import formatSize from '../utilities/formatSize.js'

/**
 * The `app` variant of ContentCard and ContentRow (CatalogAppVariant, kol-fxr 2026-10-23): kol-fxr's
 * approved saved-file card, so every app's library takes it by a bump. It is the `file` card and row
 * with the parts slotted — download on the cover, a cog over a trash in the plate, Rename, Duplicate and
 * Delete on right-click. The consumer passes raw writes (`verbs`); the dialogs are asked here. A verb not
 * passed is not drawn. The card's text is the file's — title, then date and size — and nothing else
 * (user ruling 2026-10-23: the `meta` line of 0.292.0 was never designed for and broke the plate).
 *
 * THE COG OPENS THE FILE'S RAIL (user ruling 2026-10-23: *"if each card/project had a settings/info
 * maybe an overlay or siderail then you could have edit tags there, along with much more metadata"* —
 * the side rail, ruled): name, tags, `details` `[{ label, value }]` and the verbs, on the settings drawer
 * (studio-hub review 2, § 2.1). The card is an access point; the rail is where the file's information
 * lives. Right-click keeps the one context menu.
 *
 * Both are ONE per page: `AppItemMenuProvider` (organisms/AppItemMenuProvider.jsx — the drawer is an
 * organism, so the provider lives there; CatalogPage mounts it) reads `MenuCtx` from here, and every app
 * card and row opens them. Without a provider the card still draws download and trash, but no cog, no
 * rail and no right-click menu.
 */

export const MenuCtx = createContext(null)

export const useAsk = () => {
  const modal = useModal()
  return {
    rename: async (name, verbs) => {
      const next = await modal.prompt('Rename:', name ?? '')
      if (next != null && next.trim() && next.trim() !== name) verbs.rename(next.trim())
    },
    /* returns whether it happened — the rail closes on a confirmed delete */
    remove: async (name, verbs) => {
      const ok = await modal.confirm(`Delete “${name || 'Untitled'}”?`, { okLabel: 'Delete' })
      if (ok) verbs.remove()
      return ok
    },
  }
}

export const glyph = (name) => <Icon name={name} size={14} />

/* the plate's two actions, stacked over its padded height; a plate press never opens the card */
function AppPlate({ name, verbs, onSettings }) {
  const ask = useAsk()
  return (
    <div className="flex h-full flex-col items-center justify-between" onClick={(e) => e.stopPropagation()}>
      {onSettings && <ActionButton chrome="inline" size="sm" icon="settings-01" confirmIcon="settings-01" label="Settings" onAction={onSettings} />}
      {verbs?.remove && <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="trash" label="Delete" onAction={() => ask.remove(name, verbs)} />}
    </div>
  )
}

const placeholder = (
  <div className="size-full flex items-center justify-center bg-oq-04 text-oq-24" aria-label="No preview yet">
    <Icon name="image" size={24} />
  </div>
)

/**
 * useAppItem(variant, props) — the `file` props an `app` item draws with, or null for any other variant.
 * `tags`, `details`, `onTags`, `note` and `onNote` go to the rail, never to the card; `mark` `{ icon, label, of? }` marks the
 * cover's other corner and reads in the rail. Always runs the same hooks (one
 * context read), so ContentCard / ContentRow call it unconditionally.
 */
export function useAppItem(variant, { title, verbs, download, menuItems, date, size, media, back, tone, tags, details, onTags, note, onNote, mark, onCover, onInsert, images, onImages, onBack, row = false }) {
  const ctx = useContext(MenuCtx)
  if (variant !== 'app') return null
  const menu = ctx?.menu
  const hasMenu = !!menu && !!(verbs?.rename || verbs?.duplicate || verbs?.remove || menuItems)
  const openMenu = hasMenu ? (e) => menu.openAt(e, { name: title, verbs, menuItems }) : undefined
  /* the card's date and size, as text — the rail prints the same two under Details (user 2026-10-24: *"why is date
   * and size not included in file info?"*) */
  const dateText = typeof date === 'number' ? new Date(date).toISOString().slice(0, 10) : date
  const sizeText = typeof size === 'number' ? formatSize(size) : size
  /* the cog opens the file's info rail (user ruling 2026-10-23); right-click keeps the menu. `onCover(src)` is the
   * rail's Upload image (2026-10-24), or the Cover pick when the file carries `images` (FileRailImages): the rail's
   * Files section reads the card's own cover and back srcs for its marks, so both go along as strings */
  const openInfo = ctx ? () => ctx.openInfo({
    name: title, verbs, download, tags, details, onTags, note, onNote, mark, date: dateText, size: sizeText, onCover,
    images, onImages, onBack, cover: typeof media === 'string' ? media : undefined, back: typeof back === 'string' ? back : undefined,
  }) : undefined
  /* the cover's download stops its click at the control, as the plate does — a card that opens on click
   * opened under the download too (AppCardDownloadClickBubbles, kol-monitor 2026-10-23) */
  return {
    tone: tone ?? 'secondary',
    date: dateText,
    size: sizeText,
    media: typeof media === 'string' ? <img src={media} alt={title ?? ''} className="size-full object-cover" /> : media ?? placeholder,
    control: download ? <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={(e) => { e?.stopPropagation(); return download(e) }} /> : undefined,
    /* THE MARK (user 2026-10-24, FXR's files: *"show together with a label on the card … an icon of each chrome as an
     * indicator"*): the cover's other corner, in THE DOWNLOAD'S BOX — `.kol-media-control`, 32 square, the oq-12 plate,
     * the 20 glyph at its rest scale (user 2026-10-24: *"why would the indicator of chrome in the cards not be the same
     * size as the other icon frame"* — it was an IconFrame sm, 26). Not a button: a mark reads, it does nothing.
     * A color per mark is a visual call for the open-questions page, not this file's. */
    controlStart: mark?.icon ? (
      <Tooltip label={mark.label}>
        <span className="kol-media-control" role="img" aria-label={mark.label} style={{ cursor: 'default' }}>
          <span className="kol-action-glyph inline-grid place-items-center" style={{ width: 20, height: 20 }}><Icon name={mark.icon} size={20} /></span>
        </span>
      </Tooltip>
    /* INSERT ON A CARD (StudioCreate's parts, 2026-10-24 — every card the same fields and icons, so a part keeps its plate):
     * the cover's other corner, in the download's box — a mark and Insert never meet (a part carries no mark) */
    ) : onInsert && !row ? (
      <ActionButton chrome="media" icon="plus" confirmIcon="check" label="Insert" confirmLabel="Inserted" onAction={(e) => { e?.stopPropagation(); return onInsert(e) }} />
    ) : undefined,
    /* the plate — cog over trash; on a row, Insert sits before the plate (the row has no cover corner to spare) */
    actions: openInfo || verbs?.remove || (onInsert && row) ? (
      <div className="flex h-full items-stretch gap-2">
        {onInsert && row && <div className="flex items-center" onClick={(e) => e.stopPropagation()}><ActionButton chrome="inline" size="sm" icon="plus" confirmIcon="check" label="Insert" confirmLabel="Inserted" onAction={(e) => { e?.stopPropagation(); return onInsert(e) }} /></div>}
        {(openInfo || verbs?.remove) && <AppPlate name={title} verbs={verbs} onSettings={openInfo} />}
      </div>
    ) : undefined,
    onContextMenu: openMenu,
  }
}
