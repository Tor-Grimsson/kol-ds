import { LayoutColor, DEFAULT_COLOR_LAB } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* the colour sheet on the lab's default value */
export default function Preview() {
  return <LayoutColor view="sheet" color={DEFAULT_COLOR_LAB} />
}
