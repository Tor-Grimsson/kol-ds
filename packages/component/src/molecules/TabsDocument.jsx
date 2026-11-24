import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'

/**
 * TabsDocument — A strip of open documents. One tab per open document (its glyph, its name, its close), the current one
 * on its own ground, a plus after the last that opens a new one (plan-2026-11-22 folio-on-kolbox; drawn after Figma's
 * desktop tab strip, his reference). Holds no document state and no router: the host passes the tabs and answers the
 * callbacks. `TabsRow` switches views inside a page; this strip switches documents, so it carries close, unsaved, open
 * beside and drag, which TabsRow does not.
 *
 * A tablist of tabs: arrow keys, Home and End move between the tabs (Enter or Space opens one); each tab's close button
 * is in the Tab order, named "Close <name>".
 *
 *   <TabsDocument variant="kolbox" tabs={[{ value: '/a', label: 'notes.md', icon: 'file-md', dirty: true }]}
 *     value="/a" onChange={open} onClose={close} onNew={create} />
 *
 * @param {'kolbox'|'folio'} [variant='folio'] - The look. `kolbox` (the editor style): a 40 strip on the panel ground with
 *   the field line under it, tabs 12 / 16, the current one on the field wash (light: the top rail's track pair, canvas
 *   strip and ground tab), the others flat in oq-64; the glyph 16, the close a kolbox icon button; an unsaved tab shows a
 *   dot in the close's place until hovered. `folio` (the default): Folio's own strip, carried class for class from
 *   apps/folio's FolioWrite (44 high, 36 tabs on the paper, Inter 11, a text "New"); it draws no glyph.
 * @param {Array<{ value: string, label: string, icon?: string, dirty?: boolean }>} tabs - The open documents, in order.
 *   `icon` is the document kind's glyph by your icons' name (kolbox only; `file` when unset); `dirty` shows the unsaved dot
 * @param {string} [value] - The current tab's value
 * @param {(value: string) => void} [onChange] - A tab pressed (the current one included, as Folio's tab button is)
 * @param {(value: string) => void} [onClose] - A tab's close pressed; no close button without it
 * @param {() => void} [onNew] - The plus after the last tab; none without it
 * @param {string} [newLabel='New'] - The plus's name (folio: its visible text)
 * @param {string} [paired] - The tab open beside the current one (a split): drawn on the current ground; folio chains the two
 *   with its green line
 * @param {(value: string) => void} [onOpenBeside] - A tab's "Open beside" button (shown on hover, not on the current or the
 *   paired tab); none without it
 * @param {() => void} [onCloseSplit] - With `paired`, a "Close split" button after the tabs
 * @param {(event: MouseEvent, tab: object) => void} [onTabContextMenu] - A tab's context menu; the host opens its menu
 * @param {(event: DragEvent, tab: object) => void} [onTabDragStart] - Makes the other tabs draggable (not the current one);
 *   the host sets the drag data
 * @param {string} [ariaLabel='Open documents'] - Names the tablist
 * @param {string} [className] - Extra classes on the strip
 */
export default function TabsDocument({
  variant = 'folio', tabs = [], value, onChange, onClose, onNew, newLabel = 'New', paired,
  onOpenBeside, onCloseSplit, onTabContextMenu, onTabDragStart, ariaLabel = 'Open documents', className = '',
}) {
  const kolbox = variant === 'kolbox'
  const focusable = tabs.some((t) => t.value === value) ? value : tabs[0]?.value
  /* arrows, Home and End move the focus between the tabs; the host opens one on Enter or Space (the tab is a button) */
  const onKeyDown = (e) => {
    const all = [...e.currentTarget.querySelectorAll('[role="tab"]')]
    const at = all.indexOf(document.activeElement)
    if (at < 0) return
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: all.length - 1 }[e.key]
    if (to == null) return
    e.preventDefault()
    all[(to + all.length) % all.length]?.focus()
  }
  const cell = (t) => ({
    onContextMenu: onTabContextMenu ? (e) => onTabContextMenu(e, t) : undefined,
    draggable: Boolean(onTabDragStart) && t.value !== value,
    onDragStart: onTabDragStart ? (e) => onTabDragStart(e, t) : undefined,
  })
  const tabProps = (t) => ({
    type: 'button', role: 'tab', 'aria-selected': t.value === value, tabIndex: t.value === focusable ? 0 : -1,
    onClick: () => onChange?.(t.value),
  })

  if (kolbox) {
    return (
      <div role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}
        className={`kol-tabs-document--kolbox relative flex h-10 shrink-0 items-stretch overflow-x-auto [scrollbar-width:none] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:content-[''] ${className}`.trim()}>
        {tabs.map((t) => {
          const on = t.value === value
          const lit = on || t.value === paired
          const closeShown = on && !t.dirty
          return (
            <div key={t.value} role="presentation" {...cell(t)}
              className={`kol-tabs-document-tab${lit ? ' is-active' : ''} group relative flex shrink-0 items-center gap-1 pr-2 pl-3`}>
              <button {...tabProps(t)} className="kol-tabs-document-label flex min-w-0 items-center gap-2 self-stretch outline-none focus-visible:outline-solid focus-visible:outline-1">
                <KolboxGlyph name={t.icon || 'file'} className="kol-tabs-document-glyph" />
                <span className="max-w-[220px] truncate">{t.label}</span>
              </button>
              {onOpenBeside && !lit && (
                <Button variant="kolbox" iconOnly="panel-right" aria-label={`Open ${t.label} beside`} onClick={() => onOpenBeside(t.value)}
                  className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100" />
              )}
              {onClose && (
                <span className="relative flex size-(--kol-kolbox-ctl) items-center justify-center">
                  {t.dirty && <span aria-label="Unsaved changes" role="img" className="kol-tabs-document-dot pointer-events-none absolute size-1.5 rounded-full group-hover:opacity-0 group-focus-within:opacity-0" />}
                  <Button variant="kolbox" iconOnly="x" aria-label={`Close ${t.label}`} onClick={() => onClose(t.value)}
                    className={closeShown ? '' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'} />
                </span>
              )}
            </div>
          )
        })}
        {paired && onCloseSplit && (
          <span className="flex shrink-0 items-center px-2">
            <Button variant="kolbox" tone="ghost" iconLeft="panel-right" onClick={onCloseSplit}>Close split</Button>
          </span>
        )}
        {onNew && (
          <span className="flex shrink-0 items-center px-2">
            <Button variant="kolbox" iconOnly="plus" aria-label={newLabel} onClick={onNew} />
          </span>
        )}
      </div>
    )
  }

  /* folio: FolioWrite's strip (13.3, W18) class for class; its colors are rules on the folio tokens (kol-components-molecules.css) */
  return (
    <div role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}
      className={`kol-tabs-document--folio flex h-[44px] shrink-0 items-end gap-[2px] overflow-x-auto px-[56px] [scrollbar-width:none] ${className}`.trim()}>
      {tabs.map((t) => {
        const on = t.value === value
        const chained = paired && (on || t.value === paired)
        return (
          <div key={t.value} role="presentation" {...cell(t)}
            className={`kol-tabs-document-tab${on || t.value === paired ? ' is-active' : ''}${chained ? ' is-chained' : ''} group flex h-[36px] shrink-0 items-center gap-[8px] rounded-t-[3px] pl-[14px] pr-[6px]`}>
            <button {...tabProps(t)} className={`kol-tabs-document-label kol-folio-meta max-w-[220px] truncate${on ? ' is-current font-semibold' : ''}`}>{t.label}</button>
            {t.dirty && <span aria-label="Unsaved changes" role="img" className="kol-tabs-document-dot size-[6px] rounded-full" />}
            {onOpenBeside && !on && t.value !== paired && <button type="button" aria-label={`Open ${t.label} beside`} title="Open beside" onClick={() => onOpenBeside(t.value)} className="kol-tabs-document-btn flex size-[20px] items-center justify-center rounded-[3px] opacity-0 group-hover:opacity-100"><IconLoader name="panel-right" size={12} /></button>}
            {onClose && <button type="button" aria-label={`Close ${t.label}`} onClick={() => onClose(t.value)} className="kol-tabs-document-btn flex size-[20px] items-center justify-center rounded-[3px] opacity-60 hover:opacity-100"><IconLoader name="x" size={12} /></button>}
          </div>
        )
      })}
      {paired && onCloseSplit && <button type="button" onClick={onCloseSplit} className="kol-tabs-document-text kol-folio-meta flex h-[36px] shrink-0 items-center gap-[6px] px-[12px]"><IconLoader name="panel-right" size={12} />Close split</button>}
      {onNew && <button type="button" onClick={onNew} className="kol-tabs-document-text kol-folio-meta flex h-[36px] shrink-0 items-center gap-[6px] px-[12px]"><IconLoader name="plus" size={12} />{newLabel}</button>}
    </div>
  )
}
