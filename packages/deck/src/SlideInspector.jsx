import { useRef, useState } from 'react'
import { Button, ColorInputRow, ColorSwatch, Dropdown, Input, LabeledControl, LabeledControlSection, LayerStack, MediaLibrary, SegmentedToggle, ViewToggle } from '@kolkrabbi/kol-component'
import { image, rule, text, CHROME, GREYS, resolveColor } from './slideDoc.js'
import { Icon } from '@kolkrabbi/kol-icons'
import { alignLayers, distributeLayers, reorderZ } from './layerOps.js'
import { FONT_OPTIONS } from './webFonts.js'

/* taxonomy-ok: organism — composes kol-component's LayerStack, LabeledControlSection, Input, Dropdown, ViewToggle, SegmentedToggle, ColorSwatch, ColorInputRow and MediaLibrary into the slide inspector */

/**
 * SlideInspector — the rail beside the stage (2026-09-03, the editor scope,
 * steps 3 + 4): the LAYER STACK on top, the selected layer's FIELDS under it.
 *
 * Stack: top of the list = topmost on the slide. Click selects, eye hides,
 * chevrons reorder, trash removes; the add row appends a text / image / rule
 * on the slide's centre and selects it. Fields: every control is the DS's —
 * `Input` for the words, `Stepper` for the numbers, `Dropdown` for weight,
 * `SegmentedToggle` for font / align / valign / case / italic, `ColorInputRow`
 * for a hex colour (a deck token shows as its string in a plain Input).
 *
 * Controlled like the stage: `doc` + `selectedId` in; `onChange(nextDoc)` and
 * `onSelect(id)` out.
 *
 * IMAGES come from the consumer: `mediaClient` feeds the DS picker, `onUpload(file)`
 * → `Promise<url>` puts a file from disk where the consumer keeps media. Either may be absent, and
 * its button goes with it.
 */
const WEIGHTS = [200, 300, 400, 500, 600, 700, 800].map((w) => ({ value: w, label: String(w) }))
const TWO = 'grid grid-cols-2 gap-2'
const num = (fn) => (e) => fn(Number(e.target.value))
/* A user-set name wins — that is what LayerStack's inline rename writes, and
   clearing the field falls back to the derived label. */
const name = (l) => l.name || (l.type === 'text' ? (l.text || 'Text').split('\n')[0] : l.type === 'image' ? 'Image' : 'Rule')
/* Our three types against shipped v1 glyphs; the package's default map speaks
   the engine's taxonomy (pattern/photo/shape/…), which is not ours. */
const ICON_FOR = (type) => ({ text: 'type', image: 'image', rule: 'minus' }[type] ?? 'rectangle')

/* The ramp lives in slideDoc — the exporter needs the same table (a standalone
   SVG cannot resolve `var()`), and two copies would drift. */
const DECK_GREYS = Object.entries(GREYS).map(([token, hex]) => ({ token, hex }))

/* Icon segments. Every glyph is a shipped v1 name — checked against the set,
   not guessed: align-horizontal-* / align-vertical-* / italic-a / type. */
const ALIGN_H = [
  { value: 'left',   label: 'Align left',   icon: 'align-horizontal-left' },
  { value: 'center', label: 'Align centre', icon: 'align-horizontal-center' },
  { value: 'right',  label: 'Align right',  icon: 'align-horizontal-right' },
]
const ALIGN_V = [
  { value: 'start',  label: 'Top',    icon: 'align-vertical-top' },
  { value: 'center', label: 'Middle', icon: 'align-vertical-center' },
  { value: 'end',    label: 'Bottom', icon: 'align-vertical-bottom' },
]
/* the SAME six glyphs as ALIGN_H/ALIGN_V, but these fire an action rather than
   set a property — see the Arrange comment. Kept as its own table so the two
   never get refactored into one by someone tidying up. */
const ARRANGE_ALIGN = [
  { axis: 'h', mode: 'start',  icon: 'align-horizontal-left',   title: 'Align left' },
  { axis: 'h', mode: 'center', icon: 'align-horizontal-center', title: 'Align horizontal centre' },
  { axis: 'h', mode: 'end',    icon: 'align-horizontal-right',  title: 'Align right' },
  { axis: 'v', mode: 'start',  icon: 'align-vertical-top',      title: 'Align top' },
  { axis: 'v', mode: 'center', icon: 'align-vertical-center',   title: 'Align vertical centre' },
  { axis: 'v', mode: 'end',    icon: 'align-vertical-bottom',   title: 'Align bottom' },
]

const STYLE_OPTS = [
  { value: 'roman',  label: 'Roman',  icon: 'type' },
  { value: 'italic', label: 'Italic', icon: 'italic-a' },
]

const NEW = {
  text:  () => text({ ...CHROME, text: 'Text', x: 860, y: 532, w: 200, h: 16, case: 'none', color: 'var(--grey-50)' }),
  image: () => image({ src: '', x: 660, y: 340, w: 600, h: 400 }),
  rule:  () => rule({ x: 760, y: 540, w: 400, h: 1, color: 'var(--grey-500)' }),
}

export default function SlideInspector({ doc, selectedIds = [], onChange, onSelect, onToggleSelect, onDuplicate, mediaClient, onUpload, grab }) {
  /* The FIELDS edit one layer. Multi-select is for the stack's own actions
     (reorder, hide, lock, delete) and for moving several on the stage; a
     properties panel showing four different X values is a different feature.
     So: the fields bind to the LAST selected, which is the one just clicked. */
  const selectedId = selectedIds[selectedIds.length - 1] ?? null
  const [picking, setPicking] = useState(false)
  const [layersOpen, setLayersOpen] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileRef = useRef(null)

  /* Disk → the consumer's store → the layer's src */
  const onPickFile = async (file) => {
    if (!file || !onUpload) return
    setUploading(true); setUploadError(null)
    try {
      set('src')(await onUpload(file))
    } catch (err) {
      setUploadError(err.message || String(err))
    } finally {
      setUploading(false)
    }
  }
  const layers = doc.layers
  const layer = layers.find((l) => l.id === selectedId) ?? null
  const setLayers = (next) => onChange({ ...doc, layers: next })
  const patch = (partial) => setLayers(layers.map((l) => (l.id === selectedId ? { ...l, ...partial } : l)))
  const set = (k) => (v) => patch({ [k]: v })
  const add = (type) => { const l = NEW[type](); setLayers([...layers, l]); onSelect(l.id) }

  return (
    <div className="w-72 shrink-0 flex flex-col gap-5">
      {/* ── the stack, top first ──
          ON THE PACKAGE since kol-theme 0.145.0. The swap was written on
          2026-09-03 and REVERTED the same hour: kol-component shipped LayerStack
          with none of its eleven `.kol-layer-stack-*` classes in any installed
          package, so it degraded to bare divs. 0.145.0 carries them in
          `kol-components-organisms.css`, which `/core` imports — checked in the
          tarball before bumping. Brings drag reorder, inline rename, lock and
          shift multi-select, none of which the fork had. */}
      {/* THE LAYER LIST IS ONE SECTION, not the panel (user 2026-09-04: "dont
          call the whole modal Layers, just one part"). The panel is the
          Inspector; this is the layers inside it, and it COLLAPSES so a deck
          with thirty layers does not push every field off the bottom.

          The grabber is absolutely centred in this row — the row is the drag
          handle, and `relative` here is what the grabber's `absolute` centres
          against. The buttons either side stop the drag at their own edge. */}
      <div className="flex flex-col">
        <div className={`flex items-center gap-2 h-8 ${grab?.handleProps?.className ?? ''}`}
          onMouseDown={grab?.handleProps?.onMouseDown}
          role={grab?.handleProps?.role}
          aria-label={grab?.handleProps?.['aria-label']}
          title={grab?.handleProps?.title}
        >
          {grab?.grabber}
          <button
            type="button"
            className="flex items-center gap-1 kol-eyebrow text-fg-80 hover:text-fg-96"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setLayersOpen((v) => !v)}
            aria-expanded={layersOpen}
          >
            <Icon name={layersOpen ? 'chevron-down' : 'chevron-right'} size={12} />
            Layers
          </button>
          <span className="flex-1" />
          {/* `quiet` — these are chrome on a panel, not primary actions. Without
              it they carried Button's filled treatment and read as four
              competing buttons in a header row. */}
          <div className="flex gap-0.5" onMouseDown={(e) => e.stopPropagation()}>
            <Button size="xs" quiet iconOnly="plus" aria-label="Add text" title="Add text" onClick={() => add('text')} />
            <Button size="xs" quiet iconOnly="image" aria-label="Add image" title="Add image" onClick={() => add('image')} />
            <Button size="xs" quiet iconOnly="minus" aria-label="Add rule" title="Add rule" onClick={() => add('rule')} />
            <Button size="xs" quiet iconOnly="copy" aria-label="Duplicate" title="Duplicate (\u2318D)" disabled={!selectedIds.length} onClick={() => onDuplicate?.()} />
          </div>
        </div>
        {layersOpen && (
          <div className="max-h-56 overflow-y-auto">
            <LayerStack
              layers={layers}
              selectedIds={selectedIds}
              containerTypes={[]}
              labelFor={name}
              iconFor={ICON_FOR}
              onSelect={(id) => onSelect(id)}
              onToggleSelect={(id) => onToggleSelect?.(id)}
              onToggleVisible={(id) => setLayers(layers.map((x) => (x.id === id ? { ...x, visible: x.visible === false } : x)))}
              onToggleLocked={(id) => setLayers(layers.map((x) => (x.id === id ? { ...x, locked: !x.locked } : x)))}
              onRename={(id, next) => setLayers(layers.map((x) => (x.id === id ? { ...x, name: next || undefined } : x)))}
              onReorder={(id, _parentId, index) => {
                const moved = layers.find((l) => l.id === id)
                if (!moved) return
                const rest = layers.filter((l) => l.id !== id)
                rest.splice(index, 0, moved)
                setLayers(rest)
              }}
            />
          </div>
        )}
      </div>

      {/* ── the fields — nothing selected, nothing here ──
          SECTIONS, not a flat stack (user 2026-09-03: "we are missing many
          oppertunities for uppercase eyebrows section styles, labelled control,
          labelledcontrolSection"). `LabeledControlSection` carries the uppercase
          eyebrow (`kol-eyebrow`, which ships in kol-theme — checked first, the
          habit LayerStack's missing stylesheet taught).

          And the toggles are ICONS where a glyph exists (user: "I wolud alwasy
          just fold everything into icons, rather then text"). `ViewToggle
          variant="icon"` is the DS's icon-segment control — SegmentedToggle
          takes a label string only, and its own docblock names ViewToggle as the
          icon sibling. Case stays Aa/AA because the label IS the specimen, and
          Fit stays words because the set has no cover/contain glyph. */}
      {layer && (
        <div className="flex flex-col gap-5">
          {/* ARRANGE — MOMENTARY ACTIONS. Every control here FIRES and forgets.
              The user, twice: *"they dont have selected state ONLY MOMENTARY
              CLICK"*. So these are plain quiet Buttons in a plain row — never a
              SegmentedToggle, never a ViewToggle, nothing that can render a
              chosen segment. The Alignment section below looks similar and is
              the opposite: those ARE state, so they keep their selected chip.
              Same six glyphs, two different meanings — the treatment is what
              tells them apart, so it has to differ visibly. */}
          <LabeledControlSection label="Arrange">
            <div className="flex items-center gap-0.5">
              {ARRANGE_ALIGN.map((b) => (
                <Button key={`${b.axis}-${b.mode}`} size="xs" quiet iconOnly={b.icon} title={b.title} aria-label={b.title}
                  disabled={!selectedIds.length}
                  onClick={() => onChange(alignLayers(doc, selectedIds, b.axis, b.mode))} />
              ))}
              <span className="w-2" />
              <Button size="xs" quiet iconOnly="columns" title="Distribute horizontally" aria-label="Distribute horizontally"
                disabled={selectedIds.length < 3} onClick={() => onChange(distributeLayers(doc, selectedIds, 'h'))} />
              <Button size="xs" quiet iconOnly="rows" title="Distribute vertically" aria-label="Distribute vertically"
                disabled={selectedIds.length < 3} onClick={() => onChange(distributeLayers(doc, selectedIds, 'v'))} />
              <span className="flex-1" />
              <Button size="xs" quiet iconOnly="chevron-up" title="Bring to front" aria-label="Bring to front"
                disabled={!selectedIds.length} onClick={() => onChange(reorderZ(doc, selectedIds, 'front'))} />
              <Button size="xs" quiet iconOnly="chevron-down" title="Send to back" aria-label="Send to back"
                disabled={!selectedIds.length} onClick={() => onChange(reorderZ(doc, selectedIds, 'back'))} />
            </div>
          </LabeledControlSection>

          <LabeledControlSection label="Position">
            {/* `variant="property"` — the DS's Figma property field: filled
                chrome with the letter INSIDE the field. Two things it fixes at
                once. The bare `Input`s were inheriting the panel's
                `kol-tone-secondary` and rendering with no visible ground (the
                user: "so many missing background fileds"), and the separate
                label-above-field stack was spending a whole row on one letter.
                Four fields now read as one block. */}
            <div className={TWO}>
              <Input variant="property" size="sm" type="number" affordance="X" value={layer.x} onChange={num(set('x'))} />
              <Input variant="property" size="sm" type="number" affordance="Y" value={layer.y} onChange={num(set('y'))} />
              <Input variant="property" size="sm" type="number" affordance="W" value={layer.w} onChange={num(set('w'))} />
              <Input variant="property" size="sm" type="number" affordance="H" value={layer.h} onChange={num(set('h'))} />
            </div>
          </LabeledControlSection>

          {layer.type === 'text' && (
            <>
              <LabeledControlSection label="Text">
                <textarea className="kol-control kol-control-sm kol-control--filled kol-mono-12 w-full resize-y" rows={3} value={layer.text} onChange={(e) => set('text')(e.target.value)} />
              </LabeledControlSection>

              <LabeledControlSection label="Typography">
                {/* A DROPDOWN, not the two-way toggle: `font` now carries a Google
                    family name as well as the two brand keys (webFonts.js), so a
                    binary segment cannot express it. The brand pair sits at the
                    top of the list — the list is curated rather than the whole
                    catalogue, because a client deck set in an arbitrary web font
                    is off-system by accident. */}
                <LabeledControl label="Font">
                  <Dropdown size="sm" className="w-full" options={FONT_OPTIONS} value={layer.font ?? 'sans'} onChange={set('font')} />
                </LabeledControl>
                <div className={TWO}>
                  <Input variant="property" size="sm" type="number" affordance="Size" value={layer.size} onChange={num(set('size'))} />
                  <Dropdown size="sm" className="w-full" options={WEIGHTS} value={layer.weight} onChange={set('weight')} />
                  <Input variant="property" size="sm" affordance="Track" value={layer.tracking ?? ''} onChange={(e) => set('tracking')(e.target.value)} />
                  <Input variant="property" size="sm" type="number" affordance="Leading" step={0.02} value={layer.lineHeight} onChange={num(set('lineHeight'))} />
                </div>
              </LabeledControlSection>

              <LabeledControlSection label="Alignment">
                <div className="flex items-center gap-2">
                  <ViewToggle variant="icon" tone="sunken" viewMode={layer.align} onViewChange={set('align')} options={ALIGN_H} />
                  <ViewToggle variant="icon" tone="sunken" viewMode={layer.valign} onViewChange={set('valign')} options={ALIGN_V} />
                </div>
                <div className={TWO}>
                  <LabeledControl label="Case">
                    <SegmentedToggle tone="sunken" size="sm" value={layer.case} onChange={set('case')} options={[{ value: 'none', label: 'Aa' }, { value: 'upper', label: 'AA' }]} />
                  </LabeledControl>
                  <LabeledControl label="Style">
                    <ViewToggle variant="icon" tone="sunken" viewMode={layer.italic ? 'italic' : 'roman'} onViewChange={(v) => set('italic')(v === 'italic')} options={STYLE_OPTS} />
                  </LabeledControl>
                  <Input variant="property" size="sm" type="number" affordance="Rotate" unit="\u00b0" value={layer.rotate ?? 0} onChange={num(set('rotate'))} />
                </div>
              </LabeledControlSection>
            </>
          )}

          {layer.type === 'image' && (
            <LabeledControlSection label="Image">
              <LabeledControl label="Source">
                <div className="flex gap-1">
                  <Input size="sm" className="w-full" value={layer.src ?? ''} onChange={(e) => set('src')(e.target.value)} />
                  {/* the bucket, through the same read-only client the Library
                      pages use — typing an R2 key by hand was the only way in */}
                  {mediaClient && <Button size="xs" quiet iconOnly="folder" aria-label="Browse bucket" title="Browse bucket" onClick={() => setPicking(true)} />}
                  {/* FROM DISK — into the consumer's store, whose URL comes back as the src */}
                  {onUpload && <Button size="xs" quiet iconOnly="plus" aria-label="Upload from disk" title="Upload from disk"
                    disabled={uploading} onClick={() => fileRef.current?.click()} />}
                  <input ref={fileRef} type="file" accept="image/*" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; onPickFile(f) }} />
                </div>
              </LabeledControl>
              {uploading && <p className="kol-helper-10 text-fg-48">Uploading…</p>}
              {uploadError && <p className="kol-helper-10 text-fg-64">{uploadError}</p>}
              {/* THE DS PICKER, not a local grid (user 2026-09-03: "media is in
                  the repo, so just use exactly the same setup / import"). This is
                  `MediaLibrary variant="modal"` — the same organism `apps/media`
                  and `/library/browse` already run, on the same read-only client.
                  It hands back a RESOLVED URL and closes itself, so there is no
                  key-to-url step here. `accept="image"` filters kinds inside the
                  organism. The 80-line hand-rolled ImagePicker it replaces is in
                  `_tmp/2026-09-04-imagepicker-retired/`. */}
              {mediaClient && <MediaLibrary
                variant="modal"
                open={picking}
                client={mediaClient}
                accept="image"
                onClose={() => setPicking(false)}
                onSelect={(url) => set('src')(url)}
              />}
              <LabeledControl label="Fit">
                <SegmentedToggle tone="sunken" size="sm" value={layer.fit} onChange={set('fit')} options={[{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }]} />
              </LabeledControl>
            </LabeledControlSection>
          )}

          {layer.type !== 'image' && (
            <LabeledControlSection label={layer.type === 'rule' ? 'Fill' : 'Colour'}>
              <LabeledControl label={layer.type === 'rule' ? 'Fill' : 'Colour'}>
                <div className="flex flex-col gap-2">
                  {/* THE DECK'S OWN RAMP FIRST. Every colour in the fourteen
                      documents is a `var(--grey-N)` token, and until this row the
                      only way to change one was to TYPE the var() string into a
                      text field. The swatches keep people on the ramp; the hex
                      row below stays for the off-token case. */}
                  <div className="flex flex-wrap gap-1">
                    {DECK_GREYS.map(({ token, hex }) => (
                      <ColorSwatch
                        key={token}
                        hex={hex}
                        size={20}
                        selected={layer.color === token}
                        title={token}
                        onClick={() => set('color')(token)}
                      />
                    ))}
                  </div>
                  {/* CUSTOM COLOUR is always reachable (user 2026-09-03: "or set
                      custom color?"). It used to appear ONLY when the value was
                      already a hex — a token layer got a plain text field, so the
                      one way off the ramp was to type a hex string by hand.
                      `ColorInputRow` is seeded with the token's RESOLVED hex, so
                      the picker opens on the colour you can see; writing a hex
                      replaces the token, which is the intent. */}
                  <ColorInputRow hideLabel label="Colour" value={resolveColor(layer.color) ?? '#FFFFFF'} onChange={set('color')} />
                </div>
              </LabeledControl>
              <LabeledControl label="Stroke"><Input size="sm" className="w-full" value={layer.stroke ?? ''} onChange={(e) => set('stroke')(e.target.value || undefined)} /></LabeledControl>
            </LabeledControlSection>
          )}
        </div>
      )}
    </div>
  )
}
