import { createContext, useContext } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import ActionButton from './ActionButton.jsx'
import ContextMenu, { useContextMenu } from './ContextMenu.jsx'
import { MenuDropdownItem } from './MenuItem.jsx'
import { useModal } from './Modal.jsx'
import formatSize from '../utilities/formatSize.js'

/**
 * The `app` variant of ContentCard and ContentRow (CatalogAppVariant, kol-fxr 2026-10-23): kol-fxr's
 * approved saved-file card, so every app's library takes it by a bump. It is the `file` card and row
 * with the parts slotted — download on the cover, a cog over a trash in the plate, Rename · Duplicate ·
 * Delete on the cog and on right-click. The consumer passes raw writes (`verbs`); the dialogs are asked
 * here. A verb not passed is not drawn.
 *
 * The menu is ONE per page: `AppItemMenuProvider` (CatalogPage mounts it) holds it, and every app card
 * and row opens it. Without a provider the card still draws download and trash, but no cog and no
 * right-click menu.
 */

const MenuCtx = createContext(null)

const useAsk = () => {
  const modal = useModal()
  return {
    rename: async (name, verbs) => {
      const next = await modal.prompt('Rename:', name ?? '')
      if (next != null && next.trim() && next.trim() !== name) verbs.rename(next.trim())
    },
    remove: async (name, verbs) => {
      if (await modal.confirm(`Delete “${name || 'Untitled'}”?`, { okLabel: 'Delete' })) verbs.remove()
    },
  }
}

const glyph = (name) => <Icon name={name} size={14} />

export function AppItemMenuProvider({ children }) {
  const menu = useContextMenu()
  const ask = useAsk()
  return (
    <MenuCtx.Provider value={menu}>
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
    </MenuCtx.Provider>
  )
}

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
 * Always runs the same hooks (one context read), so ContentCard / ContentRow call it unconditionally.
 */
export function useAppItem(variant, { title, verbs, download, menuItems, date, size, media, tone }) {
  const menu = useContext(MenuCtx)
  if (variant !== 'app') return null
  const hasMenu = !!menu && !!(verbs?.rename || verbs?.duplicate || verbs?.remove || menuItems)
  const openMenu = hasMenu ? (e) => menu.openAt(e, { name: title, verbs, menuItems }) : undefined
  /* the cover's download stops its click at the control, as the plate does — a card that opens on click
   * opened under the download too (AppCardDownloadClickBubbles, kol-monitor 2026-10-23) */
  return {
    tone: tone ?? 'secondary',
    date: typeof date === 'number' ? new Date(date).toISOString().slice(0, 10) : date,
    size: typeof size === 'number' ? formatSize(size) : size,
    media: typeof media === 'string' ? <img src={media} alt={title ?? ''} className="size-full object-cover" /> : media ?? placeholder,
    control: download ? <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={(e) => { e?.stopPropagation(); return download(e) }} /> : undefined,
    actions: openMenu || verbs?.remove ? <AppPlate name={title} verbs={verbs} onSettings={openMenu} /> : undefined,
    onContextMenu: openMenu,
  }
}
