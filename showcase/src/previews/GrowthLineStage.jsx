import { GrowthLineStage } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* One closed line grows into the shape and settles; move the pointer over it to push it aside, press to blast a crater
 * it regrows into. The variant is the shape: the built-in orb, or any SVG path `d` (a hexagon here) — or the intro:
 * the line grows inside the hexagon, breathes, then grows out of it to fill the box (kol-atlas's case). */
const HEX_D = 'M50 0L93.3 25V75L50 100L6.7 75V25Z'

export const variants = ['orb', 'path', 'intro']

export default function GrowthLineStagePreview({ variant = 'orb' }) {
  return (
    <div className="h-[28rem] w-full">
      {variant === 'intro'
        ? <GrowthLineStage shape={HEX_D} intro seed={7} className="text-fg-48" />
        : variant === 'path'
        ? <GrowthLineStage shape={HEX_D} params={{ minGap: 8, maxGap: 32, contrast: 1.4, growth: 8 }} seed={7} className="text-fg-48" />
        : <GrowthLineStage seed={7} className="text-fg-48" />}
    </div>
  )
}

/* Index card: the orb, still. */
export function Card() {
  return (
    <div className="h-40 w-full">
      <GrowthLineStage pointer={false} wave={false} seed={7} className="text-fg-48" />
    </div>
  )
}
