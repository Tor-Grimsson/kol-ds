/**
 * Scrape → manifest adapter — the mechanical half of "the scraper feeds the
 * schema". Maps a @kolkrabbi/kol-scrape v1 presence record onto a PARTIAL
 * brand manifest (meta.url/socials hints + presence). Press/timeline entries
 * are deliberately NOT derived here — they need judgment (subject-vs-author,
 * name collisions, dating); that's the kol-press-research skill's job.
 *
 *   import { draftFromScrape } from '@kolkrabbi/kol-brand-template/adapter'
 *   const record = await scrape('https://client.com')   // @kolkrabbi/kol-scrape
 *   const draft = draftFromScrape(record)               // partial BrandManifest
 */

/* platform → handle extractor (from the profile URL the scraper found). */
const HANDLE = {
  instagram: /instagram\.com\/([^/?#]+)/i,
  tiktok: /tiktok\.com\/(@[^/?#]+)/i,
  youtube: /youtube\.com\/(@[^/?#]+|channel\/[^/?#]+|user\/[^/?#]+)/i,
  x: /(?:twitter|x)\.com\/([^/?#]+)/i,
  github: /github\.com\/([^/?#]+)/i,
  behance: /behance\.net\/([^/?#]+)/i,
  dribbble: /dribbble\.com\/([^/?#]+)/i,
}

/** @returns {import('./schema.js').BrandManifest} partial manifest draft */
export function draftFromScrape(record) {
  if (!record || record.record !== 'kol-scrape/v1') {
    throw new Error('draftFromScrape expects a kol-scrape/v1 record')
  }

  const socials = {}
  for (const [platform, url] of Object.entries(record.profiles ?? {})) {
    const handle = HANDLE[platform]?.exec(url)?.[1]
    if (handle) socials[platform] = handle
  }

  const site = record.canonical ?? record.finalUrl ?? record.url

  return {
    meta: {
      ...(record.og?.site_name || record.title ? { name: record.og?.site_name ?? record.title } : {}),
      ...(site ? { url: site } : {}),
      ...(Object.keys(socials).length ? { socials } : {}),
    },
    presence: {
      ...(site ? { site } : {}),
      ...(record.profiles ? { profiles: record.profiles } : {}),
      ...(record.feeds?.length ? { feeds: record.feeds.map((f) => f.href) } : {}),
    },
  }
}
