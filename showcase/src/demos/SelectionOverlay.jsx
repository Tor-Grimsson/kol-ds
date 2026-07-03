import { SelectionOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Overlay coords live in the same space as the target it frames — here plain
 * px inside a relative stage (in the editor it shares the Canvas scale layer). */
const box = { x: 48, y: 44, w: 220, h: 150 }

export default function SelectionOverlayDemo() {
  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded border border-fg-16 bg-fg-04">
      <div
        style={{
          position: 'absolute',
          left: box.x, top: box.y, width: box.w, height: box.h,
          background: 'var(--kol-accent-primary)',
          opacity: 0.2,
          borderRadius: 4,
        }}
      />
      <SelectionOverlay box={box} />
    </div>
  )
}
