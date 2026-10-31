import { LayoutLogo } from '@kolkrabbi/kol-styleguide'
import { VOYAGER_LOGO_SOURCES } from 'voyager-fixture'

export const stage = 'full'

/* Voyager's marks, each with the wordmark, on its cream and on its dark ground */
const MARKS = Object.entries(VOYAGER_LOGO_SOURCES).slice(0, 3).flatMap(([id, svg]) => [
  { id: `${id}-cream`, svg, label: id, ground: '#F4E4DA' },
  { id: `${id}-dark`, svg, label: `${id} on dark`, ground: '#131316' },
])

export default function Preview() {
  return <LayoutLogo view="lockups" marks={MARKS} wordmark="Voyager" />
}
