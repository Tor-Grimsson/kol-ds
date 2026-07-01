import { Image } from '@kolkrabbi/kol-component'

// Self-contained sample so the real <img> path renders without a network asset.
const sampleSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'><rect width='100%' height='100%' fill='%23dcdce0'/><text x='50%' y='50%' fill='%23555' font-family='monospace' font-size='16' text-anchor='middle' dominant-baseline='middle'>sample 400x225</text></svg>"

export const WithSrc = () => (
  <div style={{ maxWidth: 400 }}>
    <Image src={sampleSrc} alt="Sample asset" aspectRatio="16 / 9" />
  </div>
)

// No src → AssetPlaceholder fallback with category/name labels.
export const MissingSrc = () => (
  <div style={{ maxWidth: 360 }}>
    <Image category="mocks" name="business-card-bg" />
  </div>
)

// Broken src → onError swaps to the placeholder.
export const LoadError = () => (
  <div style={{ maxWidth: 360 }}>
    <Image src="/does-not-exist.png" category="photos" name="cover" aspectRatio="4 / 3" />
  </div>
)
