import { Canvas } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Children render in a fixed 1080-virtual pixel space, so these two boxes stay
 * proportional to the frame at any zoom or viewport size. */
export default function CanvasDemo() {
  return (
    <div className="h-[340px] w-full rounded border border-fg-16 bg-fg-04">
      <Canvas aspect="1:1" guideColor="var(--kol-surface-on-primary)">
        <div
          style={{
            position: 'absolute',
            left: 120, top: 150, width: 420, height: 420,
            background: 'var(--kol-accent-primary)',
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 520, top: 520, width: 440, height: 340,
            border: '3px solid var(--kol-surface-on-primary)',
            borderRadius: 8,
          }}
        />
      </Canvas>
    </div>
  )
}
