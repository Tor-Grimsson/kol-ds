---
title: kol-scrape — all-purpose presence/press scraper package
type: plan
status: superseded
updated: 2026-07-03
description: One versioned scraper CLI to replace the copies carried between client projects — wide scope (press entries, mentions, timelines, site/social presence), structured output. Brand coupling lives only in a thin adapter that maps scrape records onto brand-manifest draft fields.
tags:
  - domain/design-system
  - domain/tooling
related:
  - "[[2026-07-03-kol-brand|kol-brand (manifest schema + packages)]]"
---

# kol-scrape — all-purpose presence/press scraper

Agreed direction 2026-07-03. The scraper is a **general research tool**, not a
brand-manifest emitter — it grabs **press entries, mentions, timelines**, and
site/social presence for any subject. Contact/favicon/palette extraction is
secondary. Because the scope is wide, the package is **not** brand-named:
`@kolkrabbi/kol-scrape`.

## Why a package (and not a skill, and not copies)

- It's deterministic code with a lifecycle, currently **copied between client
  projects** — the same disease the media client had. One versioned CLI kills
  the copies: `npx @kolkrabbi/kol-scrape <url|query>`.
- A **skill alone** is the wrong home: an agent re-deriving scraping code every
  run, with drift each time. The right split is **hybrid** — the CLI does the
  mechanical work; a thin **skill** wraps invocation and does the judgment pass
  (canonical logo among candidates, signal vs noise in mentions).

## Scope

- Press entries + mentions (log source, date, title, link, excerpt).
- Timeline assembly from dated records.
- Site/social presence sweep (pages, handles, og-meta; favicon/palette as
  secondary extras).
- **Structured output**: scrape records in a stable JSON shape — the tool's own
  contract, versioned with the package.

## Brand integration = adapter, not identity

A thin adapter (in the brand tooling, not in kol-scrape) maps scrape records →
[[2026-07-03-kol-brand|brand-manifest]] draft fields (`presence`, `press`,
`timeline`). The scraper stays subject-agnostic; the manifest schema stays the
brand keystone: *the template conforms to it, the scraper feeds it, stationery
consumes it, the styleguide renders it.*

## Decisions taken (at execution)

1. Runtime: **plain fetch + regex extraction, zero deps** — the only found
   existing scraper was a Python one-off image downloader (nothing portable),
   so v1 is fresh; Playwright upgrade path noted in the README for JS-heavy
   sources.
2. Record schema **v1 frozen**: `kol-scrape/v1` — title/h1/description/
   canonical/lang, og/twitter maps, favicons, feeds, social profiles, link
   counts.

## Status

**Executed 2026-07-03** — `packages/scrape/` built (`kol-scrape` bin +
pure `extract()` + **catalog mode**, the Squarespace `?format=json` trick
ported from the another-creation scraper, with `--download`), verified live
against kolkrabbi.io, grapevine.is, and another-creation.com. **Adapter done:**
`draftFromScrape` in `@kolkrabbi/kol-brand-template/adapter` (scrape record →
partial manifest; verified end-to-end scrape→draft→validate). **Curation skill
done:** `kol-press-research` in the dotfiles repo (`claude/skills/`) — the
judgment half, emitting manifest-shaped press/timeline entries. Changesets
staged. See
[[../session-log/2026-07-03-brand-tier-media-lobby-and-perf|the session log]].
Arc closed.
