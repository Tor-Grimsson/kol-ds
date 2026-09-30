---
title: Packages
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: Every published package and its changelog
tags:
  - domain/release
  - audience/consumer
---

# Packages

Every `@kolkrabbi/*` package this repo publishes, by tier. Each package has a page built from the package itself: its `package.json` is the frontmatter — version, tier, latest release, what it depends on and what depends on it — and its changelog is the body. Nothing is typed twice, so the page is what shipped.

| Tier | Is |
|---|---|
| UI | the design system's components, chrome and theme |
| App | an embeddable application that takes the UI packages as peers |
| Engine | plain JavaScript that more than one package needs — no React, no DOM |
| Client | a headless service SDK, one per service contract |
| Brand kit | the brand manifest, its template and the scraper that fills it |
| Deprecated alias | a renamed package kept so consumers keep resolving |
