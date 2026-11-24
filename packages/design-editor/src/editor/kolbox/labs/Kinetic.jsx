import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_POINTS, DEFAULT_THEME, isBinding, KINETIC_KNOBS, KINETIC_PRESETS, KINETIC_TREE, knobOptions, knobRange,
  mergeInstance, mulberry32, OPENTYPE_FEATURES, presetComp, randomiseComp, resolveColor, resolveTheme, THEME_OPTIONS,
  useComposeState, useLabsKeys, useLabsLayer, useLayerEdit, useRollSeed,
} from './engine.js'
import { CommitInput, OffOn } from './Params.jsx'
import { Button, ButtonGroup, Dropdown, LabeledControl, Menu, Slider, TabsRow, Textarea, ToggleCheckbox, Tooltip, LabeledControlSection, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'
import { mixedLabel, useMixed } from '../editor/generate/ContentScopeAll.jsx'

/* The kinetic type composer (round 3, 6.2): the package's KineticPanel as Labs shows it (KineticSurface), drawn with
   kolbox's rail parts. Every row comes from the composer's own definitions: the picker over KINETIC_TREE and
   KINETIC_PRESETS, the knobs from KINETIC_KNOBS with their when-gates, options and ranges, the same writes (comp
   transforms through the layer's `comp`, structural edits as discrete history). Generate holds the elements and the
   rolls; Style and Animation the knobs for the picked element, its OpenType features and its motion layers. Edit on
   canvas fires the real `kol:kinetic-edit`; Labs' stage (labs/Stage.jsx) mounts the engine's element editor on it.
   The custom path's points are dragged in a small box (the path's 0 to 1 space), one write when the drag ends.
   editor: the body sits in the editor's rail on one layer of many (round 3 faults, 1), as GenerativeBody's `editor`:
   R and Shift+R stay the editor's keys (R is its Rectangle tool). */

const MOTION_KEYS = new Set(['mode', 'cycles', 'motionAmp', 'motionPhase', 'axis', 'field'])
const NEW_MOTION = { mode: 'glyphwave', cycles: 1, phase: 0.5, amp: 0.3, axis: 'wght', field: 'x' }
const GROUP_KEYS = new Set(['align', 'italic', 'fill', 'fontSize', 'vfWght', 'offsetX', 'offsetY'])
const EDIT_TIP = 'Edit elements on the canvas (click to select, drag to move, corners to scale)'
const MORPH_BLEND ={ key: 'morphBlend', label: 'Morph blend', min: 0, max: 1, step: 0.01, default: 0.5 }
const groupTag = (gid, groups) => (gid ? String.fromCharCode(97 + (groups.indexOf(gid) % 26)) : null)
const decimals = (step) => (step && step < 1 ? (String(step).split('.')[1]?.length ?? 2) : 0)

export default function KineticBody({ layer, tab, editor = false }) {
  const { updateLayer, palette } = useComposeState()
  const { setOnly } = useLabsLayer()
  const setProp = useLayerEdit(layer.id, { history: 'coalesce' }).setProp
  const comp = layer.comp ?? { bg: '#0b0d12', instances: [] }
  const insts = comp.instances ?? []

  /* the picked element, mirrored with the canvas as the real panel does */
  const [sel, setSel] = useState(0)
  const idx = Math.min(sel, Math.max(0, insts.length - 1))
  const selectElement = (i) => {
    setSel(i)
    window.dispatchEvent(new CustomEvent('kol:kinetic-element', { detail: { id: layer.id, index: i, from: 'panel' } }))
  }
  useEffect(() => {
    const onEl = (e) => { if (e.detail?.id === layer.id && e.detail.from === 'canvas') setSel(e.detail.index) }
    window.addEventListener('kol:kinetic-element', onEl)
    return () => window.removeEventListener('kol:kinetic-element', onEl)
  }, [layer.id])

  const [marked, setMarked] = useState([])
  const toggleMark = (id) => setMarked((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  const groupMembers = (i) => {
    const g = insts[i]?.group
    return g ? insts.reduce((acc, x, j) => (x.group === g ? [...acc, j] : acc), []) : [i]
  }

  const [motionSel, setMotionSel] = useState(0)
  const motions = insts[idx]?.motions ?? []
  const mIdx = Math.min(motionSel, motions.length)
  const motionView = (c) => ({ ...c, instances: (c.instances ?? []).map((x, j) => (j === idx ? { ...x, motion: { ...(x.motions?.[mIdx - 1] ?? {}) } } : x)) })
  const viewFor = (k) => (MOTION_KEYS.has(k.key) && mIdx > 0 ? motionView(comp) : comp)

  const applyPreset = (preset) => {
    if (!preset) return
    updateLayer(layer.id, { presetId: preset.id, presetLabel: preset.label, comp: presetComp(preset) })
    setSel(0)
    setMotionSel(0)
  }
  const writeComp = (next) => setProp('comp', next)
  const writeInstances = (instances) => updateLayer(layer.id, { comp: { ...comp, instances } })
  const patchInstance = (i, partial) => writeComp({ ...comp, instances: insts.map((x, j) => (j === i ? { ...x, ...partial } : x)) })

  const groupMarked = () => {
    if (marked.length < 2) return
    const existing = new Set(insts.map((x) => x.group).filter(Boolean))
    let n = 1
    while (existing.has(`g${n}`)) n++
    writeInstances(insts.map((x) => (marked.includes(x.id) ? { ...x, group: `g${n}` } : x)))
    setMarked([])
  }
  const ungroupMarked = () => {
    if (!marked.length) return
    writeInstances(insts.map((x) => (marked.includes(x.id) ? { ...x, group: null } : x)))
    setMarked([])
  }

  /* the one write path, as KineticPanel's writeKnob: motion stack swap-out, group fan-out, else the knob's transform */
  const writeKnob = (k, v) => {
    if (MOTION_KEYS.has(k.key) && mIdx > 0) {
      const m = k.set(motionView(comp), v, idx).instances?.[idx]?.motion ?? {}
      patchInstance(idx, { motions: motions.map((mm, j) => (j === mIdx - 1 ? m : mm)) })
      return
    }
    const members = groupMembers(idx)
    if (members.length > 1 && GROUP_KEYS.has(k.key)) {
      let next = comp
      if (k.key === 'fontSize') {
        const base = Number(k.get(comp, idx)) || 1
        for (const j of members) next = k.set(next, Math.max(8, Math.min(1200, Math.round((Number(k.get(comp, j)) || base) * (v / base)))), j)
      } else if (k.key === 'offsetX' || k.key === 'offsetY') {
        const delta = v - (Number(k.get(comp, idx)) || 0)
        for (const j of members) next = k.set(next, (Number(k.get(comp, j)) || 0) + delta, j)
      } else {
        for (const j of members) next = k.set(next, v, j)
      }
      writeComp(next)
      return
    }
    writeComp(k.set(comp, v, idx))
  }

  const seed = useRollSeed(layer)
  const onRandomise = (tabs = null) => {
    const s = seed.take()
    updateLayer(layer.id, { comp: randomiseComp(comp, idx, mulberry32(s >>> 0), tabs), _rollSeed: s })
  }
  const onRandomiseAll = () => {
    const s = seed.take()
    const rng = mulberry32(s >>> 0)
    let next = comp
    insts.forEach((_, i) => { next = randomiseComp(next, i, rng) })
    updateLayer(layer.id, { comp: next, _rollSeed: s })
  }
  const applyTheme = (id, inv) => {
    const t = resolveTheme(id, inv)
    updateLayer(layer.id, { themeId: id, themeInvert: inv, comp: { ...comp, bg: t.bg, instances: insts.map((x) => ({ ...x, fill: t.fg })) } })
  }
  const onRollPreset = () => {
    const here = KINETIC_PRESETS.find((p) => p.id === layer.presetId)
    const pool = KINETIC_PRESETS.filter((p) => p.id !== here?.id && (!here || p.sub === here.sub))
    if (pool.length) applyPreset(pool[Math.floor(mulberry32(seed.take() >>> 0)() * pool.length)])
  }
  const onRollColor = () => {
    const rng = mulberry32(seed.take() >>> 0)
    applyTheme(THEME_OPTIONS[Math.floor(rng() * THEME_OPTIONS.length)].value, rng() < 0.5)
  }
  const onReset = () => applyPreset(KINETIC_PRESETS.find((p) => p.id === layer.presetId) ?? KINETIC_PRESETS[0])

  /* R resets, Shift+R rolls every element, as KineticSurface binds them; `editor` is fixed for a mount, so the hook
     order never changes */
  if (!editor) useLabsKeys( // eslint-disable-line react-hooks/rules-of-hooks
    () => { const p = KINETIC_PRESETS.find((x) => x.id === layer.presetId); if (p) setOnly('kinetic', { presetId: p.id, presetLabel: p.label, comp: presetComp(p) }) },
    onRandomiseAll,
  )

  const knobs = KINETIC_KNOBS.filter((k) => k.tab === tab && (!k.when || k.when(viewFor(k), idx)))
  const selInst = insts[idx]
  const anyMorph = insts.some((x) => x?.morph?.on)

  /* the knobs in sections, as the real rail's eyebrows split them; OpenType goes in before Arrangement and the custom
     path's points after Show path, where KineticPanel puts them */
  const sections = []
  const push = (title, node) => {
    const last = sections[sections.length - 1]
    if (last && last.title === title) last.rows.push(node)
    else sections.push({ title, rows: [node] })
  }
  if (tab !== 'generate') {
    for (const k of knobs) {
      if (k.key === 'arrangement') {
        push('OpenType', <OpenTypeMenu key="opentype" value={selInst?.opentype ?? {}} onToggle={(tag, on) => patchInstance(idx, { opentype: { ...(selInst?.opentype ?? {}), [tag]: on } })} />)
      }
      push(k.section, <KineticKnob key={k.key} knob={k} comp={viewFor(k)} viewOf={(c) => (MOTION_KEYS.has(k.key) && mIdx > 0 ? motionView(c) : c)} idx={idx} palette={palette} onWrite={writeKnob}
        bridge={MOTION_KEYS.has(k.key) && mIdx > 0 ? null : { layer, setProp, key: `kin:${idx}:${k.key}` }} />)
      if (k.key === 'showPath' && selInst?.path?.type === 'custom') {
        push(k.section, <CustomPathPoints key="points" inst={selInst} onPoints={(pts) => patchInstance(idx, { path: { ...(selInst?.path ?? {}), points: pts } })} />)
      }
    }
  }
  const current = KINETIC_PRESETS.find((p) => p.id === layer.presetId) ?? KINETIC_PRESETS[0]
  const mixedText = useMixed((v) => v.comp?.instances?.[idx]?.text ?? '')
  const mixedTheme = useMixed((v) => v.themeId ?? DEFAULT_THEME)
  const mixedInvert = useMixed((v) => !!v.themeInvert)
  const mixedFill = useMixed((v) => v.comp?.instances?.[0]?.fill ?? null)
  const mixedPreset = useMixed((v) => v.presetId ?? null)

  return (
    <>
      <LabeledControlSection variant="kolbox">
        <KineticPicker current={current} onPick={applyPreset} mixed={mixedPreset} />
      </LabeledControlSection>

      {tab === 'generate' ? (
        <>
          <LabeledControlSection variant="kolbox" label="Elements">
            <ElementList insts={insts} idx={idx} onSelect={selectElement} onWrite={writeInstances} marked={marked} onMark={toggleMark} onGroup={groupMarked} onUngroup={ungroupMarked} />
            {/* the real button: it toggles the engine's element editor on the stage (labs/Stage.jsx, the editor's own canvas) */}
            <Tooltip variant="kolbox" label={EDIT_TIP}>
              <Button variant="kolbox" tone="primary" className="w-full" aria-label={EDIT_TIP}
                onClick={() => window.dispatchEvent(new CustomEvent('kol:kinetic-edit', { detail: { id: layer.id, index: idx } }))}>
                Edit on canvas
              </Button>
            </Tooltip>
          </LabeledControlSection>
          <LabeledControlSection variant="kolbox">
            <LabeledControl variant="kolbox" label={mixedLabel('Text', mixedText)}>
              <Textarea variant="kolbox"
                rows={2}
                aria-label="Text"
                value={selInst?.text ?? ''}
                onChange={(e) => patchInstance(idx, { text: e.target.value })}
              />
            </LabeledControl>
            <LabeledControl variant="kolbox" horizontal label={mixedLabel('Theme', mixedTheme)}>
              <Dropdown variant="kolbox" className="min-w-0 flex-1" options={THEME_OPTIONS} value={layer.themeId ?? DEFAULT_THEME} onChange={(id) => applyTheme(id, !!layer.themeInvert)} />
            </LabeledControl>
            <LabeledControl variant="kolbox" horizontal label={mixedLabel('Invert', mixedInvert)}>
              <OffOn on={!!layer.themeInvert} onChange={(v) => applyTheme(layer.themeId ?? DEFAULT_THEME, v)} />
            </LabeledControl>
            <LabeledControl variant="kolbox" horizontal label={mixedLabel('Text color', mixedFill)}>
              <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Text color" value={insts[0]?.fill} resolved={resolveColor(insts[0]?.fill, palette) ?? undefined}
                onChange={(v) => writeComp({ ...comp, instances: insts.map((x) => ({ ...x, fill: resolveColor(v, palette) ?? v })) })} />
            </LabeledControl>
          </LabeledControlSection>
          <LabeledControlSection variant="kolbox">
            <Button variant="kolbox" tone="secondary" className="w-full" onClick={onRollPreset}>Randomize preset</Button>
            <div className="flex gap-2">
              <Button variant="kolbox" tone="secondary" className="min-w-0 flex-1" onClick={() => onRandomise()}>Randomize all</Button>
              <Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" onClick={onReset}/>
            </div>
            <ButtonGroup layout="grid">
              <Button variant="kolbox" tone="secondary" onClick={onRollColor}>Color</Button>
              <Button variant="kolbox" tone="secondary" onClick={() => onRandomise(['style'])}>Type</Button>
              <Button variant="kolbox" tone="secondary" onClick={() => onRandomise(['anim'])}>Motion</Button>
              <Button variant="kolbox" tone="secondary" onClick={onRandomiseAll}>All elements</Button>
            </ButtonGroup>
            <LabeledControl variant="kolbox" horizontal label="Seed">
              <CommitInput value={seed.value} aria-label="Seed" onCommit={(raw) => { const n = Math.floor(Number(raw)); if (Number.isFinite(n) && n >= 0) seed.commit(n) }} />
            </LabeledControl>
          </LabeledControlSection>
        </>
      ) : insts.length > 1 && (
        <p className="truncate px-4 pb-2 text-help text-muted">{`Element ${idx + 1}: ${selInst?.text || '—'}`}</p>
      )}

      {tab === 'anim' && (
        <LabeledControlSection variant="kolbox" label="Motion layers">
          <div className="flex items-center gap-1">
            <TabsRow variant="kolbox" className="min-w-0 flex-1" value={String(mIdx)} onChange={(v) => setMotionSel(Number(v))}
              tabs={[{ value: '0', label: '1' }, ...motions.map((_, i) => ({ value: String(i + 1), label: String(i + 2) }))]} />
            <Button variant="kolbox" iconOnly="plus" aria-label="Add motion layer" onClick={() => {
              writeInstances(insts.map((x, j) => (j === idx ? { ...x, motions: [...motions, { ...NEW_MOTION }] } : x)))
              setMotionSel(motions.length + 1)
            }}/>
            <span className={mIdx === 0 ? 'invisible pointer-events-none' : 'contents'} aria-hidden={mIdx === 0 || undefined}>
              <Button variant="kolbox" iconOnly="x" aria-label="Delete motion layer" onClick={() => {
                if (mIdx === 0) return
                writeInstances(insts.map((x, j) => (j === idx ? { ...x, motions: motions.filter((_, m) => m !== mIdx - 1) } : x)))
                setMotionSel(mIdx - 1)
              }}/>
            </span>
          </div>
        </LabeledControlSection>
      )}

      {sections.map((s, i) => <LabeledControlSection variant="kolbox" key={`${s.title ?? ''}-${i}`} label={s.title}>{s.rows}</LabeledControlSection>)}

      {tab === 'anim' && anyMorph && (
        <LabeledControlSection variant="kolbox">
          <MorphBlend layer={layer} setProp={setProp} insts={insts} />
        </LabeledControlSection>
      )}
    </>
  )
}

/* Type, Category, Preset over the kinetic catalog (the package's TreePicker) */
function KineticPicker({ current, onPick, mixed }) {
  const type = KINETIC_TREE.find((t) => t.subs.includes(current.sub)) ?? KINETIC_TREE[0]
  const firstOf = (sub) => KINETIC_PRESETS.find((p) => p.sub === sub)
  return (
    <>
      <LabeledControl variant="kolbox" horizontal label="Type">
        <Dropdown variant="kolbox" className="min-w-0 flex-1" value={type.label} options={KINETIC_TREE.map((t) => t.label)} onChange={(l) => { const t = KINETIC_TREE.find((x) => x.label === l); if (t) onPick(firstOf(t.subs[0])) }} />
      </LabeledControl>
      <LabeledControl variant="kolbox" horizontal label="Category">
        <Dropdown variant="kolbox" className="min-w-0 flex-1" value={current.sub} options={type.subs} onChange={(s) => onPick(firstOf(s))} />
      </LabeledControl>
      <LabeledControl variant="kolbox" horizontal label={mixedLabel('Preset', mixed)}>
        <Dropdown variant="kolbox" className="min-w-0 flex-1" value={current.id} options={KINETIC_PRESETS.filter((p) => p.sub === current.sub).map((p) => ({ value: p.id, label: p.label }))} onChange={(id) => onPick(KINETIC_PRESETS.find((p) => p.id === id))} />
      </LabeledControl>
    </>
  )
}

/* the comp's elements: tick, number, text, group tag, duplicate, delete; Group and Ungroup for ticked rows; Add element
   and move up or down */
function ElementList({ insts, idx, onSelect, onWrite, marked, onMark, onGroup, onUngroup }) {
  const uid = () => { let n = insts.length; while (insts.some((x) => x.id === `i${n}`)) n++; return `i${n}` }
  const add = () => {
    const s = { id: uid(), text: 'Text' }
    if (insts[idx]?.fill) s.fill = insts[idx].fill
    onWrite([...insts, mergeInstance(s, insts.length)])
    onSelect(insts.length)
  }
  const duplicate = (i) => { const next = [...insts]; next.splice(i + 1, 0, { ...structuredClone(insts[i]), id: uid() }); onWrite(next); onSelect(i + 1) }
  const remove = (i) => { if (insts.length <= 1) return; onWrite(insts.filter((_, j) => j !== i)); onSelect(Math.min(i, insts.length - 2)) }
  const move = (d) => {
    const to = idx + d
    if (to < 0 || to >= insts.length) return
    const next = [...insts]
    const [m] = next.splice(idx, 1)
    next.splice(to, 0, m)
    onWrite(next)
    onSelect(to)
  }
  const groupIds = [...new Set(insts.map((x) => x.group).filter(Boolean))]
  return (
    <>
      <div className="flex flex-col">
        {insts.map((ins, i) => {
          const tag = groupTag(ins.group, groupIds)
          return (
            <div key={ins.id ?? i} onClick={() => onSelect(i)}
              className={`flex h-control cursor-pointer items-center gap-1 rounded-control pr-1 text-label ${i === idx ? 'bg-field text-text' : 'text-muted hover:bg-hover hover:text-text'}`}>
              <span onClick={(e) => e.stopPropagation()} className="contents"><ToggleCheckbox variant="kolbox" aria-label={`Mark element ${i + 1}`} checked={marked.includes(ins.id)} onChange={() => onMark(ins.id)} /></span>
              <span className="w-4 shrink-0 font-mono text-meta text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{ins.text || '—'}</span>
              {tag && <span className="shrink-0 font-mono text-meta text-muted">grp {tag}</span>}
              <Button variant="kolbox" iconOnly="copy" aria-label="Duplicate element" onClick={(e) => { e.stopPropagation(); duplicate(i) }}/>
              <span className={insts.length <= 1 ? 'invisible pointer-events-none' : 'contents'} aria-hidden={insts.length <= 1 || undefined}>
                <Button variant="kolbox" iconOnly="x" aria-label="Delete element" onClick={(e) => { e.stopPropagation(); remove(i) }}/>
              </span>
            </div>
          )
        })}
      </div>
      {marked.length > 0 && (
        <ButtonGroup layout="grid">
          {marked.length >= 2 && <Button variant="kolbox" tone="secondary" onClick={onGroup}>Group</Button>}
          <Button variant="kolbox" tone="secondary" onClick={onUngroup}>Ungroup</Button>
        </ButtonGroup>
      )}
      <div className="flex items-center gap-1">
        <Button variant="kolbox" tone="secondary" className="min-w-0 flex-1" iconLeft="plus" onClick={add}>Add element</Button>
        <span className={idx <= 0 ? 'invisible pointer-events-none' : 'contents'} aria-hidden={idx <= 0 || undefined}>
          <Button variant="kolbox" iconOnly="chevron-down" className="rotate-180" aria-label="Move element up" onClick={() => move(-1)}/>
        </span>
        <span className={idx >= insts.length - 1 ? 'invisible pointer-events-none' : 'contents'} aria-hidden={idx >= insts.length - 1 || undefined}>
          <Button variant="kolbox" iconOnly="chevron-down" aria-label="Move element down" onClick={() => move(1)}/>
        </span>
      </div>
    </>
  )
}

/* one knob as its control: color a FillRow, select a Dropdown, range a Slider over the knob's own range; a knob bound to
   a modulation shows "animated", as the real rail does */
function KineticKnob({ knob: k, comp, viewOf, idx, palette, onWrite, bridge }) {
  const label = mixedLabel(k.label, useMixed((v) => [bridge ? v[bridge.key] ?? null : null, k.get(viewOf(v.comp ?? { instances: [] }), idx) ?? null]))
  const value = k.get(comp, idx)
  const write = (v) => onWrite(k, v)
  if (k.type === 'color') {
    return <LabeledControl variant="kolbox" horizontal label={label}><ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={k.label} value={value} resolved={resolveColor(value, palette) ?? undefined} onChange={(v) => write(resolveColor(v, palette) ?? v)} /></LabeledControl>
  }
  if (k.type === 'select') {
    return <LabeledControl variant="kolbox" horizontal label={label}><Dropdown variant="kolbox" className="min-w-0 flex-1" options={knobOptions(k, comp, idx).map((o) => ({ value: String(o.value), label: String(o.label) }))} value={String(value ?? '')} onChange={write} /></LabeledControl>
  }
  const { min, max } = knobRange(k, comp, idx)
  const raw = bridge && bridge.layer[bridge.key]
  const shown = typeof raw === 'number' ? raw : value
  const slide = typeof raw === 'number' ? (v) => bridge.setProp(bridge.key, v) : write
  const dec = decimals(k.step)
  const num = typeof shown === 'number' ? shown : min
  return (
    <LabeledControl variant="kolbox" horizontal label={label}>
      {isBinding(raw)
        ? <span className="flex-1 px-1 text-help text-muted italic">animated</span>
        : <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" min={min} max={max} step={k.step ?? 1} value={dec ? Number(num.toFixed(dec)) : num} aria-label={k.label} onChange={slide} />}
    </LabeledControl>
  )
}

/* OpenType: a multi pick that stays open (the labs OpenTypeMenu): each row toggles its feature; the field shows the count */
function OpenTypeMenu({ value = {}, onToggle }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const picked = useRef(false)
  const count = OPENTYPE_FEATURES.filter((f) => value[f.tag]).length
  return (
    <>
      <Button variant="kolbox" ref={ref} tone="secondary" className="w-full justify-between" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {count ? `${count} feature${count > 1 ? 's' : ''}` : 'None'}
      </Button>
      <Menu variant="kolbox"
        anchor={ref}
        open={open}
        aria-label="OpenType"
        minWidth={ref.current?.offsetWidth}
        groups={[OPENTYPE_FEATURES.map((f) => ({ label: f.label, value: f.tag, check: !!value[f.tag] }))]}
        onSelect={(row) => { picked.current = true; onToggle(row.value, !value[row.value]) }}
        onClose={() => { if (picked.current) { picked.current = false; return } setOpen(false) }}
      />
    </>
  )
}

/* the custom arrangement's points: each a handle in the path's 0 to 1 box, dragged, the path written once on release;
   Add and Remove point as before */
function CustomPathPoints({ inst, onPoints }) {
  const stored = inst?.path?.points
  const saved = Array.isArray(stored) && stored.length >= 2 ? stored : DEFAULT_POINTS
  const [moving, setMoving] = useState(null)
  const points = moving ?? saved
  const box = useRef(null)
  const down = (i) => (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const el = box.current, r = el.getBoundingClientRect()
    let live = points
    const at = (ev) => [Math.round(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)) * 100) / 100, Math.round(Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)) * 100) / 100]
    const move = (ev) => { live = live.map((p, j) => (j === i ? at(ev) : p)); setMoving(live) }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setMoving(null); if (live !== points) onPoints(live) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  return (
    <div className="flex flex-col gap-2">
      <svg ref={box} viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`Path, ${points.length} points`} className="h-24 w-full touch-none overflow-visible rounded-well bg-field" data-path-points>
        <polyline points={points.map(([x, y]) => `${x * 100},${y * 100}`).join(' ')} fill="none" stroke="var(--color-muted)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="pointer-events-none relative -mt-26 h-24 w-full">
        {points.map(([x, y], i) => (
          <span key={i} onPointerDown={down(i)} data-path-point={i} aria-label={`Point ${i + 1}`}
            className="pointer-events-auto absolute size-2.5 -translate-1/2 cursor-grab rounded-full bg-accent active:cursor-grabbing" style={{ left: `${x * 100}%`, top: `${y * 100}%` }} />
        ))}
      </div>
      <ButtonGroup layout="grid">
        <Button variant="kolbox" tone="secondary" onClick={() => onPoints([...points, [0.5, 0.5]])}>Add point</Button>
        {points.length > 2 && <Button variant="kolbox" tone="secondary" onClick={() => onPoints(points.slice(0, -1))}>Remove point</Button>}
      </ButtonGroup>
    </div>
  )
}

/* the layer's one flat bindable prop: every morph-on element's blend */
function MorphBlend({ layer, setProp, insts }) {
  const p = MORPH_BLEND
  const raw = layer[p.key]
  const value = typeof raw === 'number' ? raw : (insts.find((x) => x?.morph?.on)?.morph?.blend ?? p.default)
  return (
    <LabeledControl variant="kolbox" horizontal label={p.label}>
      {isBinding(raw)
        ? <span className="flex-1 px-1 text-help text-muted italic">animated</span>
        : <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" min={p.min} max={p.max} step={p.step} value={Number(value.toFixed(2))} aria-label={p.label} onChange={(v) => setProp(p.key, v)} />}
    </LabeledControl>
  )
}

