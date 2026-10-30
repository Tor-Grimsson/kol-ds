import { useEffect, useRef, useState } from 'react'
import { Button, CodeBlock, QuickLookFrame, Table, TabsRow, Tooltip, useDragResize } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — the lab's window: QuickLookFrame + TabsRow + Table + CodeBlock (kol-component) */

/**
 * LabWindow — One window for every lab. The four generators (TypeLab · ColorLab · ComboLab · LockupLab) draw in it, so they
 * look alike (BrandLabToolWindow, kol-atlas 2026-10-29 — the user: *"you are reinventing styles instead of using an already
 * established style. f.e. quicklook or media or search or modal or rail"*).
 *
 *   frame    kol-component's QuickLookFrame — the established window: its header, its opaque body, its corner grip. It
 *            fills its column, is never taller than the viewport, and the grip resizes it.
 *   header   the lab's name as the settings rail's heading (uppercase, review 6), then the lab's own actions (undo · redo ·
 *            copy CSS), then Maximize.
 *   rail     the left column, the settings rail's anatomy (review 4): Rail's ground and padding, its sections as a
 *            TabsRow at its top — the rule for every window, one section or many (review 6) — the controls of the open tab as `SettingsSections` rows (label left, control
 *            right) in the rail's default tone, and `foot` at its foot. No status line (review 6). No footer.
 *   stage    what the lab makes, beside the rail.
 *   output   OUTSIDE the window, the same shape for every lab: a Table, then the CSS.
 *
 * One padding — `--kol-lab-pad` (16) — for the header, the rail and the stage.
 *
 * @param {string}    title    the lab's name ("Type Lab")
 * @param {ReactNode} actions  header controls, right-aligned
 * @param {Array}     tabs     `[{ id, label, content }]` — the rail's sections
 * @param {string}    tab · onTabChange   the open section, controlled (optional)
 * @param {ReactNode} foot     controls at the rail's foot
 * @param {ReactNode} children the stage
 * @param {Object}    output   `{ columns, rows, css, filename, extra }` — drawn by LabOutput under the window
 */
export default function LabWindow({ title, actions, tabs = [], tab: tabProp, onTabChange, foot, output, className = '', children }) {
  const [own, setOwn] = useState(tabs[0]?.id)
  const tab = tabProp ?? own
  const setTab = onTabChange ?? setOwn
  const [size, setSize] = useState(null)
  const open = tabs.find((t) => t.id === tab) ?? tabs[0]
  /* THE RAIL RESIZES (review 2 — the user: *"make the siderail resizable"*): the DS grab edge, the workshop rails' own
   * (`useDragResize` + `.kol-rail-grab`), on its own token so it never drags another rail; the width lasts the session */
  const railRef = useRef(null)
  const { grabProps } = useDragResize(railRef, { token: 'kol-lab-rail', side: 'left' })
  /* MAXIMIZE (review 5 — Adobe's Maximize, *"on the way right to get fullscreen or overlay mode"*): the window over the
   * page on the overlay scrim, Escape or the same button to put it back */
  const [max, setMax] = useState(false)
  useEffect(() => {
    if (!max) return
    const onKey = (e) => { if (e.key === 'Escape') setMax(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [max])
  const head = (
    <>
      {actions}
      <LabAction icon="expand" label={max ? 'Restore' : 'Maximize'} onClick={() => setMax(!max)} />
    </>
  )
  return (
    <div className={`flex flex-col gap-10 ${className}`.trim()}>
      {max && <div className="fixed inset-0 z-[199] kol-overlay-scrim" onClick={() => setMax(false)} />}
      <QuickLookFrame title={<span className="kol-eyebrow">{title}</span>} actions={head} size={max ? null : size} onResize={setSize} className={`kol-lab-window${max ? ' kol-lab-window--max' : ''}`}>
        <div className="kol-lab-grid grid h-full w-full">
          {/* THE SETTINGS RAIL'S OWN GROUND (review 4 — *"look at seettings rail … a nice background, and a nice controls
            * tone. Can you not try to reference it?"*): kol-component Rail's `bg-surface-primary` and padding, no tone
            * wrapper, so every control takes the rail's default tone as the settings rail's do */}
          <aside ref={railRef} className="kol-lab-rail relative flex min-h-0 flex-col gap-4 border-b border-oq-08 bg-surface-primary md:border-b-0 md:border-r">
            <div {...grabProps} className="kol-rail-grab kol-rail-grab--left hidden md:block" />
            {/* THE TABSROW AT THE TOP OF EVERY WINDOW (review 6 — *"why dont we make it a rule at top of each window?"*):
              * one section or many, the rail opens on its tabs */}
            {tabs.length > 0 && <TabsRow type="mono-light" tabs={tabs.map(({ id, label, icon }) => ({ id, label, icon }))} value={open?.id} onChange={setTab} ariaLabel={`${title} sections`} />}
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">{open?.content}</div>
            {foot && <div className="flex flex-wrap items-center gap-1">{foot}</div>}
          </aside>
          <div className="kol-lab-stage min-h-0 min-w-0 overflow-auto">{children}</div>
        </div>
      </QuickLookFrame>
      {output && <LabOutput {...output} />}
    </div>
  )
}

/** the output every lab ends on: its table, then its CSS */
export function LabOutput({ columns, rows, css, filename = 'lab.css', caption, extra }) {
  return (
    <div className="flex flex-col gap-6">
      {rows?.length > 0 && <Table caption={caption} columns={columns} rows={rows} width="column" variant="simple" />}
      {extra}
      {css && <CodeBlock filename={filename} language="css" code={css} />}
    </div>
  )
}

/** a header control: the close idiom (`Button variant="nav"`), its name in a tooltip */
export const LabAction = ({ icon, label, ...props }) => (
  <Tooltip label={label}><Button variant="nav" size="sm" iconOnly={icon} aria-label={label} {...props} /></Tooltip>
)

/**
 * useLabValue — a lab's one value with its history: controlled (`value` · `onChange`) or its own, and undo · redo.
 * `set(patch | fn)` records a step; `undo` / `redo` move through them.
 */
export function useLabValue(valueProp, onChange, defaults) {
  const [own, setOwn] = useState(defaults)
  const value = { ...defaults, ...(valueProp ?? own) }
  const past = useRef([])
  const future = useRef([])
  const [, bump] = useState(0)
  const commit = (next, record = true) => {
    if (record) { past.current.push(value); future.current = [] }
    if (valueProp === undefined) setOwn(next)
    onChange?.(next)
    bump((n) => n + 1)
  }
  const set = (patch) => commit(typeof patch === 'function' ? patch(value) : { ...value, ...patch })
  const undo = () => { const prev = past.current.pop(); if (!prev) return; future.current.push(value); commit(prev, false) }
  const redo = () => { const next = future.current.pop(); if (!next) return; past.current.push(value); commit(next, false) }
  return { value, set, undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 }
}

/** the undo · redo pair every lab's header carries */
export const LabHistory = ({ h }) => (
  <>
    <LabAction icon="undo" label="Undo" onClick={h.undo} disabled={!h.canUndo} />
    <LabAction icon="redo" label="Redo" onClick={h.redo} disabled={!h.canRedo} />
  </>
)

/** copy text — the CSS button in a header */
export function CopyAction({ text, label = 'Copy CSS' }) {
  const [done, setDone] = useState(false)
  return <LabAction icon={done ? 'check' : 'copy'} label={done ? 'Copied' : label} onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200) }} />
}
