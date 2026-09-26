/* THE BRAND WIRING, shared by apps/brand (the tool alone) and apps/media-shell's Brand tab
 * (brand as a tool, 2026-09-27) — `useNotesTool`'s idea for kol-styleguide's `Brand`. The component
 * is the package's; what lives here is the brand it renders, once, so both apps show the same book.
 *
 *   const brand = useBrandTool()
 *   <Brand {...brand.props} view={view} onViewChange={setView} />
 *
 * THE BRAND is kol-brand — Kolkrabbi's published manifest, the one manifest with real marks — plus
 * what a fixture adds and the package does not carry: the book's copy (About and Tone are the studio
 * copy from kol-website's apps/brand, verbatim, less the lines that describe that app's own files; that app's Look and Logo copy was another client's
 * and is not used), social templates on the fixture's own images, avatar grounds, and the marks'
 * table widths. Never published — this is the fixture, not the brand.
 */
import kolBrand from '@kolkrabbi/kol-brand'
import { ASSETS } from '@kolkrabbi/kol-brand/svg'
import { fileUrl } from './assets-urls.js'

/* the marks by manifest id — kol-brand's svg files are `kol-<id>.svg` */
const logoSources = Object.fromEntries(kolBrand.logos.map((l) => [l.id, ASSETS[`kol-${l.id}`]]))

const PREVIEW_WIDTHS = { 'logomark': 48, 'wordmark': 160, 'lockup-hori': 240, 'lockup-vert': 120 }

/* grey first: the colour chapter opens on the structural neutral, then the identity hues */
const grey = kolBrand.ramps.find((r) => r.id === 'grey')
const ramps = [
  { ...grey, label: 'Greyscale', note: 'Carries the canvas and structural ink. Legacy 10-stop ramp; kept until the opacity-hex (solid neutral) primitive is reintroduced.' },
  ...kolBrand.ramps.filter((r) => r.id !== 'grey'),
]

export const BRAND_FIXTURE = {
  ...kolBrand,
  ramps,
  logos: kolBrand.logos.map((l) => ({ ...l, previewWidth: PREVIEW_WIDTHS[l.id] })),

  social: {
    templates: [
      { caption: 'Post · 1:1 square',  ratio: '1 / 1',  src: fileUrl('tt-01.jpg') },
      { caption: 'Post · 4:5 portrait', ratio: '4 / 5',  src: fileUrl('tt-02.jpg') },
      { caption: 'Story · 9:16',        ratio: '9 / 16', src: fileUrl('tt-03.jpg') },
    ],
    avatars: [
      { bg: '#FCFBFB', polarity: 'dark' },
      { bg: '#FAF7F0', polarity: 'dark' },
      { bg: '#FFCF33', polarity: 'dark' },
      { bg: '#131316', polarity: 'light' },
    ],
  },

  book: {
    about: {
      lede: 'A Reykjavík design studio and atelier — visual identity, custom typography, and thoughtful design systems for brands that value craftsmanship and clarity.',
      blocks: [
        'Kolkrabbi is a design studio and atelier founded in Reykjavík in 2019 by artist and designer Tór Grímsson. The studio focuses on brand identity, visual systems, illustration, and UI/UX — the foundational structures that shape how brands communicate. At its core sits one belief: good design is systematic, not superficial.',
        'Tór is a Reykjavík-based artist and multi-disciplinary designer working across illustration, identity, and system-driven design. Educated at the Iceland Academy of the Arts and Weissensee Kunsthochschule in Berlin, he has over 15 years of experience across branding, UI/UX, publication design, and visual communication; before founding Kolkrabbi, he served as the first dedicated designer for Tempo. Alongside design he works as a visual artist under the names Biskup and Svartval, and produces music as Konsulat.',
        'The studio works with clients across technology, culture, lifestyle, and the arts, and collaborates with developers, strategists, and other specialists when needed — expanding capabilities without losing the focus and craft of a small atelier.',
        { h: 'Systematic, not superficial' },
        'Every decision — from typography and color logic to layout, interaction, and asset management — serves clarity, consistency, and long-term adaptability. Design is approached as a system rather than a style.',
        { h: 'Grounded in structure' },
        'The process maps the problem, understands the constraints, breaks a complex identity into component parts, and rebuilds it into a coherent system that scales. Strong foundations make future design choices intuitive instead of arbitrary.',
        { h: 'Foundations that endure' },
        'The work spans branding, art direction, UI/UX, illustration, print, and digital experiences — always built on foundations that last. The result is design that scales, adapts, and retains integrity over time.',
      ],
    },
    tone: {
      lede: 'How the studio sounds — clear, structured, quietly confident.',
      blocks: [
        'Kolkrabbi speaks quietly and deliberately. The voice is clear, structured, and craft-driven — it favours specifics over claims, systems over slogans, the considered phrase over the loud one. It shows the thinking, not just the outcome, and it addresses the reader who wants to understand, never the one being sold to.',
      ],
    },
    color: {
      lede: 'Greyscale carries the structure; five brand hue ramps + cream carry identity.',
      blocks: [
        { h: 'Concept' },
        'The system splits color into two roles. Greyscale handles the structural backbone — surfaces, ink, dividers, the canvas. The brand palette names the identity through five hue families (yellow, red, blue, orange, teal), with cream as a complementary neutral surface.',
      ],
      after: [
        { h: 'Usage' },
        'Greyscale carries the canvas and structural ink. The five brand ramps name the identity — yellow primary, red secondary, with blue, orange, and teal as supporting hues. Cream sits as a neutral surface for warm-leaning compositions. Apply brand color with restraint, never decoratively.',
      ],
    },
    typography: {
      lede: 'Right Grotesk for sans (display, heading, body, prose). JetBrains Mono for utility chrome (mono body, helpers, code). Two-cut sans (Narrow / Compact) + base; weight + leading split on mono creates label/value hierarchy without size jumps.',
    },
  },
}

/** kol-styleguide's `Brand` props: the fixture brand and its marks. */
export function useBrandTool() {
  return { props: { brand: BRAND_FIXTURE, logoSources } }
}
