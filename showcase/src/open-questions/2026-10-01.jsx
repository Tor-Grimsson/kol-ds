import { useState } from 'react'
import { DocHeader, DocSection, RailRow, ResultRow, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, Dropdown, MultiSelect, SegmentedToggle, TabChips, TabsRow } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Round 6 — the visual calls out of the 2026-10-01 review (plan-2026-10-01-showcase-review-round-2,
 * the phases marked TALK). Nothing here is built into the site: each question shows what is live
 * beside what could replace it, to be picked by eye. */
export const meta = {
  round: 6,
  date: '2026-10-01',
  title: 'Review round 2 — the visual calls',
  status: 'answered',
}

const cell = 'flex flex-col gap-3 rounded border border-fg-08 p-4'
const cap = 'kol-mono-12 text-subtle'
const TABS = [{ key: 'pnpm', label: 'pnpm' }, { key: 'npm', label: 'npm' }, { key: 'yarn', label: 'yarn' }, { key: 'bun', label: 'bun' }]

function Tabs() {
  const [v, setV] = useState('pnpm')
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={cell}><TabChips tabs={TABS.map((t) => ({ id: t.key, label: t.label }))} value={v} onChange={setV} /><span className={cap}>A — ANSWERED 2026-10-01: these chips, shipped as kol-component `TabChips`</span></div>
      <div className={cell}><TabsRow tabs={TABS.map((t) => ({ id: t.key, label: t.label }))} value={v} onChange={setV} /><span className={cap}>B — TabsRow (kol-component)</span></div>
      <div className={cell}><SegmentedToggle size="sm" options={TABS.map((t) => ({ value: t.key, label: t.label }))} value={v} onChange={setV} /><span className={cap}>C — SegmentedToggle (kol-component)</span></div>
    </div>
  )
}

function Ground({ className, label }) {
  return (
    <div className={cell}>
      <div className={`flex h-28 items-center justify-center gap-3 rounded ${className}`}>
        <Button>Button</Button>
        <Button iconLeft="plus">With icon</Button>
      </div>
      <span className={cap}>{label}</span>
    </div>
  )
}

function Knobs() {
  const [variant, setVariant] = useState('primary')
  const [tone, setTone] = useState('default')
  const [size, setSize] = useState('md')
  /* the user's own proposal (2026-10-01): the knob's name as the first row, a divider, then the list */
  const named = (name, list) => [{ heading: name }, { divider: true }, ...list.map((v) => ({ value: v, label: v }))]
  const V = ['primary', 'secondary', 'accent', 'outline', 'ghost']
  const T = ['default', 'primary', 'secondary', 'inverted', 'sunken']
  const S = ['xs', 'sm', 'md', 'lg']
  const GROUPS = [['Variant', V, variant, setVariant], ['Tone', T, tone, setTone], ['Size', S, size, setSize]]
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={cell}>
        <div className="flex items-center gap-2">
          <Dropdown size="sm" options={V.map((v) => ({ value: v, label: v }))} value={variant} onChange={setVariant} />
          <Dropdown size="sm" options={T.map((v) => ({ value: v, label: v }))} value={tone} onChange={setTone} />
          <SegmentedToggle size="sm" options={S.map((v) => ({ value: v, label: v }))} value={size} onChange={setSize} />
        </div>
        <span className={cap}>A — today: two unnamed dropdowns and a bordered toggle</span>
      </div>
      <div className={cell}>
        <div className="flex items-center gap-2">
          <Dropdown size="sm" options={named('Variant', V)} value={variant} onChange={setVariant} />
          <Dropdown size="sm" options={named('Tone', T)} value={tone} onChange={setTone} />
          <Dropdown size="sm" options={named('Size', S)} value={size} onChange={setSize} />
        </div>
        <span className={cap}>B — ANSWERED 2026-10-01: three dropdowns, each with its name as the first row, a divider, then the list</span>
      </div>
      <div className={cell}>
        <div className="flex items-center gap-2">
          <MultiSelect
            groups={GROUPS.map(([name, list]) => ({ id: name, label: name, options: list.map((v) => ({ value: v, label: v })) }))}
            value={{ Variant: variant, Tone: tone, Size: size }}
            onChange={(id, v) => GROUPS.find(([name]) => name === id)[3](v)}
          />
        </div>
        <span className={cap}>C — kol-component `MultiSelect`: one dropdown, a popover with a column per setting</span>
      </div>
    </div>
  )
}

export default function OpenQuestionsRound6() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 6 · 2026-10-01"
        title="Review round 2 — the visual calls"
        lede="Six calls from the review. Each shows what is live beside what could replace it."
      />

      <DocSection id="result-row" title="1 · Result row" lede="Hover each. You asked for the title at full ink on hover, the background variant, or both — and a path and an icon on the row.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={cell}>
            <ResultRow to="/components/tag" title="Tag" meta="component · Atoms · library" description="An interactive chip to filter or select." />
            <span className={cap}>A — today: underline</span>
          </div>
          <div className={cell}>
            <ResultRow variant="wash" to="/components/tag" title="Tag" meta="component · Atoms · library" description="An interactive chip to filter or select." />
            <span className={cap}>B — wash (the other variant)</span>
          </div>
          <div className={cell}>
            <ResultRow variant="wash" to="/components/tag" title={<span className="inline-flex items-center gap-2"><Icon name="layers" size={14} />Tag</span>} meta="/components/tag" description="An interactive chip to filter or select." />
            <span className={cap}>C — ANSWERED 2026-10-01: wash, an icon for the kind, the path as the second line</span>
          </div>
        </div>
      </DocSection>

      <DocSection id="tabs" title="2 · The tab chips" lede="Preview / Code and pnpm / npm / yarn / bun are not a design-system component. Which shipped one replaces them?">
        <Tabs />
      </DocSection>

      <DocSection id="ground" title="3 · Preview ground" lede="A default Button on the stage. Today's grey swallows it.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Ground className="bg-fg-02" label="A — today: fg-02 over the page" />
          <Ground className="bg-surface-primary" label="B — the page ground itself" />
          <Ground className="bg-surface-sunken" label="C — ANSWERED 2026-10-01: the sunken surface" />
        </div>
      </DocSection>

      <DocSection id="knobs" title="4 · Knob bar" lede="Variant and tone do not say what they are, and the size toggle clashes with them.">
        <Knobs />
      </DocSection>

      <DocSection id="rail-icons" title="5 · Rail icons" lede="Only Quick actions and Tags carry icons today.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={cell}>
            <nav className="shell-nav-items">
              {['Names', 'Opacity', 'Sizes', 'Color'].map((l) => <RailRow key={l} onClick={() => {}}>{l}</RailRow>)}
            </nav>
            <span className={cap}>A — today: text only</span>
          </div>
          <div className={cell}>
            <nav className="shell-nav-items">
              {[['Names', 'book-open'], ['Opacity', 'layers'], ['Sizes', 'grid'], ['Color', 'paint-drop']].map(([l, i]) => <RailRow key={l} icon={<Icon name={i} size={14} />} onClick={() => {}}>{l}</RailRow>)}
            </nav>
            <span className={cap}>B — ANSWERED 2026-10-01: a glyph per row</span>
          </div>
        </div>
      </DocSection>

      <DocSection id="resize" title="6 · Resize handle — the line variant" lede="Built as a variant beside the pill (useDragResize variant='line'); no rail uses it yet. Hover the right edge of each box.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={cell}>
            <div className="relative h-32 border-r border-fg-08 bg-fg-02"><div className="kol-rail-grab is-near" /></div>
            <span className={cap}>A — the pill (every rail today): a click toggles</span>
          </div>
          <div className={cell}>
            <div className="relative h-32 border-r border-fg-08 bg-fg-02"><div className="kol-rail-grab kol-rail-grab--line" /></div>
            <span className={cap}>B — the line: the edge lights up, a double-click toggles. Kept as a variant beside the pill (2026-10-01)</span>
          </div>
        </div>
      </DocSection>
    </div>
  )
}
