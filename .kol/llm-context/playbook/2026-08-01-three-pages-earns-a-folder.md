---
title: Three pages earns a folder
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
description: The chapter minimum, and the sweep it forces
tags:
  - domain/design-system
---

# Three pages earns a folder

Append-only. Real timestamps. One idea per line.

## 0. Prerequisites

- 23:20 — User ruling: *"every folder should minimum have 3 documents, thats the minimum requirement for a folder ownership"*.
- 23:22 — And: *"no index does not"* count toward the three. A chapter needs 3 pages BESIDE its INDEX.
- 23:22 — Measured, index excluded: **7 of 13 chapters short**.
- 23:22 — Three are a folder wrapping nothing but their own index: `01-release` · `02-workbench` · `05-brand` — 0 pages each.
- 23:22 — Short by 2: `00-overview` · `02-icons` · `05-reference-graph`. Short by 1: `03-showcase`.
- 23:23 — Passing: `01-foundations` 6 · `03-components` 6 · `04-compositions` 10 · `06-research` 6 · `08-breakpoints` 4 · `04-content-pipeline` 6.
- 23:15 — Separately: `SHIPPED-PACKAGES.md` sits at the category ROOT, which is why the vault tree needed a loose-file special case tonight. It belongs in `01-release/`.
- 23:16 — Its `Job` column has become a changelog: **1031 words in one cell** for kol-component, 1000 for workshop, 586 theme, 511 framework — 84% of a 3684-word file in four cells.
- 23:16 — Its versions are stale: theme 0.19.0 against a live 0.30.1, component 0.21.0 against 0.23.0, workshop 0.11.0 against 0.16.4.
- 23:17 — Nine `CHANGELOG.md` files already exist in `packages/*/` — the prose has a home and was never put in it.

## 1. Shipped packages moves

- 23:30 — `docs/operations/SHIPPED-PACKAGES.md` → `docs/operations/01-release/02-shipped-packages.md`. Backup in `_tmp/2026-08-01-chapter-sweep/`.
- 23:31 — 6 vault files repointed; 3 relative depths inside the moved file were wrong after the move; `operations/INDEX.md` had a bare `[[SHIPPED-PACKAGES]]`.
- 23:32 — `operations/INDEX.md` § Folder shape claimed SHIPPED-PACKAGES was a legitimate root meta file. Corrected — it was the single loose file the vault tree grew a special case for tonight.
- 23:32 — vault-links clean, 307 resolve.

## 2. The job column

- 23:35 — Stripped changelog prose from 10 cells. **3684 words → 394.**
- 23:35 — The prose belongs in the nine `packages/*/CHANGELOG.md` that already exist; the table keeps one line per package.

## 3. Versions

- 23:36 — Regenerated from `packages/*/package.json`. theme 0.19.0 → 0.30.1 · component 0.21.0 → 0.23.0 · workshop 0.11.0 → 0.16.4 · framework 0.11.1 → 0.12.1 · icons 0.8.11 → 0.9.0.
- 23:36 — The header note claimed "verified against the registry". Rewritten: these are LOCAL versions, what the repo would publish. Claiming registry truth without checking it is the drift that put the table 11 minors behind.

## 4. The short chapters

- 23:40 — Every one turned out to be case ONE — three subjects already written under three headings in a single file. Nothing needed folding.
- 23:41 — `01-release` → `01-setup` · `02-shipped-packages` · `03-troubleshooting`.
- 23:43 — `02-workbench` → `01-starting` · `02-browsing` · `03-authoring`. Its 18 numbered steps were three jobs: get it running, drive it, write for it.
- 23:45 — `05-brand` → `01-manifest` · `02-packages` · `03-feeding`.
- 23:47 — `00-overview` → +`02-tiers` +`03-install`. `02-icons` → +`02-loader` +`03-custom` +`04-authoring` (4).
- 23:49 — `05-reference-graph` → +`02-scale` +`03-using-it`. `03-showcase` → +`03-audit-findings` (the 22 defects split from the roadmap that acts on them).
- 23:50 — 13 chapters, **0 short**.

## 5. The gate

- 23:52 — `validate:chapters` written and negative-tested: an index-only folder fails, a 3-page chapter passes. **17 gates.**

## 6. The law

- 23:54 — Written into `04-content-pipeline/02-taxonomy.md` § The minimum, beside category/chapter/page — including the direction that matters: a folder that cannot reach three pages is telling you its subject belongs in a sibling.

## 7. Verification

- 23:55 — All 17 gates clean. 65 vault docs, 334 links resolve, 245 H2s conform.
- 23:55 — NOT opened in a browser.
