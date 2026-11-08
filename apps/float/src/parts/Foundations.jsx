import { useEffect, useRef, useState } from 'react'
import { Button, IconLoader, Tooltip, floatSurfaceClass } from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — family 1, Foundations: one Part per row of 24-float-system.md § Foundations. Every value is the
 * token itself (a CSS var), and the number beside it is read back from the page, so nothing here restates a value. */
const Plate = ({ surface, className = '', children }) => (
  <div className={`${floatSurfaceClass(surface, true)} flex max-w-full flex-wrap items-end gap-6 rounded-[var(--kol-float-menu-r)] p-4 ${className}`}>{children}</div>
)

/* a token's resolved value, read off the element it sits in (so `.dark` on a glass plate reads its own) */
function Val({ token }) {
  const ref = useRef(null)
  const [v, setV] = useState('')
  useEffect(() => { setV(getComputedStyle(ref.current).getPropertyValue(token).trim()) }, [token])
  return <span ref={ref} className="kol-float-ruler text-fg-64">{token}{v ? ` · ${v}` : ''}</span>
}
const Spec = ({ children, label }) => <div className="flex flex-col items-start gap-2">{children}<span className="kol-float-ruler text-fg-64">{label}</span></div>

const ROLES = ['display', 'editorial', 'window', 'sheet', 'section', 'body-lg', 'body', 'panel', 'hint', 'label', 'timecode', 'ruler']
const SIZES = ['sm', 'md', 'lg']
const RADII = [['list', 'a bare list'], ['menu', 'a sheet or panel'], ['window', 'a window']]
const TONES = [['inverted', 'Primary'], ['secondary', 'Secondary'], ['ghost', 'Quiet'], ['danger', 'Destructive']]

export default function Foundations() {
  return (
    <FamilyPage title="Foundations" body="The float's tokens and roles — type, heights, radii, the solid ground and the two glass skins.">
      {(surface) => (
        <>
          <Part name="Sans">
            <Plate surface={surface} className="flex-col items-start">
              <span className="font-[family-name:var(--kol-font-family-float)] text-2xl font-medium text-fg-emphasis">Inter — the float sans</span>
              <span className="font-mono text-base text-fg-emphasis">JetBrains Mono — 00:01:24:12</span>
              <Val token="--kol-font-family-float" />
            </Plate>
          </Part>

          <Part name="Type roles">
            <Plate surface={surface} className="flex-col items-start gap-3">
              {ROLES.map((r) => (
                <div key={r} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className={`kol-float-${r} text-fg-emphasis`}>Still in motion</span>
                  <span className="kol-float-ruler text-fg-64">kol-float-{r}</span>
                </div>
              ))}
            </Plate>
          </Part>

          <Part name="Control type">
            <Plate surface={surface}>
              {SIZES.map((s) => (
                <Spec key={s} label={<Val token={`--kol-float-t-${s}`} />}>
                  <span className="font-[family-name:var(--kol-font-family-float)] font-medium text-fg-emphasis" style={{ fontSize: `var(--kol-float-t-${s})` }}>Export video</span>
                </Spec>
              ))}
            </Plate>
          </Part>

          <Part name="Control height">
            <Plate surface={surface}>
              {SIZES.map((s) => (
                <Spec key={s} label={<Val token={`--kol-float-h-${s}`} />}>
                  <span className="block w-24 rounded-full bg-[var(--kol-float-well)]" style={{ height: `var(--kol-float-h-${s})` }} />
                </Spec>
              ))}
            </Plate>
          </Part>

          <Part name="Glyph">
            <Plate surface={surface}>
              <Spec label={<Val token="--kol-float-ic" />}>
                <span className="inline-flex gap-3 text-oq-88">{['search', 'download', 'plus'].map((n) => <IconLoader key={n} name={n} size="var(--kol-float-ic)" />)}</span>
              </Spec>
            </Plate>
          </Part>

          <Part name="Radii">
            <Plate surface={surface}>
              {RADII.map(([r, what]) => (
                <Spec key={r} label={<><Val token={`--kol-float-${r}-r`} /> — {what}</>}>
                  <span className="block size-20 bg-[var(--kol-float-well)]" style={{ borderRadius: `var(--kol-float-${r}-r)` }} />
                </Spec>
              ))}
            </Plate>
          </Part>

          <Part name="Menu row">
            <Plate surface={surface}>
              <Spec label={<><Val token="--kol-float-row" /> · <Val token="--kol-float-inset" /></>}>
                <span className="flex w-56 items-center rounded-[var(--kol-float-list-r)] bg-fg-16 kol-float-panel text-fg-emphasis" style={{ height: 'var(--kol-float-row)', paddingInline: 'calc(var(--kol-float-inset) * 2)' }}>Duplicate</span>
              </Spec>
            </Plate>
          </Part>

          <Part name="Focus">
            <Plate surface={surface}>
              <Spec label={<Val token="--kol-float-focus" />}>
                <span className="block h-[var(--kol-float-h-md)] w-32 rounded-full bg-[var(--kol-float-well)] [box-shadow:var(--kol-float-focus)]" />
              </Spec>
            </Plate>
          </Part>

          <Part name="Selection">
            <Plate surface={surface}>
              <Spec label="--kol-fg-16 — translucent, so glass shows through">
                <span className="block h-[var(--kol-float-h-md)] w-32 rounded-[var(--kol-float-list-r)] bg-fg-16" />
              </Spec>
            </Plate>
          </Part>

          <Part name="States">
            <Plate surface={surface}>
              <Spec label="rest"><Button variant="float" tone="secondary">Duplicate</Button></Spec>
              <Spec label="pressed"><Button variant="float" tone="secondary" pressed>Duplicate</Button></Spec>
              <Spec label="disabled · 40%"><Button variant="float" tone="secondary" disabled>Duplicate</Button></Spec>
            </Plate>
          </Part>

          <Part name="Edges">
            <Plate surface={surface}>
              <Spec label="none — no hairline rims on float">
                <span className="block h-16 w-32 rounded-[var(--kol-float-menu-r)] bg-[var(--kol-float-well)]" />
              </Spec>
            </Plate>
          </Part>

          <Part name="Roles">
            <Plate surface={surface}>
              {TONES.map(([tone, role]) => (
                <Spec key={tone} label={`${role} · tone="${tone}"`}><Button variant="float" tone={tone}>{role}</Button></Spec>
              ))}
            </Plate>
          </Part>

          <Part name="Solid ground">
            <div className="kol-float-solid kol-float-m flex h-28 w-64 items-end rounded-[var(--kol-float-menu-r)] p-4">
              <span className="kol-float-ruler text-fg-64">.kol-float-solid · --kol-shadow-float</span>
            </div>
          </Part>

          <Part name="Glass">
            {['glass-dark', 'glass-light'].map((g) => (
              <div key={g} className={`${floatSurfaceClass(g, true)} flex h-28 w-64 items-end rounded-[var(--kol-float-menu-r)] p-4`}>
                <span className="kol-float-ruler text-fg-64">.kol-float-{g}</span>
              </div>
            ))}
          </Part>

          <Part name="Tooltip">
            <Plate surface={surface}>
              <Spec label={<><Val token="--kol-float-tip-h" /> · <Val token="--kol-float-tip-t" /> — hover the button</>}>
                <Tooltip variant="float" label="Export video" shortcut="⌘E"><Button variant="float" tone="secondary" iconOnly="download" aria-label="Export" /></Tooltip>
              </Spec>
            </Plate>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
