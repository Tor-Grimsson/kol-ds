import { useMemo } from 'react'
import { AudioPreview, AudioTile, VideoTile } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* a one-second silent WAV, built in memory — the demo needs a real, seekable src */
function silentWav(seconds = 1, rate = 8000) {
  const n = seconds * rate
  const b = new ArrayBuffer(44 + n)
  const v = new DataView(b)
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true)
  str(36, 'data'); v.setUint32(40, n, true)
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128)
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }))
}

/* the Finder model: the column gets a square tile with one control (AudioTile ·
 * VideoTile — KindPreview's audio and video branches); the overlay gets the
 * player (AudioPreview — seek + volume behind slider-01) */
export default function AudioPreviewDemo() {
  const src = useMemo(() => silentWav(), [])
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-2 gap-6 w-[420px] max-w-full">
        <div className="bg-fg-04 rounded overflow-hidden"><AudioTile src={src} /></div>
        <div className="bg-fg-04 rounded overflow-hidden"><VideoTile src="" /></div>
      </div>
      <AudioPreview src={src} className="w-[480px] max-w-full" />
    </div>
  )
}
