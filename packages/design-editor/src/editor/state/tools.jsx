import { createContext, useContext, useState } from 'react'
import { pack } from '../packs.js'

/**
 * Active editor tool — pointer mode for the canvas. One global value across
 * all modes; `select` is the default and the only one that supports the
 * existing select / drag / resize gestures. Other tools enter create mode:
 * mousedown + drag commits a new layer of the matching type.
 *
 * After a non-Select tool commits, the editor flips back to Select so the
 * user immediately gets normal selection gestures on the freshly-created
 * layer.
 */
export const TOOLS = ['select', 'frame', 'text', 'pen', 'rect', 'ellipse', 'triangle', 'line', 'polygon', 'star', 'pattern', 'kinetic', 'zoom', 'hand', 'orbit']

export const TOOL_META = {
  select:   { id: 'select',   label: 'Select',     icon: 'pointer',   shortcut: 'V' },
  /* frames as objects (plan-2026-11-19-kolbox-whats-left C1): a drag draws a frame; only where the chrome turns frames
   * on (elsewhere the drag does nothing). */
  frame:    { id: 'frame',    label: 'Frame',      icon: 'frame', shortcut: 'F' },
  text:     { id: 'text',     label: 'Text',       icon: 'type',     shortcut: 'T' },
  pen:      { id: 'pen',      label: 'Pen',        icon: 'pen',      shortcut: 'P' },
  rect:     { id: 'rect',     label: 'Rectangle',  icon: 'rectangle',     shortcut: 'R' },
  ellipse:  { id: 'ellipse',  label: 'Ellipse',    icon: 'circle',  shortcut: 'O' },
  triangle: { id: 'triangle', label: 'Triangle',   icon: 'triangle', shortcut: '' },
  line:     { id: 'line',     label: 'Line',       icon: 'line',     shortcut: 'L' },
  polygon:  { id: 'polygon',  label: 'Polygon',    icon: 'polygon',  shortcut: '' },
  star:     { id: 'star',     label: 'Star',       icon: 'star',     shortcut: '' },
  pattern:  { id: 'pattern',  label: 'Pattern',    icon: 'pattern-tool',  shortcut: '' },
  /* a press lands the motion pack's kinetic type there, at a set size (Figma's text tool has no kinetic sibling, so no key) */
  kinetic:  { id: 'kinetic',  label: 'Kinetic type', icon: 'type-02',   shortcut: '' },
  /* Zoom is a viewport tool, not a create tool — click zooms in at the
   * pointer, Alt+click zooms out. Never commits a layer. */
  zoom:     { id: 'zoom',     label: 'Zoom',       icon: 'search',          shortcut: 'Z' },
  /* Hand pans the viewport on drag — Space-drag as a tool (Figma's H; hide is ⇧⌘H, as Figma's).
   * `direction-cross` stands in until a `hand` cut lands (plan 17). */
  hand:     { id: 'hand',     label: 'Hand',       icon: 'direction-cross', shortcut: 'H' },
  /* Orbit is a viewport tool for 3D layers — drag over a 3D-capable layer
   * (math 3D, Soft Forms 3D, GL scenes) rotates its camera, wheel zooms.
   * Layer move/marquee is off in this mode, so orbit never fights a drag. */
  /* `shape-torus`, not `camera` (spec R9.2, the user's 10): `camera` is the webcam on this screen,
   * and no glyph means two things. An `orbit` cut is owed (plan 17). */
  orbit:    { id: 'orbit',    label: 'Orbit',      icon: 'shape-torus',   shortcut: 'C' },
}

/* Orbit has something to turn only on a layer with a camera: a loop whose params carry the orbit rig (a 3D loop, or a
   2D loop with camera keys), on its own or as a layer's motion row */
const hasCamera = (loopId) => !!loopId && !!pack('generators')?.loopById(loopId)?.params?.some((p) => p.key === 'orbit')
export const canOrbit = (layers = []) => layers.some((l) => hasCamera(l.loopId)
  || (Array.isArray(l.content) && l.content.some((c) => c.type === 'loop' && hasCamera(c.params?.loopId)))
  || (Array.isArray(l.children) && canOrbit(l.children)))
export const ORBIT_REASON = 'Orbit turns a 3D layer; there is none here'

const ToolContext = createContext(null)

export function ToolProvider({ children }) {
  const [tool, setTool] = useState('select')
  return <ToolContext.Provider value={{ tool, setTool }}>{children}</ToolContext.Provider>
}

export function useTool() {
  const ctx = useContext(ToolContext)
  if (!ctx) return { tool: 'select', setTool: () => {} }
  return ctx
}
