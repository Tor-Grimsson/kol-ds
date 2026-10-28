import { parse as parseYaml } from 'yaml'
import MEDIA from './portfolio-manifest.json'
import { WORK_BASE } from './bucket'

/**
 * Portfolio loader — reads ../../data/portfolio/NN-<id>.md (frontmatter + body).
 *
 * Files are globbed eagerly as raw strings and sorted by filename, so the `NN-`
 * prefix sets the editorial order. Frontmatter (title, year, role, summary, tags,
 * image, href) drives the grid cards; `body` is the markdown case study.
 *
 * MEDIA (portfolio-manifest.json) indexes the locally-downloaded shots under
 * public/bucket/work/<id>/. We prefer the local hero over the remote Sanity URL:
 * local files load instantly and, crucially, render in the headless PDF export
 * (remote images don't reliably resolve before Chrome prints).
 */
const files = import.meta.glob('../../data/portfolio/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/* WHERE THE SHOTS LOAD FROM: R2 kol-media `work/<id>/` (lib/bucket.js — the PDF export builds them local). */
export const PORTFOLIO_BASE = WORK_BASE

/** Local hero path for a project, or null if it hasn't been scraped. */
function localHero(id) {
  const hero = (MEDIA[id] ?? []).find((n) => n.startsWith('hero.'))
  return hero ? `${PORTFOLIO_BASE}/${id}/${hero}` : null
}

/** All locally-downloaded media filenames for a project (hero + gallery). */
export const getMedia = (id) => MEDIA[id] ?? []

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw.trim() }
  return { data: parseYaml(m[1]) ?? {}, body: m[2].trim() }
}

export const PROJECTS = Object.keys(files)
  .sort()
  .map((path) => {
    const { data, body } = splitFrontmatter(files[path])
    const id = path.split('/').pop().replace(/\.md$/, '').replace(/^\d+-/, '')
    // Public case-study URL. The in-app grid links to the local /portfolio/:id
    // route, but the exported kit is read off paper — it needs an absolute link
    // that resolves. Derived from the id (slugs match kolkrabbi.io/work/), with
    // a `work:` frontmatter override for the projects that live elsewhere.
    const work = data.work ?? `https://kolkrabbi.io/work/${id}`
    return { id, ...data, work, image: localHero(id) ?? data.image, body }
  })

export const getProject = (id) => PROJECTS.find((p) => p.id === id)
