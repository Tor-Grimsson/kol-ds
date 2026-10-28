/* VOYAGER's résumé person — an invented expedition designer, for @kolkrabbi/kol-resume's kit (ResumeKit, 2026-10-28). The
 * shapes are kol-website apps/record's (`data/business-data.js` · `data/records` · `data/info.js`), every value made up and
 * every URL on `.example`. Hand it to `<ResumeProvider person={PERSON} records={RECORDS} contact={CONTACT} … />`. */
export const BIO = {
  fullName: 'Hekla Sveinsdóttir',
  displayName: 'Hekla Sveinsdóttir',
  currentCity: 'Reykjavík, Iceland',
  tagline: 'Expedition designer — maps, kit and the systems that get a team home.',
  tagline_is: 'Leiðangurshönnuður — kort, búnaður og kerfin sem koma hópnum heim.',
  role: 'Expedition Lead & Designer',
  role_is: 'Leiðangursstjóri & hönnuður',
  bio: 'Ten years planning and designing expeditions across the North Atlantic: route maps, field manuals, kit systems and the identity of the outfit that runs them. I work where the plan meets the weather.',
  bio_is: 'Tíu ár við að skipuleggja og hanna leiðangra um Norður-Atlantshaf: leiðarkort, handbækur, búnaðarkerfi og ásýnd fyrirtækisins sem stýrir þeim. Ég vinn þar sem áætlunin mætir veðrinu.',
}

export const SKILLS = [
  { group: 'Field', group_is: 'Vettvangur', items: ['Route planning, glacier travel', 'First response, rescue drills', 'Small-boat navigation'], items_is: ['Leiðaskipulag, jöklaferðir', 'Fyrsta hjálp, björgunaræfingar', 'Siglingar á smábátum'] },
  { group: 'Design', group_is: 'Hönnun', items: ['Cartography and wayfinding', 'Field manuals and print', 'Identity systems'], items_is: ['Kortagerð og leiðarvísun', 'Handbækur og prent', 'Ásýndarkerfi'] },
  { group: 'Tools', group_is: 'Verkfæri', items: ['QGIS, Figma, InDesign', 'React, Vite, Tailwind'], items_is: ['QGIS, Figma, InDesign', 'React, Vite, Tailwind'] },
]

export const LANGUAGES = [
  { language: 'Icelandic', language_is: 'Íslenska', level: 'Native', level_is: 'Móðurmál' },
  { language: 'English', language_is: 'Enska', level: 'Fluent', level_is: 'Reiprennandi' },
  { language: 'Norwegian', language_is: 'Norska', level: 'Conversational', level_is: 'Samræðufær' },
]

export const WORK = [
  { org: 'Voyager Expeditions', year: 2016, ongoing: true, pinned: true, title: 'Founder · Expedition lead', title_is: 'Stofnandi · leiðangursstjóri', location: 'Reykjavík', bullets: ['Runs twelve guided expeditions a year across Iceland and Greenland', 'Designed the route maps, field manuals and kit system every team carries', 'Built the booking site and the identity it sits in'], bullets_is: ['Stýrir tólf leiðsögðum leiðöngrum á ári um Ísland og Grænland', 'Hannaði leiðarkortin, handbækurnar og búnaðarkerfið sem hver hópur ber', 'Smíðaði bókunarvefinn og ásýndina sem hann situr í'] },
  { org: 'North Atlantic Atlas', year: 2013, endYear: 2016, title: 'Cartographer', title_is: 'Kortagerðarmaður', location: 'Tórshavn', bullets: ['Drew the coastal series, 1:50 000, forty sheets', 'Set the atlas type system and its print specification'], bullets_is: ['Teiknaði strandaröðina, 1:50 000, fjörutíu blöð', 'Lagði leturkerfi atlasins og prentlýsingu'] },
  { org: 'Fjallaskóli', year: 2011, endYear: 2013, title: 'Instructor', title_is: 'Leiðbeinandi', location: 'Akureyri', bullets: ['Taught glacier travel and rope work to first-season guides'], bullets_is: ['Kenndi jöklaferðir og línuvinnu nýjum leiðsögumönnum'] },
  { org: 'Hafnarstofa', year: 2009, endYear: 2011, title: 'Junior designer', title_is: 'Hönnuður', location: 'Reykjavík', notes: 'Harbour signage and visitor maps.', notes_is: 'Hafnarskilti og ferðamannakort.' },
]

export const EDUCATION = [
  { title: 'Cartography', field: 'Cartography', degree: 'MSc', org: 'University of the Faroes', year: 2013 },
  { title: 'Visual communication', field: 'Visual communication', degree: 'BA', org: 'Iceland University of the Arts', year: 2009, field_is: 'Grafísk hönnun' },
  { title: 'Upper secondary', org: 'Menntaskólinn', year: 2005, cv: false },
]

export const CONTACT = {
  contact: { email: 'hekla@voyager.example', emailJobs: 'hekla@voyager.example', phone: '+354 555 0142', web: 'voyager.example' },
  social: { linkedin: 'linkedin.example/hekla', github: 'github.example/hekla' },
}

export const PERSON = { BIO, SKILLS, LANGUAGES }
export const RECORDS = { WORK, EDUCATION }

/* the letters and the portfolio, as an app globs them — raw markdown by path */
export const LETTERS = import.meta.glob('./resume/letters/*.md', { query: '?raw', import: 'default', eager: true })
export const PORTFOLIO = import.meta.glob('./resume/portfolio/*.md', { query: '?raw', import: 'default', eager: true })
