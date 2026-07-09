import TypefaceLibraryGridWithVariables from './TypefaceLibraryGridWithVariables.jsx'

/**
 * FoundryOtherTypefaces — the "Other Typefaces" section that closes a specimen
 * page: renders the full library grid (with variable preview) over the bundled
 * default typeface set. Pass `typefaces` / `typefaceWeights` to override, and
 * `linkComponent` to wire item navigation (forwarded to the grid).
 *
 * @param {Object} props
 * @param {Array} props.typefaces - Typeface objects. Defaults to the bundled set.
 * @param {Object} props.typefaceWeights - Map of typeface name → weight variant array.
 * @param {React.ElementType} props.linkComponent - Optional link wrapper (receives `to`); defaults to `<a href>`.
 */
const DEFAULT_TYPEFACE_WEIGHTS = {
  'TG Málrómur': [
    { weight: 'Light', value: 200, axis: 'wght' },
    { weight: 'Regular', value: 300, axis: 'wght' },
    { weight: 'Medium', value: 400, axis: 'wght' },
    { weight: 'SemiBold', value: 500, axis: 'wght' },
    { weight: 'Bold', value: 700, axis: 'wght' },
    { weight: 'Black', value: 900, axis: 'wght' }
  ],
  'TG Rót': [
    { weight: 'Light', value: 200, axis: 'wght' },
    { weight: 'Regular', value: 400, axis: 'wght' },
    { weight: 'Medium', value: 500, axis: 'wght' },
    { weight: 'Bold', value: 700, axis: 'wght' },
    { weight: 'Black', value: 900, axis: 'wght' },
    { weight: 'Narrow', value: 75, axis: 'wdth' },
    { weight: 'Normal', value: 100, axis: 'wdth' },
    { weight: 'Extended', value: 125, axis: 'wdth' }
  ],
  'TG Gullhamrar': [
    { weight: 'Light', value: 200, axis: 'wght' },
    { weight: 'Regular', value: 400, axis: 'wght' },
    { weight: 'Medium', value: 500, axis: 'wght' },
    { weight: 'Bold', value: 700, axis: 'wght' },
    { weight: 'Black', value: 900, axis: 'wght' }
  ],
  'TG Orðspor': [
    { weight: 'Light', value: 200, axis: 'wght' },
    { weight: 'Regular', value: 400, axis: 'wght' },
    { weight: 'Medium', value: 500, axis: 'wght' },
    { weight: 'Bold', value: 700, axis: 'wght' },
    { weight: 'Black', value: 900, axis: 'wght' }
  ],
  'TG Dylgjur': [
    { weight: 'Regular', value: 400, axis: 'wght' }
  ],
  'TG Tröllatunga': [
    { weight: 'Regular', value: 400, axis: 'wght' }
  ]
}

const DEFAULT_TYPEFACES = [
  {
    name: 'TG Málrómur',
    subtitle: 'Variable Italic Serif',
    description: 'A contemporary italic variable font for editorial design',
    classification: 'Serif',
    status: 'Available',
    year: '2025',
    styles: 'Variable (wght, slnt)',
    link: '/foundry/typefaces/malromur'
  },
  {
    name: 'TG Rót',
    subtitle: '3-Axis Variable Sans',
    description: 'Precise geometric sans serif with variable weight and width axes',
    classification: 'Sans Serif',
    status: 'Available',
    year: '2025',
    styles: 'Variable (wght, wdth)',
    link: '/foundry/typefaces/root'
  },
  {
    name: 'TG Tröllatunga',
    subtitle: 'Troll Tongue',
    description: 'Display typeface with expressive character',
    classification: 'Display',
    status: 'Available',
    year: '2025',
    styles: 'Regular',
    link: '/foundry/typefaces/trollatunga'
  },
  {
    name: 'TG Dylgjur',
    subtitle: 'Falsehood',
    description: 'Sharp angles and pointed character for critical discourse',
    classification: 'Sans Serif',
    status: 'Available',
    year: '2025',
    styles: 'Regular',
    link: '/foundry/typefaces/dylgjur'
  },
  {
    name: 'TG Gullhamrar',
    subtitle: 'Compliment',
    description: 'Variable weight typeface with warm, graceful forms',
    classification: 'Serif',
    status: 'Available',
    year: '2025',
    styles: 'Variable (wght)',
    link: '/foundry/typefaces/gullhamrar'
  }
]

const FoundryOtherTypefaces = ({
  typefaces = DEFAULT_TYPEFACES,
  typefaceWeights = DEFAULT_TYPEFACE_WEIGHTS,
  linkComponent
}) => {
  return (
    <TypefaceLibraryGridWithVariables
      typefaces={typefaces}
      typefaceWeights={typefaceWeights}
      totalCount={typefaces.length}
      linkComponent={linkComponent}
    />
  )
}

export default FoundryOtherTypefaces
