import { useEffect, useState } from 'react'
import {
  Button, Dialog, ToggleSwitch, Tooltip, SettingsGroup, SettingsGrid, SettingsCell, SettingsSlider, SettingsRange, SettingsSelect, SettingsSegmented,
  SettingsToggle, SettingsText, SettingsPoint, SettingsRamp, SettingsRampHead, SettingsLights, SettingsFieldMap, SettingsDisclosure,
} from '@kolkrabbi/kol-component'
import { CURVES } from './windows'
import { useGeneratorTool, ToolPreview } from './tool'
import { useToolUi, openTool, setUi } from './store'

/**
 * GeneratorWindow — the EXPANDED form of the generator tools: Generate, Repeat and Type on kol-component's `Dialog
 * variant="settings"` (plan-2026-11-05-float-editor W7; his frame 12:2282). The window is the spec's data (`./windows.js`):
 * the section list switches the body, each control a Settings* part bound to the engine's params (fxr's `src/generate`,
 * W7.6). Its state is the tool's one state (`./store`), shared with the Rail form. Apply puts a live `generate` / `repeat`
 * layer on the canvas (or updates the one it drew); Expand bakes it (fxr's flattenGenerate · flattenRepeat). A control the
 * engine has no param for renders disabled. Opened by `kol:open-generator-window` with `form: 'dialog'`.
 */

/* his footer buttons (12:2287): 30 tall, a 6 round, Inter 11 medium */
const BTN = '!h-[30px] !px-0 justify-center !rounded-md !text-[11px] !font-medium !normal-case !tracking-normal font-(family-name:--kol-font-family-float)'

export function Control({ x, t }) {
  const value = t.valueOf(x)
  const set = x.bind ? t.set(x) : () => {}
  const disabled = !t.isLive(x)
  const aria = x.name
  switch (x.type) {
    case 'slider': return <SettingsSlider value={value} onChange={set} min={x.min} max={x.max} step={x.step} format={x.format} disabled={disabled} aria-label={aria} />
    case 'range': return <SettingsRange value={value} onChange={set} min={x.min} max={x.max} step={x.step} format={x.format} disabled={disabled} aria-label={aria} />
    case 'segmented': return <SettingsSegmented value={value} onChange={set} options={x.options} disabled={disabled} ariaLabel={aria} />
    case 'select': return <SettingsSelect value={value} onChange={set} options={x.options} disabled={disabled} ariaLabel={aria} />
    case 'toggle': return <SettingsToggle label={x.name} checked={!!value} onChange={set} disabled={disabled} />
    case 'point': return <SettingsPoint value={value} onChange={set} min={x.min} max={x.max} disabled={disabled} aria-label={aria} />
    case 'text': return <SettingsText value={value} onChange={set} disabled={disabled} aria-label={aria} />
    case 'color': return <SettingsText value={value} onChange={set} disabled={disabled} aria-label={aria} />
    case 'lights': return <SettingsLights value={value} onChange={set} disabled={disabled} />
    case 'picker': return <SettingsSelect value={value ?? ''} onChange={set} options={[{ value: '', label: 'None' }, ...t.layersFor(x)]} disabled={disabled} ariaLabel={aria} />
    case 'button': return <Button size="sm" tone="ghost" disabled={disabled} onClick={() => t.run(x.act)} className="h-7 w-full">{x.name}</Button>
    default: return null
  }
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
  const grid = rest.length > 0 && (
    <SettingsGrid>
      {rest.map((x) => (
        <SettingsCell key={x.id} label={x.type === 'toggle' ? null : x.name} span={x.type === 'lights' ? 2 : 1} disabled={!t.isLive(x)} data-control={x.name}>
          <Control x={x} t={t} />
        </SettingsCell>
      ))}
    </SettingsGrid>
  )
  if (g.kind === 'more') {
    return (
      <SettingsDisclosure label={g.title} note={g.note} open={!!more[g.title]} onToggle={(v) => setMore((m) => ({ ...m, [g.title]: v }))}>
        {table}{grid && <div className={table ? 'pt-3' : ''}>{grid}</div>}
      </SettingsDisclosure>
    )
  }
  return <SettingsGroup title={g.title} note={g.note}>{grid}{table && <div className={grid ? 'pt-3' : ''}>{table}</div>}</SettingsGroup>
}

function Preview({ t, caption }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between pb-[15px]">
        <h3 className="text-[12px] leading-[15px] font-semibold text-fg-96">Preview</h3>
        <span className="text-[10px] leading-[12px] text-oq-64">{t.live ? '●  Live' : '○  Paused'}</span>
      </div>
      <div className="size-[248px] rounded-md border border-oq-16 bg-surface-primary overflow-hidden flex items-center justify-center">
        <ToolPreview t={t} className="size-full" />
      </div>
      <div className="flex justify-between pt-3 pb-[19px] pr-[7px] border-b border-oq-16">
        <span className="text-[10px] leading-[12px] text-oq-64">{caption}</span>
        <span className="font-(family-name:--kol-font-family-mono) text-[10px] leading-[13px] text-fg-64">512 × 512 px</span>
      </div>
    </div>
  )
}

export default function GeneratorWindow({ id, open, onClose }) {
  const t = useGeneratorTool(id)
  const { win, params, sections } = t
  const [section, setSection] = useState(sections[0].key)
  const [more, setMore] = useState({})
  const current = sections.find((s) => s.key === section) ?? sections[0]
  const styleCtl = win.header.find((x) => x.id === 'style')
  const description = win.header.find((x) => x.id === 'description')
  const expandCtl = win.header.find((x) => x.id === 'expand')
  const fieldMap = win.fieldMap?.(params)

  return (
    <Dialog variant="settings" open={open} onClose={onClose} title={win.title(params)} kind={win.kind}
      width={880} height={656}
      headerEnd={(
        <div className="flex items-center gap-2">
          {expandCtl && (
            <Tooltip label="Expand to editable paths">
              <Button tone="ghost" quiet size="sm" disabled={!t.canApply} data-control="Expand" onClick={() => { t.expand(); onClose() }}>Expand</Button>
            </Tooltip>
          )}
          {styleCtl && <div className="w-[140px]" data-control="Style"><SettingsSelect value={t.valueOf(styleCtl)} onChange={(v) => { t.set(styleCtl)(v); setSection('style') }} options={styleCtl.options} ariaLabel="Style" /></div>}
          {t.presets && <div className="w-[158px]" data-control="Preset"><SettingsSelect value={params.genPreset ?? 'custom'} onChange={t.setPreset} options={t.presets} ariaLabel="Preset" /></div>}
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
          <ToggleSwitch checked={t.live} onChange={t.setLive} aria-label="Live preview" />
          <span className="text-[11px] text-fg-96 pr-[30px]">Live preview</span>
          <Button size="sm" tone="secondary" onClick={t.reset} className={`${BTN} w-16 [--kol-tone-bg:var(--kol-oq-08)] [--kol-tone-border:var(--kol-oq-16)] [--kol-tone-fg:var(--kol-fg-96)]`}>Reset</Button>
          <span className="flex-1" />
          <Button size="sm" tone="secondary" onClick={onClose} className={`${BTN} w-20 [--kol-tone-bg:var(--kol-oq-08)] [--kol-tone-border:var(--kol-oq-16)] [--kol-tone-fg:var(--kol-fg-96)]`}>Cancel</Button>
          <Button size="sm" tone="primary" onClick={() => { t.apply(); onClose() }} disabled={!t.canApply} className={`${BTN} w-[106px] [--kol-tone-bg:var(--kol-fg-96)] [--kol-tone-fg:var(--kol-surface-primary)]`}>Apply</Button>
        </>
      )}>
      <div data-section-body={current.key}>
        {current.groups.map((g, i) => <Group key={`${current.key}-${i}`} g={g} t={t} more={more} setMore={setMore} />)}
      </div>
    </Dialog>
  )
}

/* the host — the dialog form, one tool at a time (`./store`'s ui); `kol:open-generator-window` opens a tool's Rail, or its
 * dialog with `form: 'dialog'` */
export function GeneratorWindows() {
  const { dialog } = useToolUi()
  useEffect(() => {
    const on = (e) => openTool(e.detail?.window ?? 'generate', e.detail?.form ?? 'rail')
    window.addEventListener('kol:open-generator-window', on)
    return () => window.removeEventListener('kol:open-generator-window', on)
  }, [])
  return dialog ? <GeneratorWindow key={dialog} id={dialog} open onClose={() => setUi({ dialog: null })} /> : null
}
