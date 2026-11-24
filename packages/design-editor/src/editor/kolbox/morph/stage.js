import { useEffect, useRef } from 'react'
import { isBinding, loopById, transport, useComposeState, useLabsLayer } from '../labs/engine.js'
import { buildMorph, canCrossfade, hasOutline, keysFor, morphKeys, pickParams, resetMorph, rowLabelForLayer, setMorph, stepLabel, updateStep, useMorph, useTransportPlaying } from './engine.js'

/* A Morph preset onto the stage: the package's loadMorphPreset (morph/presets.js) without its navigation, which would
   leave kolbox for the path /morph; kolbox is already on #/morph. Still until Play, as the real one. */
export function loadMorphPreset(p) {
  if (!p) return
  resetMorph({ active: true, ...p.morph, fileId: null, fileName: p.label, presetId: p.id })
  transport.setLoopSeconds(p.morph.seconds)
}

/* The stage built from the steps: the package's MorphTab (morph/MorphTab.jsx) does this inside its rail, drawn in
   another look, so its rule is carried here line for line: which modes the steps can take, the fall to the first one
   they can, and the one write the morph makes, on every change of steps or settings. Nothing auto-starts. */
export function useMorphStage() {
  const morph = useMorph()
  const { steps, curve, cycle, mode, resolution, editing } = morph
  const { updateLayer, removeLayer } = useComposeState()
  const { layer, setOnly } = useLabsLayer()

  const first = steps[0]
  const oneGenerator = steps.every((s) => s.loopId === first?.loopId)
  const engines = steps.filter((s) => !hasOutline(loopById(s.loopId)) || !canCrossfade(loopById(s.loopId)))
  const allDraw = engines.length === 0
  const blocked = {
    blend: oneGenerator ? null : 'Blend tweens one generator — these steps are different generators',
    shape: allDraw ? null : `No outline to morph: ${engines.map((s) => stepLabel(s, steps.indexOf(s))).join(', ')} (GL)`,
    crossfade: allDraw ? null : `Cannot fade: ${engines.map((s) => stepLabel(s, steps.indexOf(s))).join(', ')} (GL)`,
  }
  useEffect(() => {
    if (steps.length < 2 || !blocked[mode]) return
    const next = ['shape', 'crossfade', 'blend'].find((m) => !blocked[m])
    if (next) setMorph({ mode: next })
  }, [mode, oneGenerator, allDraw, steps.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const prevCount = useRef(steps.length)
  const rebuild = () => {
    const removed = steps.length < prevCount.current
    prevCount.current = steps.length
    if (steps.length < 2) {
      if (!layer || !removed) return
      if (steps.length === 0) { removeLayer(layer.id); return }
      const flat = {}
      for (const k in layer) if (layer[k]?.bind === 'track') flat[k] = layer[k].keys?.[0]?.v
      const one = steps[0]
      updateLayer(layer.id, { ...flat, loopGroup: one.loopGroup, presetId: one.presetId, presetLabel: one.presetLabel, loopId: one.loopId, ...one.params, morph: null, morphT: null })
      return
    }
    const identity = { loopGroup: first.loopGroup, presetId: first.presetId, presetLabel: first.presetLabel, loopId: first.loopId }
    const carried = { mode, steps: steps.map((s, i) => ({ loopId: s.loopId, params: s.params, label: stepLabel(s, i) })), cycle, curve, resolution, syncLoop: morph.syncLoop, name: morph.fileName }
    const patch = mode === 'blend'
      ? { ...identity, ...buildMorph({ snapshots: steps.map((s) => s.params), schema: loopById(first.loopId)?.params ?? [], curve, cycle }).patch, morph: carried, morphT: null }
      : { ...identity, ...first.params, morph: carried, morphT: { bind: 'track', keys: morphKeys(steps.length, cycle, curve) } }
    if (layer) updateLayer(layer.id, patch)
    else setOnly('loop', patch)
  }
  const rebuildRef = useRef(rebuild); rebuildRef.current = rebuild

  const sig = JSON.stringify([mode, steps.map((s) => [s.loopId, s.params]), curve, cycle, resolution, morph.syncLoop])
  const lastSig = useRef(null)
  useEffect(() => {
    if (editing != null || sig === lastSig.current || (steps.length >= 2 && blocked[mode])) return
    lastSig.current = sig
    rebuildRef.current()
  }, [sig, editing, steps.length]) // eslint-disable-line react-hooks/exhaustive-deps

  /* THE EDITING RULE (MorphTab's, kept): a step pressed goes on the stage, static, the transport pauses, and its own
     Generate, Style and Animation fields write to that step. Half one: the fields write to the step on the stage. */
  const playing = useTransportPlaying()
  useEffect(() => {
    if (editing == null || !layer) return
    const next = pickParams(layer, loopById(layer.loopId)?.params ?? [])
    if (!same(next, steps[editing]?.params)) updateStep(editing, next)
  }, [layer]) // eslint-disable-line react-hooks/exhaustive-deps
  /* half two: Play ends the edit and the morph runs again */
  useEffect(() => {
    if (!playing || editing == null) return
    setMorph({ editing: null })
    lastSig.current = null
  }, [playing, editing])

  const editStep = (i) => {
    const s = steps[i]
    if (!s) return
    transport.pause()
    setMorph({ editing: i })
    setOnly('loop', { loopGroup: s.loopGroup, presetId: s.presetId, presetLabel: s.presetLabel, loopId: s.loopId, ...s.params, morph: null, morphT: null })
  }
  /* back to the morph's own settings: the edit ends and the stage rebuilds, as leaving the real rail does */
  const endEdit = () => {
    if (editing == null) return
    setMorph({ editing: null })
    lastSig.current = null
  }
  /* a step name pressed on the timeline lane */
  useEffect(() => {
    if (morph.editRequest == null) return
    setMorph({ editRequest: null })
    editStep(morph.editRequest)
  }, [morph.editRequest]) // eslint-disable-line react-hooks/exhaustive-deps

  return { morph, layer, blocked, editStep, endEdit }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/* The timeline's rows, the real Timeline's (params/Timeline.jsx: collectTracks, then a row per layer in reading order):
   a layer with a morph gives its header lane first (the `morphT` keys in Shape and Crossfade, the step positions the
   cycle gives in Blend, each key named by its step), then its other tracks as rows under it, named by their parameter,
   folding away under the header's chevron; a layer with no track is a clip the loop long. While the Morph rail is up
   and no morph is built, an empty header row stands alone, named for the morph (the real one's "Morph"). Each row
   carries its layer's type icon, eye and lock and is lit while its layer is selected; `layerId` and `key` say where
   a key at the head is written. Key times are 0..1 of the loop; the timeline draws seconds. */
const TYPE_ICONS = { background: 'square', pattern: 'ptrn-dot', photo: 'image', shape: 'rectangle', text: 'type', group: 'layers', bool: 'layers', loop: 'refresh', misc: 'refresh', kinetic: 'type' }
const flatLayers = (list, out = []) => { for (const l of list) { out.push(l); if (Array.isArray(l.children)) flatLayers(l.children, out) } return out }
const stepOf = (v, n) => ((Math.round(v) % n) + n) % n

export function morphTimeline({ layers, morph, selectedIds, seconds }) {
  const flat = flatLayers(layers)
  const tracks = []
  for (const l of flat) {
    const steps = Array.isArray(l.morph?.steps) && l.morph.steps.length ? l.morph.steps : null
    if (steps) {
      const mt = isBinding(l.morphT) && l.morphT.bind === 'track' ? l.morphT : null
      const keys = mt ? mt.keys : keysFor(steps.map((_, i) => i), l.morph.cycle ?? 'loop', l.morph.curve ?? 'in-out')
      tracks.push({ id: `${l.id}:morph`, layerId: l.id, key: 'morphT', label: l.morph.name || 'Morph', keys, header: true, readOnly: !mt, steps })
    }
    for (const k in l) {
      if (k === 'morphT' && steps) continue
      const v = l[k]
      /* the real clip name is "layer · param"; a middot is never written here, so a slash */
      if (isBinding(v) && v.bind === 'track') tracks.push({ id: `${l.id}:${k}`, layerId: l.id, key: k, label: `${rowLabelForLayer(l)} / ${k}`, keys: v.keys, under: steps ? `${l.id}:morph` : undefined })
    }
  }
  if (morph.active && !tracks.some((t) => t.header)) tracks.unshift({ id: 'morph:empty', layerId: null, key: 'morphT', label: morph.fileName || 'Morph', keys: [], header: true, readOnly: true, steps: [] })

  const keyframes = (t) => t.keys.map((k) => (t.header
    ? { t: k.t * seconds, label: t.steps[stepOf(k.v, t.steps.length)]?.label ?? '', step: stepOf(k.v, t.steps.length) }
    : k.t * seconds))
  const rows = []
  for (const l of flat) {
    const base = { icon: l.icon ?? TYPE_ICONS[l.type] ?? 'rectangle', visible: l.visible !== false, locked: !!l.locked, selected: selectedIds.includes(l.id), layerId: l.id }
    const ts = tracks.filter((t) => t.layerId === l.id)
    if (!ts.length) { rows.push({ ...base, id: l.id, name: rowLabelForLayer(l), keyframes: [] }); continue }
    ts.forEach((t, i) => rows.push(i
      ? { id: t.id, layerId: l.id, key: t.key, readOnly: t.readOnly, sub: true, under: t.under, selected: base.selected, name: t.key, clip: t.label, keyframes: keyframes(t), keys: t.keys }
      : { ...base, id: t.id, key: t.key, readOnly: t.readOnly, under: t.under, name: rowLabelForLayer(l), clip: t.label, keyframes: keyframes(t), keys: t.keys }))
  }
  for (const t of tracks.filter((x) => x.layerId == null)) rows.push({ id: t.id, icon: 'layers', name: t.label, clip: t.label, keyframes: [], readOnly: true })
  return { rows, count: flat.length }
}
