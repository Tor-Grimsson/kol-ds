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
 * signoff, body: [paragraphs], …_is twins }.
 *
 * THE SEAM (ResumeKit, 2026-10-28): the files are the app's — it globs its own letters and hands them in as
 * `{ [path]: raw }` (a Vite `import.meta.glob(…, { query: '?raw', import: 'default', eager: true })` is exactly that);
 * `parseLetters` is the loader above, unchanged, over what it is given.
 */
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

export const parseLetters = (files = {}) => Object.keys(files)
  .sort()
  .map((path) => {
    const { data, body } = splitFrontmatter(files[path])
    const id = path.split('/').pop().replace(/\.md$/, '').replace(/^\d+-/, '')
    return { id, ...data, body: toParagraphs(body) }
  })
