/* JSX WHERE DATA IS EXPECTED — one dev warning per place (user 2026-10-24: *"we are literally avoiding this custom per
 * repo shit"*). The Hub's surfaces take data and draw it themselves; an element or a render function handed to one of
 * these props is the hole every drift came through, so it is named once in the console and never silently accepted. */
const warned = new Set()
export function warnJsx(where, note = '') {
  if (!import.meta.env?.DEV || warned.has(where)) return
  warned.add(where)
  console.warn(`kol-shell: ${where} takes data, not JSX — the Hub draws it (2026-10-24). ${note}`.trim())
}
