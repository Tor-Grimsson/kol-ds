import { useState } from 'react'
import { TabsRow, usePopover, PopoverPanel } from '@kolkrabbi/kol-component'

/**
 * SignalReference — the reference an expression or envelope tool is explained with (signal
 * engine, 2026-09-27). ONE component over the reference DATA in `@kolkrabbi/kol-hardware/signal`,
 * in the three shapes the estate already used:
 *
 *   variant="tabs"     kol-mirror's /expressions panel — Examples · Saved · Language · Usage
 *   variant="popover"  kol-monitor's Scope+ face — an EX and a REF button, each a popover
 *   variant="sheet"    the design editor's labs shortcuts sheet — every section, stacked
 *
 * Clicking a code loads it (`onPick`); ⌘/Ctrl-click appends it (`onAppend`) — mirror's gestures.
 *
 * @param {object} sections   `{ id: { title, rows | tips, grid } }` (EXPRESSION_SECTIONS, ADSR_SECTIONS)
 * @param {Array}  tabs       `[{ id, label, sections }]` (EXPRESSION_TABS, ADSR_TABS); a tab with
 *                            id `saved` renders the host's `saved` rows, and is hidden without them
 * @param {Array}  saved      `[code, label]` rows the host keeps (its library)
 */
function Code({ text, onPick, onAppend }) {
  return (
    <button
      type="button"
      className="kol-helper-10 min-w-0 max-w-full truncate rounded-[2px] bg-surface-tertiary px-2 py-1 text-left text-fg-96"
      onClick={(e) => ((e.metaKey || e.ctrlKey) ? onAppend : onPick)?.(text)}
    >
      {text}
    </button>
  )
}

function Section({ section, onPick, onAppend, showTitle }) {
  return (
    <div className="flex flex-col gap-1">
      {showTitle && <div className="kol-helper-10 uppercase text-fg-48">{section.title}</div>}
      {section.tips
        ? section.tips.map((tip) => <div key={tip} className="kol-helper-10 text-fg-48" style={{ lineHeight: '150%' }}>{tip}</div>)
        : (
          <div className={section.grid ? 'grid grid-cols-2 gap-x-4' : 'flex flex-col'}>
            {section.rows.map((row) => {
              const codes = Array.isArray(row) ? [row[0]] : row.codes
              const label = Array.isArray(row) ? row[1] : row.label
              return (
                <div key={codes.join()} className="flex h-6 items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    {codes.map((c) => <Code key={c} text={c} onPick={onPick} onAppend={onAppend} />)}
                  </span>
                  <span className="kol-helper-10 shrink-0 text-fg-48">{label}</span>
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}

const sectionsOf = (tab, sections, saved = []) =>
  tab.id === 'saved' ? [{ title: 'Saved', rows: saved }] : tab.sections.map((id) => sections[id]).filter(Boolean)

function Tabs({ sections, tabs, saved, onPick, onAppend }) {
  const visible = tabs.filter((t) => t.id !== 'saved' || saved)
  const [tab, setTab] = useState(visible[0]?.id)
  const current = visible.find((t) => t.id === tab) ?? visible[0]
  const list = current ? sectionsOf(current, sections, saved) : []
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <TabsRow tabs={visible} value={current?.id} onChange={setTab} />
      <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
        {current?.id === 'saved' && !saved?.length
          ? <div className="kol-helper-10 text-fg-48">Nothing saved yet.</div>
          : list.map((s) => <Section key={s.title} section={s} onPick={onPick} onAppend={onAppend} showTitle={list.length > 1} />)}
      </div>
    </div>
  )
}

function PopButton({ label, list, onPick, onAppend }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end' })
  return (
    <>
      <button
        type="button"
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        className="kol-helper-10 h-7 rounded-[2px] bg-surface-tertiary px-2 text-fg-96"
      >
        {label}
      </button>
      <PopoverPanel popover={popover} className="w-80 max-h-96 overflow-y-auto p-3">
        <div className="flex flex-col gap-3">
          {list.map((s) => (
            <Section key={s.title} section={s} showTitle
              onPick={(c) => { onPick?.(c); setOpen(false) }} onAppend={onAppend} />
          ))}
        </div>
      </PopoverPanel>
    </>
  )
}

export default function SignalReference({ sections, tabs, variant = 'tabs', saved, onPick, onAppend, className = '' }) {
  if (variant === 'popover') {
    const [first, ...rest] = tabs.filter((t) => t.id !== 'saved')
    return (
      <div className={`flex gap-1 ${className}`}>
        {first && <PopButton label="EX" list={sectionsOf(first, sections)} onPick={onPick} onAppend={onAppend} />}
        {rest.length > 0 && <PopButton label="REF" list={rest.flatMap((t) => sectionsOf(t, sections))} onPick={onPick} onAppend={onAppend} />}
      </div>
    )
  }
  if (variant === 'sheet') {
    const all = tabs.filter((t) => t.id !== 'saved').flatMap((t) => sectionsOf(t, sections))
    return (
      <div className={`grid gap-6 sm:grid-cols-2 ${className}`}>
        {all.map((s) => <Section key={s.title} section={s} onPick={onPick} onAppend={onAppend} showTitle />)}
      </div>
    )
  }
  return (
    <div className={className}>
      <Tabs sections={sections} tabs={tabs} saved={saved} onPick={onPick} onAppend={onAppend} />
    </div>
  )
}
