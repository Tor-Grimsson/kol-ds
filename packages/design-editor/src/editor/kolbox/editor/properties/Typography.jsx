import { useEffect, useRef, useState } from 'react'
import {
  applyCase, ensureFamilyLoaded, FAMILY_OPTIONS, familyCssFor, familyPatch, featureOn, fontFeatures, fontStyleFor, isBinding, layerFamily, layerWeight,
  SIZE_PRESETS, stylesFor, styleValueFor, textCss, VARIABLE_FAMILIES, weightLabel,
} from '../engine.js'
import { autoUnderline, underlineOf, UNDERLINE_STYLES } from '../../../modes/type/textSettings.js'
import { textLayerFont } from '../../../modes/type/textOutline.js'
import { OffOn } from '../../labs/Params.jsx'
import { Act, Field, Narrow, useBeside } from './parts.jsx'
import { TextStylesButton } from './Styles.jsx'
import { TEXT_STYLE_KEYS } from '../../../compose/styles.js'
import { useComposeState } from '../engine.js'
import {
  Button, ButtonGroup, ColorInputRow, ColorPickerPopover, DividerLabel, Dropdown, FieldPair, LabeledControl, Menu, PopoverPanel, Slider, TabsRow, Tooltip,
  LabeledControlSection,
} from '@kolkrabbi/kol-component'

/* Typography, as Figma's text inspector: the styles action in the title, then four rows with no labels: the font; the
   weight (its named weights and their italics) beside the size with its presets chevron; line height beside letter
   spacing, both in percent; text alignment, vertical alignment and Type settings. Type settings opens beside the rail
   with three tabs, Basics, Details and Variable, each under a preview of the layer's text; on Basics and Details each setting's name beside it, on Variable over its slider. A control the engine cannot
   do yet is drawn in its place, dimmed, with its reason. A metric bound to motion reads "animated". */

function Metric({ layer, k, ...rest }) {
  if (isBinding(layer[k])) return <span className="flex h-control items-center text-help text-muted italic">animated</span>
  return <Field {...rest} />
}

/* the weight list: each named weight and its italic; a weight between the names (set on the Variable tab) is listed too.
   A pick sets the slant to the italic's end or upright (the Variable tab's slant in between is cleared) */
function weightOptions(layer) {
  const family = layerFamily(layer)
  const rows = stylesFor(family).flatMap((s) => {
    const w = s.patch.weight
    return [
      { value: s.value, label: s.label, patch: { ...s.patch, italic: false, slant: undefined } },
      { value: `${s.value}/i`, label: w === 400 ? 'Italic' : `${s.label} Italic`, patch: { ...s.patch, italic: true, slant: undefined } },
    ]
  })
  const value = `${styleValueFor(layer)}${layer.italic ? '/i' : ''}`
  if (!rows.some((r) => r.value === value)) {
    const w = layerWeight(layer)
    rows.unshift({ value, label: `${weightLabel(w)}${layer.italic ? ' Italic' : ''}`, patch: { weight: w, italic: !!layer.italic } })
  }
  return { rows, value }
}

/* a row of the window: its label beside its control (Figma's, 11 px, cut with an ellipsis; `tip` shows the whole of a
   label too long for its column); a row whose feature the layer's font does not carry is dimmed and does nothing */
const Row = ({ label, off, tip, children }) => {
  const row = (
    <LabeledControl variant="kolbox" horizontal label={label} labelWidth={label.length > 12 ? 116 : undefined} aria-disabled={off || undefined} className={`${off ? 'opacity-40 [&_*]:pointer-events-none' : ''}${tip ? ' w-full' : ''}`}>
      {children}
    </LabeledControl>
  )
  return tip ? <Tooltip variant="kolbox" label={tip}>{row}</Tooltip> : row
}
/* the longest label the 116 px column shows whole */
const LABEL_FITS = 20
const TABS = 'w-full min-w-0 [&_button]:px-0 [&_button]:text-help'
/* a row with no trailing action: its two fields share the whole row, over the icon columns too */
const FULL = '[--kol-kolbox-row-cols:minmax(0,1fr)_minmax(0,1fr)]'
/* the features the window draws in their own rows; the rest of the font's are More features */
const OWN = new Set(['aalt', 'ccmp', 'ccm_', 'locl', 'rlig', 'rvrn', 'mark', 'mkmk', 'kern', 'calt', 'dlig', 'case', 'cpsp', 'frac', 'zero', 'sups', 'subs', 'lnum', 'onum', 'smcp'])
const FEATURE_NAMES = {
  dnom: 'Fraction denominators', numr: 'Fraction numerators', ordn: 'Ordinals', pnum: 'Proportional numbers', tnum: 'Tabular numbers',
  salt: 'Stylistic alternates', sinf: 'Scientific inferiors', c2sc: 'Capitals to small caps', liga: 'Common ligatures', clig: 'Contextual ligatures',
  hlig: 'Historical ligatures', swsh: 'Swashes', titl: 'Titling', pcap: 'Petite caps', c2pc: 'Capitals to petite caps', unic: 'Unicase', hist: 'Historical forms',
}
const setNumber = (tag) => `${tag.startsWith('ss') ? 'Stylistic set' : 'Character variant'} ${Number(tag.slice(2))}`

/* what the layer's font file carries ({ gsub, gpos, names }); none for a family with no file here */
const NONE = { gsub: new Set(), gpos: new Set(), names: {} }
function useFontFeatures(layer) {
  const family = layerFamily(layer)
  const italic = !!layer.italic
  const [feats, setFeats] = useState(null)
  useEffect(() => {
    let live = true
    fontFeatures(family, italic).then((f) => { if (live) setFeats(f ?? NONE) }).catch(() => { if (live) setFeats(NONE) })
    return () => { live = false }
  }, [family, italic])
  return feats ?? NONE
}
const has = (feats, tag) => feats.gsub.has(tag) || feats.gpos.has(tag)

function caseTabs(feats) {
  return [
    { value: 'original', label: '–', tooltip: 'As typed' },
    { value: 'upper', label: 'AG', tooltip: 'Upper case' },
    { value: 'lower', label: 'ag', tooltip: 'Lower case' },
    { value: 'title', label: 'Ag', tooltip: 'Title case' },
    { value: 'small-caps', label: 'ᴀɢ', tooltip: 'Small caps', disabled: !has(feats, 'smcp') },
  ]
}
const SETTING_TABS = ['Basics', 'Details', 'Variable']

/* the layer's text in its own font, weight, slant, case, spacing and features, on one line */
function Preview({ layer }) {
  return (
    <div data-type-preview="" className="flex h-20 items-center justify-center overflow-hidden rounded-control bg-field px-3">
      <span className="truncate text-2xl text-text"
        style={{ fontFamily: familyCssFor(layer), fontWeight: layerWeight(layer), fontStyle: fontStyleFor(layer), letterSpacing: `${layer.tracking ?? 0}em`, ...textCss(layer), textWrap: undefined }}>
        {applyCase(layer.text ?? '', layer.case)}
      </span>
    </div>
  )
}

const DECORATION_TABS = [{ value: 'none', label: '–', tooltip: 'None' }, { value: 'underline', label: 'U', tooltip: 'Underline' }, { value: 'strikethrough', label: 'S', tooltip: 'Strikethrough' }]

/* Figma's underline styles, each an underlined U drawn in its style */
const STYLE_CLASS = { solid: 'decoration-solid', dotted: 'decoration-dotted', wavy: 'decoration-wavy' }
const STYLE_TABS = UNDERLINE_STYLES.map((v) => ({ value: v, label: <span className={`underline ${STYLE_CLASS[v]}`}>U</span>, tooltip: v[0].toUpperCase() + v.slice(1) }))
const pct = (v) => Math.round(v * 100) / 100

/* Decoration's more, as Figma's Basics / Underline view: the decoration, the underline's style, thickness and offset
   (percent of the size; empty is Auto, the font's own, which the field reads), skip ink and color (empty is the
   text's); dimmed while the text is not underlined. An edit writes percent and drops an older file's px values */
function Underline({ layer, set, patch }) {
  const off = layer.decoration !== 'underline'
  const font = textLayerFont(layer)
  const u = underlineOf(layer, font)
  const auto = autoUnderline(font)
  const metric = (k, v) => patch({ [`underline${k}Pct`]: v, [`underline${k}`]: undefined })
  return (
    <>
      <Row label="Decoration">
        <TabsRow variant="kolbox" className={TABS} onChange={(v) => set('decoration', v === 'none' ? undefined : v)} value={layer.decoration ?? 'none'} tabs={DECORATION_TABS} />
      </Row>
      <div data-underline-settings="" aria-disabled={off || undefined} className={`flex flex-col gap-2 ${off ? 'opacity-40 [&_*]:pointer-events-none' : ''}`}>
        <Row label="Style">
          <TabsRow variant="kolbox" className={TABS} onChange={(v) => set('underlineStyle', v === 'solid' ? undefined : v)} value={u.style} tabs={STYLE_TABS} />
        </Row>
        <LabeledControl variant="kolbox" label="Thickness">
          <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label="Underline thickness" min={0.5} max={20} step={0.01}
            value={pct(u.thickness ?? auto.thickness)} formatValue={(v) => (u.thickness == null ? 'Auto' : `${v}%`)} onChange={(v) => metric('Thickness', v)} />
        </LabeledControl>
        <LabeledControl variant="kolbox" label="Offset">
          <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label="Underline offset" min={0} max={25} step={0.01}
            value={pct(u.offset ?? auto.offset)} formatValue={(v) => (u.offset == null ? 'Auto' : `${v}%`)} onChange={(v) => metric('Offset', v)} />
        </LabeledControl>
        <Row label="Skip ink"><OffOn on={!!layer.underlineSkipInk} onChange={(v) => set('underlineSkipInk', v || undefined)} /></Row>
        <Row label="Color">
          <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Underline color" clearable
            value={layer.underlineColor ?? ''} onChange={(v) => set('underlineColor', v ?? undefined)} />
        </Row>
      </div>
    </>
  )
}

function Basics({ layer, set, feats, onMore }) {
  const align = layer.textAlign ?? 'center'
  return (
    <>
      <Row label="Alignment">
        <ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[['left', 'text-align-left', 'Align text left'], ['center', 'text-align-center', 'Center text'], ['right', 'text-align-right', 'Align text right'], ['justify', 'text-justify-all', 'Justify text']]
          .map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: align === v, onPress: () => set('textAlign', v) }))} />
      </Row>
      <Row label="Decoration">
        <span className="flex w-full min-w-0 items-center gap-1">
          <TabsRow variant="kolbox" className={TABS} onChange={(v) => set('decoration', v === 'none' ? undefined : v)} value={layer.decoration ?? 'none'} tabs={DECORATION_TABS} />
          <Button variant="kolbox" iconOnly="more" aria-label="More decoration" onClick={onMore} />
        </span>
      </Row>
      <Row label="Case">
        <TabsRow variant="kolbox" className="w-full min-w-0 [&_button]:px-0" tabs={caseTabs(feats)} value={layer.case ?? 'original'} onChange={(v) => set('case', v)} />
      </Row>
      <hr className="border-border" />
      <Row label="Vertical trim">
        <TabsRow variant="kolbox" className={TABS} tabs={[{ value: 'standard', label: 'Standard' }, { value: 'cap', label: 'Cap height' }]} value={layer.trim ?? 'standard'} onChange={(v) => set('trim', v === 'standard' ? undefined : v)} />
      </Row>
      <Row label="List style">
        <TabsRow variant="kolbox" className={TABS} tabs={[{ value: 'none', label: 'None' }, { value: 'bullets', label: 'Bullets' }, { value: 'numbers', label: 'Numbers' }]} value={layer.listStyle ?? 'none'} onChange={(v) => set('listStyle', v === 'none' ? undefined : v)} />
      </Row>
      <Row label="Paragraph spacing">
        <Field icon="pilcrow" aria-label="Paragraph spacing" value={Math.round(layer.paragraphSpacing ?? 0)} onCommit={(n) => set('paragraphSpacing', Math.max(0, Math.round(n)))} />
      </Row>
      <Row label="Truncate text"><OffOn on={!!layer.truncate} onChange={(v) => set('truncate', v)} /></Row>
      <Row label="Wrap style">
        <Dropdown variant="kolbox" ariaLabel="Wrap style" value={layer.wrap === 'balance' ? 'balance' : 'auto'} options={[{ value: 'auto', label: 'Auto' }, { value: 'balance', label: 'Balanced' }]} onChange={(v) => set('wrap', v === 'auto' ? undefined : v)} className="w-full" />
      </Row>
    </>
  )
}

function Details({ layer, set, edit, feats }) {
  const on = (tag) => featureOn(layer, tag)
  /* a feature off or on */
  const setFeature = (tag, v) => edit.patch({ features: { ...(layer.features ?? {}), [tag]: v ? 1 : 0 } })
  const feature = (tag, label) => <Row key={tag} label={label} tip={label.length > LABEL_FITS ? label : undefined} off={!has(feats, tag)}><OffOn on={on(tag)} onChange={(v) => setFeature(tag, v)} /></Row>
  const numStyle = on('lnum') ? 'lnum' : on('onum') ? 'onum' : 'default'
  const numPos = on('subs') ? 'subs' : on('sups') ? 'sups' : 'normal'
  const font = { fontFamily: familyCssFor(layer) }
  const sets = [...feats.gsub].filter((t) => /^ss\d\d$/.test(t)).sort()
  const more = [...new Set([...feats.gsub, ...feats.gpos])].filter((t) => !OWN.has(t) && !/^ss\d\d$/.test(t)).sort()
  return (
    <>
      <DividerLabel>Indentation</DividerLabel>
      <Row label="Hanging punctuation"><OffOn on={!!layer.hangPunctuation} onChange={(v) => set('hangPunctuation', v)} /></Row>
      <Row label="Hanging lists"><OffOn on={!!layer.hangLists} onChange={(v) => set('hangLists', v)} /></Row>
      <Row label="Paragraph indent">
        <Field aria-label="Paragraph indent" value={Math.round(layer.paragraphIndent ?? 0)} onCommit={(n) => set('paragraphIndent', Math.round(n))} />
      </Row>
      <DividerLabel>Letter case</DividerLabel>
      <Row label="Case">
        <TabsRow variant="kolbox" className="w-full min-w-0 [&_button]:px-0" tabs={caseTabs(feats)} value={layer.case ?? 'original'} onChange={(v) => set('case', v)} />
      </Row>
      {feature('case', 'Case-sensitive forms')}
      {feature('cpsp', 'Capital spacing')}
      <DividerLabel>Numbers</DividerLabel>
      <Row label="Style" off={!has(feats, 'lnum') && !has(feats, 'onum')}>
        <TabsRow variant="kolbox" className={TABS} value={numStyle}
          onChange={(v) => edit.patch({ features: { ...(layer.features ?? {}), lnum: v === 'lnum' ? 1 : 0, onum: v === 'onum' ? 1 : 0 } })}
          tabs={[
            { value: 'default', label: '–', tooltip: 'Default' },
            { value: 'lnum', label: <span style={{ ...font, fontFeatureSettings: '"lnum" 1' }}>17</span>, tooltip: 'Lining', disabled: !has(feats, 'lnum') },
            { value: 'onum', label: <span style={{ ...font, fontFeatureSettings: '"onum" 1' }}>17</span>, tooltip: 'Old style', disabled: !has(feats, 'onum') },
          ]} />
      </Row>
      <Row label="Position" off={!has(feats, 'subs') && !has(feats, 'sups')}>
        <TabsRow variant="kolbox" className={TABS} value={numPos}
          onChange={(v) => edit.patch({ features: { ...(layer.features ?? {}), subs: v === 'subs' ? 1 : 0, sups: v === 'sups' ? 1 : 0 } })}
          tabs={[
            { value: 'subs', label: 'A₂', tooltip: 'Subscript', disabled: !has(feats, 'subs') },
            { value: 'normal', label: 'A2', tooltip: 'Normal' },
            { value: 'sups', label: 'A²', tooltip: 'Superscript', disabled: !has(feats, 'sups') },
          ]} />
      </Row>
      {feature('frac', 'Fractions')}
      {feature('zero', 'Slashed zero')}
      <DividerLabel>Letterforms</DividerLabel>
      {feature('dlig', 'Rare ligatures')}
      {feature('calt', 'Contextual alternates')}
      {sets.length > 0 && <DividerLabel>Stylistic sets</DividerLabel>}
      {sets.map((t) => feature(t, feats.names[t] ?? setNumber(t)))}
      <DividerLabel>Horizontal spacing</DividerLabel>
      {feature('kern', 'Kerning pairs')}
      {more.length > 0 && <DividerLabel>More features</DividerLabel>}
      {more.map((t) => feature(t, feats.names[t] ?? FEATURE_NAMES[t] ?? (/^cv\d\d$/.test(t) ? setNumber(t) : t)))}
    </>
  )
}

/* one slider and its field per axis of the layer's font, the label over each: the slant writes the slnt axis, the weight
   the wght axis, with a stop at each named weight */
function Variable({ layer, edit }) {
  const family = layerFamily(layer)
  const vf = VARIABLE_FAMILIES[family]
  if (!vf) return <p className="text-help text-muted">No variable axes</p>
  return (
    <>
      {vf.slnt != null && (
        <LabeledControl variant="kolbox" label="Slant">
          <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label="Slant" min={vf.slnt} max={0} step={0.5}
            value={Number.isFinite(layer.slant) ? layer.slant : layer.italic ? vf.slnt : 0}
            onChange={(v) => edit.patch({ slant: v, italic: v < 0 })} />
        </LabeledControl>
      )}
      <LabeledControl variant="kolbox" label="Weight">
        <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label="Weight" min={vf.min} max={vf.max} step={1} value={layerWeight(layer)}
          stops={stylesFor(family).map((s) => s.patch.weight)} onChange={(v) => edit.patch({ weight: Math.round(v) })} />
      </LabeledControl>
    </>
  )
}

export default function Typography({ layer, edit: own }) {
  /* W7: a type edit on a layer with a text style detaches it (Figma's), keeping the values */
  const { styles } = useComposeState()
  const textStyle = layer.textStyle ? styles.texts.find((s) => s.id === layer.textStyle) : null
  const detaching = (p) => (layer.textStyle && Object.keys(p).some((k) => TEXT_STYLE_KEYS.includes(k)) ? { ...p, textStyle: undefined } : p)
  const edit = { ...own, patch: (p) => own.patch(detaching(p)), setProp: (k, v) => own.patch(detaching({ [k]: v })) }
  const set = edit.setProp
  const family = layerFamily(layer)
  const weights = weightOptions(layer)
  const feats = useFontFeatures(layer)
  const [open, setOpen] = useState(null)
  const [tab, setTab] = useState('Basics')
  /* Basics' Decoration more opens the Underline view in its place, its back arrow returns */
  const [underline, setUnderline] = useState(false)
  const sizeRef = useRef(null)
  const [setRef, setAnchor] = useBeside()
  const toggle = (k) => setOpen((o) => (o === k ? null : k))
  const close = (k) => setOpen((o) => (o === k ? null : o))
  return (
    <LabeledControlSection variant="kolbox"
      label="Typography"
      end={<TextStylesButton layer={layer} write={own.patch} />}
    >
      {/* the style in use, as Figma's: its name and size over the rows, detach beside it */}
      {textStyle && (
        <FieldPair variant="kolbox" span data-text-style={textStyle.name}
          first={<span className="flex h-control min-w-0 flex-1 items-center gap-2 rounded-control bg-field px-2 text-help text-text"><span aria-hidden style={{ fontFamily: familyCssFor(textStyle.value), fontWeight: textStyle.value.weight }}>Ag</span><span className="min-w-0 flex-1 truncate">{textStyle.name}</span><span className="shrink-0 text-muted">{Math.round(textStyle.value.size ?? 0)}</span></span>}
          trailing={<Act icon="link" label="Detach style" onClick={() => own.patch({ textStyle: undefined })} />} />
      )}
      <FieldPair variant="kolbox" span className={FULL}
        first={<Dropdown variant="kolbox" ariaLabel="Font family" className="w-full" value={family} options={FAMILY_OPTIONS}
          onChange={(id) => { ensureFamilyLoaded(id); edit.patch(familyPatch(layer, id)) }} />}
      />
      <FieldPair variant="kolbox" className={FULL}
        first={<Dropdown variant="kolbox" ariaLabel="Weight" className="min-w-0 flex-1" value={weights.value} options={weights.rows.map(({ value, label }) => ({ value, label }))}
          onChange={(v) => { const s = weights.rows.find((x) => x.value === v); if (s) edit.patch(s.patch) }} />}
        second={(
          <span ref={sizeRef} className="flex min-w-0 flex-1">
            <Metric layer={layer} k="size" aria-label="Font size" value={Math.round(layer.size ?? 0)} onCommit={(n) => set('size', Math.max(1, Math.round(n)))}
              /* the kit's 12 chevron (Dropdown's), inside the field */
              trailing={<Narrow icon="chevron-down" className="[&_svg]:size-3" label="Size presets" lit={open === 'size'} onClick={() => toggle('size')} />} />
          </span>
        )}
      />
      <FieldPair variant="kolbox" className={FULL}
        first={<Metric layer={layer} k="lineHeight" icon="line-height" aria-label="Line height" value={Math.round((layer.lineHeight ?? 1) * 100)} trailing="%" onCommit={(n) => set('lineHeight', Math.round(n) / 100)} />}
        second={<Metric layer={layer} k="tracking" icon="letter-spacing" aria-label="Letter spacing" value={Math.round((layer.tracking ?? 0) * 1000) / 10} trailing="%" onCommit={(n) => set('tracking', Math.round(n / 100 / 0.005) * 0.005)} />}
      />
      <FieldPair variant="kolbox"
        first={<ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[['left', 'text-align-left', 'Align text left'], ['center', 'text-align-center', 'Center text'], ['right', 'text-align-right', 'Align text right']]
          .map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: (layer.textAlign ?? 'center') === v, onPress: () => set('textAlign', v) }))}/>}
        second={<ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[['top', 'text-valign-top', 'Align top'], ['middle', 'text-valign-middle', 'Align middle'], ['bottom', 'text-valign-bottom', 'Align bottom']]
          .map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: (layer.verticalAlign ?? 'middle') === v, onPress: () => set('verticalAlign', v) }))}/>}
        trailing={<span ref={setRef} className="inline-flex"><Act icon="slider-01" label="Type settings" lit={open === 'settings'} onClick={() => toggle('settings')} /></span>}
      />
      <Menu variant="kolbox"
        aria-label="Size presets"
        anchor={sizeRef}
        open={open === 'size'}
        onClose={() => close('size')}
        onSelect={(row) => set('size', Number(row.value))}
        groups={[SIZE_PRESETS.map((s) => ({ label: String(s), value: s, check: Math.round(layer.size) === s }))]}
      />
      <PopoverPanel variant="kolbox" anchor={setAnchor} open={open === 'settings'} onClose={() => close('settings')} aria-label="Type settings" className="max-h-120"
        leading={underline && tab === 'Basics'
          ? (
            <span className="flex min-w-0 items-center gap-1 text-help">
              <Button variant="kolbox" iconOnly="arrow-left" aria-label="Back to Basics" onClick={() => setUnderline(false)} />
              <span className="text-muted">Basics</span><span className="text-muted">/</span><span className="text-text">Underline</span>
            </span>
          )
          : <TabsRow variant="kolbox" tabs={SETTING_TABS} value={tab} onChange={setTab} />}>
        <div className="flex flex-col gap-2 px-4 pb-4 [&_.kol-labeled-control-label]:text-help" data-type-tab={underline && tab === 'Basics' ? 'Underline' : tab}>
          <Preview layer={layer} />
          {tab === 'Basics' && (underline ? <Underline layer={layer} set={set} patch={edit.patch} /> : <Basics layer={layer} set={set} feats={feats} onMore={() => setUnderline(true)} />)}
          {tab === 'Details' && <Details layer={layer} set={set} edit={edit} feats={feats} />}
          {tab === 'Variable' && <Variable layer={layer} edit={edit} />}
        </div>
      </PopoverPanel>
    </LabeledControlSection>
  )
}
