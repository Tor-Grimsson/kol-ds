import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import useExpressionValue from './useExpressionValue.js'

/**
 * Modulatable — any value control, made patchable: an EXPRESSION in its readout and a MODULATION SOURCE on right-click.
 * kol-mirror's `RotaryDial` adapter and its `ModulationAssign` menu, carried (ModulatableControls, 2026-10-28 — user:
 * *"expression generator engine lives in DS, rotary dial lives in DS. nothing here is unique to mirror except that it homes
 * modulation source"*). The app passes its sources and its clock; the behaviour is the DS's.
 *
 * A WRAPPER, NOT A PROP ON THE KNOB: the expression compiler is kol-hardware's (`./signal`), and kol-component — where the
 * panel knob and slider live (kol-component's `Knob` / `Slider` at `variant="panel"`) — cannot import kol-hardware; `Knob` and `Fader` here
 * are aliases on the retirement ledger, which may not gain behaviour. So the seam wraps the control:
 *
 *   <Modulatable label="Gain" value={v} onChange={setV} min={0} max={100} bus={busRef} clock={transport}>
 *     <Knob variant="panel" size="lg" />
 *   </Modulatable>
 *
 * The child gets `value` · `onChange` · `min` · `max` handed in. Under it, the readout: the label, then the value — click it
 * and type a number or an expression (`wave(t)`, `A * 0.5`), Enter commits, Escape cancels; alt-click clears a running one,
 * which reads in the accent. Right-click the control: None, then each source on the bus (`A`–`D` read as Expression A–D);
 * picking one runs it (the source's name IS the expression) and lights the 5px `--kol-ctl-led-red` dot.
 *
 * @param {number}   value · {Function} onChange · {number} min · {number} max   the control's own
 * @param {string}   label        the readout's label
 * @param {Object}   bus          the modulation bus — a ref (`{ current: { A, B, … } }`) or the object; its keys are the sources
 * @param {string[]} sources      the sources to offer, when not every bus key (defaults to the bus's keys)
 * @param {Object|Function} clock a transport (`createTransport()`) or `() => seconds` — what `t` is
 * @param {string|null} source    the assigned source, controlled; with `onSourceChange`. Uncontrolled, the wrapper keeps it
 * @param {'default'|'dense'} density  the readout's type: mirror's 10px mono, or `dense` at 8
 */
const sourceLabel = (key) => (/^[A-D]$/.test(key) ? `Expression ${key}` : key)

function ModulationMenu({ x, y, sources, current, onSelect, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const key = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', handle)
    window.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', handle); window.removeEventListener('keydown', key) }
  }, [onClose])
  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Modulation"
      className="flex flex-col bg-surface-secondary border border-fg-16 shadow-lg"
      style={{ position: 'fixed', left: x, top: y, zIndex: 9999, borderRadius: '4px', minWidth: '100px', padding: '2px 0' }}
    >
      <div className="kol-helper-10 text-fg-32 px-2 py-1" style={{ borderBottom: '1px solid var(--kol-fg-08)' }}>Modulation</div>
      {[{ id: null, label: 'None' }, ...sources.map((k) => ({ id: k, label: sourceLabel(k) }))].map((src) => (
        <button
          key={src.id ?? 'none'}
          type="button"
          role="menuitemradio"
          aria-checked={current === src.id}
          className={`kol-helper-12 px-2 py-1 text-left cursor-pointer bg-transparent border-0 hover:bg-fg-08 ${current === src.id ? 'text-accent-primary' : 'text-fg-96'}`}
          onClick={() => { onSelect(src.id); onClose() }}
        >
          {src.label}
        </button>
      ))}
    </div>
  )
}

export default function Modulatable({ children, value = 0, onChange, min = 0, max = 100, label, bus, sources: sourcesProp, clock, source, onSourceChange, density = 'default', className = '' }) {
  const [ownSource, setOwnSource] = useState(null)
  const mod = source !== undefined ? source : ownSource
  const assign = onSourceChange ?? setOwnSource
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [menu, setMenu] = useState(null)
  const { expr, commit, isAnimating } = useExpressionValue({ onChange, min, max, bus, clock })
  const busObj = (bus && typeof bus === 'object' && 'current' in bus ? bus.current : bus) ?? {}
  const sources = sourcesProp ?? Object.keys(busObj)

  const onContextMenu = useCallback((e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }) }, [])
  const select = useCallback((id) => { commit(id ?? ''); assign(id) }, [commit, assign])
  const done = () => { setEditing(false); commit(draft); if (!String(draft).trim() || !isNaN(parseFloat(draft))) assign(null) }

  const child = Children.only(children)
  const control = isValidElement(child) ? cloneElement(child, { value, onChange, min, max }) : child
  const dense = density === 'dense'

  return (
    <div className={`flex flex-col items-center ${className}`.trim()} data-modulatable>
      <div className="relative select-none flex items-center justify-center" onContextMenu={onContextMenu}>
        {control}
        {mod && <span aria-label={`Modulated by ${sourceLabel(mod)}`} style={{ position: 'absolute', bottom: dense ? 2 : 4, right: 0, width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--kol-ctl-led-red)' }} />}
      </div>
      {menu && createPortal(<ModulationMenu x={menu.x} y={menu.y} sources={sources} current={mod} onSelect={select} onClose={() => setMenu(null)} />, document.body)}
      <div className={`flex items-center justify-center gap-1 w-full ${dense ? 'kol-helper-8' : ''}`} style={dense ? {} : { fontSize: '10px', fontFamily: 'var(--kol-font-family-mono)' }}>
        {label && <span className="text-fg-64 uppercase">{label}</span>}
        <span className="text-fg-96" style={{ minWidth: 32, textAlign: 'right', display: 'inline-block', overflow: 'hidden' }}>
          {editing ? (
            <input
              type="text"
              value={draft}
              aria-label={`${label ?? 'Value'} — a number or an expression`}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={done}
              onKeyDown={(e) => { if (e.key === 'Enter') done(); if (e.key === 'Escape') setEditing(false) }}
              autoFocus
              className="bg-surface-tertiary"
              style={{ width: '100%', height: 15, border: 'none', outline: 'none', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', padding: 0, textAlign: 'right', borderRadius: 2, lineHeight: '15px' }}
            />
          ) : (
            <button
              type="button"
              data-readout
              className={`cursor-pointer bg-transparent border-0 p-0 ${isAnimating ? 'text-accent-primary' : ''}`}
              style={{ font: 'inherit', color: isAnimating ? undefined : 'inherit' }}
              onClick={(e) => { if (e.altKey && isAnimating) { commit(''); assign(null) } else { setDraft(expr || String(Math.round(value))); setEditing(true) } }}
            >
              {expr || `${Math.round(value)}`}
            </button>
          )}
        </span>
      </div>
    </div>
  )
}
