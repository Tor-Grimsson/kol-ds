/* The MD export: the source body under the export frontmatter — kol-print's kol-print.js (dotfiles), verbatim. */
import { frontmatter } from './flow.js'

export function toMarkdown(src, { meta = {}, studio = {}, doc } = {}) {
  const { fm, body } = frontmatter(src)
  const y = (v) => (/[:#'"]/.test(v) ? JSON.stringify(v) : v)
  const lines = [['title', `${doc} ${meta.project}`], ['document', doc], ['type', fm.type], ['status', fm.status], ['updated', fm.updated],
    ['description', fm.description], ['client', meta.client], ['contact', meta.contact], ['designer', studio.studio ? `${studio.studio}, ${studio.designer}` : undefined], ['dates', meta.dates]]
    .filter(([, v]) => v).map(([k, v]) => `${k}: ${y(v)}`)
  const tags = (fm.tags || []).map((t) => `  - ${t}`)
  return `---\n${lines.join('\n')}\n${tags.length ? 'tags:\n' + tags.join('\n') + '\n' : ''}---\n${body.startsWith('\n') ? '' : '\n'}${body}`
}
