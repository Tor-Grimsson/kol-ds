import { useId } from 'react'
import { typeLabCss } from './typeLab.js'

/* THE LAYOUTS' TYPE (LayoutGroup, 2026-10-31). kol-atlas set its lab's type once, in a <style> (apps/lab scale.js):
 * typeLabCss at its value, a `.t-<role>` class per role, the ink from `--lab-ink-*` re-set on every [data-theme] so a
 * light board in a dark page takes light ink. A layout does the same, scoped to its own root, so two layouts on one page
 * can wear two type values. The ink is KOL's text opacity until a brand has its own. In the components layer, so a
 * Tailwind utility on the same element still wins (italic on a quote).
 *
 *   const t = useLayoutType({ type, faces })
 *   <div className={t.className}>{t.style} …<p className="t-body">…</p></div> */
const INKS = ['emphasis', 'strong', 'lede', 'body', 'meta']

export function useLayoutType({ type, faces }) {
  const scope = `kol-layout-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`
  const css = typeLabCss(type, { prefix: 't', faces, inkPrefix: 'kol-layout' })
    .replace(':root {', `.${scope} {`)
    .replace(/^\.t-/gm, `.${scope} .t-`)
  const ink = `.${scope}, .${scope} [data-theme] {\n${INKS.map((i) => `  --kol-layout-ink-${i}: var(--kol-fg-${i});`).join('\n')}\n}`
  return { className: scope, style: <style>{`@layer components {\n${css}\n${ink}\n}`}</style> }
}
