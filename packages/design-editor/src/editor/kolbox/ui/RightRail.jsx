import { createContext, useContext } from 'react'
import { TabsRow, Tooltip, Rail, RailHeader, Button, Dropdown, AccountMenu } from '@kolkrabbi/kol-component'
import { sessionUser } from '../files/account.js'
import { signIn } from '../app/SettingsHost.jsx'
import MenuZoom from './MenuZoom.jsx'
import { useZoom } from '../../shell/zoomStore.js'
import Icon from './Icon.jsx'

/* The right rail (Figma RightRail 147:21543): the Rail shell with content in its slots.
   variant editor (his design 149:26890, W19.1): with a selection, the header, 50 high: padding 14, 16, 12, 16 round a
   row at the control height (24), so the title's dropdown and the actions' 24 frames sit inside the padding, nothing cut
   (R3.1); the selection's name (Inter Medium 14, no chevron), the actions at the right 8 apart, the last on the rows'
   icon column.
   Nothing selected: no header, the sections from the rail's top.
   variant labs: the open lab's title, the Generate, Style and Animation tabs (tabs, tab, onTab), then its settings as
   children. meta is the quiet line at the header's right (the lab's preset).
   tabs show in either variant when given (the editor's generative, misc, kinetic and photo layers, round 3, 2.1).
   THE RAIL'S TOP (plan-2026-11-20-kolbox-everything-left W1.2): what the retired top rail held at its right (the zoom,
   Preview and Export) sits over the header, handed in by the screen through RailTop, so every RightRail on that screen
   (the inspector's many) carries it without each caller passing it. */
export const RailTop = createContext(null)

export default function RightRail({ variant = 'editor', title, titleMenu, meta, actions, tabs, tab, onTab, children }) {
  const top = useContext(RailTop)
  const editorHead = variant === 'editor' && (title || actions) && (
    <div className="px-4 pt-3.5 pb-3 font-normal" data-rail-header>
      <div className="flex h-(--kol-kolbox-ctl) items-center">
        {/* `titleMenu`: the title is a dropdown (his reference 2026-11-19, "Frame is missing dropdown"): the kit's ghost
            button at the control height, the title and a chevron, the field fill on hover; -ml-2 keeps the title's text
            on the rail's 16 line (the sections' titles), its hover box in the padding. `true` draws it with no function
            yet; a function is its click. */}
        {title && (titleMenu
          ? <Button variant="kolbox" tone="ghost" aria-haspopup="menu" onClick={typeof titleMenu === 'function' ? titleMenu : undefined}
              className="-ml-2 gap-1.5! px-2! text-rail-title! text-text!" data-rail-title>{title}<Icon name="chevron-down" /></Button>
          : <span className="min-w-0 truncate text-rail-title text-text" data-rail-title>{title}</span>)}
        {actions && <span className="ml-auto flex shrink-0 items-center gap-2">{actions}</span>}
      </div>
    </div>
  )
  return (
    <Rail variant="kolbox"
      side="right"
      aria-label="Properties"
      header={(top || editorHead || variant !== 'editor' || tabs) && (
        <>
          {top}
          {variant === 'editor' ? editorHead : <RailHeader variant="kolbox" title={title} subtitle={meta} actions={actions} />}
          {tabs && (
            <div className="flex px-4 pb-3">
              <TabsRow variant="kolbox" tabs={tabs} value={tab} onChange={onTab} className="w-full" />
            </div>
          )}
        </>
      )}
    >
      {/* the rail's own ink is Inter or JetBrains Mono Regular, as the file's; Medium is the title steps' own (the page
          around the rail sets Medium) */}
      {/* overflow-x clip (W20.2): an absolute child wider than the rail (a row's hidden tooltip) no longer widens the body,
          so the body never scrolls sideways */}
      <div className={`overflow-x-clip ${variant === 'editor' ? 'font-normal' : ''}`}>{children}</div>
    </Rail>
  )
}

/* the zoom field, moved from the retired top rail: the unbordered field reading the editor's live percent (1 = 100%, the
   engine canvas's own), opening MenuZoom. Drawn where an editor canvas is mounted. `className` goes to the field (the
   rail's top draws it plain). */
export function ZoomField({ className = '' }) {
  const scale = useZoom()
  return <Dropdown variant="kolbox" tone="grey" ariaLabel="Zoom" value={`${Math.round(scale * 100)}%`} className={className || undefined} data-zoom menu={(m) => <MenuZoom {...m} zoom={scale} />} />
}

/* The rail's top (W16.6, Figma's right rail measured 2026-11-20, _tmp/2026-11-20-w16/figma-measures.md): row one, 48
   high, the account at the left 12 in, Preview (ghost, text ink) and Export (the kit's primary, in Share's place and at
   its 32 height) at the right 8 in, 4 apart; row two, 24 high, the zoom at the right 8 in, plain text and its chevron in
   the ink as Figma's,
   the field fill only on hover or while its menu is open. No tabs: there is no Prototype (decided for his review). */
export function RightRailTop({ zoom = false, onPreview, onExport }) {
  const user = sessionUser()
  return (
    <div className={zoom ? 'pb-2' : ''} data-rail-top>
      <div className="flex h-12 items-center gap-1 pr-2 pl-3">
        <Tooltip variant="kolbox" asChild label="Account"><span className="flex"><AccountMenu variant="kolbox" initial={user?.name?.[0]} name="Account" onClick={signIn} /></span></Tooltip>
        <span className="ml-auto flex items-center gap-1">
          <Button variant="kolbox" tone="ghost" className="border-0! text-text!" onClick={onPreview}>Preview</Button>
          <Button variant="kolbox" tone="primary" className="h-8! px-2!" onClick={onExport}>Export</Button>
        </span>
      </div>
      {zoom && <div className="flex h-6 items-center justify-end pr-2"><ZoomField className="font-sans bg-transparent hover:bg-field aria-expanded:bg-field [&_.kol-dd-caret--kolbox]:text-text" /></div>}
    </div>
  )
}

/* THE RIGHT PILL (W2.1, [37]): the undocked state's second pill, RailPill's look at the right: the account chip (signed
   out, it opens Sign in, as the main menu's row), the zoom and Preview. `children` are the floating pieces under it
   (W2.2). */
export function RailPillRight({ onPreview, children }) {
  const user = sessionUser()
  return (
    <div className="pointer-events-none absolute top-3 right-3 bottom-3 z-10 flex flex-col items-end gap-2 *:pointer-events-auto" data-rail-pill-stack="right">
      <div className="kol-kolbox-surface flex h-8 shrink-0 items-center gap-2 rounded-[var(--kol-radius-12)] bg-panel pr-1 pl-2" data-rail-pill="right">
        <Tooltip variant="kolbox" asChild label="Account"><span className="flex"><AccountMenu variant="kolbox" initial={user?.name?.[0]} name="Account" onClick={signIn} /></span></Tooltip>
        <ZoomField />
        <Button variant="kolbox" tone="ghost" className="border-0! text-text!" onClick={onPreview}>Preview</Button>
      </div>
      {children}
    </div>
  )
}
