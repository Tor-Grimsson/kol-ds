/* THE BRAND GUIDE OUTLINE (BrandGuideOutlineTwoVersions, kol-hq 2026-10-27) — kol-branding's `/template/general`, carried:
 * `GUIDE_SECTIONS` is its chapter list (src/template/template-sections.js), `GUIDE_TEMPLATE` its manifest's copy
 * (src/template/template.js `book`) on a blank brand. One chapter structure; a client fills it by passing its own
 * manifest with a `book` keyed by the same `key`s. kol-styleguide's `BrandGuide` renders either.
 *
 * Changed from the source, nothing else: the brand's name is `[client-name]`, every value the placeholder brand
 * carried (Norðurljós's meta, its hexes, its ramp stops) is `[input]`, and the rows' `source` — kol-branding's research
 * citations — stays there. Square brackets mark what a brand fills in. Decided 2026-10-27 for review. */

const DEFINING = 'Defining the brand', ELEMENTS = 'Design elements', APPLICATIONS = 'Applications', GOVERNANCE = 'Governance'

/**
 * The chapter list — a row per chapter, merged with `brand.book[key]` by kol-styleguide's `guideSections`:
 *   key      the copy key in `brand.book`            id      the anchor            nav    rail label (unindexed without one)
 *   kind     the specimen — hero · contents · prose · logo · lockups · color · typography · logos-table · branded ·
 *            stationery · social · profile (default: prose)
 *   part     the contents' group                      label   eyebrow — it carries the chapter number
 *   marks    logo ids a marks kind draws
 */
export const GUIDE_SECTIONS = [
  { key: 'hero', id: 'hero', kind: 'hero', label: 'brand guide template' },
  { key: 'contents', id: 'contents', kind: 'contents', label: 'Contents', title: 'Chapters' },

  { key: 'intro', id: 'intro', part: DEFINING, nav: 'Intro', label: '00 — intro', title: 'How to use this guide' },
  { key: 'about', id: 'about', part: DEFINING, nav: 'About', label: '01 — about' },
  { key: 'messages', id: 'key-messages', part: DEFINING, nav: 'Key messages', label: '02 — key messages', title: 'Key messages' },
  { key: 'voice', id: 'voice', part: DEFINING, nav: 'Voice', label: '03 — voice and naming', title: 'Voice and naming' },

  { key: 'mark', id: 'the-mark', part: ELEMENTS, kind: 'logo', nav: 'The mark', label: '04 — the mark', title: 'The mark', marks: ['logomark', 'wordmark'] },
  { key: 'logo', id: 'logo', part: ELEMENTS, kind: 'lockups', nav: 'Logo', label: '05 — logo', title: 'Lockups, clear space, size and misuse', marks: ['logomark', 'wordmark', 'lockup-hori'] },
  { key: 'colour', id: 'colour', part: ELEMENTS, kind: 'color', nav: 'Color', label: '06 — color', title: 'Color' },
  { key: 'type', id: 'type', part: ELEMENTS, kind: 'typography', nav: 'Type', label: '07 — type', title: 'Type' },
  { key: 'grid', id: 'elements-and-grid', part: ELEMENTS, nav: 'Elements and grid', label: '08 — elements and grid', title: 'Graphic elements and grid' },
  { key: 'imagery', id: 'imagery', part: ELEMENTS, nav: 'Imagery', label: '09 — imagery', title: 'Imagery' },
  { key: 'icons', id: 'icons', part: ELEMENTS, nav: 'Icons', label: '10 — icons', title: 'Icons and illustration' },

  { key: 'applications', id: 'applications', part: APPLICATIONS, kind: 'stationery', nav: 'Applications', label: '12 — applications', title: 'Applications' },
  { key: 'templates', id: 'templates-and-tools', part: APPLICATIONS, kind: 'social', nav: 'Templates and tools', label: '13 — templates and tools', title: 'Templates and tools' },

  { key: 'cobranding', id: 'co-branding', part: GOVERNANCE, nav: 'Co-branding', label: '14 — co-branding', title: 'Co-branding and partners' },
  { key: 'governance', id: 'running-the-guide', part: GOVERNANCE, nav: 'Running the guide', label: '15 — running the guide', title: 'Running the guide' },
]

const I = '[input]'

/** The blank guide — a manifest with every value a placeholder and the template's copy in `book`. */
export const GUIDE_TEMPLATE = {
  meta: {
    name: '[client-name]', nameShort: I, legalName: I, founded: I, founder: I,
    role: I, location: { city: I, country: I, locShort: I },
    url: I, email: I,
  },
  social: {
    mark: 'wordmark',
    templates: [{ caption: 'Post · 1:1', ratio: '1 / 1' }, { caption: 'Post · 4:5', ratio: '4 / 5' }, { caption: 'Story · 9:16', ratio: '9 / 16' }],
  },

  book: {
    hero: {
      lede: 'What a working brand guide holds, chapter by chapter — concluded from eight published guides and measured against Another Creation. The values are a placeholder brand; the text is the template.',
    },
    contents: { lede: 'Sixteen chapters in four parts: defining the brand, the design elements, the applications, and how the guide is run. Every chapter carries the research it rests on.' },

    intro: {
      lede: 'Who the guide is for, how it is organized, and which edition this is.',
      rules: [
        'Name the readers: [client staff, agencies, partners, press].',
        'Say how to use it: read in order once, then go to the chapter you need; every chapter stands alone.',
        'Edition and date on the cover — [Edition 1.0 · Month Year] — and on every chapter that changes.',
        'Point to the files: [where the logos, fonts and templates are].',
      ],
      after: ['A missing changelog is the most repeated omission across the researched guides.'],
    },

    about: {
      title: 'About [client-name]',
      lede: 'Who makes it, where, since when, and what it works against.',
      rules: [
        'The founding story in one short paragraph: [who, where, when].',
        'What the brand is for, and what it refuses.',
        'Close with one line that names what the visual rules must protect.',
      ],
      after: ['Guides that never tie their strategy back to the visuals are criticised for it; the closing line is that tie.'],
    },

    messages: {
      lede: 'Three to four lines the brand returns to everywhere — and what each one means in practice.',
      spec: { caption: 'Messages put to work', columns: ['Message', 'In copy', 'In design', 'On touchpoints'], rows: [
        ['[Message one]', '[What the words do]', '[What the layout or image does]', '[What the object does]'],
        ['[Message two]', '…', '…', '…'],
        ['[Message three]', '…', '…', '…'],
      ] },
    },

    voice: {
      lede: 'How the brand sounds — traits with their counterweights, real examples, and the words it uses.',
      spec: { caption: 'Voice traits', columns: ['We are', 'But not', 'Sounds like'], rows: [
        ['[Direct]', '[Curt]', '[An example sentence]'],
        ['[Warm]', '[Gushing]', '…'],
        ['[Precise]', '[Technical]', '…'],
      ] },
      words: { use: ['[word]', '[word]', '[word]'], avoid: ['[word]', '[word]', '[word]'] },
      after: [
        { h: 'Before and after' },
        { lead: 'Before:', text: '[A real label, product line or post, as written today.]' },
        { lead: 'After:', text: '[The same, rewritten in the voice.]' },
        { h: 'Naming' },
        'How the brand name is written (case, never abbreviated, never possessive), and how products are named.',
      ],
    },

    mark: {
      lede: 'What the marks are and why — the concept before the rules.',
      blocks: ['[What the logomark draws, what the wordmark is set in, and what each carries alone.] Name any retired mark, so old files can be recognized.'],
    },

    logo: {
      lede: 'Clear space, minimum size, color versions, placement and misuse — stated in units, not only drawn.',
      spec: { caption: 'Logo specification', columns: ['', 'Logomark', 'Wordmark', 'Horizontal lockup'], rows: [
        ['Clear space', '[½ the mark’s height]', '[the cap height of the first letter]', '[the logomark’s height]'],
        ['Minimum size — print', '[10 mm]', '[25 mm wide]', '[35 mm wide]'],
        ['Minimum size — screen', '[24 px]', '[80 px wide]', '[120 px wide]'],
        ['Color versions', '[primary on cream · cream on primary · black · white]', '…', '…'],
        ['Default placement', '[top left, one clear space from the edge]', '…', '…'],
      ] },
      donts: ['Stretch, squash or rotate the marks.', 'Recolor outside the color versions.', 'Set the wordmark in another face.', 'Place on a busy image without a clear field.', 'Add effects — shadows, outlines, gradients.', 'Rebuild the lockup with new spacing.'],
      after: ['Number the misuse examples, so a reviewer can point to one.'],
    },

    colour: {
      lede: 'Every color in four systems, how much of each a layout uses, and which pairs are safe to read.',
      spec: { caption: 'Values', columns: ['Color', 'HEX', 'RGB', 'CMYK', 'Pantone'], rows: [
        ['Primary — [input]', I, I, '[C — M — Y — K]', '[PMS —]'],
        ['Secondary — [input]', I, I, '[C — M — Y — K]', '[PMS —]'],
        ['Neutral — [input]', I, I, '[C — M — Y — K]', '[PMS —]'],
        ['Ink — [input]', I, I, '[C — M — Y — K]', '[PMS —]'],
      ] },
      pairs: [
        { text: I, bg: I, use: 'Body text' },
        { text: I, bg: I, use: 'Headlines on the identity color' },
        { text: I, bg: I, use: 'Large text only' },
        { text: I, bg: I, use: 'Labels on the secondary' },
      ],
      after: [
        { h: 'Proportions' },
        '[Cream 60 · teal 30 · orange 10] — how much of each color a layout uses.',
        { h: 'One source' },
        'Every edition quotes the same values. Guides whose editions disagree on a HEX are criticised for it; keep one table and link to it.',
      ],
    },

    type: {
      lede: 'The faces and their roles, the brand’s own scale, where the fonts come from, and what to use when they are not there.',
      spec: { caption: 'Scale', columns: ['Role', 'Face', 'Weight', 'Size / leading', 'Tracking'], rows: [
        ['Display', '[Narrow]', '[500]', '[80 / 80]', '[0]'],
        ['Heading', '[Compact]', '[400]', '[32 / 40]', '[0]'],
        ['Body', '[Base]', '[300]', '[16 / 24]', '[0.02em]'],
        ['Label', '[Mono]', '[500]', '[12 / 16]', '[0.1em, uppercase]'],
        ['Minimum — screen / print', '', '', '[12 px / 7 pt]', ''],
      ] },
      rules: [
        'Source and license: [where the fonts are bought, who holds the license, what it allows].',
        'Fallback: [system face for email and Office] — [web fallback stack].',
      ],
    },

    grid: {
      lede: 'One base unit, tied to the logo, that sets the margins, the grid and the spacing everywhere.',
      rules: [
        'The unit: [the logomark’s height = one margin = ⅓ of a column].',
        'Print: [12 columns, margins of one unit, gutter of ½ unit].',
        'Screen: [the same unit in px, at each breakpoint].',
        'Any signature device — a rule, a frame, a pattern — and when it is used.',
      ],
      after: ['The most usable guides run everything off one unit.'],
    },

    imagery: {
      lede: 'A brief someone else can shoot from.',
      rules: ['Subjects: [what we show].', 'Light: [natural, soft, directional].', 'Casting and locations: [who and where].', 'A standing shot list: [the ten images every campaign needs].', 'The library: [where the images live and who may use them].'],
      dos: ['[Natural light]', '[Material close-ups]', '[Real people at work]'],
      donts: ['[Studio gloss]', '[Stock smiles]', '[Heavy filters]'],
    },

    icons: {
      lede: 'Only if the brand uses them — and when it does, sizes and one style rule.',
      rules: ['Icon sizes: [16 · 24 · 32 px], drawn on a [24 px] grid.', 'Stroke: [1.5 px, round caps].', 'Illustration: [the style, who draws it, and when it is used instead of photography].'],
    },

    applications: {
      lede: 'The brand’s own touchpoints, each measured and with the files to work from. The mocks below are the placeholder brand’s stationery.',
      spec: { caption: 'Touchpoints', columns: ['Item', 'Size', 'Mark', 'File'], rows: [
        ['Business card', '85 × 55 mm', '[Horizontal lockup]', '[link]'],
        ['Letterhead', 'A4', '[Wordmark]', '[link]'],
        ['[The brand’s own — packaging, labels, signage]', '…', '…', '…'],
        ['Showcase', '[mockups of the system in use]', '', ''],
      ] },
    },

    templates: {
      lede: 'The files people start from — post sizes, the deck, the generators — and where to download them.',
      rules: ['Social: one template per aspect ratio — 1:1, 4:5, 9:16.', 'Profile: [the avatar treatment].', 'Deck: [the presentation template and its master slides].', 'Tools: [generators, Figma libraries], with the link.'],
    },

    cobranding: {
      lede: 'How the brand appears beside stockists, collaborators and sponsors.',
      rules: ['The partner lockup: [our mark · a rule · their mark], [one clear space] apart, ours first unless [the event is theirs].', 'Equal visual weight; neither mark resized to win.'],
      dos: ['[Use the supplied lockup files]', '[Ask before using the marks]'],
      donts: ['[Alter the marks]', '[Imply endorsement we have not given]'],
    },

    governance: {
      lede: 'Who owns the brand, what needs approval, where the files are, and which edition this is.',
      spec: { caption: 'Running the guide', columns: ['', ''], rows: [
        ['Owner', '[Name, role]'],
        ['Contact', '[email]'],
        ['Needs approval', '[new marks, partner use, campaigns]'],
        ['Files, fonts, templates', '[link]'],
        ['Edition', '[1.0 · Month Year]'],
      ] },
      after: [{ h: 'Changelog' }, '[1.0 · Month Year — first edition.]'],
    },
  },
}
