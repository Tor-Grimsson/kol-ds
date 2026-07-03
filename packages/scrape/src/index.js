/**
 * @kolkrabbi/kol-scrape — all-purpose presence/press scraper.
 *
 * Subject-agnostic: fetch a URL, emit a structured SCRAPE RECORD (v1, shape
 * below). Brand coupling deliberately lives in adapters that map records onto
 * a brand manifest — never in here.
 *
 * Zero dependencies — extraction is regex-based over the raw HTML.
 * ponytail: no DOM parser; fine for meta/link/anchor extraction, upgrade to a
 * real parser (or Playwright for JS-rendered pages) if sources demand it.
 *
 * Record v1:
 *   {
 *     record: 'kol-scrape/v1',
 *     url, finalUrl, fetchedAt, status,
 *     title, h1, description, canonical, lang,
 *     og: {…}, twitter: {…},
 *     favicons: [urls], feeds: [{ href, type, title }],
 *     profiles: { platform → url },   // social links found on the page
 *     links: { internal, external },  // counts
 *   }
 */

const PLATFORMS = {
  instagram: /instagram\.com\/([^/?#"']+)/i,
  youtube: /youtube\.com\/(@[^/?#"']+|channel\/[^/?#"']+|user\/[^/?#"']+)/i,
  tiktok: /tiktok\.com\/(@[^/?#"']+)/i,
  x: /(?:twitter|x)\.com\/([^/?#"']+)/i,
  facebook: /facebook\.com\/([^/?#"']+)/i,
  linkedin: /linkedin\.com\/(?:in|company)\/([^/?#"']+)/i,
  github: /github\.com\/([^/?#"']+)/i,
  bandcamp: /([^/?#"']+)\.bandcamp\.com/i,
  discogs: /discogs\.com\/(?:artist|label)\/([^/?#"']+)/i,
  vimeo: /vimeo\.com\/([^/?#"']+)/i,
  behance: /behance\.net\/([^/?#"']+)/i,
  dribbble: /dribbble\.com\/([^/?#"']+)/i,
}

const decode = (s = '') => s
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .trim()

/* All <meta> tags → [{ key, content }] where key = property|name (lowercase).
 * Attribute-order-agnostic: grab the tag, then pull attrs individually. */
function metaTags(html) {
  const out = []
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    const content = tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1]
    if (key && content !== undefined) out.push({ key, content: decode(content) })
  }
  return out
}

function linkTags(html) {
  const out = []
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = tag.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1]
    const type = tag.match(/type\s*=\s*["']([^"']+)["']/i)?.[1]
    const title = tag.match(/title\s*=\s*["']([^"']+)["']/i)?.[1]
    if (rel && href) out.push({ rel, href, type, title })
  }
  return out
}

const abs = (href, base) => { try { return new URL(href, base).href } catch { return href } }

/** Extract a scrape record from raw HTML (pure — no fetching). */
export function extract(html, { url = '', finalUrl = url, status = null, fetchedAt = null } = {}) {
  const metas = metaTags(html)
  const links = linkTags(html)
  const pick = (k) => metas.find((m) => m.key === k)?.content

  const og = {}
  const twitter = {}
  for (const m of metas) {
    if (m.key.startsWith('og:')) og[m.key.slice(3)] = m.content
    if (m.key.startsWith('twitter:')) twitter[m.key.slice(8)] = m.content
  }

  // Social profile links anywhere in the document (hrefs only).
  const profiles = {}
  for (const [, href] of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    for (const [platform, re] of Object.entries(PLATFORMS)) {
      if (!profiles[platform] && re.test(href)) profiles[platform] = abs(href, finalUrl)
    }
  }

  let internal = 0
  let external = 0
  const host = (() => { try { return new URL(finalUrl).host } catch { return '' } })()
  for (const [, href] of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    try { new URL(href, finalUrl).host === host ? internal++ : external++ } catch { /* skip */ }
  }

  return {
    record: 'kol-scrape/v1',
    url,
    finalUrl,
    fetchedAt,
    status,
    title: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || undefined,
    h1: decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '').replace(/<[^>]+>/g, '')) || undefined,
    description: pick('description') || og.description || undefined,
    canonical: links.find((l) => l.rel === 'canonical')?.href,
    lang: html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1],
    og: Object.keys(og).length ? og : undefined,
    twitter: Object.keys(twitter).length ? twitter : undefined,
    favicons: links.filter((l) => l.rel.includes('icon')).map((l) => abs(l.href, finalUrl)),
    feeds: links
      .filter((l) => l.rel === 'alternate' && /rss|atom|json/i.test(l.type ?? ''))
      .map((l) => ({ href: abs(l.href, finalUrl), type: l.type, title: l.title })),
    profiles: Object.keys(profiles).length ? profiles : undefined,
    links: { internal, external },
  }
}

/** Fetch a URL and extract its scrape record. */
export async function scrape(url, { signal, userAgent = 'kol-scrape/0.1 (+https://kolkrabbi.io)' } = {}) {
  const res = await fetch(url, { signal, headers: { 'user-agent': userAgent }, redirect: 'follow' })
  const html = await res.text()
  return extract(html, {
    url,
    finalUrl: res.url || url,
    status: res.status,
    fetchedAt: new Date().toISOString(),
  })
}

/** Scrape several URLs; failures become { url, error } records, never throws. */
export async function scrapeMany(urls, opts) {
  return Promise.all(urls.map((u) => scrape(u, opts).catch((e) => ({ record: 'kol-scrape/v1', url: u, error: String(e) }))))
}

/**
 * Squarespace catalog scrape — the `?format=json` trick (ported from the
 * another-creation scraper): any Squarespace collection/shop page serves its
 * structured catalog as JSON, no HTML parsing. Returns a catalog record:
 *
 *   { record: 'kol-scrape/catalog-v1', url, fetchedAt, source: 'squarespace',
 *     collection, count, items: [{ title, price, currency, image, url }] }
 *
 * `image` is the high-res assetUrl; price comes from variants[0].priceMoney.
 */
export async function squarespaceCatalog(url, { signal, userAgent = 'kol-scrape/0.1 (+https://kolkrabbi.io)' } = {}) {
  const base = url.replace(/\/$/, '')
  const res = await fetch(`${base}?format=json`, { signal, headers: { 'user-agent': userAgent }, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const items = (data.items ?? []).map((it) => ({
    title: it.title ?? 'Untitled',
    price: it?.variants?.[0]?.priceMoney?.value ?? null,
    currency: it?.variants?.[0]?.priceMoney?.currency ?? null,
    image: it.assetUrl ?? null,
    url: it.fullUrl ? abs(it.fullUrl, base) : undefined,
  }))
  return {
    record: 'kol-scrape/catalog-v1',
    url,
    fetchedAt: new Date().toISOString(),
    source: 'squarespace',
    collection: data.collection?.title,
    count: items.length,
    items,
  }
}

/** Filesystem-safe filename from an item title (ported behavior). */
export const safeName = (title = 'untitled') =>
  [...title].filter((c) => /[a-z0-9 \-_]/i.test(c)).join('').replace(/ /g, '_') || 'untitled'
