---
"@kolkrabbi/kol-scrape": minor
---

New package: all-purpose presence/press scraper CLI (`kol-scrape <url>`) — emits versioned scrape records (title, og/twitter meta, favicons, feeds, social profiles, link counts) from any URL. Zero dependencies; `extract()` is pure for offline runs. Subject-agnostic: brand-manifest mapping belongs to adapters, not this package. Also ships **catalog mode** (`kol-scrape catalog <url> [--download dir]`) — the Squarespace `?format=json` trick ported from the another-creation scraper: structured catalog records (title/price/image/url per item) + high-res asset download. Replaces the per-project scraper copies.
