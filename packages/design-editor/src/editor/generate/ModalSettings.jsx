import { useEffect, useState } from 'react'
import {
  Button, ButtonGroup, Dropdown, Input, ModalDialog, LabeledControl, LabeledControlSection, Slider, TabsRow, ToggleSwitch, Tooltip,
  SettingsGrid, SettingsPoint, SettingsRamp, SettingsRampHead, SettingsLights, SettingsFieldMap, SettingsDisclosure,
} from '@kolkrabbi/kol-component'
import { CURVES, splitSection, stepId, familyOf, familyStyles, rememberStyle, paramsForFamily } from './windows'
import { useGeneratorTool, ToolPreview } from './tool'
import { useToolUi, openTool, setUi, getTool, setTool } from './store'

/**
 * ModalSettings — the EXPANDED form of the generator tools: Generate, Repeat and Type on kol-component's `ModalDialog
 * variant="settings"` (plan-2026-11-05-float-editor W7; his frame 12:2282, his mock 879P1yBsBPqpdGI5a5v2Y5 143:35343). The
 * window is the spec's data (`./windows.js`): the section list switches the body, each control bound to the engine's params
 * (fxr's `src/generate`, W7.6). ONLY BASE FLOAT PARTS (plan-2026-11-12-one-header W6.1, P8 · P9): every row is a
 * `LabeledControl variant="float"` (label above) around the base itself — `Slider variant="float" readout="input"` (its
 * value an Input pill), `Dropdown variant="float"`, `Input variant="float"`, `TabsRow variant="float"`; a toggle row is
 * `horizontal` around a bare float `ToggleSwitch`; every group a `LabeledControlSection`; the footer's buttons a
 * `ButtonGroup` of float Buttons. Its state is the tool's one state (`./store`), shared with the Rail form. Apply puts a
 * live `generate` / `repeat` layer on the canvas (or updates the one it drew); Expand bakes it (fxr's flattenGenerate ·
 * flattenRepeat). A control the engine has no param for renders disabled. Opened by `kol:open-generator-window` with
 * `form: 'dialog'`.
 */

/* a float Dropdown filling its cell */
const FILL = 'w-full [&_.kol-dd-trigger]:w-full [&_.kol-dd-trigger]:justify-between'

export function Control({ x, t }) {
  const value = t.valueOf(x)
  const set = x.bind ? t.set(x) : () => {}
  const disabled = !t.isLive(x)
  const aria = x.name
  const fmt = x.format ?? String
  switch (x.type) {
    /* his mock's slider row: the value pill 26 tall (the sm height scoped to it), the run bright */
    case 'slider': return <Slider variant="float" readout="input" value={Number(value)} onChange={set} min={x.min} max={x.max} step={x.step} formatValue={x.format} disabled={disabled} aria-label={aria} className="w-full [--kol-float-h-sm:26px] [--kol-slider-float-run:var(--kol-fg-96)] [&_.kol-control]:!px-2" />
    case 'range': return (
      <Slider variant="dual" value={value[0]} value2={value[1]} min={x.min} max={x.max} step={x.step} disabled={disabled} aria-label={aria} label1={fmt(value[0])} label2={fmt(value[1])}
        onChange={(v) => set([Math.min(v, value[1]), value[1]])} onChange2={(v) => set([value[0], Math.max(v, value[0])])} />
    )
    case 'segmented': return <TabsRow variant="float" size="xs" tabs={x.options} value={value} onChange={set} ariaLabel={aria} className="w-full [&>*]:flex-1" />
    case 'select': return <Dropdown variant="float" size="sm" value={value} onChange={set} options={x.options} ariaLabel={aria} className={FILL} />
    case 'toggle': return <ToggleSwitch variant="float" checked={!!value} onChange={set} disabled={disabled} aria-label={aria} />
    case 'point': return <SettingsPoint value={value} onChange={set} min={x.min} max={x.max} disabled={disabled} aria-label={aria} />
    case 'text':
    case 'color': return <Input variant="float" size="sm" value={value ?? ''} onChange={(e) => set(e.target.value)} disabled={disabled} aria-label={aria} width="100%" />
    case 'lights': return <SettingsLights value={value} onChange={set} disabled={disabled} />
    case 'picker': return <Dropdown variant="float" size="sm" value={value ?? ''} onChange={set} options={[{ value: '', label: 'None' }, ...t.layersFor(x)]} ariaLabel={aria} className={FILL} />
    case 'button': return <Button variant="float" tone="secondary" size="sm" disabled={disabled} onClick={() => t.run(x.act)} className="w-full">{x.name}</Button>
    default: return null
  }
}

/* one row: the LabeledControl (`settings` — his mock's 10/12 label, 6 above the control, W8.1) around the base (a toggle's beside it, the rest above). A disabled row sits in a fieldset that
 * disables what is inside natively (`contents`, so it draws nothing) */
function Row({ x, t }) {
  const disabled = !t.isLive(x)
  const toggle = x.type === 'toggle'
  return (
    <fieldset disabled={disabled || undefined} className={`contents ${x.type === 'lights' ? '[&>*]:col-span-2' : ''}`.trim()}>
      <LabeledControl variant="settings" horizontal={toggle} labelWidth={toggle ? 'auto' : undefined} label={x.type === 'lights' ? null : x.name}
        data-control={x.name} className={disabled ? 'opacity-40' : ''}>
        <Control x={x} t={t} />
      </LabeledControl>
    </fieldset>
  )
}

/* a group: its rows two-up, its A→B ramps as one table under VALUE A · CURVE · VALUE B (first in a disclosure, his
 * More geometry; after the grid elsewhere) */
function Group({ g, t, more, setMore }) {
  const ramps = g.controls.filter((x) => x.type === 'ramp')
  const rest = g.controls.filter((x) => x.type !== 'ramp')
  const table = ramps.length > 0 && (
    <div className="flex flex-col gap-1">
      <SettingsRampHead />
      {ramps.map((x) => (
        <SettingsRamp key={x.id} label={x.name} value={t.valueOf(x)} onChange={x.bind ? t.set(x) : () => {}} curves={x.curves ?? CURVES} disabled={!t.isLive(x)} data-control={x.name} />
      ))}
    </div>
  )
  const grid = rest.length > 0 && <SettingsGrid>{rest.map((x) => <Row key={x.id} x={x} t={t} />)}</SettingsGrid>
  if (g.kind === 'more') {
    return (
      <SettingsDisclosure label={g.title} note={g.note} open={!!more[g.title]} onToggle={(v) => setMore((m) => ({ ...m, [g.title]: v }))}>
        {table}{grid && <div className={table ? 'pt-3' : ''}>{grid}</div>}
      </SettingsDisclosure>
    )
  }
  return <LabeledControlSection variant="settings" label={g.title} end={g.note} divided>{grid}{table && <div className={grid ? 'pt-3' : ''}>{table}</div>}</LabeledControlSection>
}

function Preview({ t, caption }) {
  return (
    <LabeledControlSection variant="settings" label="Preview" end={t.live ? '●  Live' : '○  Paused'} className="[&>div:first-child]:pr-0">
      <div className="size-[248px] rounded-md border border-oq-16 bg-surface-primary overflow-hidden flex items-center justify-center">
        <ToolPreview t={t} className="size-full" />
      </div>
      <div className="flex justify-between pt-3 pb-[19px] pr-[7px] border-b border-oq-16">
        <span className="text-[10px] leading-[12px] text-oq-64">{caption}</span>
        <span className="font-(family-name:--kol-font-family-mono) text-[10px] leading-[13px] text-fg-64">512 × 512 px</span>
      </div>
    </LabeledControlSection>
  )
}

/* W23.7: the Advanced row's state per window and step, while the app is open */
const ADVANCED = {}

export default function ModalSettings({ id, open, onClose }) {
  const t = useGeneratorTool(id)
  const { win, params, sections } = t
  const [section, setSection] = useState(sections[0].key)
  const [more, setMore] = useState(ADVANCED)
  const current = sections.find((s) => s.key === section) ?? sections[0]
  /* W23.9 · W23.7 · W23.0: only what the style reads, simple first, the family's styles */
  const step = `${id}:${stepId(current, params)}`
  const { simple, advanced } = splitSection(current, params, stepId(current, params))
  const family = id === 'generate' ? familyOf(params) : null
  useEffect(() => { if (id === 'generate') rememberStyle(params) }, [id, params.genStyle]) // eslint-disable-line react-hooks/exhaustive-deps
  const toggleAdv = (v) => setMore((m) => { const n = { ...m, [step]: v }; Object.assign(ADVANCED, n); return n })
  const styleCtl = win.header.find((x) => x.id === 'style')
  const description = win.header.find((x) => x.id === 'description')
  const expandCtl = win.header.find((x) => x.id === 'expand')
  const fieldMap = win.fieldMap?.(params)

  return (
    <ModalDialog variant="settings" open={open} movable="generator" onClose={onClose} title={win.title(params)} kind={family?.label ?? win.kind} sectionsLabel="Steps"
      width={880} height={656}
      headerEnd={(
        <div className="flex items-center gap-2">
          {expandCtl && (
            <Tooltip label="Expand to editable paths">
              <Button variant="float" tone="ghost" size="sm" disabled={!t.canApply} data-control="Expand" onClick={() => { t.expand(); onClose() }}>Expand</Button>
            </Tooltip>
          )}
          {styleCtl && <LabeledControl variant="float" horizontal label="Style" labelWidth="fit-content" className="gap-2"><div className="w-[140px]" data-control="Style"><Dropdown variant="float" size="sm" value={t.valueOf(styleCtl)} onChange={(v) => { t.set(styleCtl)(v); setSection('style') }} options={familyStyles(params)} ariaLabel="Style" className={FILL} /></div></LabeledControl>}
          {t.presets && <LabeledControl variant="float" horizontal label="Preset" labelWidth="fit-content" className="gap-2"><div className="w-[140px]" data-control="Preset"><Dropdown variant="float" size="sm" value={params.genPreset ?? 'custom'} onChange={t.setPreset} options={t.presets} ariaLabel="Preset" className={FILL} /></div></LabeledControl>}
        </div>
      )}
      sections={sections.map((s) => ({ key: s.key, label: s.label, state: s.state?.(params) }))}
      section={current.key} onSection={setSection}
      aside={(
        <div className="flex flex-col">
          <Preview t={t} caption={current.state?.(params) ?? ''} />
          {fieldMap && <div className="pt-[18px]"><SettingsFieldMap background={fieldMap.background} left={fieldMap.left} right={fieldMap.right} /></div>}
          {description && <p className="pt-6 text-[10px] leading-[14px] text-fg-64" data-control="Description">{t.valueOf(description)}</p>}
          <p className="pt-2 text-[10px] leading-[12px] text-oq-64">Updates as you adjust settings.</p>
        </div>
      )}
      footer={(
        <>
          {/* his mock (W8.1): the label 12 off the small (bare) switch; Reset and Cancel on the grey tone; one centre line */}
          <LabeledControl variant="float" horizontal label="Live preview" labelWidth="fit-content" className="gap-3 mr-[36px]">
            <ToggleSwitch checked={t.live} onChange={t.setLive} aria-label="Live preview" className="flex gap-0" />
          </LabeledControl>
          <Button variant="float" tone="grey" size="sm" onClick={t.reset}>Reset</Button>
          <Button variant="float" tone="grey" size="sm" onClick={t.randomise} data-control="Randomise">Randomise</Button>
          <ButtonGroup align="right" className="flex-1">
            <Button variant="float" tone="grey" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="float" tone="inverted" size="sm" onClick={() => { t.apply(); onClose() }} disabled={!t.canApply}>Apply</Button>
          </ButtonGroup>
        </>
      )}>
      <div data-section-body={current.key}>
        {simple.map((g, i) => <Group key={`${current.key}-${i}`} g={g} t={t} more={more} setMore={setMore} />)}
        {advanced.length > 0 && (
          <SettingsDisclosure label="Advanced" note={`${advanced.reduce((n, g) => n + g.controls.length, 0)} more`} open={!!more[step]} onToggle={toggleAdv}>
            {advanced.map((g, i) => <Group key={`${current.key}-adv-${i}`} g={g} t={t} more={more} setMore={setMore} />)}
          </SettingsDisclosure>
        )}
      </div>
    </ModalDialog>
  )
}

/* the host — the dialog form, one tool at a time (`./store`'s ui); `kol:open-generator-window` opens a tool's Rail, or its
 * dialog with `form: 'dialog'` */
export function GeneratorWindows() {
  const { dialog } = useToolUi()
  useEffect(() => {
    /* W23.0b: `family` opens the Generate window on that family, on the style it last showed */
    const on = (e) => {
      const fam = e.detail?.family
      if (fam && familyOf(getTool('generate')?.params ?? {}).id !== fam) setTool('generate', { params: paramsForFamily(fam), layerId: null })
      openTool(e.detail?.window ?? 'generate', e.detail?.form ?? 'rail')
    }
    window.addEventListener('kol:open-generator-window', on)
    return () => window.removeEventListener('kol:open-generator-window', on)
  }, [])
  return dialog ? <ModalSettings key={dialog} id={dialog} open onClose={() => setUi({ dialog: null })} /> : null
}
