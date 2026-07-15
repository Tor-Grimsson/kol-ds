import { TypeSpecimenLive } from '@kolkrabbi/kol-foundry'

export const stage = 'lg'

/* Nothing here is typed in by hand — each row renders its type class and reads
 * its own getComputedStyle, so the printed typeface / weight / size / leading /
 * tracking always match the theme's real tokens (and re-measure once the
 * webfonts land). */
const SPECS = [
  { className: 'kol-sans-heading-01', sample: 'Kolkrabbi foundry' },
  { className: 'kol-sans-heading-03', sample: 'Eight arms, one system' },
  { className: 'kol-sans-body-02', sample: 'The quick brown fox jumps over the lazy dog, then reads its own computed style.' },
  { className: 'kol-mono-12', sample: 'fontUrl: /fonts/TGRotVF.ttf · wght 100–900' },
]

export default function TypeSpecimenLiveDemo() {
  return (
    <TypeSpecimenLive
      title="Type ramp, measured live"
      description="Each sample below prints metrics read from its own rendered element — retune a token and the labels follow."
      specs={SPECS}
    />
  )
}
