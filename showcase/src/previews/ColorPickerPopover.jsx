import { useState } from 'react'
import { ColorPickerPopover, ColorSwatch, Button } from '@kolkrabbi/kol-component'

/* monitor's module colour rows — a set colour, a translucent one, none; ⌥-click resets */
export const sizes = ['xs', 'sm']
/* `footer`: fxr's ColorField — palette swatches and the quick states under the hex row; a pick closes the panel */
export const variants = ['default', 'footer', 'kolbox', 'folio']

const PALETTE = ['#1E1E1E', '#E74C3C', '#F2C14E', '#3C8CE7', '#F5F5F0']

export default function ColorPickerPopoverPreview({ size = 'xs', variant = 'default' }) {
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  /* folio (Folio batch C): Folio's SwatchMenu, a set to pick from */
  if (variant === 'folio') return <FolioPicker />
  if (variant === 'kolbox') return (
    <KolboxPicker />
  )
  const [a, setA] = useState('#E74C3C')
  const [b, setB] = useState('#3C8CE780')
  const [c, setC] = useState('transparent')
  return (
    <div className="flex items-center gap-4 kol-mono-12 text-fg-64">
      {[[a, setA, '#E74C3C'], [b, setB, '#3C8CE780'], [c, setC, 'transparent']].map(([v, set, d], i) => (
        <span key={i} className="flex items-center gap-2">
          <ColorPickerPopover color={v} onChange={set} defaultValue={d} size={size}
            footer={variant === 'footer' ? ({ close }) => (
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {PALETTE.map((p) => (
                    <button key={p} type="button" aria-label={p} className="border-0 bg-transparent p-0" onClick={() => { set(p); close() }}>
                      <ColorSwatch hex={p} size={16} hoverable={false} />
                    </button>
                  ))}
                </div>
                <Button size="sm" tone="ghost" onClick={() => { set('transparent'); close() }}>None</Button>
              </div>
            ) : undefined} />
          {v}
        </span>
      ))}
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('#E74C3C')
  return <ColorPickerPopover color={v} onChange={setV} size="sm" />
}

/* kolbox: the popover opens beside its anchor, as kolbox's fill row opens it */
function KolboxPicker() {
  const [el, setEl] = useState(null)
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-[520px] w-full items-start justify-center pt-4">
      <span ref={setEl} className="inline-flex"><Button variant="kolbox" onClick={() => setOpen((o) => !o)}>Color</Button></span>
      <ColorPickerPopover variant="kolbox" anchor={el} open={open} onClose={() => setOpen(false)} placement="bottom-start" color="#D65D0E" />
    </div>
  )
}

const FOLIO_SWATCHES = [['ink', '#121215'], ['slate', '#2B2F36'], ['moss', '#3A4A3F'], ['paper', '#F4F1EA']]
function FolioPicker() {
  const [v, setV] = useState('#121215')
  return <ColorPickerPopover variant="folio" label="Background" color={v} swatches={FOLIO_SWATCHES} onChange={setV} />
}
