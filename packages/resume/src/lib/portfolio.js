import { parse as parseYaml } from 'yaml'

/**
 * Portfolio loader — reads ../../data/portfolio/NN-<id>.md (frontmatter + body).
 *
 * Files are globbed eagerly as raw strings and sorted by filename, so the `NN-`
 * prefix sets the editorial order. Frontmatter (title, year, role, summary, tags,
 * image, href) drives the grid cards; `body` is the markdown case study.
 *
 * MEDIA (portfolio-manifest.json) indexes the locally-downloaded shots under
 * <workBase>/<id>/. We prefer the local hero over the remote Sanity URL:
 * local files load instantly and, crucially, render in the headless PDF export
 * (remote images don't reliably resolve before Chrome prints).
 *
 * THE SEAM (ResumeKit, 2026-10-28): the files, the media index and where the shots load from are the app's —
 * `parsePortfolio(files, { media, workBase, workUrl })`; record's R2 `work/<id>/` and kolkrabbi.io/work/<id> were baked in.
 */
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw.trim() }
  return { data: parseYaml(m[1]) ?? {}, body: m[2].trim() }
}

export function parsePortfolio(files = {}, { media = {}, workBase = '', workUrl } = {}) {
  /** Local hero path for a project, or null if it hasn't been scraped. */
  const localHero = (id) => {
    const hero = (media[id] ?? []).find((n) => n.startsWith('hero.'))
    return hero ? `${workBase}/${id}/${hero}` : null
  }
  return Object.keys(files)
    .sort()
    .map((path) => {
      const { data, body } = splitFrontmatter(files[path])
      const id = path.split('/').pop().replace(/\.md$/, '').replace(/^\d+-/, '')
      // Public case-study URL. The in-app grid links to the local /portfolio/:id
      // route, but the exported kit is read off paper — it needs an absolute link
      // that resolves. `work:` frontmatter wins; else the app's `workUrl(id)`.
      const work = data.work ?? workUrl?.(id)
      return { id, ...data, work, image: localHero(id) ?? data.image, body }
    })
}
