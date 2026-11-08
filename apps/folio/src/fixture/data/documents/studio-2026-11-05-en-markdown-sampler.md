---
title: "A Markdown sampler"
date: 2026-11-05
lang: en
---

# A Markdown sampler

The fixture's one invented document: every block the reader draws, on one page. Links go to [Walden](/library/vault/walden/01-economy) and [[write-1845-en-the-raven|a wikilink to The Raven]].

## Lists

- A bullet
- Another, with `inline code`
  - and a nested one

1. First
2. Second

## A table

| Part | What it is | Lines |
| --- | --- | ---: |
| Shelf | the books, as jackets | 308 |
| Reader | one column at a measure | 333 |
| Editor | Markdown, code, rich text | 899 |

## Code

```js
export const glob = (re) => Object.fromEntries(Object.entries(client().list()).filter(([path]) => re.test(path)))
```

```css
.kol-reader-title { font-size: 72px; font-weight: 700; }
```

## An image

![[plates/raven-plate.png|600]]

## A sound

[A two-second tone, from the fixture bucket](/src/fixture/bucket/sounds/tone.wav)

---

#### The end
