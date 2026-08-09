---
title: Root causes
type: audit
status: active
created: 2026-08-02
updated: 2026-08-02
description: The five causes behind twenty-two defects
tags:
  - domain/showcase
  - audience/agency-internal
related:
  - "[[01-recovery-roadmap|showcase recovery]]"
  - "[[03-audit-findings|audit findings]]"
---

# Root causes

Twenty-two defects traced back to five causes. The findings are the evidence, the roadmap is the response; this is the middle step that says why the same fix keeps applying.

| # | Cause | Evidence |
|---|---|---|
| 1 | **Override instead of read** | the wordmark; both preview cards; three rail idioms under a "ONE rail voice" comment |
| 2 | **Dangling classes and foreign dialects** | `FIELD_ORDER` filtering for `category`/`date`/`modified`; tag classes that shipped before their CSS |
| 3 | **Improvised values where a scale exists** | hash-assigned tag colours; eight raw hexes in the graph; `#121215` ×7; uncapped tables |
| 4 | **Affordances that promise nothing** | childless group headers with chevrons and no navigation; a graph with no entry point |
| 5 | **No membership test** | placement decides *where* a component goes, never *whether* it belongs in a published package |
