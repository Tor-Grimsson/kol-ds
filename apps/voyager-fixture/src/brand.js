/* VOYAGER's brand manifest — the kol-brand / kol-brand-template SHAPE (meta · colors · ramps · type ·
 * logos · clearspace · stationery · presence · press · timeline), so kol-styleguide's `Brand` renders
 * it exactly as it renders Kolkrabbi's. The palette and type are the client template's
 * (`client-theme.css`): burgundy + cream on a warm grey, Right Grotesk with Playfair italic accents.
 * Invented — a fake client for the apps tier, never a real brand. */
import { BRAND_INFO, BIO, PRESS, TIMELINE } from './business.js'
import { MARK_SVG } from './assets.js'

const ramp = (id, label, anchor, note, stops) => ({ id, label, anchor, note, stops: Object.entries(stops).map(([stop, value]) => ({ stop: Number(stop), value })) })

/* the four ids kol-styleguide's chapters ask for, then the alternates the archive carries */
const LOGOS = [
  { id: 'logomark', file: 'logomark-01', name: 'Logomark', use: 'Square/compact contexts, avatars, favicons', previewWidth: 48 },
  { id: 'wordmark', file: 'wordmark', name: 'Wordmark', use: 'Text-led contexts, headers', previewWidth: 160 },
  { id: 'lockup-hori', file: 'lockup-horizontal-01', name: 'Lockup · horizontal', use: 'Default lockup, wide formats', previewWidth: 240 },
  { id: 'lockup-vert', file: 'lockup-vertical-01', name: 'Lockup · vertical', use: 'Stacked/narrow formats', previewWidth: 120 },
  { id: 'logomark-alt', file: 'logomark-02', name: 'Logomark · alternate', use: 'The alternate composition', previewWidth: 48 },
  { id: 'lockup-hori-wide', file: 'lockup-horizontal-02', name: 'Lockup · horizontal wide', use: 'Banners', previewWidth: 240 },
  { id: 'lockup-vert-tight', file: 'lockup-vertical-02', name: 'Lockup · vertical tight', use: 'Tight stacks', previewWidth: 120 },
]

export const VOYAGER_BRAND = {
  meta: {
    name: BRAND_INFO.identity.name,
    nameShort: BRAND_INFO.identity.nameShort,
    legalName: BRAND_INFO.legal.entity,
    founded: BRAND_INFO.identity.established,
    founder: BRAND_INFO.identity.founder,
    role: BRAND_INFO.identity.role,
    location: { city: BRAND_INFO.studio.city, country: BRAND_INFO.studio.country, locShort: BRAND_INFO.studio.locShort },
    url: `https://${BRAND_INFO.contact.web}`,
    email: BRAND_INFO.contact.email,
    socials: { instagram: 'voyager.expeditions', youtube: '@voyager' },
  },
  colors: {
    anchors: [
      { token: '--client-accent-primary', resolvesTo: '--burgundy-500', value: '#850F36', use: 'The signature burgundy — marks, kickers, links' },
      { token: '--client-accent-on-primary', resolvesTo: '--orange-50', value: '#F4E4DA', use: 'Cream — ink on burgundy, and the warm surface' },
      { token: '--client-ink', resolvesTo: '--burgundy-900', value: '#2D121C', use: 'Ink' },
      { token: '--client-base', resolvesTo: '--grey-900', value: '#131316', use: 'The dark ground' },
    ],
  },
  ramps: [
    ramp('grey', 'Greyscale', 900, 'The structural neutral — canvas and ink.', { 50: '#FCFBFB', 100: '#EBEBEB', 200: '#DBDBDB', 300: '#A3A3A4', 400: '#5B5B5D', 500: '#363639', 600: '#2E2E30', 700: '#242427', 800: '#1B1B1E', 900: '#131316' }),
    ramp('burgundy', 'Burgundy', 500, 'The signature — anchored at 500.', { 50: '#FBEDF1', 100: '#F3D2DD', 200: '#E5A8BE', 300: '#D0759A', 400: '#B13E62', 500: '#850F36', 600: '#610A2F', 700: '#411F34', 800: '#301728', 900: '#2D121C' }),
    ramp('cream', 'Cream', 50, 'The warm surface; one stop.', { 50: '#F4E4DA' }),
  ],
  type: {
    families: [
      { token: '--client-font-display', role: 'Display + headings', cut: 'Right Grotesk', weights: [500, 700] },
      { token: '--client-font-text', role: 'Body', cut: 'Right Grotesk Text', weights: [400, 500] },
      { token: '--client-font-serif', role: 'Italic accents, pull quotes', cut: 'Playfair (variable)', weights: [400, 700] },
      { token: '--client-font-mono', role: 'Labels, data', cut: 'Right Grotesk Mono', weights: [400] },
    ],
    scale: [
      { cls: 'h1', family: 'display', weight: 700, size: '48px' },
      { cls: 'h2', family: 'display', weight: 700, size: '32px' },
      { cls: 'lede', family: 'text', weight: 400, size: '22px' },
      { cls: 'quote', family: 'serif', weight: 400, size: '24px' },
      { cls: 'body', family: 'text', weight: 400, size: '17px' },
    ],
  },
  logos: LOGOS.map(({ file, ...l }) => ({ ...l, file: `./marks/${file}.svg` })),
  favicons: [{ id: 'logomark', name: 'Voyager', file: './marks/logomark-01.svg', use: 'Site favicon' }],
  clearspace: { rule: 'Clearspace equals the height of one logomark blade on every side of a lockup.' },
  stationery: { assets: [] },
  presence: { site: `https://${BRAND_INFO.contact.web}`, pages: [], profiles: { instagram: 'https://social.example/voyager.expeditions', youtube: 'https://video.example/@voyager' }, feeds: [] },
  press: PRESS.map((p) => ({ date: String(p.year ?? ''), title: p.title, outlet: p.org, url: p.href })),
  timeline: TIMELINE.filter((t) => t.kind === 'milestone').map((t) => ({ date: String(t.year), title: t.title, note: t.notes })),
  book: {
    about: { lede: BIO.companyBio, blocks: [BIO.founderBio, { h: 'Small groups' }, 'No trip carries more than eight travellers. The routes are chosen for what a small group can do and a large one cannot.'] },
    tone: { lede: 'Plain, specific, outdoors — say where, how long and how hard.', blocks: ['Voyager writes the way a guide briefs: the route, the distance, the weather window, what to bring. No superlatives; the landscape does that work.'] },
    color: { lede: 'Burgundy carries the identity; cream is the warm surface; greyscale carries the structure.' },
    typography: { lede: 'Right Grotesk for everything structural; Playfair italic for the one line that should sound like a person.' },
  },
}

/* raw SVG by manifest logo id — kol-styleguide's `logoSources` */
export const VOYAGER_LOGO_SOURCES = Object.fromEntries(LOGOS.map((l) => [l.id, MARK_SVG[l.file]]))
