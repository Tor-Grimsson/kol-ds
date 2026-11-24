import { useEffect, useRef } from 'react'
import { groupOfPreset, presetById, presetLayerPatch, urlIntent, useLabsLayer } from '../labs/engine.js'
import { KINETIC_PRESETS, presetComp } from '../labs/engine.js'

/* Labs' pick in the address (round 4, W9), the real LabsView's two effects carried over: the deep link seeds the stage
   once on arrival (a file or a fresh frame asked for by `?open` / `?new` wins), and every pick after is written back with
   replaceState, not push, so back leaves Labs instead of walking a preset history. The real form is
   `/labs?preset=<id>&cat=<group>`; in kolbox the path is the hash, so it reads `/?preset=<id>&cat=<group>#/labs` (the
   query stays where the engine's restore check reads `preset` and stands down for it, as it does for the real link). */
export function useLabsAddress() {
  const { layer, setOnly } = useLabsLayer()

  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    const intent = urlIntent(); if (intent.open || intent.fresh) return
    const deepLink = new URLSearchParams(window.location.search).get('preset')
    const group = deepLink ? groupOfPreset(deepLink) : null
    if (group) setOnly('loop', presetLayerPatch(presetById(deepLink), group))
    /* a kinetic preset (the Library's Kinetic type files, round 4 W10) has no loops group: it seeds the kinetic lab, as
       the lab's own preset picker does (labs/Kinetic.jsx) */
    const kt = !group && deepLink ? KINETIC_PRESETS.find((p) => p.id === deepLink) : null
    if (kt) setOnly('kinetic', { presetId: kt.id, presetLabel: kt.label, comp: presetComp(kt) })
  }, [setOnly])

  useEffect(() => {
    if (!layer?.presetId) return
    const url = new URL(window.location.href)
    if (url.searchParams.get('preset') === layer.presetId) return
    url.searchParams.delete('view')
    url.searchParams.set('preset', layer.presetId)
    if (layer.loopGroup) url.searchParams.set('cat', layer.loopGroup)
    else url.searchParams.delete('cat')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, [layer?.presetId, layer?.loopGroup])
}
