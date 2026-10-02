---
title: Search
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: One engine behind the search modal and page
tags:
  - domain/architecture
  - domain/search
---

# Search

Every page on the site is one item in one index: its title, kind, space, category, tags, headings and description. The ⌘K search modal and this page query the same index through the same engine. The search modal is the quick jump; ⌘Enter in it opens this page with the full list.

## What you can type

A query is words plus filters, in any order. Every word must match somewhere on a page; every filter narrows the list.

| Type | Finds |
|---|---|
| `button` | pages where the word appears |
| `"exact phrase"` | the words together, never read as a filter |
| `-legacy` | pages without the word |
| `#layout` or `tag:layout` | pages carrying the tag |
| `is:component` or `kind:component` | one kind of page: component, doc, block, set, package |
| `in:library` or `space:library` | one header tab: styles, library, docs, search, development |
| `cat:atoms` or `category:atoms` | one category, such as a tier or a block category |
| `-tag:draft` | leaves a tag out |
| `after:2026-09-01` · `before:2026-10-01` | pages updated in a date range |

**A bare word can be a filter.** A word that names a category, kind or tab becomes that filter on its own, so `atom` lists the atoms and `doc` lists the docs. Filters on different fields must all hold; several values of one field mean any of them.

## How it ranks

Each word scores by the best place it lands on a page, from most to least:

| Where the word lands | Weight |
|---|---|
| the whole title | 100 |
| the start of the title | 60 |
| the start of a word in the title (camelCase splits, so `Anatomy` finds `ColorAnatomy`) | 40 |
| inside the title | 25 |
| a tag, exactly | 30 |
| inside a tag | 12 |
| a heading | 15 |
| a keyword | 10 |
| the description | 8 |
| the body | 3 |

Ties sort by title. Every result keeps the reason it ranked where it did, and the counts beside each filter are what the rest of the query leaves.

The engine is `@kolkrabbi/kol-search`, plain JavaScript; the search modal and this page run the same index through it.

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
