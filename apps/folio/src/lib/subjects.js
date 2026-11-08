/* SUBJECTS — the tags a document earns by what it is about (plan 2026-11-05-library-connections W3.1, W5.1). The audit
 * (scripts/library-audit.mjs, report 2026-11-05) found these names across three or more books: the clients, the bands,
 * the people in them, the schools and places. A document that names one carries its tag; the tag's page lists them all.
 * A subject is matched as a whole word in the document's text, any case; `also` holds the other spellings. */
export const SUBJECTS = [
  /* clients */
  { tag: 'Aftra', kind: 'Client' },
  { tag: 'Another Creation', kind: 'Client' },
  { tag: 'Canalix', kind: 'Client' },
  { tag: 'Casedoc', kind: 'Client' },
  { tag: 'Exmon', kind: 'Client' },
  { tag: 'Flik', kind: 'Client' },
  { tag: 'Kaffistofan', kind: 'Client' },
  { tag: 'Servado', kind: 'Client' },
  { tag: 'Voyager', kind: 'Client' },
  /* bands */
  { tag: 'Konsulat', kind: 'Band' },
  { tag: 'Two Step Horror', kind: 'Band' },
  { tag: 'a & e sounds', kind: 'Band', also: ['a&e sounds'] },
  { tag: 'Rafiðn', kind: 'Band', also: ['rafidn'] },
  /* people */
  { tag: 'Kolbeinn Soffíuson', kind: 'Person' },
  { tag: 'Orri Einarsson', kind: 'Person' },
  { tag: 'Viktor Weisshappel', kind: 'Person' },
  { tag: 'Þóranna Björnsdóttir', kind: 'Person' },
  /* schools and places */
  { tag: 'LHÍ', kind: 'Place', also: ['Listaháskóli Íslands', 'Iceland University of the Arts'] },
  { tag: 'Weißensee', kind: 'Place', also: ['Weissensee'] },
  { tag: 'Berlin', kind: 'Place' },
  { tag: 'Mengi', kind: 'Place' },
  { tag: 'Kaffibarinn', kind: 'Place' },
]

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const MATCHERS = SUBJECTS.map((s) => ({ ...s, re: new RegExp(`(^|[^\\p{L}])(${[s.tag, ...(s.also ?? [])].map(escape).join('|')})(?=[^\\p{L}]|$)`, 'iu') }))

/** the subject tags a text names */
export const subjectsOf = (text = '') => MATCHERS.filter((m) => m.re.test(text)).map((m) => m.tag)

/** a tag's address: its name, lower-case, spaces as hyphens */
export const tagSlug = (tag) => tag.toLowerCase().normalize('NFC').replace(/\s+/g, '-')
