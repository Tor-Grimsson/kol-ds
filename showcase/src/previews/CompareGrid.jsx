import { CompareGrid } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* old vs new on four glyphs — two changed, one the same, one new in B only */
export const stage = 'full'
const icon = (name) => ({ size }) => <Icon name={name} size={size} />
const ITEMS = [
  { id: 'a', label: 'chevron-down', a: icon('chevron-down'), b: icon('chevron-down'), state: 'same' },
  { id: 'b', label: 'arrow-right', a: icon('arrow-left'), b: icon('arrow-right'), state: 'changed' },
  { id: 'c', label: 'grid', a: icon('rows'), b: icon('grid'), state: 'changed' },
  { id: 'd', label: 'monitor', a: null, b: icon('monitor'), state: 'missing' },
]

export default function CompareGridPreview() {
  return <CompareGrid items={ITEMS} labels={{ a: 'old', b: 'new' }} defaultSize={48} />
}

/* Index card: one canonical instance. */
export function Card() {
  return <CompareGrid items={ITEMS.slice(1, 2)} labels={{ a: 'old', b: 'new' }} defaultSize={24} showActual={false} />
}
