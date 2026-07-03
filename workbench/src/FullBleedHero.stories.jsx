import { Button, FullBleedHero, OverlayGlassPanel } from '@kolkrabbi/kol-component'

const bg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="1150" cy="320" r="360" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="1150" cy="320" r="220" fill="none" stroke="#5a5a63" stroke-width="2"/><line x1="0" y1="620" x2="1600" y2="620" stroke="#3a3a41" stroke-width="2"/><line x1="400" y1="0" x2="400" y2="900" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

const Panel = () => (
  <OverlayGlassPanel maxWidth="max-w-[440px]">
    <p className="kol-helper-12 text-meta">KOLKRABBI</p>
    <h2 className="kol-sans-display-04 text-emphasis">Full-bleed media hero</h2>
    <p className="kol-sans-body-02 text-body">
      Cover media, an optional surface scrim, and one caller-authored glass panel.
    </p>
    <Button size="sm">View work</Button>
  </OverlayGlassPanel>
)

export const ImageWithGlassPanel = () => (
  <FullBleedHero media={{ src: bg, kind: 'image', alt: '' }} height="md" overlayOpacity={24} panel={<Panel />} />
)

// Video variant = the folded-in StudioHero recipe. The .m3u8 src is
// intentionally dead — hls.js errors quietly and the poster frame holds the
// layer, which is exactly the offline/failed-stream behavior worth seeing.
export const VideoScreen = () => (
  <FullBleedHero
    media={{ src: 'https://example.invalid/hls/master.m3u8', kind: 'video', poster: bg }}
    height="screen"
    panel={<Panel />}
  />
)

export const AlignStart = () => (
  <FullBleedHero media={{ src: bg, kind: 'image', alt: '' }} height="md" overlayOpacity={40} align="start">
    <OverlayGlassPanel align="start" maxWidth="max-w-[400px]">
      <p className="kol-helper-12 text-meta">CHILDREN SLOT</p>
      <p className="kol-sans-body-02 text-body">
        No panel prop — children render in the content layer, here left-aligned.
      </p>
    </OverlayGlassPanel>
  </FullBleedHero>
)
