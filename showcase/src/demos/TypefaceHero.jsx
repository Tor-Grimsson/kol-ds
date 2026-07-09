import { TypefaceHero } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* Rendered live in the specimen's own family (Right Grotesk ships with the
 * theme); the giant name is the type preview, not a fixed KOL type class. */
const typeface = {
  displayName: 'Right Grotesk',
  fontFamily: '"Right Grotesk", system-ui, sans-serif',
  category: 'Grotesque',
  description: 'A tight, contemporary grotesque with a wide weight range.',
}

export default function TypefaceHeroDemo() {
  return (
    <TypefaceHero
      typeface={typeface}
      downloadHref="#"
      specimenLabel="View Specimen"
      onSpecimenClick={() => {}}
      licenseNote="Trial license — evaluation only."
    />
  )
}
