/* STATIC FIXTURES, NOT LIVE UMAMI. The pages are kol-website metric's /demo-11 verbatim; every `/api/*` call they make
 * is answered here from `fixtures.json` — the responses /demo-11 got when it was captured (2026-10-31). An exact URL
 * wins; otherwise the same call with its time window stripped, choosing the captured window that sits where the asked
 * one does relative to now (so "this period" and "the previous period" stay apart on a later day). */
import FIX from './fixtures.json'

const TIME = ['startAt', 'endAt', 't']
const strip = (path, body) => {
  const u = new URL(path, 'http://x')
  for (const k of TIME) u.searchParams.delete(k)
  u.searchParams.sort()
  let b = ''
  if (body) { try { const j = JSON.parse(body); delete j.parameters?.startDate; delete j.parameters?.endDate; b = JSON.stringify(j) } catch { b = body } }
  return `${u.pathname}?${u.searchParams}::${b}`
}
const endOf = (path, body) => {
  const e = new URL(path, 'http://x').searchParams.get('endAt')
  if (e) return Number(e)
  try { return Date.parse(JSON.parse(body).parameters.endDate) || null } catch { return null }
}

const byShape = new Map()
for (const [k, v] of Object.entries(FIX.responses)) {
  const [head, body] = k.split('::')
  const path = head.slice(head.indexOf(' ') + 1)
  const key = strip(path, body)
  ;(byShape.get(key) ?? byShape.set(key, []).get(key)).push({ end: endOf(path, body), v })
}

const answer = (path, body) => {
  const exact = FIX.responses[`${body ? 'POST' : 'GET'} ${path}${body ? `::${body}` : ''}`]
  if (exact !== undefined) return exact
  const list = byShape.get(strip(path, body))
  if (!list) return null
  const end = endOf(path, body)
  if (end == null || list.length === 1) return list[0].v
  const want = end - Date.now()
  return list.reduce((a, b) => (Math.abs(b.end - FIX.capturedAt - want) < Math.abs(a.end - FIX.capturedAt - want) ? b : a)).v
}

const real = window.fetch.bind(window)
window.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input.url
  const u = new URL(url, window.location.href)
  if (u.origin !== window.location.origin || !u.pathname.startsWith('/api/')) return real(input, init)
  const body = init?.body ?? null
  return Promise.resolve(new Response(JSON.stringify(answer(u.pathname + u.search, body)), { headers: { 'Content-Type': 'application/json' } }))
}
