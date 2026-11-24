import { useState } from 'react'
import { canOrbit, comboLabel, findLayerDeep, hasImageFill, ORBIT_REASON, pack, shortcutById, TOOL_META, useComposeState, useTool } from '../engine.js'
import { insertImage } from '../windows/InsertImage.jsx'
import { Menu, Tooltip } from '@kolkrabbi/kol-component'
import { ToolRail } from '@kolkrabbi/kol-shell'

/* The editor's dock, as the editor design 149:26890 draws it (W19.2): select, pen, rectangle and text, each with its
   chevron; a divider; hand with its chevron; a divider; image and crop. The real ToolStrip's tools and
   folds ride the chevrons (shell/panels/ToolStrip.jsx), the same rows and keys. No well: the search and the fill and
   stroke pair it held are rows in the Tools menu (../MenuBar.jsx) until he rules where they live
   (_tmp/2026-11-18-kolbox-system/lost-controls.md). Rotate, Boolean and Duplicate are the selection's, in the right
   rail and the Layer menu. */

/* the real toolItems: a key chip comes from the keymap only */
const key = (id) => { const s = shortcutById(id); return s ? comboLabel(s.combo) : undefined }
/* the design's glyphs where they differ from the engine's TOOL_META (your icons by the set's names); zoom takes the set's other lens */
const GLYPH = { frame: 'frame', select: 'pointer', pen: 'pen-nib', rect: 'square', text: 'font-01', hand: 'hand', zoom: 'search-zoom' }
const variant = (id) => ({ id, label: TOOL_META[id].label, icon: GLYPH[id] ?? TOOL_META[id].icon, kbd: key(`tool-${id}`) })
/* a tool's members are ToolRail's `more` (W31.2 batch 5) */
const fold = (more) => ({ ...more[0], more })

function useTools() {
  return [
    /* Node select = A, a one-shot row (the real fold's `action`): the canvas's own node edit on the selection */
    fold([variant('select'), { id: 'node', label: 'Node select', icon: 'pointer-node', kbd: key('node-edit'), action: true }]),
    /* the frame tool (C1): a drag draws a frame, white, no stroke */
    variant('frame'),
    /* Line rides the pen's fold, as the real one */
    fold([variant('pen'), variant('line')]),
    fold(['rect', 'ellipse', 'triangle', 'polygon', 'star'].map(variant)),
    /* kinetic type is the motion pack's: armed, a press lands it there */
    fold([variant('text'), ...(pack('motion') ? [variant('kinetic')] : [])]),
    { divider: true },
    fold([variant('hand'), variant('zoom'), variant('orbit')]),
  ]
}

export default function ToolDockEditor() {
  const { tool: current, setTool } = useTool()
  const { layers, selectedId } = useComposeState()
  const orbit = canOrbit(layers)
  const tools = useTools()

  /* the real ToolStrip's onAction: the fold's one-shot rows */
  const run = (id) => {
    if (id === 'node') window.dispatchEvent(new CustomEvent('kol:node-edit'))
  }
  const [variants, setVariants] = useState(null)

  /* the real ActionBar's Insert image and Crop image, disabled by its rules */
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const image = !!layer && (layer.type === 'photo' || hasImageFill(layer))
  const actions = [
    { divider: true },
    { id: 'image', icon: 'image', label: 'Insert image', kbd: key('insert-image'), onClick: insertImage },
    { id: 'crop', icon: 'crop', label: !image ? 'Crop image: select an image first' : layer.locked ? 'Crop image: the layer is locked' : 'Crop image',
      disabled: !image || !!layer.locked, onClick: () => window.dispatchEvent(new CustomEvent('kol:enter-crop', { detail: layer.id })) },
  ]

  return (
    <>
      <ToolRail variant="kolbox" tools={[...tools, ...actions]} value={current} onChange={setTool} onVariants={(t, el) => setVariants({ t, el })} variantsOpen={variants?.t.id} />
      <Menu variant="kolbox"
        aria-label="Tool variants"
        anchor={variants?.el}
        open={!!variants}
        onClose={() => setVariants(null)}
        onSelect={(row) => (row.action ? run(row.id) : setTool(row.id))}
        groups={variants ? [variants.t.more.map((v) => {
          const off = v.id === 'orbit' && !orbit
          return { id: v.id, icon: v.icon, label: off ? <Tooltip variant="kolbox" label={ORBIT_REASON}>{v.label}</Tooltip> : v.label, shortcut: v.kbd, action: v.action, check: v.id === current, disabled: off }
        })] : []}
      />
    </>
  )
}
