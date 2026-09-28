/**
 * createIndex + search — the ranker.
 *
 * An item is any object with an `id` and a `title`; the rest is optional and passes through
 * untouched: `kind · space · category · tags[] · headings[] · keywords[] · description · body ·
 * date ('YYYY-MM-DD') · href`.
 *
 * Every text term must match somewhere (AND); a negated term must match nowhere. Each term
 * scores the BEST field it hits, and every hit is returned as a reason, so a UI can say why a
 * result ranked where it did. Filters are AND across fields, OR within one field.
 */
import { norm, singular, highlightRanges } from './text.js'
import { parseQuery } from './query.js'

/* the field ladder — a title hit outranks a tag hit outranks a body hit */
export const WEIGHTS = {
  titleExact: 100,
  titlePrefix: 60,
  titleWord: 40,
  title: 25,
  tagExact: 30,
  tag: 12,
  heading: 15,
  keyword: 10,
  description: 8,
  body: 3,
}

const DEFAULT_FACETS = ['space', 'kind', 'category', 'tags']
const DEFAULT_SMART = ['category', 'kind', 'space']
const list = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v])

export function createIndex(items = [], { facets = DEFAULT_FACETS, smart = DEFAULT_SMART, aliases = {} } = {}) {
  const records = items.map((item) => ({
    item,
    title: norm(item.title),
    words: norm(item.title).split(/[^a-z0-9]+/).filter(Boolean),
    /* camelCase names split too, so `Anatomy` in ColorAnatomy is a word start */
    camelWords: String(item.title ?? '').split(/(?=[A-Z][a-z])|[^A-Za-z0-9]+/).map(norm).filter(Boolean),
    tags: list(item.tags).map(norm),
    headings: list(item.headings).map(norm),
    keywords: list(item.keywords).map(norm),
    description: norm(item.description),
    body: norm(item.body),
    facets: Object.fromEntries(facets.map((f) => [f, list(item[f]).map(String)])),
  }))

  /* smart terms: a facet value, singularised, names its filter. Earlier facets in `smart` win a
   * clash — `components` as a space and a kind reads as the first listed. Explicit aliases win all. */
  const vocabulary = new Map()
  for (const field of [...smart].reverse()) {
    for (const r of records) for (const v of r.facets[field] ?? []) vocabulary.set(singular(norm(v)), { field, value: v })
  }
  for (const [word, target] of Object.entries(aliases)) vocabulary.set(singular(norm(word)), target)

  return { records, facets, vocabulary }
}

function scoreTerm(r, raw) {
  const t = norm(raw)
  const reasons = []
  if (r.title === t) reasons.push(['title', 'titleExact'])
  else if (r.title.startsWith(t)) reasons.push(['title', 'titlePrefix'])
  else if (r.words.some((w) => w.startsWith(t)) || r.camelWords.some((w) => w.startsWith(t))) reasons.push(['title', 'titleWord'])
  else if (r.title.includes(t)) reasons.push(['title', 'title'])
  const tag = r.tags.find((x) => x === t) ?? r.tags.find((x) => x.includes(t))
  if (tag) reasons.push(['tags', tag === t ? 'tagExact' : 'tag', tag])
  const heading = r.headings.find((h) => h.includes(t))
  if (heading) reasons.push(['headings', 'heading', heading])
  const keyword = r.keywords.find((k) => k.includes(t))
  if (keyword) reasons.push(['keywords', 'keyword', keyword])
  if (r.description.includes(t)) reasons.push(['description', 'description'])
  if (r.body.includes(t)) reasons.push(['body', 'body'])
  return reasons.map(([field, rung, hit]) => ({ term: raw, field, rung, weight: WEIGHTS[rung], ...(hit ? { hit } : {}) }))
}

const passes = (r, filters, exclude, date, skip) => {
  for (const [field, values] of Object.entries(filters)) {
    if (field === skip || !values?.length) continue
    const have = (r.facets[field] ?? list(r.item[field]).map(String)).map(norm)
    if (!values.some((v) => have.includes(norm(v)))) return false
  }
  for (const [field, values] of Object.entries(exclude)) {
    const have = (r.facets[field] ?? list(r.item[field]).map(String)).map(norm)
    if (values.some((v) => have.includes(norm(v)))) return false
  }
  const d = r.item.date
  if (date.after && !(d && d >= date.after)) return false
  if (date.before && !(d && d <= date.before)) return false
  return true
}

const merge = (...bags) => {
  const out = {}
  for (const bag of bags) for (const [k, v] of Object.entries(bag ?? {})) out[k] = [...new Set([...(out[k] ?? []), ...list(v)])]
  return out
}

/**
 * @param index   createIndex(...)
 * @param query   a string (parsed here, with smart terms) or a parseQuery() result
 * @param opts    { scope: { field: values } — the UI's hard scope, filters: { … } — chips, limit }
 * @returns { query, results: [{ item, score, reasons, highlights }], facets: { field: [{ value, count, selected }] }, total }
 */
export function search(index, query = '', { scope = {}, filters = {}, limit = Infinity } = {}) {
  const q = typeof query === 'string' ? parseQuery(query, index) : query
  const allFilters = merge(scope, q.filters, filters)
  const positive = q.terms.filter((t) => !t.negate)
  const negative = q.terms.filter((t) => t.negate)

  const textHits = []
  for (const r of index.records) {
    if (negative.some((t) => scoreTerm(r, t.value).length)) continue
    const reasons = []
    let score = 0
    let ok = true
    for (const t of positive) {
      const hits = scoreTerm(r, t.value)
      if (!hits.length) { ok = false; break }
      score += Math.max(...hits.map((h) => h.weight))
      reasons.push(...hits)
    }
    if (ok) textHits.push({ r, score, reasons })
  }

  const results = textHits
    .filter(({ r }) => passes(r, allFilters, q.exclude, q.date))
    .sort((a, b) => b.score - a.score || String(a.r.item.title).localeCompare(String(b.r.item.title)))
    .map(({ r, score, reasons }) => ({
      item: r.item,
      score,
      reasons,
      highlights: { title: highlightRanges(r.item.title, positive.map((t) => t.value)) },
    }))

  /* disjunctive facets: each field is counted with every OTHER filter applied, so picking one
   * value never hides its siblings */
  const facets = {}
  for (const field of index.facets) {
    const counts = new Map()
    for (const { r } of textHits) {
      if (!passes(r, allFilters, q.exclude, q.date, field)) continue
      for (const v of r.facets[field] ?? []) counts.set(v, (counts.get(v) ?? 0) + 1)
    }
    const selected = (allFilters[field] ?? []).map(norm)
    facets[field] = [...counts.entries()]
      .map(([value, count]) => ({ value, count, selected: selected.includes(norm(value)) }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  }

  return { query: q, results: results.slice(0, limit), facets, total: results.length }
}
