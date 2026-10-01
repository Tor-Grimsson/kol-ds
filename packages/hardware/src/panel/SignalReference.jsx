import { useState } from 'react'
import { Button, TabsRow, usePopover, PopoverPanel } from '@kolkrabbi/kol-component'

/**
 * SignalReference — The reference for a signal tool. the reference an expression or envelope tool is explained with (signal
 * engine, 2026-09-27). ONE component over the reference DATA in `@kolkrabbi/kol-hardware/signal`,
 * in the three shapes the estate already used:
 *
 *   variant="tabs"     the tabs and their sections, bare — for a host that draws its own box
 *   variant="panel"    kol-mirror's /expressions fold, class for class: a box the height of its
 *                      parent, TabsRow in its head (`px-4 border-b`), the body `p-4` scrolling
 *                      inside, sub-eyebrows only when a tab holds more than one section
 *   variant="popover"  kol-monitor's Scope+ face — an EX and a REF button, each a popover
 *   variant="sheet"    the design editor's labs shortcuts sheet — every section, in columns
 *
 * Clicking a code loads it (`onPick`); ⌘/Ctrl-click appends it (`onAppend`) — mirror's gestures.
 *
 * @param {object} sections   `{ id: { title, rows | tips, grid } }` (EXPRESSION_SECTIONS, ADSR_SECTIONS)
 * @param {Array}  tabs       `[{ id, label, sections }]` (EXPRESSION_TABS, ADSR_TABS); a tab with
 *                            id `saved` renders the host's `saved` rows, and is hidden without them
 * @param {Array}  saved      `[code, label]` rows the host keeps (its library)
 * @param {'xs'|'sm'|'md'} size  the popover buttons' rung (default sm) — match the row they sit in
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
    <div className="flex shrink-0 flex-col">
      {showTitle && <div className="kol-helper-12 flex h-6 shrink-0 items-center uppercase text-fg-48">{section.title}</div>}
      {section.tips
        ? section.tips.map((tip) => <div key={tip} className="kol-helper-10 text-fg-48" style={{ lineHeight: '150%' }}>{tip}</div>)
        : (
          <div className={section.grid ? 'grid grid-cols-2 gap-x-4' : 'flex flex-col'}>
            {section.rows.map((row) => {
              const codes = Array.isArray(row) ? [row[0]] : row.codes
              const label = Array.isArray(row) ? row[1] : row.label
              return (
                <div key={codes.join()} className="flex h-6 min-w-0 items-center justify-between gap-3">
                  {/* in the two-column grid the CODE is the thing to read — the label yields */}
                  <span className={`flex items-center gap-2 ${section.grid ? 'shrink-0' : 'min-w-0'}`}>
                    {codes.map((c) => <Code key={c} text={c} onPick={onPick} onAppend={onAppend} />)}
                  </span>
                  <span className={`kol-helper-10 text-fg-48 ${section.grid ? 'min-w-0 truncate' : 'shrink-0'}`}>{label}</span>
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

/* THE FOLD — kol-mirror's /expressions reference box (ExpressionReference, `scopeFill`) */
function Panel({ sections, tabs, saved, onPick, onAppend }) {
  const visible = tabs.filter((t) => t.id !== 'saved' || saved)
  const [tab, setTab] = useState(visible[0]?.id)
  const current = visible.find((t) => t.id === tab) ?? visible[0]
  const list = current ? sectionsOf(current, sections, saved) : []
  return (
    <div className="kol-helper-12 flex h-full min-h-0 flex-col overflow-hidden rounded-[4px] border border-oq-08 bg-surface-secondary">
      <div className="shrink-0 border-b border-oq-08 px-4">
        <TabsRow tabs={visible} value={current?.id} onChange={setTab} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
        {current?.id === 'saved' && !saved?.length
          ? <div className="kol-helper-10 text-fg-48">Nothing saved yet.</div>
          : list.map((s) => <Section key={s.title} section={s} onPick={onPick} onAppend={onAppend} showTitle={list.length > 1} />)}
      </div>
    </div>
  )
}

function PopButton({ label, list, onPick, onAppend, size }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end' })
  return (
    <>
      {/* Button takes no ref — the wrapper is the anchor, and the click reaches it by bubbling */}
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button variant="grey" size={size} pressed={open}>{label}</Button>
      </span>
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

export default function SignalReference({ sections, tabs, variant = 'tabs', saved, onPick, onAppend, size = 'sm', className = '' }) {
  if (variant === 'panel') {
    return (
      <div className={`h-full min-h-0 ${className}`}>
        <Panel sections={sections} tabs={tabs} saved={saved} onPick={onPick} onAppend={onAppend} />
      </div>
    )
  }
  if (variant === 'popover') {
    const [first, ...rest] = tabs.filter((t) => t.id !== 'saved')
    return (
      <div className={`flex gap-1 ${className}`}>
        {first && <PopButton label="EX" size={size} list={sectionsOf(first, sections)} onPick={onPick} onAppend={onAppend} />}
        {rest.length > 0 && <PopButton label="REF" size={size} list={rest.flatMap((t) => sectionsOf(t, sections))} onPick={onPick} onAppend={onAppend} />}
      </div>
    )
  }
  if (variant === 'sheet') {
    const all = tabs.filter((t) => t.id !== 'saved').flatMap((t) => sectionsOf(t, sections))
    return (
      <div className={`grid content-start gap-x-6 gap-y-4 ${className}`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
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
