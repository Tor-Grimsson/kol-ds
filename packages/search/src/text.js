/** Lowercase, accents folded — `Café` and `cafe` are one word to the index. */
export const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')

/** A plain English singular, enough for facet names: atoms → atom, categories → category, boxes → box. */
export const singular = (w) => {
  if (w.length <= 3) return w
  if (w.endsWith('ies')) return `${w.slice(0, -3)}y`
  if (/(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2)
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

/** Every occurrence of every term in `text`, as merged `[start, end]` ranges — for highlighting. */
export function highlightRanges(text = '', terms = []) {
  const hay = norm(text)
  const ranges = []
  for (const t of terms) {
    const needle = norm(t)
    if (!needle) continue
    for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + needle.length)) ranges.push([i, i + needle.length])
  }
  ranges.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([...r])
  }
  return merged
}
