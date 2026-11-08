/* THE CATALOGUE (plan 2026-11-04-folio-library W6.2–6.3) — how Folio reads the library: which documents are one BOOK
 * (chapters), what each book and chapter is called, and which copies are the same text twice. Nothing on disk moves or
 * changes; this is a reading of the files. A document's own `title:` frontmatter still wins over every rule here.
 *
 * Title system, per shelf (user, 2026-11-04):
 *   Self      — CV and Resume are one kind, CV. Books per year ("CV — 2012"), about/bio texts per year ("About & bio — 2011"),
 *               every cover letter one book. Chapters are the variant + the day ("Art · 16 Jan 2012").
 *   Schooling — the school, department and school year ("LHÍ Fine Arts — 2006–07"); the paper's name is the chapter.
 *   Press     — "<Publication> — <headline>, <year>", the publication spelled out (mbl → Morgunblaðið).
 *   Work      — grouped into books (lyrics, notes, artwork texts, portfolio, prints …) on the shelf; the shelf split
 *               (art texts · lyrics & poems · writing) is his call, W6.2 TALK. */

import { client } from '../folio/client'

const VAULT_BOOKS = client().read('vault-books')

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fmtDate = (d = '') => {
  const [y, m, day] = d.split('-')
  if (!y) return ''
  if (!m) return y
  return day ? `${+day} ${MONTH[+m - 1]} ${y}` : `${MONTH[+m - 1]} ${y}`
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const stem = (doc) => doc.id.split('/').pop().normalize('NFC')

/* school year, autumn to summer: 2009-10 → 2009–10, 2009-03 → 2008–09; a bare year counts as spring */
const schoolYear = (date) => {
  if (!date) return ''
  const y = +date.slice(0, 4)
  const m = +(date.slice(5, 7) || 1)
  const from = m >= 9 ? y : y - 1
  return `${from}–${String(from + 1).slice(2)}`
}

/* ── books: one key per document; the same key on one shelf is one book ── */

const PUBLICATION = { mbl: 'Morgunblaðið', dv: 'DV', 'DV': 'DV' }

function schooling(doc) {
  const path = doc.id
  if (/lhi-(LIS|KVI)|lhi-verkefni/.test(path)) return { key: 'hi-art-theory-2009', title: 'HÍ Art Theory — 2009–10' }
  if (doc.code === 'ERA') return { key: 'lhi-design-erasmus', title: 'LHÍ Design — 2013–14', subtitle: 'Erasmus, Weißensee Berlin' }
  if (/ritgerdir/.test(path)) return { key: 'lhi-fine-arts-2006', title: 'LHÍ Fine Arts — 2006–07' }
  if (/fine-arts/.test(path)) return { key: 'lhi-fine-arts-2008', title: 'LHÍ Fine Arts — 2008–09' }
  if (/ba-design/.test(path)) return { key: 'lhi-design-2014', title: 'LHÍ Design — 2014–15' }
  return { key: `schooling-${schoolYear(doc.date)}`, title: `Schooling — ${schoolYear(doc.date)}` }
}

export function bookOf(doc) {
  /* the vault's books: the folder is the book (scripts/import-vault.mjs) */
  if (doc.collection === 'vault') { const id = doc.id.split('/')[0]; return { key: `vault-${id}`, title: VAULT_BOOKS[id]?.title ?? id } }
  const s = stem(doc)
  const year = doc.date?.slice(0, 4)
  switch (doc.folder) {
    case 'self':
      if (doc.code === 'CV' || doc.code === 'RES') return { key: `cv-${year || 'nd'}`, title: `CV — ${year || 'undated'}` }
      if (doc.code === 'ABT' || doc.code === 'BIO') return doc.collection === 'business'
        ? { key: 'about-studio', title: 'About & bio — the studio' }
        : { key: `about-${year || 'nd'}`, title: `About & bio — ${year || 'undated'}` }
      if (doc.code === 'CVL') return { key: 'cover-letters', title: 'Cover letters' }
      break
    case 'schooling':
      return schooling(doc)
    case 'applications':
      if (s.startsWith('application-grant')) return { key: `grant-${year}`, title: `Grant applications — ${year}` }
      if (s.startsWith('application-tsh-kraumur')) return { key: 'kraumur', title: 'Kraumur — Two Step Horror' }
      if (/^stef-tsh|^registration-2011-is-stef/.test(s)) return { key: 'stef-2011', title: 'STEF — Two Step Horror, 2011' }
      if (/lhi/.test(s)) return { key: 'lhi-application-2012', title: 'LHÍ Visual Communication — application, 2012' }
      if (doc.collection === 'opportunities') return { key: 'opportunities', title: 'Opportunities' }
      break
    case 'studio':
      if (doc.id.startsWith('pitch/')) return { key: 'pitch', title: 'Pitch' }
      if (doc.id.startsWith('frumkvaedi-2024/')) return { key: 'frumkvaedi-2024', title: 'Frumkvæði — 2024' }
      return { key: 'studio', title: 'The studio' }
    case 'work':
      if (doc.code === 'LYR') return { key: 'lyrics', title: 'Lyrics — Two Step Horror' }
      if (doc.code === 'NTS') return { key: 'notes', title: 'Notes — 2010–13' }
      if (s.startsWith('write-prump')) return { key: 'prump-2009', title: 'Prump er ekki list — 2009' }
      if (doc.code === 'INF') return { key: 'artwork-texts', title: 'Artwork texts — 2009–13' }
      if (doc.code === 'PRT') return { key: 'portfolio', title: 'Portfolio' }
      if (doc.code === 'PRN') return { key: 'prints', title: 'Prints' }
      if (doc.code === 'MUS') return { key: 'konsulat', title: 'Konsulat — 2016' }
      if (s.startsWith('tsh-bio')) return { key: 'tsh-bio', title: 'Two Step Horror — bio, 2014' }
      if (s.includes('papay-gyro-nights')) return { key: 'papay-2012', title: 'Papay Gyro Nights — 2012' }
      break
    case 'press': {
      /* numbered parts of one article are one book */
      const base = s.replace(/-0\d$/, '')
      if (base !== s) return { key: `press-${base}`, title: null }
      break
    }
    case 'reference':
      return { key: 'registry', title: 'Registry', subtitle: 'The card index' }
  }
  return null
}

/* ── titles ── */

const CHAPTER = {
  /* Self — CV book chapters */
  'open application': 'Open application',
  'atvinnuumsókn form': 'Atvinnuumsókn — job application form',
  'Ferilskra_VMST_snidmat_950290628': 'Ferilskrá — Vinnumálastofnun template',
  '!cv freelance': 'Freelance',
  '! ferilskrá': 'Ferilskrá',
  '! ferilskrá english': 'Ferilskrá, English',
  'cv 13.des': 'Art',
  'CV last update (jan 2012) art': 'Art',
  'CV last update (august 2012) art': 'Art',
  'cv-art-2012': 'Art',
  'CV - sept 2013': 'Art',
  '!cv freelance (15.nov.12)': 'Freelance',
  'cv 2015': 'Art',
  'tór-grímsson-info': 'Info',
  'tor-grimsson-cv': 'Designer',
  'cv-2009-02': 'Art',
  'cv-2012': 'Art',
  /* Self — about & bio */
  'torg-about-2010-01': 'About', 'torg-about-2010-02': 'About', 'torg-bio-2010': 'Bio',
  'bio text': 'Bio, capabilities',
  'about-letter': 'About, letter', 'about-talk': 'About-me talk — Kynning 6.–7. mars', bio: 'Bio — Tór Grímsson',
  /* Schooling */
  Afangalysing_HO09: 'Áfangalýsing — LIS004G', Efnisaatlun_fyrirlestra_HO09: 'Efnisáætlun fyrirlestra — LIS004G',
  Lestrarlisti_HO09: 'Lestrarlisti — LIS004G', Ritgeroarefni_HO09: 'Ritgerðarefni — LIS004G',
  Kennsluaatlun_og_lesefni_namskeiosins: 'Kennsluáætlun og lesefni — LIS101G', 'íkanografía glósur': 'Íkanógrafía, glósur — LIS101G',
  Fraedi_2009_dagskra: 'Fræði 2009, dagskrá — KVI101G', Thydingar_til_bradabirgoa: 'Þýðingar til bráðabirgða — KVI101G',
  'glósur 1b': 'Glósur 1b — KVI101G', Thydingalisti_fyrir_prof: 'Þýðingalisti fyrir próf — KVI101G',
  'Thydingalisti_fyrir_prof (endurunnið fyrir próf)': 'Þýðingalisti fyrir próf, endurunninn — KVI101G',
  'Þýðingarlisti Íslenskaður': 'Þýðingalisti, íslenskaður — KVI101G', Greining2009: 'Greiningarverkefni — KVI101G',
  'Amadeus - Milos Forman, Greiningarverkefni I': 'Amadeus, Miloš Forman — greiningarverkefni I',
  'Marxísk myndgreining the french ambassadors': 'Marxísk myndgreining — The Ambassadors',
  'Nam June Paik fadir video listarinnar': 'Nam June Paik, faðir vídeólistarinnar',
  'Maya Deren - Ritual in transfigured time': 'Maya Deren — Ritual in Transfigured Time',
  '"Tv-Selló" eftir Nam June Paik': '„TV-Selló“ eftir Nam June Paik',
  'Paul McCarthy The black and white tapes': 'Paul McCarthy — The Black and White Tapes',
  moti2: 'Letter of motivation, Weißensee', 'Letter of motivaton UDK': 'Letter of motivation, UdK', uppló: 'Uppló',
  PeriodStudents: 'Confirmation of study period',
  'catalogue-2009-is-en-lhi-fine-arts-graduation': 'Graduation catalogue',
  'thesis-2009-02-is-ba-fine-arts-unheimlich': 'BA thesis — Unheimlich / Óhugnaður / Macabre',
  'thesis-2014-is-ba-design-fagurfraedi-faranleikans': 'BA thesis — Fagurfræði fáránleikans',
  /* Applications */
  'application-grant-small': 'Small grant', 'application-grant-large': 'Large grant', 'application-grant-2009-02': 'Grant',
  'application-tsh-kraumur-2011-01': 'Application', 'application-tsh-kraumur-2011-02': 'Follow-up',
  'stef-tsh-2011-02': 'STEF registration, draft', 'stef-tsh-2011-03': 'STEF registration',
  'registration-2011-is-stef-two-step-horror': 'STEF registration, filed',
  'application-lhi-2012': 'Letter to the admissions committee', 'application-2012-03-22-is-en-lhi-visual-communication': 'Application',
  'application-invitation-crymo': 'Invitation — Gallerí Crymo, 2010', 'application-proposal-substrate': 'Proposal — While in their possession, 2010',
  'application form': 'Application form',
  /* Work */
  'info-artwork-02': 'Artwork list', 'info-artwork-01': 'Artwork list', 'info-artwork-mbe-2012': 'M.B.E. — My Black Earth',
  'info-artwork-mute-2012': 'Mute', 'info-opening-text-2013': 'Opening — Skyndreymi og táknvilla', 'info-artwork-video-rant': 'Video rant',
  'write-prump-list': 'Prump er ekki list', 'write-prump-nyju-fotin': 'Nýju fötin', 'write-prump-fésarumræð': 'Fésarumræða',
  'tsh-bio-en': 'Bio, English', 'tsh-bio-is': 'Bio, Icelandic', Konsulat: 'Invaders', 'konsulat-credit': 'Credits',
  'ae-karolina': 'Karólína — project form, 2015', 'write-rant-myndlist': 'Rant — myndlist, 2010',
  'programme-2012-02-papay-gyro-nights': 'Programme', 'poster-2012-02-papay-gyro-nights': 'Poster',
}

/* press documents whose file name carries no publication */
const PRESS = {
  'press-olafur-ruv': 'RÚV Rás 2 — 700IS Hreindýraland, 2008',
  'press-dv': 'DV — before the interview, 2010',
  'press-interview-nuclear-bunker': 'Nuclear bunker selection — interview, 2011',
  'press-magmart-interview': 'Magmart — interview on Mute, 2012',
  'press-interview-tsh-bast-2012': 'Bast — Two Step Horror interview, 2012',
  'press-svartval-en': 'Svartval — artist text, 2013',
  'press-interview-2013-en-01': 'Fascinated by the Beauty in Darkness — interview, 2013',
  'press-interview-2013-en-02': 'Fascinated by the Beauty in Darkness — interview, 2013',
  'press-rant-2013-01': 'Rant — on music and art, 2013', 'press-rant-2013-02': 'Rant — on music and art, 2013',
  'press-interview-straumur': 'Straumur — Two Step Horror interview, 2014',
  'tsh-review-vb': 'Review — Two Step Horror, 2010',
  'tsh-review-lrm': 'TPR Mag — Two Step Horror, Bad Sides and Rejects, 2012',
  'comment-is-facebook-sigurbjorg-einisdottir': 'Facebook — Sigurbjörg Einisdóttir, comment',
}

/* "Fréttablaðið — 48 stundir í Berlín (2)" → part 2 */
const part = (title) => /\((\d+)\)\s*$/.exec(title)?.[1]

export function pressTitle(doc) {
  const s = stem(doc)
  if (PRESS[s]) return PRESS[s]
  let t = doc.rawTitle.replace(/\s*\(\d+\)\s*$/, '')
  t = t.replace(/^(mbl|dv)\b/i, (m) => PUBLICATION[m.toLowerCase()] ?? m)
  const year = doc.date?.slice(0, 4)
  return year && !t.includes(year) ? `${t}, ${year}` : t
}

/* the document's own name with its kind taken off: "Resume, art" → "art", "Erasmus, application" → "application" */
const bare = (doc) => {
  const raw = (CHAPTER[stem(doc)] ?? doc.rawTitle).replace(/^!\s*/, '').replace(/_/g, ' ').trim()
  if (CHAPTER[stem(doc)]) return raw
  const k = doc.kind
  if (k && raw.toLowerCase() === k.toLowerCase()) return ''
  if (k && raw.toLowerCase().startsWith(`${k.toLowerCase()}, `)) return raw.slice(k.length + 2)
  return raw
}
/* kinds whose name belongs in front of a bare title: "Birna" → "Recommendation — Birna" */
const NAMED_KIND = ['REC', 'INV', 'REG', 'TST', 'SKL', 'APP', 'ERA']

/* a document's title on the shelf (alone) */
export function titleOf(doc) {
  if (doc.folder === 'press') return pressTitle(doc)
  const kind = doc.code === 'RES' || doc.code === 'CV' ? 'CV' : doc.kind
  const name = bare(doc)
  const year = doc.date?.slice(0, 4)
  let t = !name ? (kind || doc.rawTitle) : kind && (doc.rawTitle.toLowerCase().startsWith(`${doc.kind?.toLowerCase()}, `) || NAMED_KIND.includes(doc.code)) && !CHAPTER[stem(doc)] ? `${kind} — ${name}` : name
  if (year && doc.folder !== 'schooling' && !t.includes(year)) t = `${t}${t.includes(' — ') ? ', ' : ' — '}${year}`
  return cap(t)
}

/* a document's name inside its book */
export function chapterOf(doc, book) {
  if (doc.folder === 'press') {
    const n = part(doc.rawTitle) ?? /-0(\d)$/.exec(stem(doc))?.[1]
    return n ? `Part ${n}` : pressTitle(doc)
  }
  if (book.key === 'cover-letters') return cap(doc.collection === 'letters' ? `${doc.rawTitle.toLowerCase()} (template)` : bare(doc))
  const label = cap(bare(doc) || (doc.code === 'RES' || doc.code === 'CV' ? 'CV' : doc.kind || 'Untitled'))
  /* in a book of one kind and one year, the day tells the chapters apart */
  return /^(cv|about|grant)-/.test(book.key) && doc.date?.length > 4 ? `${label}, ${fmtDate(doc.date)}` : label
}

/* sub-shelves (user, 2026-11-04: Work → "sub categories of writing, lyrics, poems etc."): a shelf can carry a second
   level; the book takes its first chapter's */
export const SUBSHELVES = {
  work: [
    { id: 'writing', label: 'Writing' },
    { id: 'lyrics', label: 'Lyrics' },
    { id: 'art-texts', label: 'Art texts' },
    { id: 'portfolio', label: 'Portfolio & prints' },
  ],
}
export function subOf(doc) {
  if (doc.folder !== 'work') return null
  if (['WRI', 'NTS'].includes(doc.code)) return 'writing'
  if (['LYR', 'MUS'].includes(doc.code) || stem(doc).startsWith('tsh-bio')) return 'lyrics'
  if (['PRT', 'PRN'].includes(doc.code)) return 'portfolio'
  return 'art-texts'
}

export { schoolYear }
