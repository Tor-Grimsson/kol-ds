import { LockupLab } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* VOYAGER's naming levels (invented), picked into the product */
const PRESETS = {
  Products: ['Field', 'Basecamp', 'Outfitters'],
  Programs: ['Guides', 'Partners'],
}

export default function Preview() {
  return <LockupLab value={{ parent: 'Voyager', product: 'Field', sub: 'Manual' }} presets={PRESETS} />
}
