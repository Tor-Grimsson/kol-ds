/**
 * Case helper — shared between the Type Lab editor and TypeBlock.
 *
 * Lifted out of `editor/modes/type/cuts.js` so DS + framework no longer
 * reach into the editor for these shared utilities (phase 7 backwards-dep
 * cleanup). Type-lab's `cuts.js` re-exports from here. The Right Grotesk
 * WEIGHTS list and `familyFor` left with the static cut system (2026-11-18,
 * variable fonts; the old file is in _tmp/2026-11-18-static-cuts-2/).
 */

export const applyCase = (text, c) => {
  if (c === 'upper')    return text.toUpperCase()
  if (c === 'lower')    return text.toLowerCase()
  if (c === 'sentence') return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  if (c === 'title')    return text.replace(/(^|[\s\-–—("“‘'/])(\p{L})/gu, (_, a, b) => a + b.toUpperCase())
  return text
}
