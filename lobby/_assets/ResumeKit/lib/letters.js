import { parse as parseYaml } from 'yaml'

/**
 * Cover-letter loader — reads ../../data/letters/NN-<id>.md (frontmatter + body).
 *
 * Mirrors portfolio.js: files are globbed eagerly as raw strings and sorted by
 * the `NN-` filename prefix, so the prefix sets picker order (first = default).
 * Frontmatter carries the structured fields (date / recipient / signoff + their
 * `_is` Icelandic twins) plus the Icelandic body (`body_is`); the markdown body
 * is the English prose, split into paragraphs on blank lines.
 *
 * Shape matches what CoverLetter.jsx expects: { id, label, date, recipient,
 * signoff, body: [paragraphs], …_is twins }. NB: adding a NEW .md needs a
 * dev-server restart (data/ is outside the app's watch root — glob membership
 * doesn't hot-update); editing an existing file's text does not.
 */
const files = import.meta.glob('../../data/letters/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw.trim() }
  return { data: parseYaml(m[1]) ?? {}, body: m[2].trim() }
}

/** Markdown body → array of paragraphs (blank-line separated, soft wraps collapsed). */
const toParagraphs = (body) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)

export const LETTERS = Object.keys(files)
  .sort()
  .map((path) => {
    const { data, body } = splitFrontmatter(files[path])
    const id = path.split('/').pop().replace(/\.md$/, '').replace(/^\d+-/, '')
    return { id, ...data, body: toParagraphs(body) }
  })

/** Look up a letter by id; falls back to the first. */
export const getLetter = (id) => LETTERS.find((l) => l.id === id) ?? LETTERS[0]

/** Default letter the page shows. */
export const DEFAULT_LETTER = LETTERS[0]
