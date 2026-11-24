import { useState } from 'react'
import ExportSection from './Export.jsx'
import { Act, Dim, Field, shown } from './parts.jsx'
import { useComposeState } from '../engine.js'
import { StyledSlot } from './Styles.jsx'
import { AlignmentGrid, ButtonGroup, ColorInputRow, ColorPickerPopover, Dropdown, FieldPair, LabeledControlSection } from '@kolkrabbi/kol-component'

/* The sections his design draws for a selection (149:26890, W19.1; frame and layer alike): Position, Layout,
   Appearance, then (from the caller) Fill, Stroke, Effects, and the closing Export. The frame (Canvas.jsx) and a layer (Properties.jsx)
   hand in their own values and writes; a control whose write is left out is dimmed with its reason (`Act`'s `reason`,
   `Dim`), never live and dead. */

const ALIGN_H = [['start', 'align-horizontal-left', 'Align left'], ['center', 'align-horizontal-center', 'Align horizontal centers'], ['end', 'align-horizontal-right', 'Align right']]
const ALIGN_V = [['start', 'align-vertical-top', 'Align top'], ['center', 'align-vertical-center', 'Align vertical centers'], ['end', 'align-vertical-bottom', 'Align bottom']]

/* AlignmentRow (Figma 27:9345): the package's AlignmentGrid in its kolbox look, the two strips each filling its cell */
const ALIGN_ITEMS = [...ALIGN_H.map(([mode, icon, title]) => ({ axis: 'h', mode, icon, title })), ...ALIGN_V.map(([mode, icon, title]) => ({ axis: 'v', mode, icon, title }))]
export function AlignmentRow({ onAlign, reason }) {
  const grid = <AlignmentGrid variant="kolbox" items={ALIGN_ITEMS} onAlign={onAlign}/>
  return reason || !onAlign ? <Dim reason={reason ?? 'Nothing to align to'}>{grid}</Dim> : grid
}

/* Position: alignment; X and Y; rotation and, in the second cell, rotate 90 right (Figma's), flip horizontal, flip vertical.
   `rotatable` false (the one built-in frame): no rotation field and no rotate, the flips alone. `alignable` false leaves
   the alignment row off (a frame alone on its page has nothing to align to) */
export function PositionSection({ x, y, rotation = 0, onX, onY, onRotation, onAlign, alignReason, onRotate, onFlip, flipX = false, flipY = false, rotatable = true, alignable = true }) {
  const flips = [
    { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal', pressed: flipX, onPress: () => onFlip?.('h') },
    { icon: 'flip-vertical', ariaLabel: 'Flip vertical', pressed: flipY, onPress: () => onFlip?.('v') },
  ]
  return (
    <LabeledControlSection variant="kolbox" label="Position">
      {alignable && <AlignmentRow onAlign={onAlign} reason={alignReason} />}
      <FieldPair variant="kolbox"
        first={<Field lead="X" aria-label="X position" value={Math.round(x ?? 0)} onCommit={(n) => onX(Math.round(n))} />}
        second={<Field lead="Y" aria-label="Y position" value={Math.round(y ?? 0)} onCommit={(n) => onY(Math.round(n))} />}
      />
      <FieldPair variant="kolbox"
        first={rotatable ? <Field icon="rotate-left" aria-label="Rotation" value={`${Math.round(rotation)}°`} onCommit={onRotation} /> : <ButtonGroup layout="joined" variant="kolbox" className="w-full" options={flips}/>}
        second={rotatable ? <ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[{ icon: 'rotate-right', ariaLabel: 'Rotate 90° right', onPress: onRotate }, ...flips]}/> : null}
      />
    </LabeledControlSection>
  )
}

/* Layout (design 149:26890): W and H, then one icon, Constrain proportions (the engine's aspect lock) */
export function LayoutSection({ w, h, onW, onH, locked = false, onLock, lockReason, children }) {
  return (
    <LabeledControlSection variant="kolbox" label="Layout">
      <FieldPair variant="kolbox"
        first={<Field lead="W" aria-label="Width" value={Math.round(w ?? 0)} onCommit={onW} />}
        second={<Field lead="H" aria-label="Height" value={Math.round(h ?? 0)} onCommit={onH} />}
        trailing={<Act icon="expand" label="Constrain proportions" lit={locked} onClick={onLock} reason={onLock ? undefined : lockReason ?? 'This layer has no size to keep'} />}
      />
      {children}
    </LabeledControlSection>
  )
}

/* Appearance (design 149:26890): eye and blend in the heading; opacity and corner radius, then the corners button, which
   opens one field per corner under the row ([TL, TR, BR, BL], the engine's `radii`) and folds back to the one field;
   corners that differ read Mixed there. It ends 12 below its row like every section (R3.1). */
const CORNER_FIELDS = [[0, 'corner-top-left', 'Top left radius'], [1, 'corner-top-right', 'Top right radius'], [3, 'corner-bottom-left', 'Bottom left radius'], [2, 'corner-bottom-right', 'Bottom right radius']]
export function AppearanceSection({ visible = true, onVisible, blendRef, blendLit = false, onBlend, opacity = 100, onOpacity, radius = 0, onRadius, radii = null, onRadii, radiusReason = 'This layer has no corners' }) {
  const [corners, setCorners] = useState(false)
  const mixed = radius == null || (Array.isArray(radii) && radii.some((r) => r !== radii[0]))
  const opacityMixed = opacity == null
  const corner = (i) => Math.round((Array.isArray(radii) ? radii[i] : radius) ?? 0)
  const cornerField = ([i, icon, label]) => <Field icon={icon} aria-label={label} value={corner(i)} onCommit={(n) => onRadii?.(i, Math.max(0, Math.round(n)))} />
  const radiusField = <Field icon="corner-radius" aria-label="Corner radius" value={mixed ? '' : Math.round(radius)} placeholder={mixed ? 'Mixed' : undefined} onCommit={(n) => onRadius?.(Math.max(0, Math.round(n)))} disabled={!onRadius} />
  return (
    <LabeledControlSection variant="kolbox"
      label="Appearance"
      end={(
        <>
          <Act icon={visible ? 'eye-on' : 'eye-off'} label={visible ? 'Hide layer' : 'Show layer'} onClick={onVisible} />
          <span ref={blendRef} className="inline-flex"><Act icon="paint-drop" label="Blend mode" lit={blendLit} onClick={onBlend} /></span>
        </>
      )}
    >
      <FieldPair variant="kolbox"
        first={<Field icon="opacity" aria-label="Opacity" value={opacityMixed ? '' : Math.round(opacity)} placeholder={opacityMixed ? 'Mixed' : undefined} trailing="%" onCommit={(n) => onOpacity?.(Math.min(100, Math.max(0, n)))} />}
        second={onRadius ? radiusField : <Dim reason={radiusReason}>{radiusField}</Dim>}
        trailing={<Act icon="corner-independent" label="Independent corners" lit={corners} onClick={() => setCorners((c) => !c)} reason={onRadii ? undefined : radiusReason} />}
      />
      {corners && (
        <div className="contents" data-corner-fields>
          <FieldPair variant="kolbox" first={cornerField(CORNER_FIELDS[0])} second={cornerField(CORNER_FIELDS[1])} />
          <FieldPair variant="kolbox" first={cornerField(CORNER_FIELDS[2])} second={cornerField(CORNER_FIELDS[3])} />
        </div>
      )}
    </LabeledControlSection>
  )
}

/* the closing section: Export, the selected layer's or frame's own settings (./Export.jsx, plan-2026-11-19 C8) */
export function TailSections() {
  return <ExportSection />
}

/* the selection header's actions (design 149:26890): Use as mask (the design's half-filled glyph), the boolean
   operation with its menu chevron, Edit object (node edit). A write left out is dimmed with its reason (`maskReason`,
   `boolReason`, `nodesReason`). Create component is off the screen: components are parked (W7.3). `frame` (W5,
   Figma's frame header): nothing, a frame's mask is in its menu and it has no boolean and no nodes */
export function HeaderActions({ frame = false, mask = false, onMask, maskReason = 'Needs a layer below to mask', boolRef, boolLit = false, onBool, onBoolMenu, boolReason = 'Needs two or more shapes', onNodes, nodesReason = 'Only a shape or a path has nodes' }) {
  if (frame) return null
  return (
    <>
      <Act icon="blend" label={mask ? 'Release mask' : 'Use as mask'} lit={mask} onClick={onMask} reason={onMask ? undefined : maskReason} />
      <span ref={boolRef} className="inline-flex items-center gap-1">
        <Act icon="boolean-unite" label="Boolean operation" onClick={onBool} reason={onBool ? undefined : boolReason} />
        <Act icon="chevron-down" label="Boolean operations" lit={boolLit} onClick={onBoolMenu} reason={onBoolMenu ? undefined : boolReason} />
      </span>
      <Act icon="vector-nodes" label="Edit object" onClick={onNodes} reason={onNodes ? undefined : nodesReason} />
    </>
  )
}

/* SEVERAL FILLS AND STROKES (W6.2, Figma's lists): the rows above a layer's own fill or stroke (`fills` / `strokes`,
   bottom first, each { color, opacity, hidden }), drawn top first as Figma lists them, each with its color, opacity,
   eye and minus. `onRows` writes the whole list. */
export function PaintRows({ rows = [], kind, palette, onRows, layer }) {
  const at = (i, patch) => onRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const list = kind === 'Stroke' ? 'strokes' : 'fills'
  const { styles } = useComposeState()
  return rows.map((r, i) => i).reverse().map((i) => {
    const r = rows[i]
    const eyeMinus = (
      <>
        <Act icon={r.hidden ? 'eye-off' : 'eye-on'} label={r.hidden ? `Show ${kind.toLowerCase()}` : `Hide ${kind.toLowerCase()}`} onClick={() => at(i, { hidden: !r.hidden })} />
        <Act icon="minus" label={`Remove ${kind.toLowerCase()}`} onClick={() => onRows(rows.filter((_, j) => j !== i))} />
      </>
    )
    /* W7: a row that uses a style shows the style */
    if (layer && r.style && styles.colors.some((st) => st.id === r.style)) {
      return <div key={i} data-paint-row={kind}><StyledSlot layer={layer} slot={`${list}:${i}`} hidden={!!r.hidden} write={(patch) => onRows(patch[list])} actions={eyeMinus} /></div>
    }
    return (
      <div key={i} data-paint-row={kind}>
        <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={kind}
          value={shown(r.color, palette) ?? r.color} resolved={shown(r.color, palette)}
          hidden={!!r.hidden}
          onChange={(v) => at(i, { color: v })}
          opacity={(r.opacity ?? 1) * 100} onOpacity={(n) => at(i, { opacity: n / 100 })}
          actions={(
            <>
              <Act icon={r.hidden ? 'eye-off' : 'eye-on'} label={r.hidden ? `Show ${kind.toLowerCase()}` : `Hide ${kind.toLowerCase()}`} onClick={() => at(i, { hidden: !r.hidden })} />
              <Act icon="minus" label={`Remove ${kind.toLowerCase()}`} onClick={() => onRows(rows.filter((_, j) => j !== i))} />
            </>
          )} />
      </div>
    )
  })
}

/* the own row's minus with rows above it: the lowest row takes its place, so the list loses one row and keeps the rest */
export function promoteFill(layer) {
  const [next, ...rest] = layer.fills ?? []
  return next ? { color: next.color ?? null, fillOpacity: next.opacity ?? 1, fillHidden: !!next.hidden, fill: null, fills: rest, fillStyle: next.style } : { color: null, fillStyle: undefined }
}
export function promoteStroke(layer) {
  const [next, ...rest] = layer.strokes ?? []
  return next ? { stroke: next.color ?? null, strokeOpacity: next.opacity ?? 1, strokeHidden: !!next.hidden, strokes: rest, strokeStyle: next.style } : { stroke: null, strokeWidth: 0, strokes: [], strokeStyle: undefined }
}

/* STROKE POSITION AND SIDES (W6.1, Figma's stroke line): position and weight, the stroke settings, and Individual sides,
   which opens one field per side under the line ([top, right, bottom, left], the layer's `strokeSides`) and folds back
   to one weight. `canAlign` / `canSides` false leaves that control off (a shape the engine has no such stroke for). */
const SIDE_FIELDS = [[0, 'Top'], [1, 'Right'], [2, 'Bottom'], [3, 'Left']]
export function StrokeLine({ layer, canAlign, canSides, onPatch, settings, lineRef }) {
  const sides = Array.isArray(layer.strokeSides) ? layer.strokeSides : null
  const sw = layer.strokeWidth ?? 0
  /* several layers (15.5): a weight they do not share comes in as null and reads Mixed */
  const weight = layer.strokeWidth === null ? { value: '', placeholder: 'Mixed' } : { value: sw }
  const align = layer.strokeAlign ?? 'inside'
  const word = align[0].toUpperCase() + align.slice(1)
  const side = ([i, name]) => <Field lead={name[0]} aria-label={`${name} stroke weight`} value={sides[i]} onCommit={(n) => { const next = [...sides]; next[i] = Math.max(0, n); onPatch({ strokeSides: next }) }} />
  return (
    <>
      <div ref={lineRef} data-stroke-line>
      <FieldPair variant="kolbox"
        first={canAlign ? <span className="flex w-full min-w-0"><Dropdown variant="kolbox" tone="grey" ariaLabel="Stroke position" value={word} options={['Inside', 'Center', 'Outside']} onChange={(v) => onPatch({ strokeAlign: String(v).toLowerCase() })} className="w-full" /></span> : <Field icon="line" aria-label="Stroke weight" {...weight} onCommit={(n) => onPatch({ strokeWidth: Math.max(0, n) })} />}
        second={canAlign ? (sides ? null : <Field icon="line" aria-label="Stroke weight" {...weight} onCommit={(n) => onPatch({ strokeWidth: Math.max(0, n) })} />) : null}
        trailing={(
          <>
            {settings}
            {canSides && <Act icon="select-frame" label="Individual sides" lit={!!sides} onClick={() => onPatch(sides ? { strokeSides: undefined, strokeWidth: Math.max(...sides) } : { strokeSides: [sw, sw, sw, sw] })} />}
          </>
        )}
      />
      </div>
      {sides && (
        <div className="contents" data-stroke-sides>
          <FieldPair variant="kolbox" first={side(SIDE_FIELDS[0])} second={side(SIDE_FIELDS[1])} />
          <FieldPair variant="kolbox" first={side(SIDE_FIELDS[2])} second={side(SIDE_FIELDS[3])} />
        </div>
      )}
    </>
  )
}
