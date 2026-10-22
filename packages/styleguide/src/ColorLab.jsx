import { useState } from 'react'
import { ColorPickerPopover, Dropdown, HARMONIES, PaletteHarmonyWheel, ToggleSwitch, hslToHex } from '@kolkrabbi/kol-component'
import { COLOR_MIX, COLOR_ROLES, COLOR_SLOTS, DEFAULT_COLOR_LAB, deriveColorLab, rgbText } from './colorLab.js'
import { fgOn } from './comboMath.js'

/* taxonomy-ok: organism — the color builder: harmony wheel, roles, slots, palette, ramps and the 60/30/10 strip over one value */

/**
 * ColorLab — an interactive palette builder from one base color.
 *
 * Carried from kol-atlas's Color page (2026-10-20). Six sections over ONE value: Harmony (base +
 * rule on KOL's wheel), Roles (the harmony's five), Brand slots (four, two dark two light), Palette
 * (ten hues 36° apart + blue-grey and grey ramps), Ramps (five blend steps per hue) and Composition
 * (60/30/10). Select a slot or a composition share, then click any swatch to fill it.
 *
 * The math is `colorLab.js` (`deriveColorLab`, `colorLabCss`), so a consumer can save the value into
 * a brand and emit it as CSS without rendering the lab.
 *
 * @param {Object}   value     `{ base, harmony, blueBase, greyBase, blueLinked, slots, picks }` — controlled; omit for internal
 * @param {Function} onChange  `(next) => void`
 * @param {string}   className classes on the root
 */
const LABEL = 'kol-helper-10 tracking-widest text-meta uppercase'
const BARE_SWITCH = '[&>.toggle-switch-label]:hidden'
const PICKER = '[&>*]:!size-3'
/* ten columns capped so the 5-row ramp fits the window — a swatch is the same size in every section */
const ROW_MAX = 'calc((100vh - 200px) * 2)'
const isHex = (hex) => /^#[0-9a-f]{6}/i.test(hex)

function Swatch({ hex, name, selected, onClick, info }) {
  return (
    <button type="button" onClick={onClick} title={`${name} ${hex}`} className={`group relative aspect-square cursor-pointer overflow-hidden rounded ${selected ? 'ring-2 ring-[var(--kol-accent-primary)]' : ''}`} style={{ background: hex }}>
      <span className={`absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-surface-primary px-1.5 py-1 text-left kol-mono-10 leading-tight transition-opacity ${info ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <span className="truncate text-emphasis">{name}</span>
        <span className="truncate text-meta">{hex}</span>
        <span className="truncate text-meta">{rgbText(hex)}</span>
      </span>
    </button>
  )
}

const Row = ({ children }) => <div className="grid grid-cols-10 gap-2" style={{ maxWidth: ROW_MAX }}>{children}</div>

const Switch = ({ label, checked, onChange }) => (
  <span className="flex items-center gap-2"><span className={LABEL}>{label}</span><ToggleSwitch size="sm" className={BARE_SWITCH} checked={checked} onChange={onChange} /></span>
)

function Section({ title, info, onInfo, extra, children }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-6">
        <h3 className="m-0 kol-eyebrow text-fg-80">{title}</h3>
        {onInfo && <Switch label="Info" checked={info} onChange={onInfo} />}
        {extra}
      </div>
      {children}
    </section>
  )
}

export default function ColorLab({ value: valueProp, onChange, className = '' }) {
  const [own, setOwn] = useState(DEFAULT_COLOR_LAB)
  const value = valueProp ?? own
  const set = (patch) => { const next = { ...value, ...patch }; if (valueProp === undefined) setOwn(next); onChange?.(next) }
  const [slot, setSlot] = useState(null)
  const [info, setInfo] = useState({ roles: false, brand: false, palette: false, ramps: false, mix: false })
  const infoFor = (k) => ({ info: info[k], onInfo: (v) => setInfo((x) => ({ ...x, [k]: v })) })
  const c = deriveColorLab(value)

  /* a swatch click fills the selected slot (0–3) or composition share (4–6) */
  const assign = (hex) => {
    if (slot === null) return
    if (slot >= 4) set({ picks: [0, 1, 2].map((i) => (i === slot - 4 ? hex : value.picks?.[i] ?? null)) })
    else set({ slots: c.slots.map((v, i) => (i === slot ? hex : v)) })
    setSlot(null)
  }
  const toggleSlot = (i) => setSlot(slot === i ? null : i)
  const picked = (hex) => c.slots.includes(hex)

  return (
    <div className={`flex flex-col gap-10 ${className}`.trim()}>
      <Section title="Harmony">
        <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2"><span className={LABEL}>Base</span><span className="flex h-8 items-center gap-2"><ColorPickerPopover size="sm" className={PICKER} color={c.base} onChange={(hex) => isHex(hex) && set({ base: hex.slice(0, 7).toUpperCase() })} label="Base color" /><span className="kol-mono-10 text-meta">{c.base}</span></span></div>
          <div className="flex flex-col gap-2"><span className={LABEL}>Harmony</span><Dropdown size="sm" value={c.harmony} onChange={(v) => set({ harmony: v })} options={HARMONIES.map((x) => ({ value: x.id, label: x.label }))} /></div>
          <div className="flex flex-col gap-2"><span className={LABEL}>Info</span><span className="flex h-8 items-center"><ToggleSwitch size="sm" className={BARE_SWITCH} checked={Object.values(info).every(Boolean)} onChange={(v) => setInfo({ roles: v, brand: v, palette: v, ramps: v, mix: v })} /></span></div>
        </div>
        <PaletteHarmonyWheel size={220} hue={c.h} harmony={c.harmony} saturation={c.s} lightness={c.l} onHueChange={(hh) => set({ base: hslToHex(hh, c.s, c.l).toUpperCase() })} />
      </Section>

      <Section title="Roles" {...infoFor('roles')}>
        <Row>{c.roles.map((hex, i) => <Swatch key={i} info={info.roles} hex={hex} name={COLOR_ROLES[i]} onClick={() => assign(hex)} />)}</Row>
      </Section>

      <Section title="Brand slots" {...infoFor('brand')}>
        <Row>{c.slots.map((hex, i) => <Swatch key={i} info={info.brand} hex={hex} name={COLOR_SLOTS[i]} selected={slot === i} onClick={() => toggleSlot(i)} />)}</Row>
      </Section>

      <Section title="Palette" {...infoFor('palette')} extra={<Switch label="Link blue" checked={c.blueLinked} onChange={(v) => set({ blueLinked: v })} />}>
        <Row>{c.hues.map((x) => <Swatch key={x.name + x.hex} info={info.palette} hex={x.hex} name={x.name} selected={picked(x.hex)} onClick={() => assign(x.hex)} />)}</Row>
        {[['Blue-grey', c.blueGrey, c.blueBase, 'blueBase', true], ['Grey', c.grey, c.greyBase, 'greyBase', false]].map(([row, ramp, rb, key, linkable]) => (
          <div key={row} className="mt-4 flex flex-col gap-2">
            <span className="flex h-4 items-center gap-3"><span className={`${LABEL} w-[120px]`}>{row} base</span>
              {!(linkable && c.blueLinked) && <><ColorPickerPopover size="sm" className={PICKER} color={rb} onChange={(hex) => isHex(hex) && set({ [key]: hex.slice(0, 7).toUpperCase() })} label={`${row} base`} /><span className="kol-mono-10 text-meta">{rb}</span></>}</span>
            <Row>{ramp.map((hex, i) => <Swatch key={row + i} info={info.palette} hex={hex} name={`${row} ${(i + 1) * 100}`} selected={picked(hex)} onClick={() => assign(hex)} />)}</Row>
          </div>
        ))}
      </Section>

      <Section title="Ramps" {...infoFor('ramps')}>
        <Row>
          {[0, 1, 2, 3, 4].flatMap((step) => c.ramps.map((hue) => {
            const hex = hue.steps[step]
            return <Swatch key={hue.hex + step} info={info.ramps} hex={hex} name={`${hue.name} ${(step + 1) * 100}`} selected={picked(hex)} onClick={() => assign(hex)} />
          }))}
        </Row>
      </Section>

      <Section title="Composition" {...infoFor('mix')}>
        <div style={{ maxWidth: ROW_MAX }}>
          <div className="flex h-40 overflow-hidden rounded">
            {COLOR_MIX.map(([share, label], i) => (
              <button key={label} type="button" onClick={() => toggleSlot(4 + i)} title={`${label} ${c.mix[i]}`} className={`flex min-w-0 cursor-pointer flex-col justify-between p-3 text-left transition-colors ${slot === 4 + i ? 'ring-2 ring-inset ring-[var(--kol-accent-primary)]' : ''}`} style={{ flex: share, background: c.mix[i], color: fgOn(c.mix[i]) }}>
                <span className="kol-sans-heading-03 leading-none">{share * 10}</span>
                <span className={`truncate kol-mono-10 leading-tight transition-opacity ${info.mix ? 'opacity-100' : 'opacity-0'}`}>{c.mix[i]}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {COLOR_MIX.map(([, label, note], i) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center gap-2.5">
                  <span className="size-4 rounded-[3px] border border-fg-16" style={{ background: c.mix[i] }} />
                  <span className="kol-sans-body-02 text-emphasis">{label}</span>
                </div>
                <p className="m-0 kol-sans-body-03 text-meta">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
