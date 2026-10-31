import { LayoutType, DEFAULT_TYPE_LAB } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* the styles board on the lab's default value, in KOL's own faces (the scale view pins its rail to the page edge, so
 * the preview shows the styles) */
const FACES = {
  display: { family: 'var(--kol-font-family-sans-narrow)', label: 'Right Grotesk Narrow' },
  heading: { family: 'var(--kol-font-family-sans-compact)', label: 'Right Grotesk Compact' },
  text: { family: 'var(--kol-font-family-sans)', label: 'Right Grotesk' },
  mono: { family: 'var(--kol-font-family-mono)', label: 'JetBrains Mono' },
}

export default function Preview() {
  return <LayoutType view="styles" type={DEFAULT_TYPE_LAB} faces={FACES} />
}
