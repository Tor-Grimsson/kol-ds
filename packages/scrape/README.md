# @kolkrabbi/kol-scrape

All-purpose presence/press scraper — fetch a URL, emit a **structured scrape record**. Subject-agnostic by design: brand coupling (mapping records onto a brand manifest's `presence`/`press`/`timeline` fields) lives in adapters, never in this package. Zero dependencies, Node ≥ 18.

```
npx @kolkrabbi/kol-scrape kolkrabbi.io
kol-scrape https://kolkrabbi.io https://grapevine.is --out records.json
kol-scrape catalog https://www.another-creation.com/shop-now --download ./assets
```

```js
import { scrape, scrapeMany, extract } from '@kolkrabbi/kol-scrape'
const record = await scrape('https://kolkrabbi.io')
```

## Record v1

```
{
  record: 'kol-scrape/v1',
  url, finalUrl, fetchedAt, status,
  title, h1, description, canonical, lang,
  og: { title, image, … },        // og:* meta
  twitter: { card, … },           // twitter:* meta
  favicons: [urls],
  feeds: [{ href, type, title }], // RSS/Atom/JSON alternates
  profiles: { instagram: url, youtube: url, … },  // social links found on the page
  links: { internal, external },  // anchor counts
}
```

`extract(html, ctx)` is pure (no fetching) — feed it saved HTML for offline runs. `scrapeMany` never throws; failures come back as `{ url, error }` records.

## Catalog mode (Squarespace)

`kol-scrape catalog <url>` uses Squarespace's `?format=json` trick — any collection/shop page serves its structured catalog directly, no HTML parsing (ported from the another-creation scraper). Record `kol-scrape/catalog-v1`: `{ collection, count, items: [{ title, price, currency, image, url }] }`. `--download <dir>` saves each item's high-res image, named by sanitized title.

## Scope & ceilings

- Regex extraction over raw HTML — right for meta/link/anchor mining; JS-rendered pages need a browser pass (Playwright) if a source ever demands it.
- Press/mention *search* across outlets is a judgment-heavy task: drive this CLI from a skill/agent that curates its output. The CLI stays mechanical.
