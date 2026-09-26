/* The note model — pure, no React (kol-olina's brand notes, lib/notesStore + pages/Notes).
 *
 * A note is a DATABASE ROW, not a file: `{ slug, title, body, favourite, updated_at }`, the body
 * markdown with a frontmatter block. The body is what you typed, so a note stays readable in a
 * database dump years from now. The TITLE lives in the body's frontmatter (`title:`), so one editor
 * and one Save cover both — the row's `title` column is derived on save, never typed twice. */
import { joinFrontmatter, parseFrontmatter } from '@kolkrabbi/kol-component'

const today = () => new Date().toISOString().slice(0, 10)

/** The body a new note starts from. */
export const starterBody = (title) => joinFrontmatter([['title', title], ['date', today()], ['tags', []]], `\n# ${title}\n\n`)

/** The row's title, read off the body: frontmatter `title`, else the first heading, else the fallback. */
export function titleOf(body, fallback = 'Untitled') {
  const fm = parseFrontmatter(body ?? '')
  /* the frontmatter writer quotes a value with punctuation in it; the reader hands the quotes back */
  const t = typeof fm.title === 'string' ? fm.title.trim().replace(/^(["'])(.*)\1$/, '$2') : ''
  if (t) return t
  const h = /^#{1,6}\s+(.+)$/m.exec(String(body ?? '').replace(/^---[\s\S]*?---/, ''))
  return h ? h[1].trim() : fallback
}

/** The body's frontmatter `tags`, lower-cased. */
export function tagsOf(body) {
  const t = parseFrontmatter(body ?? '').tags
  return (Array.isArray(t) ? t : []).map((x) => String(x).trim().toLowerCase()).filter(Boolean)
}

/* markdown → a plain first line or two. Not a renderer: the card wants text. */
export const previewOf = (raw = '') => raw
  .replace(/^---[\s\S]*?---/, '')      /* frontmatter */
  .replace(/^#{1,6}\s+/gm, '')          /* heading marks */
  .replace(/\*\*|__|[*_`>]/g, '')      /* emphasis + code + quote marks */
  .replace(/^\s*[-+]\s+/gm, '• ')      /* list bullets, kept as a glyph */
  .replace(/\|/g, ' ')                  /* table pipes */
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 180)

/* `Some Title` → `some-title-x7k2`, and a timestamp when that leaves nothing. The slug is the
   primary key, so two notes called "Notes" must not collide. */
export const slugFor = (title) => {
  const base = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return base ? `${base}-${Date.now().toString(36).slice(-4)}` : `note-${Date.now().toString(36)}`
}
