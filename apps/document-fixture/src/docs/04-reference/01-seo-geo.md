---
title: SEO + GEO
type: reference
status: active
updated: 2026-10-19
description: Search and AI visibility, the checklist and the build path.
tags:
  - project/atlas
  - audience/agency-internal
---

# SEO + GEO
%% thumb: link-atlascloud-is-en.png

Search engine optimization and generative engine optimization: the work that makes a site rank in search results and appear in AI answers. Raised by Atlas in the first meeting and included at no charge alongside the website handoff; the developer can take it up or not.

*The step-by-step build path is in [Implementation](#frontdoor--implementation) below.*

## Search basics

The tags and files every public page needs before launch. Search engines read them to index the site, and social platforms read them to build link previews when a page is shared.

| Item | Tag or file | What right looks like |
|---|---|---|
| Page language | `<html lang>` | `is` or `en`, matching the page content |
| Page title | `<title>` | Page name and brand, short and consistent across the site |
| Meta description | `meta description` | One or two sentences in the brand register |
| Canonical URL | `link rel=canonical` | The production address of each page |
| Open Graph tags | `og:type` · `og:site_name` · `og:title` · `og:description` · `og:url` | Filled on every page, matching the title and description |
| Open Graph image | `og:image` | 1200 × 630, absolute URL, with alt text, generated from the brand system |
| X card | `twitter:card` | `summary_large_image`, with the same values as Open Graph |
| Robots meta | `meta robots` | Indexable for public pages; `noindex` for staging and internal routes |
| Robots file | `robots.txt` | Allows the public site, blocks private routes, points to the sitemap |
| Sitemap | `sitemap.xml` | Every public page, generated at build |
| Manifest | `manifest.webmanifest` | Name, description and theme colors for installs and browser chrome |

*Code-formatted names are the literal tags and files in the site's HTML and root folder. Open Graph is the standard social platforms read for link previews; `og:type` declares the content type, usually `website`.*

## AI visibility

What decides whether AI assistants find, read and cite the site. Most of it builds on the search basics, with a few additions specific to how AI crawlers and answer engines work.

| Item | Tag or file | Why it matters |
|---|---|---|
| Structured data | JSON-LD, schema.org | Describes the company, products and FAQ in a form machines read directly |
| Server-rendered content | First HTML response | Many AI fetchers skip JavaScript, so content and metadata must arrive without it |
| AI crawler policy | `robots.txt` | An explicit allow or block per crawler; allowing them is a decision, not a default |
| AI summary | `llms.txt` | A plain summary with key links for AI assistants; emerging, cheap, uncertain in effect |
| Language versions | `hreflang` | Links the Icelandic and English pages so each is served to the right audience |
| Webmaster tools | Search Console · Bing Webmaster Tools | Verified ownership and a submitted sitemap; Bing's index feeds several AI assistants |

*JSON-LD is a block of structured data placed in the page's HTML. The main AI crawlers are GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot (Perplexity) and Google-Extended (Google). Server rendering matters most for a headless build.*

## Social platforms

Connections that let ad platforms verify the domain and measure campaigns. Only relevant if Atlas runs paid campaigns, which the ad templates in M2 suggest is likely.

| Item | Tag or file | What it does |
|---|---|---|
| Meta domain verification | DNS record or meta tag | Proves domain ownership in Meta Business Manager; needed for ads and control over link previews |
| Meta Pixel or Conversions API | Script or server connection | Measures ad results; the Conversions API works server-side |
| LinkedIn Insight Tag | Script | Conversion tracking and retargeting for LinkedIn ads |

*Ad tags set cookies and track visitors, so they bring a consent question that cookieless analytics avoids.*

## Domain records

Records that prove the domain belongs to Atlas and protect email sent from it. Often overlooked at launch, yet they decide whether email lands in the inbox or the spam folder.

| Item | Tag or file | What it does |
|---|---|---|
| SPF | DNS record | Lists the servers allowed to send email for the domain |
| DKIM | DNS record | Signs outgoing email so receivers can verify it; the key comes from the email provider (Google Workspace, Proton…) |
| DMARC | DNS record | Sets the policy for email that fails those checks, with reports; protects against spoofing |
| Search Console verification | DNS record | Proves ownership of the domain to Google |

*All four live wherever the domain's DNS is managed. SPF, DKIM and DMARC together are the standard for email authentication.*

## Analytics

A headless site needs analytics that Atlas chooses and maintains. The options differ on cookies, hosting, cost and who owns the data, which matters for a company selling data sovereignty.

| Tool | Cookieless | Hosting | Cost | Notes |
|---|---|---|---|---|
| Umami | Yes | Self-hosted or cloud | Free self-hosted, paid cloud | Open source; in use at [metrics.kolkrabbi.io](https://metrics.kolkrabbi.io) |
| Plausible | Yes | Cloud or self-hosted | Paid cloud, free self-hosted | Open source, EU-hosted cloud |
| Fathom | Yes | Cloud | Paid | Simple, with an EU isolation option |
| Matomo | Configurable | Self-hosted or cloud | Free self-hosted, paid cloud | Full-featured and heavier to run |
| Google Analytics 4 | No | Cloud | Free | Needs a consent banner; data stays with Google |
| Vercel Web Analytics | Yes | Vercel | Free tier, then paid | Only if the site deploys on Vercel |
| Cloudflare Web Analytics | Yes | Cloudflare | Free | Basic metrics only |

*Cookieless tools usually avoid a consent banner under GDPR; the final call belongs with Atlas's legal advice. Self-hosting keeps the data on Atlas's own infrastructure, in Iceland.*

## Implementation {#implementation}
%% thumb: custom-ui-kolkrabbi-io-sets-metrics-dashboard.png
The path a developer follows to build everything in the checklist above, in order. Each phase points back to its reference table, so the checklist and the steps stay one source.

### 1 Search basics {#impl-search}

Acceptance: Every public page passes a metadata check and the sitemap is live.

The groundwork every page needs before launch. Metadata, share previews and crawl files are set from the Search basics table, so search engines index the site correctly and shared links look right on every platform.

#### Page metadata

Language, title, meta description and canonical URL on every public page, written in the brand register. Values follow the Search basics table and stay consistent with the Open Graph tags.

#### Open Graph

Open Graph tags and the X card on every page, with a 1200 × 630 share image generated from the brand system. Link previews then look deliberate wherever a page is shared.

#### Crawl files

A robots file that allows the public site and blocks private routes, plus a sitemap generated at build. The sitemap is submitted to search tools in the final launch phase.

### 2 AI visibility {#impl-ai}

Acceptance: Structured data validates and key content loads without JavaScript.

What makes the site readable to AI assistants and answer engines. Structured data, server rendering and an explicit crawler policy decide whether the company is found, understood and cited correctly in AI answers about hosting in Iceland.

#### Structured data

JSON-LD blocks describing the organization, its products and frequent questions, following schema.org. Validated with Google's Rich Results Test before launch, then kept in step with every content change on the site.

#### Server rendering

Content and metadata delivered in the first HTML response, so crawlers that skip JavaScript still read every page. For a headless build, this is the single most important technical decision.

#### Crawler policy

Rules in the robots file for each AI crawler, following Atlas's decision, plus an llms.txt summary with key links. Both are small files, easy to revise whenever the policy changes.

### 3 Domain records {#impl-domain}

Acceptance: SPF, DKIM and DMARC all pass and domain ownership is verified.

DNS records that protect the domain and its email. Set up together with whoever manages Atlas's DNS and Google Workspace, since a single wrong record can stop email from reaching customers at all, without any visible warning.

#### Email authentication

SPF, DKIM and DMARC records added in DNS, with the DKIM key taken from the email provider. DMARC starts in monitoring mode, then moves to a stricter policy once reports look clean.

#### Domain verification

DNS records proving ownership to Google Search Console, Bing Webmaster Tools and Meta Business Manager. One verified domain then supports search tools and ad platforms without any further setup work.

### 4 Analytics {#impl-analytics}

Acceptance: Visits are tracked and the dashboard shows live data.

Measuring how the site performs once it is live and in use. The chosen tool runs alongside a dashboard built from existing components, so Atlas reads traffic and conversions without learning a separate analytics platform.

#### Analytics tool

The tool chosen from the Analytics table, installed with one script and, if self-hosted, deployed on Atlas's own infrastructure. Cookieless tools keep the site free of a consent banner entirely.

#### Metrics dashboard

Charts and views from the [metrics dashboard set](https://ui.kolkrabbi.io/sets/metrics-dashboard), an existing npm package, connected to the analytics data as on [metrics.kolkrabbi.io](https://metrics.kolkrabbi.io). The frontend assets are ready, so the work is wiring and Atlas branding.

### 5 Social platforms {#impl-social}

Acceptance: Ad platforms are verified and any tags respect the consent setup.

Connections for paid campaigns on Meta and LinkedIn. Only needed if Atlas runs ads, which the M2 ad templates suggest, and always set up together with the consent decisions made for website analytics in phase 4.

#### Platform verification

The domain verified in Meta Business Manager and LinkedIn Campaign Manager, so campaigns can run and link previews stay under Atlas's control. Verification reuses the DNS records set in phase 3.

#### Ad tags

Meta Pixel or Conversions API and the LinkedIn Insight Tag, added only if ads actually run. Ad tags set cookies, so they load behind consent, unlike the cookieless analytics in phase 4.

### 6 Launch checks {#impl-launch}

Acceptance: Every check passes on the production domain.

Final checks on the production domain, before and just after the public launch. Each check confirms that the work from earlier phases actually reaches search engines, AI tools, social platforms and inboxes as intended, from day one.

#### Search tools

Sitemap submitted to Google Search Console and Bing Webmaster Tools, with coverage reports reviewed closely in the first weeks after launch. Indexing errors are fixed early, before they affect rankings.

#### Preview checks

Shared links tested on LinkedIn, Meta and messaging apps, and email authentication checked with a test message. Each preview and header confirms the setup works correctly from end to end.

## Open questions

Decisions that belong with Atlas before or during the build. Each one changes what the developer sets up, so they are best settled before the website handoff in 1.5.

- **Implementation:** who builds from this checklist, in-house or a hired developer; the consultation reviews the result.
- **Crawler policy:** which AI crawlers Atlas allows.
- **Ad tracking:** whether Meta and LinkedIn tags are used, and how consent is handled.
- **Analytics home:** which tool, self-hosted or managed, and who maintains it.
