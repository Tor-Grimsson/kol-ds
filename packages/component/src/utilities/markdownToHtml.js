/**
 * markdownToHtml — a small, escape-first markdown → HTML renderer for
 * `.kol-prose` (KindPreviewMarkdown, kol-r2b2 2026-08-27 — user: "why is it not
 * rendering in preview using kol-prose?"). No dependency: the theme's prose CSS
 * styles bare tags, so bare tags are what this emits. Covers headings,
 * paragraphs, bold / italic / inline code, links and images, bullet and
 * numbered lists, blockquotes, fenced code, rules and pipe tables. Every
 * character is HTML-escaped before any markup is added; link and image URLs
 * allow http(s), mailto, and relative paths only.
 *
 * ponytail: enough for READMEs and notes; a CommonMark engine is the upgrade if
 * nested lists or reference links turn up.
 */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const safeUrl = (u) => (/^(https?:|mailto:|\/|\.\/|\.\.\/|#|[a-z0-9_-]+(\/|\.|$))/i.test(u.trim()) && !/^javascript:/i.test(u.trim()) ? u.trim() : '#')

export const inlineToHtml = (raw) => {
  let s = esc(raw)
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img alt="${alt}" src="${safeUrl(src)}">`)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `<a href="${safeUrl(href)}">${t}</a>`)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>').replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>')
  return s
}

export default function markdownToHtml(markdown = '') {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const out = []
  let i = 0
  const para = []
  const flush = () => { if (para.length) { out.push(`<p>${inlineToHtml(para.join(' ').trim())}</p>`); para.length = 0 } }
  /* frontmatter at the very top is skipped */
  if (lines[0]?.trim() === '---') { const end = lines.indexOf('---', 1); if (end > 0) i = end + 1 }
  while (i < lines.length) {
    const line = lines[i]; const t = line.trim()
    if (t.startsWith('```')) {
      flush(); const lang = t.slice(3).trim(); const buf = []; i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) buf.push(lines[i++])
      i++; out.push(`<pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre>`); continue
    }
    if (!t) { flush(); i++; continue }
    const h = t.match(/^(#{1,6})\s+(.*)$/)
    if (h) { flush(); out.push(`<h${h[1].length}>${inlineToHtml(h[2])}</h${h[1].length}>`); i++; continue }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { flush(); out.push('<hr>'); i++; continue }
    if (t.startsWith('>')) {
      flush(); const buf = []
      while (i < lines.length && lines[i].trim().startsWith('>')) buf.push(lines[i++].trim().replace(/^>\s?/, ''))
      out.push(`<blockquote>${markdownToHtml(buf.join('\n'))}</blockquote>`); continue
    }
    if (/^[-*+]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
      flush(); const ordered = /^\d+[.)]\s+/.test(t); const items = []
      while (i < lines.length && (/^[-*+]\s+/.test(lines[i].trim()) || /^\d+[.)]\s+/.test(lines[i].trim()))) items.push(lines[i++].trim().replace(/^([-*+]|\d+[.)])\s+/, ''))
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map((it) => `<li>${inlineToHtml(it)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`); continue
    }
    if (t.startsWith('|') && lines[i + 1]?.trim().match(/^\|?\s*:?-{2,}/)) {
      flush(); const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => inlineToHtml(c.trim()))
      const head = cells(t); i += 2; const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]))
      out.push(`<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`); continue
    }
    para.push(t); i++
  }
  flush()
  return out.join('\n')
}
