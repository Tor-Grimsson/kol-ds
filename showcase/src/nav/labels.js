/**
 * labels.js — THE slug/identifier → display label rule. One copy.
 *
 * WHY IT EXISTS (user ruling 2026-08-01): *"Everywhere there is clashing
 * conventions, spelling errors, its very amateur that you cant start a sentence
 * or word with a Capital? or Create a space between CreateButton.jsx or
 * whatever [ Create Button ]"*.
 *
 * `label()` was written TWICE, byte-identical, in `shell-nav.js` and
 * `vault.js` — the left rail's chapter labels and the vault tree's group
 * labels, one rule, two homes. Both carried the same comment explaining the
 * no-auto-text-transform law, which is how you know it was copied. A rule kept
 * in two places is a rule that will disagree with itself; it is the same defect
 * the rail ladder and the glyph ladders were both born from.
 *
 * CASING IS AUTHORED AT THE DATA LAYER, never by CSS. KOL forbids
 * `text-transform` on a component (a string is authored in the case it renders)
 * — so a derived label is cased HERE, where the string is made.
 */

/**
 * A folder/file slug → its display label.
 *
 *   `01-foundations`    → `Foundations`
 *   `layout-breakpoints` → `Layout breakpoints`
 *   `CreateButton.jsx`   → `Create Button`
 *   `used_in`            → `Used in`
 *
 * PascalCase is split on the case boundary and KEPT capitalised — `MediaCard`
 * is a two-word name, not a sentence, and `Media Card` is how it reads out
 * loud. Everything else is sentence case: first letter up, the rest as authored.
 *
 * Runs of capitals stay whole: `KOLButton` → `KOL Button`, not `K O L Button`.
 */
export const labelFromSlug = (seg) => {
  if (!seg) return ''

  const stem = String(seg)
    .replace(/\.(jsx?|tsx?|mdx?|css|md)$/i, '')   // a label is not a filename
    .replace(/^\d+-/, '')                          // the numeric sort prefix
    .trim()

  /* PascalCase / camelCase → spaced, capitals preserved. The lookahead pair
   * handles `KOLButton` (capital run then a word) and `MediaCard` (word then a
   * capital) without splitting the run itself. */
  const isCompound = /^[A-Za-z]+$/.test(stem) &&
    (/[a-z][A-Z]/.test(stem) || /[A-Z]{2}[a-z]/.test(stem))
  if (isCompound) {
    return stem
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  }

  const words = stem.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export default labelFromSlug
