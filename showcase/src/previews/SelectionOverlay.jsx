import { SelectionOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* the readout stays upright under the box's bounds at any angle (SelectionOverlayLabelUpright, 2026-10-13) */
export const variants = ['0°', '45°', '−90°', '180°', '225°']
const ROT = { '0°': 0, '45°': 45, '−90°': -90, '180°': 180, '225°': 225 }

/* Overlay coords live in the same space as the target it frames — here plain
 * px inside a relative stage (in the editor it shares the Canvas scale layer). */
const base = { x: 120, y: 60, w: 220, h: 150 }

export default function SelectionOverlayPreview({ variant = '0°' }) {
  const box = { ...base, rotation: ROT[variant] ?? 0 }
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded border border-fg-16 bg-fg-04">
      <div
        style={{
          position: 'absolute',
          left: box.x, top: box.y, width: box.w, height: box.h,
          background: 'var(--kol-accent-primary)',
          opacity: 0.2,
          borderRadius: 4,
          transform: `rotate(${box.rotation}deg)`,
        }}
      />
      <SelectionOverlay box={box} />
    </div>
  )
}
