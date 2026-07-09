/**
 * Typeface Configuration — bundled default fixture for the foundry specimen
 * layer. Ported verbatim from the monorepo `apps/web` foundry data so the DS
 * package carries a ready-to-render default set (Málrómur, Rót, Dylgjur,
 * Gullhamrar, Tröllatunga). Consumers can ignore this and inject their own
 * typeface objects via props — nothing here is load-bearing beyond a default.
 *
 * Font URLs are relative (`/fonts/…`); a consumer serves the actual files.
 */

const cdnBase = 'https://f005.backblazeb2.com/file/kolkrabbi/website/asset-library/foundry'

export const typefaceConfig = {
  malromur: {
    id: 'malromur',
    name: 'Málrómur',
    displayName: 'Málrómur',
    fontFamily: 'TGMalromur',
    fontUrl: '/fonts/TGMalromurItalicVF.ttf',
    fontUrlRoman: '/fonts/TGMalromurRomanVF.ttf',
    fontUrlItalic: '/fonts/TGMalromurItalicVF.ttf',
    fontStyle: 'italic',
    category: 'Variable Font',
    description: 'A contemporary italic variable font for editorial design',
    badgeText: 'Málrómur',
    specimenLink: '/foundry/specimen/malromur',

    photos: [
      `${cdnBase}/foundry-typefaces/01-malromur/typefaces-malromur/01-typefaces-hero/typefaces-hero-1200.jpg`,
      `${cdnBase}/foundry-typefaces/01-malromur/typefaces-malromur/02-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/01-malromur/typefaces-malromur/03-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/01-malromur/typefaces-malromur/04-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/01-malromur/typefaces-malromur/05-typefaces-image/typefaces-image-1200.jpg`
    ],

    // Style section config
    styles: {
      hasWeight: true,
      hasWidth: false,
      hasItalic: true,
      defaultStyle: 'italic',
      weights: [
        { label: 'Thin', weight: 100 },
        { label: 'Extralight', weight: 200 },
        { label: 'Light', weight: 300 },
        { label: 'Regular', weight: 400 },
        { label: 'Medium', weight: 500 },
        { label: 'Semibold', weight: 600 },
        { label: 'Bold', weight: 700 },
        { label: 'Extrabold', weight: 800 }
      ]
    }
  },

  rot: {
    id: 'rot',
    name: 'Rót',
    displayName: 'Rót',
    fontFamily: 'TGRoot',
    fontUrl: '/fonts/TGRotVF.ttf',
    fontStyle: 'normal',
    category: 'Variable Font',
    description: 'A precise geometric sans serif with variable weight and width axes',
    badgeText: 'Rót Aa',
    specimenLink: '/foundry/specimen/rot',

    photos: [
      `${cdnBase}/foundry-typefaces/02-raetur/typefaces-raetur/01-typefaces-hero/typefaces-hero-1200.jpg`,
      `${cdnBase}/foundry-typefaces/02-raetur/typefaces-raetur/02-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/02-raetur/typefaces-raetur/03-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/02-raetur/typefaces-raetur/04-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/02-raetur/typefaces-raetur/05-typefaces-image/typefaces-image-1200.jpg`
    ],

    styles: {
      hasWeight: true,
      hasWidth: true,
      hasItalic: false,
      defaultStyle: 'weight',
      weights: [
        { label: 'Thin', weight: 100 },
        { label: 'Extralight', weight: 200 },
        { label: 'Light', weight: 300 },
        { label: 'Regular', weight: 400 },
        { label: 'Medium', weight: 500 },
        { label: 'Semibold', weight: 600 },
        { label: 'Bold', weight: 700 },
        { label: 'Extrabold', weight: 800 },
        { label: 'Black', weight: 900 }
      ],
      widths: [
        { label: 'Narrow', width: 100 },
        { label: 'Semi-Narrow', width: 175 },
        { label: 'Normal', width: 250 },
        { label: 'Semi-Extended', width: 325 },
        { label: 'Extended', width: 400 }
      ]
    }
  },

  dylgjur: {
    id: 'dylgjur',
    name: 'Dylgjur',
    displayName: 'Dylgjur',
    fontFamily: 'TGDylgjur',
    fontUrl: '/fonts/TGDylgjur-Regular.otf',
    fontStyle: 'normal',
    category: 'Display Font',
    description: 'Sharp angles and pointed character for critical discourse',
    badgeText: 'Dylgjur Aa',
    specimenLink: '/foundry/specimen/dylgjur',

    photos: [
      `${cdnBase}/foundry-typefaces/03-dylgjur/typefaces-dylgjur/01-typefaces-hero/typefaces-hero-1200.jpg`,
      `${cdnBase}/foundry-typefaces/03-dylgjur/typefaces-dylgjur/02-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/03-dylgjur/typefaces-dylgjur/03-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/03-dylgjur/typefaces-dylgjur/04-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/03-dylgjur/typefaces-dylgjur/05-typefaces-image/typefaces-image-1200.jpg`
    ],

    styles: {
      hasWeight: false,
      hasWidth: false,
      hasItalic: false,
      weights: [
        { label: 'Regular', weight: 400 }
      ]
    }
  },

  gullhamrar: {
    id: 'gullhamrar',
    name: 'Gullhamrar',
    displayName: 'Gullhamrar',
    fontFamily: 'TGGullhamrar',
    fontUrl: '/fonts/TGGullhamrarVF.ttf',
    fontStyle: 'normal',
    category: 'Variable Font',
    description: 'Variable weight typeface with warm, graceful forms',
    badgeText: 'Gullhamrar Aa',
    specimenLink: '/foundry/specimen/gullhamrar',

    photos: [
      `${cdnBase}/foundry-typefaces/04-gullhamrar/typefaces-gullhamrar/01-typefaces-hero/typefaces-hero-1200.jpg`,
      `${cdnBase}/foundry-typefaces/04-gullhamrar/typefaces-gullhamrar/02-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/04-gullhamrar/typefaces-gullhamrar/03-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/04-gullhamrar/typefaces-gullhamrar/04-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/04-gullhamrar/typefaces-gullhamrar/05-typefaces-image/typefaces-image-1200.jpg`
    ],

    styles: {
      hasWeight: true,
      hasWidth: false,
      hasItalic: false,
      weights: [
        { label: 'Thin', weight: 100 },
        { label: 'Extralight', weight: 200 },
        { label: 'Light', weight: 300 },
        { label: 'Regular', weight: 400 },
        { label: 'Medium', weight: 500 },
        { label: 'Semibold', weight: 600 },
        { label: 'Bold', weight: 700 },
        { label: 'Extrabold', weight: 800 }
      ]
    }
  },

  trollatunga: {
    id: 'trollatunga',
    name: 'Tröllatunga',
    displayName: 'Tröllatunga',
    fontFamily: 'TGTrollatunga',
    fontUrl: '/fonts/TGTrollatunga-Regular.otf',
    fontStyle: 'normal',
    category: 'Display Font',
    description: 'Bold expressive display font for impactful messaging',
    badgeText: 'Tröllatunga Aa',
    specimenLink: '/foundry/specimen/trollatunga',

    photos: [
      `${cdnBase}/foundry-typefaces/05-trollatunga/typefaces-trollatunga/01-typefaces-hero/typefaces-hero-1200.jpg`,
      `${cdnBase}/foundry-typefaces/05-trollatunga/typefaces-trollatunga/02-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/05-trollatunga/typefaces-trollatunga/03-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/05-trollatunga/typefaces-trollatunga/04-typefaces-image/typefaces-image-1200.jpg`,
      `${cdnBase}/foundry-typefaces/05-trollatunga/typefaces-trollatunga/05-typefaces-image/typefaces-image-1200.jpg`
    ],

    styles: {
      hasWeight: false,
      hasWidth: false,
      hasItalic: false,
      weights: [
        { label: 'Regular', weight: 400 }
      ]
    }
  }
}

/**
 * Helper to get typeface config by ID
 * @param {string} id - Typeface ID (malromur, rot, dylgjur, etc.)
 * @returns {object} Typeface configuration object
 */
export function getTypefaceConfig(id) {
  const config = typefaceConfig[id]
  if (!config) {
    console.warn(`Typeface config not found for: ${id}`)
    return typefaceConfig.malromur // fallback
  }
  return config
}

/**
 * Get all typeface IDs
 * @returns {string[]} Array of typeface IDs
 */
export function getAllTypefaceIds() {
  return Object.keys(typefaceConfig)
}

/**
 * Get all typefaces
 * @returns {object[]} Array of typeface configuration objects
 */
export function getAllTypefaces() {
  return Object.values(typefaceConfig)
}
