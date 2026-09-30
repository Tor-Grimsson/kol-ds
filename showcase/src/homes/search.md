---
title: Search
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: One engine behind the palette and this page
tags:
  - domain/architecture
  - audience/consumer
---

# Search

Every page on the site is one item in one index: its title, kind, space, category, tags, headings and description. The ⌘K palette and this page query the same index through the same engine, `kol-search`. The palette is the quick jump and this page is the full list.

## The engine

A query is words plus filters. `in:collection` limits it to a space, `is:component` to a kind, and `#domain/compositions` to a tag. Results are ranked by where the words hit: the title first, then headings, tags and description. The facets count what the rest of the query leaves.

## Tags

A tag is namespaced and hierarchical: `domain/compositions` reads as the domain *compositions*. A page carries the tags in its frontmatter, and clicking one lists every page that shares it.

## The graph

Each tag is a node. An edge joins two tags when a page carries both, and it gets heavier the more pages share them.

| View | Shows |
|---|---|
| Results | the ranked list for a query |
| Tags | every tag in use, by namespace, with its count |
| Graph | the tags as nodes and their shared pages as edges |
| A–Z | every page on the site, by space |
