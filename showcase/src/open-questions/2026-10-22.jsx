import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, Dropdown, PageHeader, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'

/* Round 16 — the variants button on a reference app (user 2026-10-22, on /apps/catalog: "there is usually
 * empty space top right … load it like a unique button to indicate its not part of the layout, like f..e
 * fully rounded with slight shadow? like create new button is often in apps? … would be cool to see
 * something?"). Built from what ships: `Button iconOnly radius="full"` and a `--kol-shadow-*` token, inset
 * by the page's own padding so its right edge is the content's. Plan: plan-2026-10-22-catalog-variants-and-no-cover.md 2.0. */
export const meta = {
  round: 16,
  date: '2026-10-22',
  title: 'The variants button',
  status: 'open',
}

const cell = 'flex flex-col gap-3 rounded border border-fg-08 p-4'
const label = 'kol-doc-eyebrow'

/* the agent's pick — every axis below varies ONE of these and holds the rest */
const PICK = { icon: 'slider-01', size: 'lg', tone: 'inverted', shadow: 'lg' }

const AXES = [
  { key: 'icon', title: 'Icon', values: ['slider-01', 'variant-01', 'layers'], lede: 'What the button says before it is opened.' },
  { key: 'size', title: 'Size', values: ['md', 'lg'], lede: '32 or 40 — the two control heights a floating button can take.' },
  { key: 'tone', title: 'Fill', values: ['inverted', 'primary'], lede: 'Inverted is the text color as fill, the loudest; primary is the page ground, carried by the shadow alone.' },
  { key: 'shadow', title: 'Shadow', values: ['md', 'lg'], lede: 'The two shadow tokens. In dark they are a faint white haze, not a shadow — look at the dark pane before picking.' },
]

const cap = (v) => v[0].toUpperCase() + v.slice(1)
const axis = (name, values, value, onChange) => (
  <Dropdown size="sm" value={value} onChange={onChange}
    options={[{ heading: name }, { divider: true }, ...values.map((v) => ({ value: v, label: cap(v) }))]} />
)

/* the button and its panel — the dropdowns inside portal to <body> too, so a click on one is not an
 * outside press of the panel */
function VariantsButton({ icon, size, tone, shadow, theme }) {
  const [open, setOpen] = useState(false)
  const [card, setCard] = useState('catalog')
  const [row, setRow] = useState('catalog')
  const [list, setList] = useState('grid')
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end', offset: 8, dismiss: { outsidePress: (e) => !e.target.closest?.('.kol-popover-float') } })
  return (
    <>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button iconOnly={icon} size={size} tone={tone} radius="full" aria-label="Variants" style={{ boxShadow: `var(--kol-shadow-${shadow})` }} pressed={open} />
      </span>
      {/* each dropdown NAMED beside it — closed, three of them read "Catalog · Catalog · Grid" */}
      {/* the panel portals to <body>, out of the pane's theme — the chrome is drawn inside, in the pane's */}
      <PopoverPanel popover={popover} panel={false}>
        <div data-theme={theme} className="kol-popover grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 p-3">
        <span className="kol-mono-12 text-fg-64">Card</span>{axis('Card', ['catalog', 'file', 'slide', 'article', 'showcase'], card, setCard)}
        <span className="kol-mono-12 text-fg-64">Row</span>{axis('Row', ['catalog', 'file', 'slide'], row, setRow)}
        <span className="kol-mono-12 text-fg-64">List</span>{axis('List', ['grid', 'stack'], list, setList)}
        </div>
      </PopoverPanel>
    </>
  )
}

/* the catalog's top-left as it renders, the button in its empty top-right */
function Stage({ theme, spec }) {
  return (
    <div data-theme={theme} className="relative overflow-hidden rounded border border-fg-08 bg-surface-primary" style={{ padding: 'var(--kol-shell-page-pad)' }}>
      <PageHeader level="app" title="Catalog" subtitle="18 items" />
      <div className="absolute" style={{ top: 'var(--kol-shell-page-pad)', right: 'var(--kol-shell-page-pad)' }}>
        <VariantsButton {...spec} theme={theme} />
      </div>
    </div>
  )
}

export default function OpenQuestionsRound16() {
  usePageMeta({ tags: [], related: [] })
  const [spec, setSpec] = useState(PICK)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Open questions · Round 16" title="The variants button" lede="A round button floating in the empty top-right of a reference app, opening the page's variants. Not part of the layout, so it is drawn like nothing else on the page. Click any button to see its panel." />

      <DocSection id="pick" title="The pick" lede="Slider icon · 40 · inverted · large shadow. Change any axis here to try a combination; the sections below vary one axis each.">
        <div className="flex flex-wrap gap-2">
          {AXES.map((a) => <div key={a.key}>{axis(a.title, a.values, spec[a.key], (v) => setSpec((s) => ({ ...s, [a.key]: v })))}</div>)}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {['light', 'dark'].map((t) => <Stage key={t} theme={t} spec={spec} />)}
        </div>
      </DocSection>

      {AXES.map((a) => (
        <DocSection key={a.key} id={a.key} title={a.title} lede={a.lede}>
          {a.values.map((v) => (
            <div key={v} className={cell}>
              <span className={label}>{a.title} · {v}{PICK[a.key] === v ? ' · the pick' : ''}</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {['light', 'dark'].map((t) => <Stage key={t} theme={t} spec={{ ...PICK, [a.key]: v }} />)}
              </div>
            </div>
          ))}
        </DocSection>
      ))}
    </div>
  )
}
