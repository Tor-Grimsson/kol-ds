import { useState } from 'react'
import { LogoTuner } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* A logo rebuilt from circles and lines on one ladder: with no file it tunes the built-in crescent; drop or pick an SVG
 * or a black and white image to tune that. The host reads the file into an Image (an SVG carries its text too). */
const SETTINGS = { preset: 'golden', effect: 100, read: 'auto', view: 'tuned', keylines: true, grid: 'off', comb: false, sample: 'crescent', construction: true, math: true, outline: true, fill: 'grey', size: 1 }

const read = (file, done) => {
  if (!file || !/^image\//.test(file.type)) return
  const r = new FileReader()
  r.onload = () => {
    const img = new Image()
    img.onload = () => {
      if (!/svg/.test(file.type)) return done(img)
      const t = new FileReader(); t.onload = () => { img.__svg = t.result; done(img) }; t.readAsText(file)
    }
    img.src = r.result
  }
  r.readAsDataURL(file)
}

export default function LogoTunerPreview() {
  const [image, setImage] = useState(null)
  return (
    <div className="aspect-[3/2] w-full">
      <LogoTuner settings={SETTINGS} image={image} onFile={(f) => read(f, setImage)} />
    </div>
  )
}

/* Index card: the tuned crescent alone. */
export function Card() {
  return (
    <div className="h-40 w-full">
      <LogoTuner settings={SETTINGS} peek />
    </div>
  )
}
