import { FramedMediaBand } from '@kolkrabbi/kol-component'

// Self-contained sample so the real <img> path renders without a network asset.
const sampleSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'><rect width='100%' height='100%' fill='%23dcdce0'/><text x='50%' y='50%' fill='%23555' font-family='monospace' font-size='40' text-anchor='middle' dominant-baseline='middle'>sample 1400x700</text></svg>"

export const Default = () => <FramedMediaBand src={sampleSrc} alt="Sample band" />

// Per-instance deltas from the source page: top margin + caption.
export const WithCaption = () => (
  <FramedMediaBand
    src={sampleSrc}
    alt="Sample band with caption"
    caption="Fig. 1 — framed media band"
    className="mt-12"
  />
)

// Non-default frame aspect.
export const Aspect3x1 = () => <FramedMediaBand src={sampleSrc} alt="Wide band" aspectRatio="3/1" />

// `media` node replaces the Image inside the frame (video, canvas, ...).
export const MediaOverride = () => (
  <FramedMediaBand
    media={
      <div className="w-full h-full flex items-center justify-center rounded-[4px] bg-fg-08">
        <span className="kol-mono-12 text-fg-48">custom media node</span>
      </div>
    }
  />
)

// No src → DS Image falls back to AssetPlaceholder inside the frame.
export const MissingSrc = () => <FramedMediaBand alt="Missing asset" />
