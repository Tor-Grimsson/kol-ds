import { useEffect, useState } from 'react'
import { PHONE_NAV_VARIANTS } from './PhoneNav.jsx'
import { TabsRow, TABBAR_H, TABBAR_PILL_INSET, TABBAR_PILL_TAB, tabbarPillWidth } from '@kolkrabbi/kol-component'
import MoreRows from './MoreSheet.jsx'

/* taxonomy-ok: molecule — TabsRow's phone pill of action slots + a MoreRows sheet */

/**
 * TransportPill — The transport, on a phone, as a pill (TransportPill, kol-fxr 2026-10-27, frame E). PhoneNav's pill —
 * the same TabsRow, so the slots, the 28px glyphs and the 44×44 circle are the nav's — holding ACTIONS instead of
 * destinations. It floats over the open panel, so it carries the shadow the nav does not, and folds to a RIGHT edge tab.
 *
 * A slot fires `onPress`; `selected` lights it (play and pause are a radio pair the consumer owns, so both are just
 * `selected`). A slot named in `sheetFor` opens a sheet of rows anchored above it instead, lit while open; a row runs its
 * `onPress` and closes the sheet.
 *
 * @param {Array}  items         `[{ id, icon, label, onPress?, selected? }]` in pill order
 * @param {Object} sheetFor      `{ [id]: [{ label, icon?, onPress, checked? }] }` — rows for a slot that opens a sheet;
 *                               `checked` marks the current pick with the 22px check (MoreRows)
 * @param {'bottom'|'top'} placement  the pill's edge (default bottom)
 * @param {boolean} foldable     a sideways swipe folds it into the right edge tab
 * @param {boolean} folded · {Function} onFoldChange  the folded state, controlled (else the pill holds it)
 */
export default function TransportPill({ items = [], sheetFor = {}, placement = 'bottom', foldable = false, folded, onFoldChange }) {
  const [sheet, setSheet] = useState(null)
  useEffect(() => {
    if (!sheet) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setSheet(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet])

  const top = placement === 'top'
  const tabs = items.map((i) => ({ value: i.id, label: i.label, icon: i.icon, selected: sheet === i.id || !!i.selected }))
  const press = (id) => {
    if (sheetFor[id]) { setSheet((s) => (s === id ? null : id)); return }
    setSheet(null)
    items.find((i) => i.id === id)?.onPress?.()
  }
  /* the sheet centres on its slot: the pill's left edge + its 7px pad + the slot's centre */
  const W = tabbarPillWidth(items.length)
  const at = items.findIndex((i) => i.id === sheet)
  const sheetStyle = {
    left: `calc(50% - ${W / 2}px + 7px + ${at * TABBAR_PILL_TAB + TABBAR_PILL_TAB / 2}px)`,
    right: 'auto',
    transform: 'translateX(-50%)',
    [top ? 'top' : 'bottom']: `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + TABBAR_H + 12}px)`,
    ...(top ? { bottom: 'auto' } : {}),
    width: 'max-content', minWidth: 160,
  }

  return (
    <>
      {sheet && (
        /* a clear BUTTON scrim — the panel under it stays in view, a tap off the sheet closes it */
        <button type="button" aria-label="Close" className="kol-phone-nav-scrim" onClick={() => setSheet(null)} />
      )}
      {sheet && (
        <div className="kol-phone-nav-more kol-more-sheet" role="menu" aria-label={items[at]?.label} style={sheetStyle}>
          <MoreRows actions={sheetFor[sheet]} onPick={() => setSheet(null)} />
        </div>
      )}
      <TabsRow
        variant="stacked"
        placement="phone"
        shape="pill"
        edge={top ? 'top' : 'bottom'}
        /* the `transport` row of PHONE_NAV_VARIANTS (2026-10-28) — one table, not a second tuning */
        border={PHONE_NAV_VARIANTS.transport.border}
        shadow={PHONE_NAV_VARIANTS.transport.shadow}
        active={PHONE_NAV_VARIANTS.transport.active}
        foldable={foldable}
        folded={folded}
        onFoldChange={(v) => { if (v) setSheet(null); onFoldChange?.(v) }}
        foldSide="right"
        ariaLabel="Transport"
        tabs={tabs}
        onChange={press}
      />
    </>
  )
}
