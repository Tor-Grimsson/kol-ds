import { useState } from 'react'
import { findLayerDeep, LAYER_EFFECTS, layerEffectsOf, makeEffect, useComposeState, useLayerEdit } from '../engine.js'
import { ParamList } from '../../labs/Params.jsx'
import { Button, Input, ModalDialog, ToggleCheckbox, Tooltip } from '@kolkrabbi/kol-component'

/* Layer Effects, as the real ModalLayerEffects: the ten effects always listed, each with its on/off; add and remove on
   the five that stack; the selected row's controls on the right (the kit's AutoControls, ParamList); Move up and Move
   down among its own kind; Scale with Object; Fill Opacity; Close. Every edit is live and undoable through the
   engine's useLayerEdit; there is no OK or Cancel. For the selected layer; with none it draws nothing, as the real one. */
export default function WindowLayerEffects({ onClose }) {
  const { selectedId, layers, palette } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  if (!layer) return null
  return <Window key={layer.id} layer={layer} palette={palette} onClose={onClose} />
}

function Window({ layer, palette, onClose }) {
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const effects = layerEffectsOf(layer)
  const [sel, setSel] = useState(LAYER_EFFECTS[0].id)
  const write = (next) => edit.patch({ effects: next })

  const rows = LAYER_EFFECTS.flatMap((def) => {
    const inst = effects.filter((e) => e.id === def.id)
    return inst.length ? inst.map((e) => ({ def, e })) : [{ def, e: null }]
  })
  const row = rows.find((r) => (r.e ? r.e.key === sel : r.def.id === sel)) ?? rows[0]

  const ensure = (r, enabled) => {
    if (r.e) return r.e
    const e = makeEffect(r.def.id, enabled)
    write([...effects, e])
    setSel(e.key)
    return e
  }
  const toggle = (r) => {
    if (!r.e) { ensure(r, true); return }
    write(effects.map((e) => (e.key === r.e.key ? { ...e, enabled: e.enabled === false } : e)))
  }
  const add = (r) => {
    const e = makeEffect(r.def.id, true)
    const at = r.e ? effects.indexOf(r.e) + 1 : effects.length
    write([...effects.slice(0, at), e, ...effects.slice(at)])
    setSel(e.key)
  }
  const remove = (r) => {
    if (!r.e) return
    write(effects.filter((e) => e.key !== r.e.key))
    setSel(r.def.id)
  }
  const move = (dir) => {
    if (!row.e) return
    const same = effects.filter((e) => e.id === row.e.id)
    const i = same.indexOf(row.e), j = i + dir
    if (j < 0 || j >= same.length) return
    const a = effects.indexOf(same[i]), b = effects.indexOf(same[j])
    const next = [...effects]; [next[a], next[b]] = [next[b], next[a]]
    write(next)
  }
  const setParam = (k, v) => {
    const e = row.e ?? ensure(row, true)
    const base = row.e ? effects : [...effects, e]
    write(base.map((x) => (x.key === e.key ? { ...x, enabled: true, params: { ...x.params, [k]: v } } : x)))
  }
  const params = { ...Object.fromEntries(row.def.params.map((p) => [p.key, p.default])), ...(row.e?.params ?? {}) }
  const sameKind = row.e ? effects.filter((e) => e.id === row.e.id) : []
  const fill = Math.round((layer.effectsFillOpacity ?? 1) * 100)
  const scaled = !!layer.effectsRefW
  const setScaled = (v) => edit.patch({ effectsRefW: v ? (layer.w ?? null) : null })

  return (
    <ModalDialog variant="kolbox"
      open
      onClose={onClose}
      title="Layer Effects"
      width="var(--spacing-modal-wide)"
      footer={(
        <>
          <ToggleCheckbox variant="kolbox" aria-label="Scale with Object" checked={scaled} onChange={setScaled} />
          <span className="cursor-pointer text-label text-text" onClick={() => setScaled(!scaled)}>Scale with Object</span>
          <span className="flex-1" />
          <span className="text-label text-text">Fill Opacity</span>
          <Input variant="kolbox" aria-label="Fill opacity" type="number" min={0} max={100} value={fill} className="w-18 shrink-0"
            onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) edit.patch({ effectsFillOpacity: Math.max(0, Math.min(100, v)) / 100 }) }} />
          <Button variant="kolbox" onClick={onClose}>Close</Button>
        </>
      )}
    >
      <div className="grid h-[540px] max-h-[70vh] grid-cols-[280px_1px_1fr]" data-window="layer-effects">
        <div className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto px-2" role="listbox" aria-label="Effects">
            {rows.map((r) => {
              const id = r.e ? r.e.key : r.def.id
              const on = !!r.e && r.e.enabled !== false
              const active = row === r
              return (
                <div key={id} role="option" aria-selected={active} onClick={() => setSel(id)} data-effect-row={r.def.id}
                  className={`flex h-control shrink-0 cursor-pointer items-center gap-1 rounded-control pr-1 text-label ${active ? 'bg-field text-text' : 'text-muted hover:bg-field hover:text-text'}`}>
                  <span onClick={(ev) => ev.stopPropagation()} className="inline-flex">
                    <ToggleCheckbox variant="kolbox" aria-label={`${r.def.label} on`} checked={on} onChange={() => toggle(r)} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{r.def.label}</span>
                  {r.def.stack && (
                    <span className="flex items-center" onClick={(ev) => ev.stopPropagation()}>
                      <Tooltip variant="kolbox" label={`Add ${r.def.label}`}><Button variant="kolbox" iconOnly="plus" aria-label={`Add ${r.def.label}`} onClick={() => add(r)}/></Tooltip>
                      <Tooltip variant="kolbox" label={`Remove ${r.def.label}`}><Button variant="kolbox" iconOnly="x" aria-label={`Remove ${r.def.label}`} disabled={!r.e} onClick={() => remove(r)}/></Tooltip>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-1 px-2 py-2">
            <Tooltip variant="kolbox" label="Move up"><Button variant="kolbox" iconOnly="chevron-up" aria-label="Move up" disabled={!row.e || sameKind.indexOf(row.e) <= 0} onClick={() => move(-1)}/></Tooltip>
            <Tooltip variant="kolbox" label="Move down"><Button variant="kolbox" iconOnly="chevron-down" aria-label="Move down" disabled={!row.e || sameKind.indexOf(row.e) >= sameKind.length - 1} onClick={() => move(1)}/></Tooltip>
          </div>
        </div>
        <div role="separator" className="bg-border" />
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-4" data-effect-params={row.def.params.length}>
          <ParamList schema={row.def.params} layer={params} setProp={setParam} palette={palette} flat wide />
        </div>
      </div>
    </ModalDialog>
  )
}
