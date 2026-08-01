# 🏁 Milestone: the media library and the docs surface

**Date:** 2026-08-01
**Agent:** Grim (Opus 5)
**Arc:** the lobby queue emptied to its two filed entries, and the showcase's docs surface rebuilt from three rounds of user callouts — twenty-three items, every one measured in a browser before it was called done.
**Delivered:** `MediaLibrary` (four consumer forks → one component, two variants), `InteractiveImage`, the references + search surfaces, and five duplications collapsed into named components. Component **0.19.0** · theme **0.18.0** · workshop **0.11.0**, bumped and unpublished.

## What closed

- **The lobby queue** → **done.** `InteractiveImage` and `MediaLibrary` built, resolved and filed to `done/`. Two entries remain and both are the user's to rule on, tracked in `lobby/INDEX.md`: `ButtonIconOnlyParity` (filed defect) and `ReferenceGraphPipeline` (needs-ruling).
- **MediaLibrary — one component or two?** → **closed by user ruling.** They were variants all along: `variant="page"|"modal"`, container geometry only, `MediaPicker`/`MediaBrowser` kept as thin aliases. The client is **injected, never imported** — ARCHITECTURE §3 in both directions.
- **Folder navigation** → **closed.** Finder's list model: folders disclose in place, the parent never leaves the screen, the path bar moved to the foot. Click-to-enter and the breadcrumb-above-a-divider are both gone.
- **"Why are the code blocks two different components?"** — asked repeatedly, never answered → **answered in code.** They shared `CodeBlock` but hand-wrote their tab bars in **byte-identical** class strings, in two files, in different frames. `DocTabs` is now the one strip and `InstallBlock` is a *call* to `PreviewCard`.
- **The search results page** (held since 2026-08-01 morning) → **delivered.** `/search?q=…` reads the same items and the same matcher as the ⌘K overlay; no second index exists.
- **Two metadata panels on every component page** → **closed.** `MetaRows` retired; `buildProvenance()` returns data and the one frontmatter panel renders it.
- **Set pages that listed nothing** → **closed.** Membership is derived from imports across sets · blocks · demos · pages, read in both directions (`in_sets` / `used_in`).
- **Table width fought the gate** → **closed properly on the second attempt.** The first fix bought clearance with a `width-ok:` comment; that was deleted and replaced with a real contract — `Table` declares `width="panel"|"column"` and caps itself, and the gate now bans hand-wrapping. It caught three pre-existing offenders on its first run.
- **The reference model** → **read, not guessed.** chess.kolkrabbi.io was driven in a browser rather than fetched, and the finding was that it runs **our own design system better than we were** — `.kol-table-pill` had sat unused in the theme the whole time.
- **Docs behind the code** → **closed this pass.** The width contract, `DocTabs`, variant preview, `TagPath` and set-membership are written into `docs/`; four docs re-dated.
- **gruvbox ↔ kolkrabbi colour matching** → **parked, unchanged.** The user's standing hold; nothing in this arc touched it.

## The arc (brief)

It began as a lobby ticket and became a lesson repeated until it stuck: **check the whole construct, not the leaf.** I closed the code-block question by inspecting the renderer and missing the tab bars; I answered set membership from sets alone when the real consumer was a page; I "read" an SPA with a static fetch. Each was caught by the user, not by me.

The counter-rule now written into AGENT-CONTEXT: an answer that cannot be measured in a browser is not verified, and an HTTP 200 is not a render check. Every item in the final two rounds was confirmed against computed styles and DOM counts.

The durable output is five duplications turned into named, gated things — `DocTabs`, `TagPath`, `useCoarsePointer`, the `Table` width contract, and one media library where there were four forks — plus a gate that now asserts a contract instead of grepping for a token name.

Spans: `playbook/2026-08-01-lobby-and-media-library.md` · `session-log/2026-08-01-rail-ladder-chip-and-one-search.md` · `playbook/2026-08-01-rail-ladder-and-search.md`.
