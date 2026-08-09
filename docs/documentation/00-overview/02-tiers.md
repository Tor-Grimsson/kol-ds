---
title: Package tiers
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: How the packages are layered
tags:
  - domain/architecture
  - audience/consumer
related:
  - "[[INDEX|overview]]"
---

# Package tiers

The layers, and what each one may depend on.

| Tier | Packages | Job |
|---|---|---|
| **UI** (11) | foundation `kol-theme` · `kol-icons`; core `kol-component` · `kol-framework`; + 7 domain packages (workshop · dashboards · chess · content · foundry · store · styleguide) | see [[01-package-topology]] |
| **Clients** | `kol-media-client` | Headless service SDKs — one package per service contract |
| **Brand kit** | `kol-brand-template` · `kol-brand` | The brand-manifest schema + conforming data packages |
| **Tools** | `kol-scrape` | CLIs (presence/catalog scraper) |

The UI dependency arrow only points left — no reverse deps, ever. Clients/brand/tools have no deps on or from the UI packages.
