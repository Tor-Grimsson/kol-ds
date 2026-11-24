import { useEffect, useMemo, useRef, useState } from 'react'
import { groupById, groupOfPreset, loopById, useLabsLayer } from '../labs/engine.js'
import { addStep, isToolPreset, loadLibrary, loopSnapshot, pickParams, PRESETS, setMorph, stepFromLayer, stepFromPreset, useMorph } from './engine.js'
import { Input, ModalDialog, TreeRow } from '@kolkrabbi/kol-component'

/* The add-step picker: the package's StepPicker (morph/StepPicker.jsx) carried line for line, drawn in kolbox's Modal
   in place of the DS search modal. Open while the store's `picker` is set (the Steps plus sets it, as the real slot).
   Rows, in order: Current stage (the generator on the stage, while it can be a step), My files (saved labs files),
   then every catalog preset under its generator. In Blend mode after a first step only that generator is listed (one
   schema to tween). The empty field lists the stage, My files and one row per generator; a generator opens its
   presets, All categories goes back; a query searches every row. A pick adds the step and closes; the first step also
   puts its generator on the stage. Up, Down and Enter move and pick, as the search modal's. */
function stepFromFile(item, loopId) {
  const l = loopId ? loopSnapshot(item, loopId) : (item.layers ?? []).find((x) => x?.type === 'loop')
  if (!l) return null
  const schema = loopById(l.loopId)?.params ?? []
  return { loopId: l.loopId, loopGroup: l.loopGroup, presetId: l.presetId, presetLabel: l.presetLabel, params: pickParams(l, schema), source: { kind: 'file', id: item.id, label: item.name || 'Untitled' } }
}

export default function StepPicker() {
  const morph = useMorph()
  const { layer, setOnly } = useLabsLayer()
  const open = !!morph.picker
  const only = morph.mode === 'blend' ? morph.loopId : null
  const [query, setQuery] = useState('')
  const stageOk = layer?.type === 'loop' && (morph.steps.length < 2 || morph.editing != null)

  const { rows, make } = useMemo(() => {
    const rows = [], make = new Map()
    if (!open) return { rows, make }
    if (stageOk && (!only || layer.loopId === only)) {
      rows.push({ id: 'stage', label: layer.presetLabel || 'Current stage', group: 'Current stage', hint: groupById(layer.loopGroup)?.label })
      make.set('stage', () => stepFromLayer(layer))
    }
    for (const it of (loadLibrary().preset ?? []).filter((x) => !x.shipped)) {
      if (it.mode === 'morph' || !(only ? loopSnapshot(it, only) : (it.layers ?? []).some((x) => x?.type === 'loop'))) continue
      const id = `file:${it.id}`
      rows.push({ id, label: it.name || 'Untitled', group: 'My files' })
      make.set(id, () => stepFromFile(it, only))
    }
    for (const p of PRESETS) {
      if (isToolPreset(p) || (only && p.loop !== only)) continue
      const id = `preset:${p.id}`
      rows.push({ id, label: p.label, group: groupById(groupOfPreset(p.id))?.label ?? p.loop, hint: p.sub })
      make.set(id, () => stepFromPreset(p))
    }
    return { rows, make }
  }, [open, only, stageOk, layer])

  const [cat, setCat] = useState(null)
  const suggestions = useMemo(() => {
    if (cat) return [{ id: 'back', label: 'All categories', icon: 'arrow-left', group: cat, keepOpen: true }, ...rows.filter((r) => r.id.startsWith('preset:') && r.group === cat)]
    const counts = new Map()
    for (const r of rows) if (r.id.startsWith('preset:')) counts.set(r.group, (counts.get(r.group) ?? 0) + 1)
    const cats = [...counts].map(([g, n]) => ({ id: `cat:${g}`, label: g, icon: 'arrow-right', group: 'Categories', hint: `${n}`, cat: g, keepOpen: true }))
    return [...rows.filter((r) => !r.id.startsWith('preset:')), ...cats]
  }, [rows, cat])

  const needle = query.trim().toLowerCase()
  const list = needle ? rows.filter((r) => [r.label, r.group, r.hint].some((s) => s && s.toLowerCase().includes(needle))) : suggestions
  const [hi, setHi] = useState(0)
  useEffect(() => { setHi(0) }, [needle, cat, open])
  /* the field takes the focus once the Modal has taken it for its shell */
  const field = useRef(null)
  useEffect(() => { if (open) setTimeout(() => field.current?.focus(), 0) }, [open])

  const onClose = () => { setMorph({ picker: null }); setQuery(''); setCat(null) }
  const onSelect = (row) => {
    if (!row) return
    if (row.keepOpen) { setCat(row.cat ?? null); return }
    const step = make.get(row.id)?.()
    if (!step) return
    if (morph.steps.length === 0) setOnly('loop', { loopGroup: step.loopGroup, presetId: step.presetId, presetLabel: step.presetLabel, loopId: step.loopId, ...step.params })
    addStep(step)
    onClose()
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(list.length - 1, h + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); onSelect(list[hi]) }
  }

  /* rows under their group's heading, in list order */
  const groups = []
  list.forEach((r, i) => {
    if (groups[groups.length - 1]?.name !== r.group) groups.push({ name: r.group, rows: [] })
    groups[groups.length - 1].rows.push([r, i])
  })

  return (
    <ModalDialog variant="kolbox" open={open} onClose={onClose} title="Add step">
      <div className="flex flex-col gap-3 px-4 pb-4" data-step-picker>
        <Input variant="kolbox" ref={field} iconLeft="search" placeholder="Search presets and files" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKey} aria-label="Search presets and files"/>
        <div className="flex max-h-96 flex-col gap-3 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.name} className="flex flex-col gap-1">
              <h3 className="px-2 text-meta text-muted">{g.name}</h3>
              {g.rows.map(([r, i]) => (
                <TreeRow variant="kolbox"
                  key={r.id}
                  icon={r.icon}
                  label={r.label}
                  active={i === hi}
                  onClick={() => onSelect(r)}
                  trailing={r.hint && <span className="shrink-0 truncate font-mono text-meta text-muted">{r.hint}</span>}
                />
              ))}
            </div>
          ))}        </div>
      </div>
    </ModalDialog>
  )
}
