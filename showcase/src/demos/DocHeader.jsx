import { DocHeader } from '@kolkrabbi/kol-workshop'

export const stage = 'lg'

/* The page header every doc page opens with: eyebrow, title, lede. */
export default function DocHeaderDemo() {
  return <DocHeader eyebrow="Components / Atoms" title="Button" lede="The action atom, on one padding ladder." />
}
