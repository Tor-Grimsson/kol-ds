import { TypefaceStyleSection } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* Right Grotesk ships with the theme as static faces at 100/300–700/900 plus
 * true italics, so hasWeight + hasItalic gives the Roman/Italic dropdown and a
 * real weight ramp in the style cards — hover a card to flip the sticky
 * inverted preview panel into that style. */
const TYPEFACE = {
  fontFamily: '"Right Grotesk", system-ui, sans-serif',
  badgeText: 'Right Grotesk',
  styles: {
    hasWeight: true,
    hasWidth: false,
    hasItalic: true,
    weights: [
      { label: 'Fine', weight: 100 },
      { label: 'Light', weight: 300 },
      { label: 'Regular', weight: 400, isDefault: true },
      { label: 'Medium', weight: 500 },
      { label: 'Dark', weight: 600 },
      { label: 'Bold', weight: 700 },
      { label: 'Black', weight: 900 },
    ],
  },
}

export default function TypefaceStyleSectionDemo() {
  return <TypefaceStyleSection typeface={TYPEFACE} />
}
