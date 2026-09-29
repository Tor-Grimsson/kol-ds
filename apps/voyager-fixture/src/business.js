/* VOYAGER's business data — INVENTED, in the exact shape the client sites hand-carry (kol-system's
 * kol-client `brand/data/{info,business-data}.js`, the ACYR registry): identity, bio, a timeline by
 * kind, companies, collaborations, social, vendors, stack, the live-site map, the marketing playbook
 * and the open questions. The apps render it as data; nothing here is a real person, company or
 * address — every URL is on `.example`. */

export const BRAND_INFO = {
  identity: {
    founder:     'Hekla Sveinsdóttir',
    role:        'Founder · Expedition lead',
    established: '2016',
    name:        'Voyager',
    nameShort:   'VYG',
  },
  contact: {
    email: 'hello@voyager.example',
    phone: '+354 555 0142',
    web:   'voyager.example',
  },
  studio: {
    street:   'Grandagarður 8',
    postcode: '101 Reykjavík',
    country:  'Iceland',
    city:     'Reykjavík',
    locShort: 'Reykjavík · IS',
  },
  legal: {
    entity: 'Voyager Expeditions ehf',
    kt:     '000000-0000',
  },
  labels: {
    madeIn:    'Planned in Reykjavík',
    handmade:  'Small groups, long days',
    handBy:    'Led by people who live here',
    manifesto: 'Go further, leave less.',
  },
}

export const BIO = {
  fullName:    'Hekla Sveinsdóttir',
  birthDate:   '1986-02-11',
  birthCity:   'Ísafjörður, Iceland',
  hometown:    'Ísafjörður, Iceland',
  currentCity: 'Reykjavík, Iceland',
  founderBio:
    'Hekla Sveinsdóttir grew up in the Westfjords and spent ten years guiding glacier and sea-kayak trips before founding Voyager in 2016. She plans every route herself and still leads the long ones.',
  companyBio:
    'Voyager runs small-group expeditions across Iceland and Greenland — glacier traverses, sea-kayak crossings and winter light trips — with local guides, fixed departures and no more than eight travellers a trip.',
  quote: '"The best route is the one you can still walk back from."',
}

export const TIMELINE = [
  { year: 2004, endYear: 2007, kind: 'education', title: 'BSc Geography', org: 'University of Iceland', notes: 'Glaciology track.' },
  { year: 2008, kind: 'education', title: 'Mountain guide certification', org: 'Association of Icelandic Mountain Guides', notes: 'Glacier + ice-climbing modules.' },
  { year: 2016, kind: 'milestone', title: 'Founded Voyager', org: 'Reykjavík', notes: 'Two guides, one van, one glacier route.' },
  { year: 2018, kind: 'milestone', title: 'First Greenland departure', org: 'Kulusuk', notes: 'East Greenland sea-kayak crossing.' },
  { year: 2021, kind: 'milestone', title: 'Harbour office opens', org: 'Grandagarður, Reykjavík', notes: 'Kit room and briefing space.' },
  { year: 2019, kind: 'award', title: 'Responsible Operator of the Year', org: 'North Atlantic Travel Awards', notes: 'Small-operator category.' },
  { year: 2023, kind: 'award', title: 'Best Small-Group Expedition', org: 'Nordic Outdoor Guide', notes: 'For the Vatnajökull traverse.' },
  { year: 2019, kind: 'press', title: 'Eight people, one ice cap', org: 'Harbour Weekly', href: 'https://press.example/harbour-weekly/eight-people', notes: 'Feature on the traverse.' },
  { year: 2022, kind: 'press', title: 'The operators keeping groups small', org: 'Travel North', href: 'https://press.example/travel-north/small-groups', mediaType: 'article' },
  { year: 2024, kind: 'press', title: 'Winter light, on foot', org: 'Field Journal', href: 'https://press.example/field-journal/winter-light', mediaType: 'video' },
  { year: 2020, kind: 'film', title: 'Crossing', org: 'Short documentary — subject', notes: 'Twelve days on the east coast.' },
  { year: null, kind: 'profile', title: 'Guide registry — Hekla Sveinsdóttir', org: 'Guide Registry', href: 'https://registry.example/guides/hekla', notes: 'Certification record.' },
]

export const TIMELINE_KINDS = [
  { key: 'education', label: 'Education' },
  { key: 'press',     label: 'Press' },
  { key: 'award',     label: 'Awards' },
  { key: 'milestone', label: 'Milestones' },
  { key: 'film',      label: 'Films' },
  { key: 'profile',   label: 'Profiles' },
]

export const PRESS    = TIMELINE.filter((t) => t.kind === 'press')
export const AWARDS   = TIMELINE.filter((t) => t.kind === 'award')
export const FILMS    = TIMELINE.filter((t) => t.kind === 'film')
export const PROFILES = TIMELINE.filter((t) => t.kind === 'profile')

export const COMPANIES = [
  { name: 'Voyager Expeditions', role: 'Founder', years: '2016–present', status: 'active', notes: 'The operator.' },
  { name: 'Voyager Kit', role: 'Co-founder', years: '2020–2023', status: 'archived', notes: 'Gear rental; folded back into the operator.' },
]

export const COLLABORATIONS = [
  { client: 'Coastal Research Station', type: 'research', year: 2022, notes: 'Glacier-margin sampling trips.' },
  { client: 'North Light Films', type: 'film', year: 2020, notes: 'Logistics + guiding for “Crossing”.' },
  { client: 'Harbour Outfitters', type: 'co-design', year: 2023, notes: 'Expedition jacket, two colourways.' },
]

export const SOCIAL = [
  { platform: 'Instagram', handle: '@voyager.expeditions', url: 'https://social.example/voyager.expeditions', notes: 'Primary account.' },
  { platform: 'YouTube',   handle: '@voyager',             url: 'https://video.example/@voyager',            notes: 'Trip films.' },
  { platform: 'Newsletter', handle: 'Field notes',         url: 'https://voyager.example/field-notes',       notes: 'Monthly.' },
]

export const VENDORS = [
  { name: 'Harbour Outfitters', role: 'Kit supplier', notes: 'Shells, layers and the co-designed jacket.', url: 'https://harbour.example', status: 'active' },
  { name: 'Fjord Vans',         role: 'Transport',    notes: 'Two 4x4 vans on a seasonal lease.',       url: 'https://fjordvans.example', status: 'active' },
  { name: 'Booking platform',   role: 'Reservations', notes: 'Fixed departures + deposits. Migration to direct checkout under review.', url: null, status: 'tbd' },
  { name: 'Photographer',       role: 'Trip imagery', notes: 'Commissioned per season.', url: null, status: 'tbd' },
]

export const STACK = [
  { layer: 'Frontend',      choice: 'React 19 + Vite 8 + Tailwind 4', status: 'shipped' },
  { layer: 'Design system', choice: 'KOL (Kolkrabbi)',                status: 'shipped' },
  { layer: 'Hosting',       choice: 'Vercel',                          status: 'shipped' },
  { layer: 'CMS',           choice: 'Sanity — trips as documents',     status: 'proposed' },
  { layer: 'Payments',      choice: 'Stripe deposits',                 status: 'planned' },
]

export const LIVE_SITE_MAP = [
  { live: '/',                label: 'Home',          ours: '/site',                    coverage: 'covered' },
  { live: '/trips',           label: 'Trips',         ours: '/site/trips',              coverage: 'covered' },
  { live: '/trips/:slug',     label: 'Trip detail',   ours: '/site/trips/:slug',        coverage: 'covered' },
  { live: '/journal',         label: 'Journal',       ours: '/site/journal',            coverage: 'partial' },
  { live: '/about',           label: 'About',         ours: '/site/about',              coverage: 'planned' },
  { live: '/contact',         label: 'Contact',       ours: '/site/contact',            coverage: 'covered' },
]

export const MARKETING_PLAYBOOK = [
  { step: 1, title: 'Season calendar',   body: 'Publish next season’s departures in one place before any campaign runs.' },
  { step: 2, title: 'Trip films',        body: 'One short film per route; the trip page embeds it above the itinerary.' },
  { step: 3, title: 'Field notes',       body: 'A monthly letter — conditions, a route, a guide. No discounts.' },
  { step: 4, title: 'Referral',          body: 'Past travellers get first access to new routes.' },
]

export const OPEN_QUESTIONS = [
  { topic: 'Greenland season', note: 'Confirm 2027 departure dates with the Kulusuk partner.' },
  { topic: 'Direct checkout',  note: 'Deposits on Stripe vs. staying on the booking platform.' },
]
