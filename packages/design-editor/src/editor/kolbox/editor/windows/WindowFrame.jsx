import { useState } from 'react'
import { ModalDialog } from '@kolkrabbi/kol-component'

/* THE ONE WINDOW FRAME (plan-2026-11-18-kolbox-system W23.0, W25.1; plan-2026-11-19 C5): the generator window's frame, lifted
   out of GeneratorWindow so the color window and the Motion window are the same window. ModalDialog kolbox, movable by its
   header, on the kolbox surface; the header holds the title and its kind, then `actions`; the body is three columns,
   the steps list at the left (when `steps` has any), the controls (children) and the preview (`aside`);
   the footer is the caller's. Not blocking: the canvas around it stays live. Sizes are the generator's (`--spacing-modal-generator`, `h-modal-generator-height`). */
export const THIN_SCROLL = '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'

function Steps({ steps, step, onStep, params }) {
  return (
    <nav aria-label="Steps" className={`overflow-y-auto bg-ground px-2 pt-5 pb-4 ${THIN_SCROLL}`}>
      <p className="pb-3 pl-3 text-help text-muted uppercase">Steps</p>
      <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-1.5"
        onKeyDown={(e) => {
          const dir = { ArrowDown: 1, ArrowUp: -1 }[e.key]
          if (!dir) return
          e.preventDefault()
          const at = steps.findIndex((s) => s.key === step)
          const next = steps[(at + dir + steps.length) % steps.length]
          onStep(next.key)
          e.currentTarget.querySelector(`[data-section="${next.key}"]`)?.focus()
        }}>
        {steps.map((s) => {
          const lit = s.key === step
          return (
            <button key={s.key} type="button" role="tab" aria-selected={lit} data-section={s.key} tabIndex={lit ? 0 : -1} onClick={() => onStep(s.key)}
              className={`relative flex shrink-0 flex-col items-start gap-1 rounded-control px-3 py-2 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${lit ? 'bg-field' : 'hover:bg-hover'}`}>
              {lit && <span aria-hidden className="absolute top-1/2 left-0 h-4.5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />}
              <span className="text-label text-text">{s.label}</span>
              {s.state && <span className="text-help text-muted">{s.state(params)}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* `dock` (rows): a window that edits the selection opens beside the right rail, as every effect's settings: its right
   edge 8 from the rail's left, its top on the first of `rows` found among the Effects rows (else the Effects section) */
const dockAt = (rows = []) => {
  const rail = document.querySelector('[data-rail="right"]')
  if (!rail) return undefined
  const row = rows.map((r) => rail.querySelector(`[data-effect-row="${CSS.escape(r)}"]`)).find(Boolean) ?? rail.querySelector('[data-rail-section="Effects"]')
  return { right: rail.getBoundingClientRect().left - 8, y: (row ?? rail).getBoundingClientRect().top }
}

export default function WindowFrame({ movable, title, kind, actions, footer, steps = [], step, onStep, params, aside, onClose, bodyKey, dataWindow, tool, dock, children, ...modal }) {
  const listed = steps.length > 0
  const [place] = useState(() => (dock ? dockAt(dock) : undefined))
  return (
    <ModalDialog variant="kolbox"
      open
      blocking={false}
      movable={movable}
      place={place}
      onClose={onClose}
      aria-label={typeof title === 'string' ? title : undefined}
      width="var(--spacing-modal-generator)"
      className="h-modal-generator-height"
      title={<span className="flex items-baseline gap-2">{title}{kind && <span className="font-normal text-muted">{kind}</span>}</span>}
      actions={actions}
      footer={footer}
      {...modal}
    >
      <div className={`mb-4 grid min-h-0 flex-1 border-y border-border ${listed ? 'grid-cols-[calc(var(--spacing)*39)_minmax(0,1fr)_calc(var(--spacing)*68)]' : 'grid-cols-[minmax(0,1fr)_calc(var(--spacing)*68)]'}`} data-window={dataWindow} data-tool={tool}>
        {listed && <Steps steps={steps} step={step} onStep={onStep} params={params} />}
        <div className={`min-h-0 overflow-y-auto px-6 py-6 ${THIN_SCROLL}`} data-section-body={bodyKey ?? step}>{children}</div>
        <aside className={`min-h-0 overflow-y-auto border-l border-border py-6 pr-6 pl-6 ${THIN_SCROLL}`}>{aside}</aside>
      </div>
    </ModalDialog>
  )
}
