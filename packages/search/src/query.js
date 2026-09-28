/**
 * parseQuery — the query box's language, read into data the ranker and the UI both use.
 *
 *   button                 a text term
 *   "exact phrase"         a text term, never read as a filter
 *   -legacy                a text term that must NOT match
 *   tag:layout  #layout    a filter on a facet (tag · kind · space · category, and their aliases)
 *   in:docs  is:component  aliases for space: and kind:
 *   -tag:draft             an excluded facet value
 *   after:2026-09-01       a date bound (before: too), compared as ISO strings
 *   atom                   a SMART term: a bare word that names a facet value in the index
 *                          (`atom` → category: Atoms) becomes that filter; quote it to search the text
 *
 * Every token is kept with how it was read (`tokens`), so a UI can show the reading back as chips.
 */
import { norm, singular } from './text.js'

export const FIELD_ALIASES = {
  tag: 'tags', tags: 'tags', '#': 'tags',
  kind: 'kind', is: 'kind', type: 'kind',
  space: 'space', in: 'space',
  category: 'category', cat: 'category',
}

const TOKEN = /(-?)(?:([a-z]+):)?(?:"([^"]*)"|(#?[^\s"]+))/gi

export function parseQuery(input = '', index = null) {
  const out = { input, terms: [], filters: {}, exclude: {}, date: {}, tokens: [] }
  const add = (bucket, field, value) => ((bucket[field] ||= []).includes(value) ? null : bucket[field].push(value))

  for (const m of String(input).matchAll(TOKEN)) {
    const [raw, neg, prefix, quoted, bare] = m
    const negate = neg === '-'
    const key = prefix?.toLowerCase()

    if (key === 'after' || key === 'before') {
      const value = quoted ?? bare
      out.date[key] = value
      out.tokens.push({ raw, kind: 'date', field: key, value })
      continue
    }

    if (bare?.startsWith('#') && !key && bare.length > 1) {
      const value = bare.slice(1)
      add(negate ? out.exclude : out.filters, 'tags', value)
      out.tokens.push({ raw, kind: 'filter', field: 'tags', value, negate, via: 'hash' })
      continue
    }

    const field = key ? FIELD_ALIASES[key] : null
    if (field) {
      const value = quoted ?? bare
      add(negate ? out.exclude : out.filters, field, value)
      out.tokens.push({ raw, kind: 'filter', field, value, negate, via: 'prefix' })
      continue
    }

    /* an unknown `word:` prefix is text — `http://…` or `a:b` must not vanish */
    const value = key ? raw.replace(/^-/, '') : (quoted ?? bare)
    if (!value) continue

    if (!quoted && !negate && index) {
      const hit = index.vocabulary.get(singular(norm(value)))
      if (hit) {
        add(out.filters, hit.field, hit.value)
        out.tokens.push({ raw, kind: 'filter', field: hit.field, value: hit.value, negate: false, via: 'smart' })
        continue
      }
    }

    out.terms.push({ value, negate, phrase: Boolean(quoted) })
    out.tokens.push({ raw, kind: 'term', value, negate, phrase: Boolean(quoted) })
  }
  return out
}
