import { IconBrowser } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* a handful of kol-icons, and one raw-SVG gap (`svg: null`) — the two kinds of item it takes */
const ITEMS = [
  ...['arrow-right', 'arrow-left', 'grid', 'search', 'copy', 'brightness'].map((name) => ({ name, group: 'Interface' })),
  { name: 'Not drawn yet', group: 'Gaps', svg: null },
]

export default function Preview() {
  return <IconBrowser items={ITEMS} />
}
