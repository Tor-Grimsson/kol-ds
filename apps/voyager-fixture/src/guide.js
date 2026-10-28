/* VOYAGER's brand guide — the outline (`@kolkrabbi/kol-brand-template`'s GUIDE_SECTIONS) filled in: the same chapter
 * keys as GUIDE_TEMPLATE's `book`, each placeholder answered from this fixture's manifest and business data
 * (BrandGuideOutlineTwoVersions, 2026-10-27). Invented, like everything here. The copy is decided 2026-10-27 for review. */
import { VOYAGER_BRAND } from './brand.js'
import { BRAND_INFO, BIO, COLLABORATIONS, SOCIAL } from './business.js'

const hex = (id, stop) => VOYAGER_BRAND.ramps.find((r) => r.id === id).stops.find((s) => s.stop === stop).value
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ')
const value = (label, id, stop) => [label, hex(id, stop), rgb(hex(id, stop)), '—', '—']

export const VOYAGER_GUIDE = {
  ...VOYAGER_BRAND,
  social: {
    mark: 'wordmark',
    templates: [{ caption: 'Post · 1:1', ratio: '1 / 1' }, { caption: 'Post · 4:5', ratio: '4 / 5' }, { caption: 'Story · 9:16', ratio: '9 / 16' }],
  },

  book: {
    hero: { lede: `${BRAND_INFO.labels.manifesto} The ${BRAND_INFO.identity.name} brand, chapter by chapter.` },
    contents: { lede: 'Four parts: defining the brand, the design elements, the applications, and how the guide is run.' },

    intro: {
      lede: 'Who the guide is for, how it is organized, and which edition this is.',
      rules: [
        'For the guides, the office, Harbour Outfitters and North Light Films, and the press.',
        'Read in order once, then go to the chapter you need; every chapter stands alone.',
        'Edition 1.0 · October 2026.',
        `Logos, fonts and templates: the shared drive, Brand folder — ask ${BRAND_INFO.contact.email}.`,
      ],
    },

    about: {
      lede: BIO.companyBio,
      blocks: [BIO.founderBio],
      after: ['Every visual rule protects one thing: the landscape is the subject, never the brand.'],
    },

    messages: {
      lede: 'Three lines Voyager returns to everywhere.',
      spec: { caption: 'Messages put to work', columns: ['Message', 'In copy', 'In design', 'On touchpoints'], rows: [
        [BRAND_INFO.labels.manifesto, 'Distances and days, never adjectives', 'Wide frames, small type', 'Reusable kit, no printed brochures'],
        [BRAND_INFO.labels.handmade, 'The group size in every trip line', 'People small in the frame', 'Eight seats, one van'],
        [BRAND_INFO.labels.handBy, 'Guides named on every route', 'Portraits of the guides, not models', 'The guide signs the trip notes'],
      ] },
    },

    voice: {
      lede: 'Plain, specific, outdoors — say where, how long and how hard.',
      spec: { caption: 'Voice traits', columns: ['We are', 'But not', 'Sounds like'], rows: [
        ['Direct', 'Curt', 'Six days, 92 km, one river crossing.'],
        ['Calm', 'Cold', 'If the weather turns, we wait. That is the plan.'],
        ['Local', 'Folksy', 'Hekla has walked this route forty times.'],
      ] },
      words: { use: ['route', 'crossing', 'group'], avoid: ['adventure', 'epic', 'bucket list'] },
      after: [
        { h: 'Before and after' },
        { lead: 'Before:', text: 'An epic adventure across breathtaking glaciers!' },
        { lead: 'After:', text: 'Five days on Vatnajökull, eight travellers, one guide per four.' },
        { h: 'Naming' },
        `Always “${BRAND_INFO.identity.name}” — capital V, never VYG in copy, never possessive. Trips are named for the route: “Westfjords Crossing”.`,
      ],
    },

    mark: {
      lede: 'What the marks are and why — the concept before the rules.',
      blocks: ['The logomark draws a blade of ice against open water; the wordmark is Right Grotesk, set wide. The logomark carries alone on avatars and kit; the wordmark leads every page.'],
    },

    logo: {
      lede: 'Clear space, minimum size, color versions, placement and misuse — stated in units, not only drawn.',
      spec: { caption: 'Logo specification', columns: ['', 'Logomark', 'Wordmark', 'Horizontal lockup'], rows: [
        ['Clear space', VOYAGER_BRAND.clearspace.rule, '…', '…'],
        ['Minimum size — print', '10 mm', '25 mm wide', '35 mm wide'],
        ['Minimum size — screen', '24 px', '80 px wide', '120 px wide'],
        ['Color versions', 'burgundy on cream · cream on burgundy · black · white', '…', '…'],
        ['Default placement', 'top left, one clear space from the edge', '…', '…'],
      ] },
      donts: ['Stretch, squash or rotate the marks.', 'Recolor outside the color versions.', 'Set the wordmark in another face.', 'Place on a busy image without a clear field.', 'Add effects — shadows, outlines, gradients.', 'Rebuild the lockup with new spacing.'],
    },

    colour: {
      lede: 'Burgundy carries the identity; cream is the warm surface; greyscale carries the structure.',
      spec: { caption: 'Values', columns: ['Color', 'HEX', 'RGB', 'CMYK', 'Pantone'], rows: [
        value('Primary — burgundy-500', 'burgundy', 500),
        value('Neutral — cream-50', 'cream', 50),
        value('Ink — burgundy-900', 'burgundy', 900),
        value('Ground — grey-900', 'grey', 900),
      ] },
      pairs: [
        { text: 'burgundy-900', bg: 'cream-50', use: 'Body text' },
        { text: 'cream-50', bg: 'burgundy-500', use: 'Headlines on the identity color' },
        { text: 'cream-50', bg: 'grey-900', use: 'Type on the dark ground' },
        { text: 'burgundy-500', bg: 'cream-50', use: 'Kickers and links' },
      ],
      after: [{ h: 'Proportions' }, 'Cream 60 · greyscale 30 · burgundy 10.'],
    },

    type: {
      lede: VOYAGER_BRAND.book.typography.lede,
      spec: { caption: 'Scale', columns: ['Role', 'Face', 'Weight', 'Size / leading', 'Tracking'], rows: [
        ...VOYAGER_BRAND.type.scale.map((s) => [s.cls, s.family, String(s.weight), s.size, '0']),
        ['Minimum — screen / print', '', '', '12 px / 7 pt', ''],
      ] },
      rules: ['Source and license: Right Grotesk from Pangram Pangram, desktop and web; Playfair under the OFL.', 'Fallback: Arial for email and Office — system-ui on the web.'],
    },

    grid: {
      lede: 'One base unit, tied to the logo, that sets the margins, the grid and the spacing everywhere.',
      rules: ['The unit: the logomark’s height = one margin.', 'Print: 12 columns, margins of one unit, gutter of ½ unit.', 'Screen: 8 px steps, the margin at 24 px on a phone and 48 on a desk.'],
    },

    imagery: {
      lede: 'A brief someone else can shoot from.',
      rules: ['Subjects: the route, the weather, the group small in the frame.', 'Light: natural only, the low northern sun.', 'Casting: the guides and real travellers, with consent.', 'The library: the shared drive, Imagery — commissioned per season.'],
      dos: ['Wide frames', 'Weather as it was', 'Real travellers'],
      donts: ['Drone hero shots', 'Posed summits', 'Heavy grading'],
    },

    icons: {
      lede: 'Voyager uses icons only on the trip pages — difficulty, days, group size.',
      rules: ['Icon sizes: 16 · 24 px, drawn on a 24 px grid.', 'Stroke: 1.5 px, round caps.'],
    },

    applications: {
      lede: 'The brand’s own touchpoints, each measured and with the files to work from.',
      spec: { caption: 'Touchpoints', columns: ['Item', 'Size', 'Mark', 'File'], rows: [
        ['Business card', '85 × 55 mm', 'Horizontal lockup', 'shared drive'],
        ['Letterhead', 'A4', 'Wordmark', 'shared drive'],
        ['Kit labels', '60 × 30 mm', 'Logomark', 'shared drive'],
      ] },
    },

    templates: {
      lede: 'The files people start from — post sizes, the deck, the generators — and where to download them.',
      rules: [`Social: ${SOCIAL.map((s) => `${s.platform} ${s.handle}`).join(', ')}.`, 'Profile: the logomark, cream on burgundy.', 'Deck: the season deck, twelve master slides.'],
    },

    cobranding: {
      lede: 'How the brand appears beside stockists, collaborators and sponsors.',
      rules: [`Partners so far: ${COLLABORATIONS.map((c) => c.client).join(', ')}.`, 'The partner lockup: our mark · a rule · their mark, one clear space apart, ours first unless the event is theirs.'],
      donts: ['Alter the marks', 'Imply endorsement we have not given'],
    },

    governance: {
      lede: 'Who owns the brand, what needs approval, where the files are, and which edition this is.',
      spec: { caption: 'Running the guide', columns: ['', ''], rows: [
        ['Owner', `${BRAND_INFO.identity.founder}, ${BRAND_INFO.identity.role}`],
        ['Contact', BRAND_INFO.contact.email],
        ['Needs approval', 'new marks, partner use, campaigns'],
        ['Files, fonts, templates', 'the shared drive, Brand folder'],
        ['Edition', '1.0 · October 2026'],
      ] },
      after: [{ h: 'Changelog' }, '1.0 · October 2026 — first edition.'],
    },
  },
}
