---
title: Typography lookup
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: Every type class, with its real values
aliases:
  - typography-lookup
  - type-lookup
  - type-values
sources:
  - packages/theme/kol-typography.css
  - packages/theme/kol-type-mono-classes.css
  - packages/theme/kol-type-roles.css
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[03-typography|type classes]]"
  - "[[09-sizes|sizes]]"
---

> **Generated** by `pnpm lookups` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.

# Typography lookup

The fault line decides which family you want: **`kol-helper-*` is
`line-height: 1`** and takes single-line chrome only; everything else carries
leading and takes anything that can wrap. See [[03-typography|type classes]].

## Mono

| Class | Family | Size | Line height | Weight | Tracking | Transform |
|---|---|---|---|---|---|---|
| `.kol-mono-8` | `mono` | `8px` | 12px | 400 | — | — |
| `.kol-mono-10` | `mono` | `10px` | 14px | 400 | — | — |
| `.kol-mono-12` | `mono` | `12px` | 16px | 400 | — | — |
| `.kol-mono-14` | `mono` | `14px` | 18px | 400 | — | — |
| `.kol-mono-16` | `mono` | `16px` | 22px | 400 | — | — |
| `.kol-mono-20` | `mono` | `20px` | 26px | 400 | — | — |

## Helper

Single-line chrome. Weight 500, no leading, letter-spaced.

| Class | Family | Size | Line height | Weight | Tracking | Transform |
|---|---|---|---|---|---|---|
| `.kol-helper-8` | `mono` | `8px` | 1 | 500 | 0.10em | — |
| `.kol-helper-10` | `mono` | `10px` | 1 | 500 | 0.10em | — |
| `.kol-helper-12` | `mono` | `12px` | 1 | 500 | 0.06em | — |
| `.kol-helper-14` | `mono` | `14px` | 1 | 500 | 0.06em | — |
| `.kol-helper-16` | `mono` | `16px` | 1 | 500 | 0.06em | — |
| `.kol-helper-20` | `mono` | `20px` | 1 | 500 | 0.06em | — |

## Mono roles

| Class | Family | Size | Line height | Weight | Tracking | Transform |
|---|---|---|---|---|---|---|
| `.kol-mono-heading-03` | `mono` | `heading-03` | 110% | 500 | — | — |
| `.kol-mono-display-03` | `mono` | `display-03` | 100% | 500 | — | — |
| `.kol-mono-display-02` | `mono` | `display-02` | 100% | 500 | — | — |

## Sans

| Class | Family | Size | Line height | Weight | Tracking | Transform |
|---|---|---|---|---|---|---|
| `.kol-sans-display-01` | `sans-tight` | `display-01` | 100% | 500 | — | — |
| `.kol-sans-display-02` | `sans-tight` | `display-02` | 100% | 500 | — | — |
| `.kol-sans-display-03` | `sans-tight` | `display-03` | 100% | 500 | — | — |
| `.kol-sans-display-04` | `sans-tight` | `display-04` | 100% | 500 | — | — |
| `.kol-sans-heading-01` | `sans-narrow` | `heading-01` | 110% | 500 | — | — |
| `.kol-sans-heading-02` | `sans-narrow` | `heading-02` | 110% | 500 | — | — |
| `.kol-sans-heading-03` | `sans-compact` | `heading-03` | 120% | 500 | — | — |
| `.kol-sans-heading-04` | `sans-compact` | `heading-04` | 120% | 500 | — | — |
| `.kol-sans-heading-05` | `sans-compact` | `heading-05` | 125% | 500 | — | — |
| `.kol-sans-body-01` | `sans` | `body-01` | 160% | 400 | — | — |
| `.kol-sans-body-02` | `sans` | `body-02` | 160% | 400 | — | — |
| `.kol-sans-body-03` | `sans` | `body-03` | 150% | 400 | — | — |

## Roles

| Class | Family | Size | Line height | Weight | Tracking | Transform |
|---|---|---|---|---|---|---|
| `.kol-doc-eyebrow` | `mono` | `10px` | 1 | 500 | 0.1em | uppercase |
| `.kol-doc-heading` | `sans-compact` | `heading-03` | 120% | 500 | — | — |
| `.kol-doc-section-title` | `sans-compact` | `heading-04` | 100% | 500 | — | — |
| `.kol-doc-lede` | `sans` | `body-01` | 160% | 400 | 0.04em | — |
| `.kol-doc-body` | `sans` | `body-02` | 160% | 400 | 0.04em | — |
| `.kol-doc-code` | `inherit` | — | — | — | — | — |
| `.kol-doc-table` | `sans` | `body-02` | 160% | 400 | — | — |
| `.kol-doc-figure` | `inherit` | — | — | — | — | — |
| `.kol-doc-caption` | `mono` | `12px` | 16px | 400 | 0.02em | — |
| `.kol-doc-footer` | `mono` | `10px` | 14px | 400 | 0.02em | — |
| `.kol-card-title` | `sans-compact` | `heading-05` | 125% | 500 | — | — |
| `.kol-eyebrow` | `mono` | `12px` | 1 | 500 | 0.06em | uppercase |
| `.kol-card-kicker` | `mono` | `12px` | 1 | 500 | 0.06em | uppercase |
| `.kol-card-meta` | `mono` | `12px` | 1 | 500 | 0.06em | — |
| `.kol-card-excerpt` | `mono` | `14px` | 18px | 400 | — | — |
| `.kol-card-value` | `mono` | `16px` | 22px | 500 | — | — |
| `.kol-card-tag` | `mono` | `10px` | 1 | 500 | 0.1em | uppercase |

## Size tokens

Mobile values. Display and `heading-01` step up at 768 and 1280 — see
`kol-typography.css`.

| Token | Mobile |
|---|---|
| `--kol-text-display-01` | `96px` |
| `--kol-text-display-02` | `64px` |
| `--kol-text-display-03` | `48px` |
| `--kol-text-display-04` | `40px` |
| `--kol-text-heading-01` | `64px` |
| `--kol-text-heading-02` | `40px` |
| `--kol-text-heading-03` | `32px` |
| `--kol-text-heading-04` | `24px` |
| `--kol-text-heading-05` | `20px` |
| `--kol-text-heading-06` | `16px` |
| `--kol-text-body-01` | `16px` |
| `--kol-text-body-02` | `14px` |
| `--kol-text-body-03` | `12px` |
| `--kol-text-display-tight-01` | `96px` |
| `--kol-text-display-tight-02` | `64px` |
| `--kol-text-display-tight-03` | `48px` |
