import { useState } from 'react'
import { ColorPickerPopover, ColorSwatch, Button } from '@kolkrabbi/kol-component'

/* monitor's module colour rows — a set colour, a translucent one, none; ⌥-click resets */
export const sizes = ['xs', 'sm']
/* `footer`: fxr's ColorField — palette swatches and the quick states under the hex row; a pick closes the panel */
export const variants = ['default', 'footer']

const PALETTE = ['#1E1E1E', '#E74C3C', '#F2C14E', '#3C8CE7', '#F5F5F0']

export default function ColorPickerPopoverPreview({ size = 'xs', variant = 'default' }) {
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
