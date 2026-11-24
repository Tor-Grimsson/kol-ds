import { useRef, useState } from 'react'
import { LabeledControlSection, ColorInputRow, ColorPickerPopover, FieldPair, ToggleCheckbox } from '@kolkrabbi/kol-component'
import { BLEND_MODES, effectDef, LAYER_EFFECTS, layerEffectsOf, makeEffect, useColorTarget, useComposeState, useLayerEdit } from '../engine.js'
import RightRail from '../../ui/RightRail.jsx'
import MenuBlendMode from '../../ui/MenuBlendMode.jsx'
import MenuEffects from '../../ui/MenuEffects.jsx'
import PopoverEffect from '../../ui/PopoverEffect.jsx'
import Icon from '../../ui/Icon.jsx'
import { Act, shown, useBeside } from './parts.jsx'
import { AppearanceSection, LayoutSection, PaintRows, PositionSection, promoteFill, promoteStroke, StrokeLine, TailSections } from './Sections.jsx'
import ExportSection from './Export.jsx'
import StylesPopover, { ColorStylesButton, StyledPaintRow, StyledSlot, topSlot, usePageStyles, valueAt } from './Styles.jsx'
import { Menu } from '@kolkrabbi/kol-component'
import { PRESET_SIZES } from '../../../shell/aspects.js'

/* The canvas inspector, the file's two states (W11.1, sheet 264:41071; the frame as an object, 11.3).
   Nothing selected: no header; Page (the page color on the fill row, its eye and its opacity), Styles (its title and
   plus: styles are per file, a new file has none, 19.6, so the plus is dimmed with that reason), Export.
   The frame selected: the header "Frame" with no actions (Figma's frame header: its mask is in its menu, it
   has no boolean and no nodes), then Position (the aligns, against the page's other frames, off when it is alone; X and
   Y in frame units; rotation, rotate 90 and both flips, W5), Layout (W and H: a typed size flips the aspect to custom,
   the engine's one write path; constrain proportions; Clip content, W5), Appearance (hide, blend, opacity, corner radius
   and corners), Fill (the frame's own fill, through the color target so the paint pair stays in step, and its opacity,
   with fill rows above it, W6.2), Stroke (its rows, position, weight and sides, W6), Effects (the Layer effects, the
   ones a frame hosts), Export (design 149:26890, W19.1). Each write is the frame layer's own (`useLayerEdit`, one undo
   step), as a shape's in Properties.jsx.
   FRAMES AS OBJECTS (plan-2026-11-19-kolbox-whats-left C1): `frame` is the selected frame layer, and every field is its
   own: X and Y move it with its layers (moveFrame), W and H are its export px (its page size times its `density`),
   the fill row is its `color`. `frame === true` (a chrome with the one built-in frame) reads the engine's canvas as before. */
const size = (n, fallback) => (n > 0 ? Math.round(n) : fallback)
/* the hidden or removed frame fill, and the hidden page color, kept for this session so the eye and the plus can bring
   them back */
const kept = { hidden: null, removed: null, page: null }
const FX_ICONS = { bevel: 'cube', outline: 'select-frame', threeD: '3d-cube', innerShadow: 'drop-hatch', innerGlow: 'sparkle', colorOverlay: 'drop', gradientOverlay: 'gen-gradient', outerGlow: 'wand-sparkles', outerShadow: 'drop-circle', gaussianBlur: 'transparency' }
const BUILT_IN = 'Not on the built-in frame'
/* a turn kept in 0 to 359 */
const turn = (n) => ((Math.round(n) % 360) + 360) % 360
/* W6.2: a new row's paint, as the shape's (Properties.jsx) */
const NEW_FILL = { color: '#d9d9d9', opacity: 1 }
const NEW_STROKE = { color: '#000000', opacity: 1 }

/* the page color as a 6 hex and an opacity: an alpha rides in the hex's last two digits (#rrggbbaa) */
function splitPage(fill, palette) {
  if (fill == null) return { hex: null, alpha: 100 }
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})$/i.exec(String(fill))
  if (m) return { hex: `#${m[1]}`, alpha: Math.round((parseInt(m[2], 16) / 255) * 100) }
  return { hex: shown(fill, palette) ?? fill, alpha: 100 }
}
const withAlpha = (hex, alpha) => {
  const h = String(hex ?? '').replace('#', '').slice(0, 6)
  if (!/^[0-9a-f]{6}$/i.test(h)) return hex
  return alpha >= 100 ? `#${h}` : `#${h}${Math.round((alpha / 100) * 255).toString(16).padStart(2, '0')}`
}

function PageProperties() {
  const { infiniteFill, setInfiniteFill, setPageStyle, pageStyle, styles, palette } = useComposeState()
  const followed = pageStyle ? styles.colors.find((s) => s.id === pageStyle) : null
  const hidden = infiniteFill == null && kept.page != null
  const { hex, alpha } = splitPage(hidden ? kept.page : infiniteFill, palette)
  const resolved = hex && /^#/.test(hex) ? hex : null
  const write = (next) => { if (hidden) kept.page = next; else setInfiniteFill(next) }
  const eye = () => { if (hidden) { setInfiniteFill(kept.page); kept.page = null } else { kept.page = infiniteFill; setInfiniteFill(null) } }
  const pageStyles = usePageStyles(resolved)
  /* the Page row's Styles button: the page takes a color style and follows it, as a layer does (W7) */
  const [styleRef, styleAnchor] = useBeside()
  const [picking, setPicking] = useState(false)
  return (
    <RightRail variant="editor">
      <LabeledControlSection variant="kolbox" label="Page" end={(
        <span ref={styleRef} className="inline-flex"><Act icon="circles-grid" label="Styles" lit={picking} onClick={() => setPicking((o) => !o)} /></span>
      )}>
        <StylesPopover kind="color" anchor={styleAnchor} open={picking} onClose={() => setPicking(false)} current={pageStyle}
          onApply={setPageStyle} />
        {followed && !hidden ? (
          <StyledPaintRow style={followed} palette={palette} onOpen={() => setPicking(true)}
            onDetach={() => setInfiniteFill(infiniteFill)}
            actions={<Act icon="eye-on" label="Hide page color" onClick={eye} />} />
        ) : <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Page" value={hex} resolved={resolved}
          hidden={hidden}
          onChange={(v) => write(alpha < 100 ? withAlpha(v, alpha) : v)}
          opacity={alpha} onOpacity={(n) => write(withAlpha(resolved ?? hex, n))}
          actions={<Act icon={hidden ? 'eye-off' : 'eye-on'} label={hidden ? 'Show page color' : 'Hide page color'} onClick={eye} />} />}
      </LabeledControlSection>
      {/* the file's styles (W7): its text and color styles, each opening its settings; the plus saves the page color */}
      <LabeledControlSection variant="kolbox" label="Styles" end={pageStyles.end}>{pageStyles.body}</LabeledControlSection>
      <ExportSection page />
    </RightRail>
  )
}

export default function CanvasProperties({ frame = false }) {
  if (!frame) return <PageProperties />
  return <FrameProperties frame={frame} />
}

function FrameProperties({ frame }) {
  const target = useColorTarget()
  const engine = useComposeState()
  const { palette, updateLayer, moveFrame, toggleLayer, layers } = engine
  /* the frame's fields: a drawn frame's own (C1), else the built-in frame's */
  const f = typeof frame === 'object' ? frame : null
  const edit = useLayerEdit(f && !f.locked ? f.id : null, { history: 'coalesce' })
  const set = edit.setProp
  const k = f?.density > 0 ? f.density : 1
  const canvasW = f ? f.w * k : engine.canvasW
  const canvasH = f ? f.h * k : engine.canvasH
  const canvasX = f ? f.x : engine.canvasX
  const canvasY = f ? f.y : engine.canvasY
  const canvasFill = f ? f.color ?? null : engine.canvasFill
  const canvasFillOpacity = f ? f.fillOpacity ?? 1 : engine.canvasFillOpacity
  const aspect = f && Number.isFinite(f.aspectLocked) && f.aspectLocked > 0 ? f.aspectLocked : null
  const setCanvasSize = f ? (w, h) => updateLayer(f.id, { w: w / k, h: h / k }) : engine.setCanvasSize
  const setCanvasPos = f ? (x, y) => moveFrame(f.id, x, y) : engine.setCanvasPos
  const setCanvasFill = f ? (v) => updateLayer(f.id, { color: v }) : engine.setCanvasFill
  const setCanvasFillOpacity = f ? (v) => updateLayer(f.id, { fillOpacity: v }) : engine.setCanvasFillOpacity
  /* the color target writes the canvas only while the canvas is selected, so the canvas fill is written as well; a
     frame layer is the color target's own selection, so the target alone writes it */
  const setFill = (v) => { if (!f) setCanvasFill(v); target.setFill(v) }
  /* the frame's fill can be hidden and removed (his "cant disable the black background from the canvas", 2026-11-19): the
     engine keeps a `null` fill as None, so the frame draws nothing and the page shows through. Hide keeps the row and
     remembers the color for the eye to bring back; remove takes the row away and the section's plus puts a fill back. */
  const hidden = canvasFill == null && kept.hidden != null
  const hide = () => { if (hidden) { setFill(kept.hidden); kept.hidden = null } else { kept.hidden = canvasFill; setCanvasFill(null) } }
  const remove = () => { kept.removed = hidden ? kept.hidden : canvasFill; kept.hidden = null; setCanvasFill(null) }
  const add = () => { if (canvasFill == null) { setFill(kept.hidden ?? kept.removed ?? '#000000'); kept.hidden = null } }
  const fillShown = hidden ? kept.hidden : canvasFill

  const [open, setOpen] = useState(null)
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key))
  const closeIf = (key) => () => setOpen((cur) => (cur === key ? null : cur))
  const blendRef = useRef(null)
  const titleAnchor = useRef({ getBoundingClientRect: () => document.querySelector('[data-rail="right"] [data-rail-title]')?.getBoundingClientRect() ?? new DOMRect(), contains: (t) => !!document.querySelector('[data-rail="right"] [data-rail-title]')?.contains(t) }).current
  const [fxPlusRef, fxPlusAnchor] = useBeside()
  const [fxRowRef, fxRowAnchor] = useBeside()

  /* the aligns: against the page's other frames, their common box, the frame moved with its layers; alone on its page
     a frame has nothing to align to */
  const others = f ? layers.filter((l) => l.type === 'frame' && l.id !== f.id && typeof l.x === 'number') : []
  const onAlign = others.length ? (axis, mode) => {
    const lo = axis === 'h' ? Math.min(...others.map((l) => l.x)) : Math.min(...others.map((l) => l.y))
    const hi = axis === 'h' ? Math.max(...others.map((l) => l.x + l.w)) : Math.max(...others.map((l) => l.y + l.h))
    const own = axis === 'h' ? f.w : f.h
    const at = Math.round(mode === 'start' ? lo : mode === 'end' ? hi - own : (lo + hi) / 2 - own / 2)
    if (axis === 'h') moveFrame(f.id, at, f.y); else moveFrame(f.id, f.x, at)
  } : undefined

  /* corner radius: one value, or each corner from Appearance's corners button ([TL, TR, BR, BL]) */
  const radii = Array.isArray(f?.radii)
  const r0 = Math.round(f?.radius ?? 0)
  const hasStroke = !!f?.stroke && (f.strokeWidth ?? 0) > 0

  /* effects: the Layer effects, written to the frame's `effects` as a shape's; the rest of the menu is greyed */
  const effects = f ? layerEffectsOf(f) : []
  const writeFx = (next) => edit.patch({ effects: next })
  const fxGroups = [[
    { label: 'Layer effects', icon: 'drop-circle', submenu: [LAYER_EFFECTS.map((d) => ({ label: d.label, value: d.id, icon: FX_ICONS[d.id], disabled: !d.stack && effects.some((e) => e.id === d.id) }))] },
  ]]
  const openFx = effects.find((e) => open === `fx:${e.key}`)
  const def = openFx ? effectDef(openFx.id) : null

  if (!f) {
    /* the one built-in frame (a chrome without frames): its size, place and fill, as before */
    return (
      <RightRail variant="editor" title="Frame">
        <PositionSection x={canvasX} y={canvasY} onX={(n) => setCanvasPos(n, canvasY)} onY={(n) => setCanvasPos(canvasX, n)} rotatable={false} alignReason={BUILT_IN} />
        <LayoutSection w={canvasW} h={canvasH} onW={(n) => setCanvasSize(size(n, canvasW), canvasH)} onH={(n) => setCanvasSize(canvasW, size(n, canvasH))} lockReason={BUILT_IN} />
        <LabeledControlSection variant="kolbox" label="Fill" end={<Act icon="plus" label="Add fill" onClick={add} />}>
          {fillShown != null && <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Fill" value={shown(fillShown, palette) ?? fillShown} resolved={shown(fillShown, palette)} onChange={setFill} />}
        </LabeledControlSection>
        <TailSections />
      </RightRail>
    )
  }

  return (
    <RightRail variant="editor" title="Frame" titleMenu={() => toggle('title')} >
      {/* W5: a frame turns, its layers with it (the engine's turnMembers); Rotate 90 turns it right, as a shape's button and Figma's */}
      <PositionSection x={canvasX} y={canvasY} onX={(n) => setCanvasPos(n, canvasY)} onY={(n) => setCanvasPos(canvasX, n)}
        rotation={f.rotation ?? 0} onRotation={(n) => set('rotation', turn(n))} onRotate={() => set('rotation', turn((f.rotation ?? 0) + 90))}
        onAlign={onAlign} alignable={!!onAlign}
        flipX={!!f.flipX} flipY={!!f.flipY} onFlip={(axis) => set(axis === 'h' ? 'flipX' : 'flipY', !(axis === 'h' ? f.flipX : f.flipY))} />
      <LayoutSection w={canvasW} h={canvasH}
        locked={!!aspect} onLock={() => set('aspectLocked', aspect ? null : f.w / Math.max(1, f.h))}
        onW={(n) => { const w = size(n, canvasW); setCanvasSize(w, aspect ? Math.max(1, Math.round(w / aspect)) : canvasH) }}
        onH={(n) => { const h = size(n, canvasH); setCanvasSize(aspect ? Math.max(1, Math.round(h * aspect)) : canvasW, h) }}>
        {/* W5: Figma's Clip content, under W and H; on unless turned off */}
        <div className="flex items-center gap-2" data-clip-content>
          <ToggleCheckbox variant="kolbox" checked={f.clip !== false} onChange={() => set('clip', f.clip === false)} aria-label="Clip content" />
          <span className="min-w-0 flex-1 cursor-pointer truncate text-help text-text" onClick={() => set('clip', f.clip === false)}>Clip content</span>
        </div>
      </LayoutSection>
      <AppearanceSection
        visible={f.visible !== false} onVisible={() => toggleLayer(f.id)}
        blendRef={blendRef} blendLit={open === 'blend'} onBlend={() => toggle('blend')}
        opacity={(f.opacity ?? 1) * 100} onOpacity={(n) => set('opacity', n / 100)}
        radius={radii ? f.radii[0] ?? 0 : r0} radii={radii ? f.radii : null}
        onRadius={(n) => (radii ? set('radii', [n, n, n, n]) : set('radius', n))}
        onRadii={(i, n) => { const next = radii ? [...f.radii] : [r0, r0, r0, r0]; next[i] = n; set('radii', next) }} />
      <LabeledControlSection variant="kolbox" label="Fill" end={<><ColorStylesButton layers={[f]} slot={topSlot(f, 'fill')} value={valueAt(f, topSlot(f, 'fill'))} write={(_, patch) => edit.patch(patch)} /><Act icon="plus" label="Add fill" onClick={() => (fillShown != null ? set('fills', [...(f.fills ?? []), NEW_FILL]) : add())} /></>}>
        <PaintRows kind="Fill" rows={f.fills} palette={palette} onRows={(fills) => set('fills', fills)} layer={f} />
        {f.fillStyle && f.color != null && (
          <StyledSlot layer={f} slot="fill" hidden={!!f.fillHidden} write={edit.patch}
            actions={<><Act icon={f.fillHidden ? 'eye-off' : 'eye-on'} label={f.fillHidden ? 'Show fill' : 'Hide fill'} onClick={() => set('fillHidden', !f.fillHidden)} /><Act icon="minus" label="Remove fill" onClick={() => edit.patch(promoteFill(f))} /></>} />
        )}
        {!(f.fillStyle && f.color != null) && fillShown != null && (
          <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Fill" value={shown(fillShown, palette) ?? fillShown} resolved={shown(fillShown, palette)}
            hidden={hidden}
            onChange={(v) => { if (hidden) kept.hidden = v; else setFill(v) }}
            opacity={(canvasFillOpacity ?? 1) * 100} onOpacity={(n) => setCanvasFillOpacity(n / 100)}
            actions={<><Act icon={hidden ? 'eye-off' : 'eye-on'} label={hidden ? 'Show fill' : 'Hide fill'} onClick={hide} /><Act icon="minus" label="Remove fill" onClick={f.fills?.length ? () => edit.patch(promoteFill(f)) : remove} /></>} />
        )}
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Stroke" end={<>{hasStroke && <ColorStylesButton layers={[f]} slot={topSlot(f, 'stroke')} value={valueAt(f, topSlot(f, 'stroke'))} write={(_, patch) => edit.patch(patch)} />}<Act icon="plus" label="Add stroke" onClick={() => edit.patch(hasStroke ? { strokes: [...(f.strokes ?? []), NEW_STROKE] } : { stroke: f.stroke ?? 'palette:dark', strokeWidth: 1 })} /></>}>
        {hasStroke && (
          <>
            <PaintRows kind="Stroke" rows={f.strokes} palette={palette} onRows={(strokes) => set('strokes', strokes)} layer={f} />
            {f.strokeStyle
              ? <StyledSlot layer={f} slot="stroke" hidden={!!f.strokeHidden} write={edit.patch}
                  actions={<><Act icon={f.strokeHidden ? 'eye-off' : 'eye-on'} label={f.strokeHidden ? 'Show stroke' : 'Hide stroke'} onClick={() => set('strokeHidden', !f.strokeHidden)} /><Act icon="minus" label="Remove stroke" onClick={() => edit.patch(promoteStroke(f))} /></>} />
              : <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Stroke" value={shown(f.stroke, palette) ?? f.stroke} resolved={shown(f.stroke, palette)}
                  onChange={(v) => set('stroke', v)}
                  opacity={(f.strokeOpacity ?? 1) * 100} onOpacity={(n) => set('strokeOpacity', n / 100)}
                  actions={<><Act icon={f.strokeHidden ? 'eye-off' : 'eye-on'} label={f.strokeHidden ? 'Show stroke' : 'Hide stroke'} onClick={() => set('strokeHidden', !f.strokeHidden)} /><Act icon="minus" label="Remove stroke" onClick={() => edit.patch(promoteStroke(f))} /></>} />}
            <StrokeLine layer={f} canAlign canSides onPatch={edit.patch} />
          </>
        )}
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Effects" end={<span ref={fxPlusRef} className="inline-flex"><Act icon="plus" label="Add effect" lit={open === 'effects-menu'} onClick={() => toggle('effects-menu')} /></span>}>
        {effects.length > 0 && (
          <div className="flex flex-col gap-2">
            {effects.map((e) => {
              const on = e.enabled !== false
              return (
                <div key={e.key} ref={openFx?.key === e.key ? fxRowRef : undefined} data-effect-row={effectDef(e.id)?.label ?? e.id}>
                  <FieldPair variant="kolbox" span trailing={(
                    <>
                      <Act icon={on ? 'eye-on' : 'eye-off'} label={on ? 'Hide effect' : 'Show effect'} onClick={() => writeFx(effects.map((x) => (x.key === e.key ? { ...x, enabled: !on } : x)))} />
                      <Act icon="minus" label="Remove effect" onClick={() => { if (open === `fx:${e.key}`) setOpen(null); writeFx(effects.filter((x) => x.key !== e.key)) }} />
                    </>
                  )} first={(
                    <button type="button" onClick={() => toggle(`fx:${e.key}`)} aria-pressed={open === `fx:${e.key}`}
                      className={`flex h-control min-w-0 flex-1 items-center gap-2 rounded-control bg-field pr-2 pl-1.5 text-left text-help outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-accent ${open === `fx:${e.key}` ? 'outline-1 -outline-offset-1 outline-accent' : ''} ${on ? 'text-text' : 'text-muted'}`}>
                      <Icon name={FX_ICONS[e.id] ?? 'sparkles'} className="text-muted" />
                      <span className="min-w-0 flex-1 truncate">{effectDef(e.id)?.label ?? e.id}</span>
                    </button>
                  )} />
                </div>
              )
            })}
          </div>
        )}
      </LabeledControlSection>
      <TailSections />
      {/* the title's menu, as Figma's (read 2026-11-20): what the layer is (a frame; section and group are not the
          engine's), then the size presets with the current one checked; a pick sets the size */}
      <Menu variant="kolbox" aria-label="Frame" anchor={titleAnchor} open={open === 'title'} onClose={closeIf('title')}
        groups={[
          [{ label: 'Section', disabled: true }, { label: 'Frame', check: true }, { label: 'Group', disabled: true }],
          Object.entries(PRESET_SIZES).map(([id, sz]) => ({ label: id, value: id, tag: `${sz.w}×${sz.h}`, check: Math.round(canvasW) === sz.w && Math.round(canvasH) === sz.h })),
        ]}
        onSelect={(row) => { const sz = PRESET_SIZES[row.value]; if (sz) setCanvasSize(sz.w, sz.h) }} />
      <MenuBlendMode anchor={blendRef} open={open === 'blend'} onClose={closeIf('blend')} modes={BLEND_MODES} value={f.blend ?? 'normal'} onChange={(v) => set('blend', v)} />
      <MenuEffects anchor={fxPlusRef} open={open === 'effects-menu'} onClose={closeIf('effects-menu')} groups={fxGroups} onSelect={(row) => {
        setOpen(null)
        if (LAYER_EFFECTS.some((d) => d.id === row.value)) writeFx([...effects, makeEffect(row.value)])
      }} />
      {openFx && (
        <PopoverEffect key={openFx.key} anchor={fxRowAnchor ?? fxPlusAnchor} open onClose={closeIf(`fx:${openFx.key}`)}
          name={def?.label ?? openFx.id} icon={FX_ICONS[openFx.id] ?? 'sparkles'}
          params={def?.params ?? []}
          values={{ ...Object.fromEntries((def?.params ?? []).map((p) => [p.key, p.default])), ...openFx.params }}
          onChange={(key, v) => writeFx(effects.map((x) => (x.key === openFx.key ? { ...x, params: { ...x.params, [key]: v } } : x)))}
          more={[[{ label: openFx.enabled === false ? 'Enable effect' : 'Disable effect', value: 'toggle' }, { label: 'Reset to defaults', value: 'reset' }], [{ label: 'Delete effect', value: 'delete' }]]}
          onMore={(row) => {
            if (row.value === 'toggle') writeFx(effects.map((x) => (x.key === openFx.key ? { ...x, enabled: x.enabled === false } : x)))
            else if (row.value === 'reset') writeFx(effects.map((x) => (x.key === openFx.key ? { ...x, params: {} } : x)))
            else if (row.value === 'delete') { setOpen(null); writeFx(effects.filter((x) => x.key !== openFx.key)) }
          }} />
      )}
    </RightRail>
  )
}
