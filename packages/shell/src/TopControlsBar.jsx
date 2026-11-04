import { useState } from 'react'
import { Button, TabsRow, usePopover, PopoverPanel, floatSurfaceClass } from '@kolkrabbi/kol-component'
import DocumentCapsule from './DocumentCapsule.jsx'
import MoreRows, { FloatMenu } from './MoreSheet.jsx'

/* taxonomy-ok: organism — the top bar: DocumentCapsule · TabsRow float · float Buttons · PanelsRestore */

/**
 * PanelsRestore — The Panels ▾ control (float-everything W5 row 79, 2026-11-04): a float capsule that opens the
 * workspace's panels menu — `children` when the consumer brings one (kol-component's PanelsMenu), else `items` as the
 * float menu's rows. The exploration's `Panels restore control` (kol-float--style 9:15406).
 *
 * @param {string}    label     the capsule's word (default "Panels")
 * @param {ReactNode} children  the menu's body, drawn in the float card
 * @param {Array}     items     `[{ label, icon?, onPress }]` — rows when there is no `children`
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the capsule and its card are made of (default `solid`)
 * @param {string}    className
 */
export function PanelsRestore({ label = 'Panels', children, items, surface = 'solid', className = '' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end', offset: 8 })
  const card = `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}`
  return (
    <>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button variant="float" size="lg" iconRight="chevron-down" aria-haspopup="menu" aria-expanded={open} className={`${floatSurfaceClass(surface)} ${className}`.trim()}>{label}</Button>
      </span>
      <PopoverPanel popover={popover} panel={false} focus={false} className={card} style={{ minWidth: 220, maxWidth: 'calc(100vw - 24px)' }}>
        {children ?? (
          <FloatMenu beside cardClass={card} onLeaf={() => setOpen(false)}>
            <MoreRows variant="float" actions={items ?? []} onPick={() => setOpen(false)} />
          </FloatMenu>
        )}
      </PopoverPanel>
    </>
  )
}

/**
 * TopControlsBar — The one 64 bar over a workspace (float-everything W5 row 77, 2026-11-04): the document capsule at
 * the start, the section tabs (TabsRow float) in the middle with the search glyph, Panels ▾ and the primary action at the
 * end — every piece a float on its `surface`, 16 between, nothing behind them. `start` · `center` · `end` replace any
 * of the three. The exploration's `Floating application controls` (kol-float--style 9:14341).
 *
 * @param {Object}    document   DocumentCapsule's props (`name`, `status`, `onBack`, `menuItems`)
 * @param {Array}     tabs       TabsRow tabs `[{ value, label, icon? }]`; `tab` the current value · `onTab` `(value) => void`
 * @param {Function}  onSearch   the search glyph's press; unset, no glyph
 * @param {Object}    panels     PanelsRestore's props (`items` or `children`); unset, no Panels
 * @param {Object}    action     `{ label, icon?, onPress }` — the primary action (New task), the inverted float capsule
 * @param {ReactNode} start · {ReactNode} center · {ReactNode} end  the three regions, when the props above are not the bar
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what every float on the bar is made of (default `solid`)
 * @param {string}    className
 */
export default function TopControlsBar({ document, tabs, tab, onTab, onSearch, panels, action, start, center, end, surface = 'solid', className = '' }) {
  return (
    <div className={`kol-top-controls kol-float-chrome flex items-center gap-4 h-16 ${className}`.trim()}>
      <div className="flex items-center gap-4">
        {start ?? (document && <DocumentCapsule {...document} surface={surface} />)}
      </div>
      <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
        {center ?? (
          <>
            {tabs?.length > 0 && <TabsRow variant="float" tabs={tabs} value={tab} onChange={onTab} className={`rounded-full p-1.5 ${floatSurfaceClass(surface)}`} />}
            {onSearch && <Button variant="float" tone="ghost" size="lg" iconOnly="search" aria-label="Search" onClick={onSearch} className={floatSurfaceClass(surface)} />}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {end ?? (
          <>
            {panels && <PanelsRestore {...panels} surface={surface} />}
            {action && <Button variant="float" tone="inverted" size="lg" iconLeft={action.icon ?? 'plus'} onClick={action.onPress}>{action.label}</Button>}
          </>
        )}
      </div>
    </div>
  )
}
