import { FramedMediaBand } from '@kolkrabbi/kol-component'

export const stage = 'full'

const base = 'https://picsum.photos/seed/kol-band'

export default function FramedMediaBandDemo() {
  return (
    <div className="w-full">
      <FramedMediaBand
        src={`${base}/1400/700`}
        srcSet={`${base}/800/400 800w, ${base}/1400/700 1400w`}
        alt="Sample showcase photograph"
      />
      <FramedMediaBand
        src={`${base}-wide/1400/467`}
        srcSet={`${base}-wide/800/267 800w, ${base}-wide/1400/467 1400w`}
        sizes="(max-width: 1400px) 100vw, 1400px"
        alt="Wide sample photograph"
        aspectRatio="3/1"
        caption="Fig. 2 — 3/1 frame with caption"
        className="mt-12"
      />
    </div>
  )
}
