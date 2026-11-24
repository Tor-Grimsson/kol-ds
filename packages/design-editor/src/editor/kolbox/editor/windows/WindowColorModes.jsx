import { useEffect, useMemo, useRef, useState } from 'react'
import {
  allPalettes, assignRoles, contrast, findLayerDeep, generatePalette, mulberry32, oklchToHex, pack, randomSeed, RELATIONS, resolvePalette,
  ROLES, useComposeState, useGeneratorLibrary,
} from '../engine.js'
import Icon from '../../ui/Icon.jsx'
import WindowFrame from './WindowFrame.jsx'
import { Button, Dropdown, Input, LabeledControl, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'

/* COLOR MODES on the one window frame (plan-2026-11-19 C5.1, was W25): the engine's ModalColorModes and its PaletteBody,
   every function carried (one base color, a relationship and a count make the list; Roll re-rolls around the same base;
   per color its swatch edits it, lock keeps it on Roll, delete drops it; Load palette, Save; Apply to layer with a loop
   selected, Apply to document), on the generator's frame: steps Base, Colors, Palettes at the left, the step's controls,
   the palette's preview at the right, the foot with Reset, Roll, Cancel and the Applies. Every write is the engine's:
   generatePalette, assignRoles, updateLayer, setColorAt, the library's addItem. Apply closes, as the generator's does
   (decided for review: the old window stayed open). */
const ROLE_LABELS = { bg: 'Background', fg: 'Ink', accent: 'Accent', dim: 'Dim', warm: 'Warm' }
const DOC_SLOT_ROLE = { 0: 'fg', 1: 'warm', 3: 'dim', 4: 'accent', 5: 'bg' }
const hex6 = (h) => h.slice(0, 7).toLowerCase()
const fresh = () => {
  const seed = randomSeed()
  const base = oklchToHex(0.62, 0.14, Math.random() * 360)
  return { seed, base, relation: 'analogous', items: generatePalette(mulberry32(seed), { base, relation: 'analogous', count: 5 }).map((hex) => ({ hex, locked: false })) }
}

function Section({ title, note, children }) {
  return (
    <section className="mb-5 flex flex-col gap-4 border-b border-border pb-6 last:mb-0 last:border-b-0 last:pb-0" data-group={title}>
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="text-section text-text">{title}</h3>
        {note && <span className="text-help text-muted">{note}</span>}
      </header>
      {children}
    </section>
  )
}

/* the right column: the palette on a piece (Background under Ink, Dim and Warm, the Accent), then every color with its roles */
function Preview({ colors, roles, rolesOf }) {
  return (
    <div className="flex flex-col" data-preview-column>
      <header className="flex items-baseline justify-between pb-4">
        <h3 className="text-section text-text">Preview</h3>
        <span className="text-help text-muted">●  Live</span>
      </header>
      <div className="flex aspect-square w-full flex-col justify-between overflow-hidden rounded-well p-5" style={{ background: roles.bg }} data-palette-preview>
        <div className="flex flex-col gap-2">
          <span className="text-4xl leading-none" style={{ color: roles.fg }}>Aa</span>
          <span className="h-1 w-3/4 rounded-full" style={{ background: roles.dim }} />
          <span className="h-1 w-1/2 rounded-full" style={{ background: roles.dim }} />
        </div>
        <div className="flex items-end justify-between">
          <span className="h-6 w-20 rounded-control" style={{ background: roles.accent }} />
          <span className="size-6 rounded-full" style={{ background: roles.warm }} />
        </div>
      </div>
      <div className="flex h-6.5 overflow-hidden rounded-control mt-3" role="img" aria-label="Palette">
        {colors.map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
      </div>
      <div className="flex flex-col gap-1.5 border-b border-border pt-3 pb-5">
        {colors.map((c, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="truncate text-help text-muted">{rolesOf(c) || `Color ${i + 1}`}</span>
            <span className="font-mono text-meta text-muted">{c.toUpperCase()}</span>
          </div>
        ))}
      </div>
      {contrast(roles.bg, roles.fg) < 4.5 && (
        <span className="inline-flex items-center gap-1 pt-4 text-help text-muted"><Icon name="info" size={12} />Ink on background is under 4.5:1</span>
      )}
      <p className="pt-4 text-help text-muted">Updates as you adjust settings.</p>
    </div>
  )
}

export default function WindowColorModes({ onClose }) {
  const { layers, selectedId, updateLayer, setColorAt } = useComposeState()
  const { library, addItem } = useGeneratorLibrary()
  const first = useRef(null)
  if (!first.current) first.current = fresh()
  const [relation, setRelation] = useState(first.current.relation)
  const [seed, setSeed] = useState(first.current.seed)
  const [base, setBase] = useState(first.current.base)
  const [items, setItems] = useState(first.current.items)
  const [loaded, setLoaded] = useState(null)
  const [step, setStep] = useState('base')
  const saved = useMemo(() => allPalettes(library), [library])
  /* the color being edited in the picker: 'base' or a row's index, with its swatch as the anchor */
  const [picking, setPicking] = useState(null)

  const regen = ({ b = base, rel = relation, n = items.length, s = seed } = {}) => {
    const next = generatePalette(mulberry32(s), { base: b, relation: rel, count: n })
    setItems((prev) => next.map((hex, i) => (prev[i]?.locked ? prev[i] : { hex, locked: false })))
    setLoaded(null)
  }
  const roll = () => { const s = randomSeed(); setSeed(s); regen({ s }) }
  const changeBase = (h) => { const b = hex6(h); setBase(b); regen({ b }) }
  const changeRelation = (rel) => { setRelation(rel); regen({ rel }) }
  const changeCount = (v) => { const n = Number(v); if (Number.isInteger(n) && n >= 2 && n <= 8) regen({ n }) }
  const edit = (i, h) => { setItems((prev) => prev.map((x, j) => (j === i ? { ...x, hex: hex6(h) } : x))); setLoaded(null) }
  const toggleLock = (i) => setItems((prev) => prev.map((x, j) => (j === i ? { ...x, locked: !x.locked } : x)))
  const remove = (i) => { setItems((prev) => prev.filter((_, j) => j !== i)); setLoaded(null) }
  const load = (id) => {
    const p = saved.find((x) => x.id === id)
    if (!p) return
    const colors = p.colors.slice(0, 8)
    setItems((colors.length >= 2 ? colors : [...colors, ...colors]).map((hex) => ({ hex: hex6(hex), locked: false })))
    setLoaded({ name: p.name, roles: p.colors.length <= 8 ? p.roles : null })
  }
  /* Reset: the window as it opened */
  const reset = () => { const f = first.current; setRelation(f.relation); setSeed(f.seed); setBase(f.base); setItems(f.items); setLoaded(null) }

  const colors = items.map((x) => x.hex)
  const roles = loaded?.roles ?? assignRoles(colors)
  const relLabel = RELATIONS.find((x) => x.id === relation)?.label ?? 'Palette'
  const palette = { name: loaded?.name ?? relLabel, relation, colors, roles }
  const rolesOf = (hex) => ROLES.filter((r) => roles[r]?.toLowerCase() === hex).map((r) => ROLE_LABELS[r]).join(', ')

  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const schema = layer?.type === 'loop' ? pack('generators')?.loopById(layer.loopId)?.params : null
  const apply = () => {
    if (!layer || !schema) return
    const next = resolvePalette(layer, schema, palette, { rotate: true })
    updateLayer(layer.id, Object.fromEntries(schema.filter((p) => p.type === 'color').map((p) => [p.key, next[p.key]])))
    onClose()
  }
  const applyDocument = () => { Object.entries(DOC_SLOT_ROLE).forEach(([i, r]) => setColorAt(Number(i), roles[r])); onClose() }

  const pickValue = picking ? (picking.at === 'base' ? base : items[picking.at]?.hex) : null
  const onPick = ({ value }) => (picking.at === 'base' ? changeBase(value) : edit(picking.at, value))
  const locked = items.filter((x) => x.locked).length

  const steps = [
    { key: 'base', label: 'Base', state: () => `${relLabel}, ${items.length} colors` },
    { key: 'colors', label: 'Colors', state: () => (locked ? `${items.length} colors, ${locked} locked` : `${items.length} colors`) },
    { key: 'palettes', label: 'Palettes', state: () => loaded?.name ?? `${saved.length} saved` },
  ]

  return (
    <WindowFrame
      movable="color-modes"
      onClose={onClose}
      title="Color Modes"
      kind={palette.name}
      dataWindow="color-modes"
      data-editor-keep-selection=""
      steps={steps}
      step={step}
      onStep={setStep}
      aside={<Preview colors={colors} roles={roles} rolesOf={rolesOf} />}
      footer={(
        <>
          <Button variant="kolbox" onClick={reset}>Reset</Button>
          <Button variant="kolbox" onClick={roll} data-control="Roll">Roll</Button>
          <span className="flex-1" />
          <Button variant="kolbox" onClick={onClose}>Cancel</Button>
          {schema && <Button variant="kolbox" onClick={apply}>Apply to layer</Button>}
          <Button variant="kolbox" tone="primary" onClick={applyDocument}>Apply to document</Button>
        </>
      )}
    >
      {step === 'base' && (
        <Section title="Base" note="One color makes the palette">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <LabeledControl variant="kolbox" label="Base">
              <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Base" value={base} onChange={changeBase} lit={picking?.at === 'base'} onSwatch={(e) => setPicking({ at: 'base', el: e.currentTarget })} />
            </LabeledControl>
            <LabeledControl variant="kolbox" label="Colors">
              <Input variant="kolbox" aria-label="Colors" type="number" min={2} max={8} value={items.length} onChange={(e) => changeCount(e.target.value)} className="w-full" />
            </LabeledControl>
            <LabeledControl variant="kolbox" label="Relationship">
              <Dropdown variant="kolbox" ariaLabel="Relationship" value={relation} options={RELATIONS.map((r) => ({ value: r.id, label: r.label }))} onChange={changeRelation} className="w-full" />
            </LabeledControl>
          </div>
        </Section>
      )}
      {step === 'colors' && (
        <Section title="Colors" note="Lock keeps a color on Roll">
          <div className="flex flex-col gap-1" data-color-rows={items.length}>
            {items.map((x, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={`Color ${i + 1}`} value={x.hex} onChange={(h) => edit(i, h)} lit={picking?.at === i} onSwatch={(e) => setPicking({ at: i, el: e.currentTarget })} />
                </div>
                <span className="w-28 shrink-0 truncate text-meta text-muted">{rolesOf(x.hex)}</span>
                <Button variant="kolbox" iconOnly={x.locked ? 'lock' : 'unlock'} aria-label={`${x.locked ? 'Unlock' : 'Lock'} color ${i + 1}`} pressed={x.locked} onClick={() => toggleLock(i)}/>
                <span className={items.length <= 2 ? 'invisible pointer-events-none' : 'contents'} aria-hidden={items.length <= 2 || undefined}>
                  <Button variant="kolbox" iconOnly="trash" aria-label={`Delete color ${i + 1}`} tabIndex={items.length <= 2 ? -1 : undefined} onClick={() => remove(i)} />
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
      {step === 'palettes' && (
        <Section title="Palettes" note="Saved in your library">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <LabeledControl variant="kolbox" label="Load">
              <Dropdown variant="kolbox" ariaLabel="Load palette" value="" options={[{ value: '', label: 'Load palette…' }, ...saved.map((p) => ({ value: p.id, label: p.name }))]} onChange={(v) => v && load(v)} className="w-full" />
            </LabeledControl>
            <Button variant="kolbox" className="self-end" onClick={() => addItem('palette', { name: palette.name, colors })}>Save</Button>
          </div>
        </Section>
      )}
      <ColorPickerPopover variant="kolbox" anchor={picking?.el} open={!!picking} onClose={() => setPicking(null)} color={pickValue?.toUpperCase()} onChange={onPick} />
    </WindowFrame>
  )
}

/* Every door kolbox has to Color Modes lands here: the engine's `kol:open-color-modes` (Labs' "Edit in Color Modes",
   openColorModes) and the menus' Color Modes rows, which fire it (editor/Windows.jsx). Mounted once per screen in
   app/Providers.jsx, where the engine's own ModalColorModes stood. */
export function ColorModesHost() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setOpen(true)
    window.addEventListener('kol:open-color-modes', on)
    return () => window.removeEventListener('kol:open-color-modes', on)
  }, [])
  return open ? <WindowColorModes onClose={() => setOpen(false)} /> : null
}
