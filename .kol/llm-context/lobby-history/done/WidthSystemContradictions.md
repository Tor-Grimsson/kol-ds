---
component: Layout width system (tokens, not a component)
source: kol-website apps/web + apps/brand · packages/theme/kol-theme.css · packages/framework/kol-framework.css
date: 2026-07-30
status: closed
deps: [kol-page, kol-page-hero, kol-doc-*, PageSection]
staged: 2026-07-30
---

# ✅ RESOLUTION (2026-07-30 — the DS answer, consume from here)

All five decisions taken and shipped. **kol-theme 0.13.0 · kol-framework 0.7.0.**

| # | Decision | Shipped as |
|---|---|---|
| 1 | **One family — the law's names win.** `--kol-container-max` is redefined as the *responsive resolution* of the shell, not a rival: `100% → 1400 (lg) → 1600 (xl) → var(--kol-content-shell) (≥1920)`. | `kol-framework.css` ladder + comment |
| 2 | **1800 vs 1600 reconciled**: the ladder was simply missing its last rung — `.kol-page` now reaches 1800 on ≥1920 viewports, matching the stated law. | same ladder rung |
| 3 | **The missing stop exists: `--kol-content-panel: 960px`** — tables, code blocks, framed panels, review cards. The law comment now reads "three inner caps" and names panel's job. | `kol-theme.css` content block |
| 4 | **One full-bleed: `.kol-full-bleed`** — your negative-margin `@utility full-bleed` promoted into the DS, wired to the DS's own inset (`margin-inline: calc(-1 * var(--kol-pad-section-x))`). | `kol-framework.css` |
| 5 | **The 50vw trap documented at the utility** — viewport-relative pulls are banned in sidenav layouts; the comment explains the /review slice bug. | same rule's comment |

**What kol-website does on the bump:**
- Replace improvised caps: `max-w-[920px]`/`[960px]` → `max-w-[var(--kol-content-panel)]` · `[720px]`/`[640px]` → column/measure per content · `[1200px]` → panel or shell, judged per block.
- Swap the local `@utility full-bleed` call sites to `.kol-full-bleed`, then delete the local utility — note it cancels the DS inset (`--kol-pad-section-x`), so wrappers padded by your own `.breakpoint-padding` should move to the DS inset first.
- Delete `apps/web/src/index.css:27`'s `--kol-container-max` re-declaration — the DS resolves it now.
- Kill any remaining `width:100vw; margin-left: calc(50% - 50vw)` (the third mechanism) — it's the documented trap.

Registry doc (source of truth for all layout systems): `docs/documentation/01-foundations/05-layout-systems.md`.

---

# Width system — two token families, three full-bleed mechanisms, one missing stop

## The problem this solves

**A consumer cannot look up how wide a thing should be, so every consumer invents
a number.** In `apps/brand` alone there are five hand-picked caps —
`max-w-[920px]` (×3), `[1200px]` (×2), `[960px]`, `[720px]`, `[640px]` — and not
one of them maps to a token. That is not sloppiness at the call site; the DS
genuinely does not answer the question being asked.

Three concrete failures, in order of how much they cost:

1. **Two width systems disagree, and neither is reachable.** kol-theme declares
   `shell / column / measure` and states the law. kol-framework's actual layout
   rules use a different token, `--kol-container-max`. The theme's own trio is
   dead code — `grep var(--kol-content-shell)` across both packages returns
   nothing. A consumer reading the law and following it gets a different width
   than every DS component on the page.
2. **There is no cap between 768px and 1800px.** A documentation table, a review
   card, a settings panel — all want ~900–1200. The DS offers a reading column
   (768, too narrow) or the page shell (1800, too wide). Consumers land in the
   gap and improvise, every time, differently.
3. **Full-bleed is three unrelated mechanisms**, and the one consumers reach for
   most is silently broken inside a sidenav layout.

## 1 — Two families, one of them dead

`kol-theme/kol-theme.css:76-81` declares the system, with the law in its own comment:

```
/* Content widths (2026-07-28) — ONE frame, two inner caps (chess law).
 * Every page: mx-auto max-w-shell + the one padding rhythm, content
 * LEFT-ANCHORED inside. Width is a content decision, never a page identity:
 * column caps reading blocks, measure caps running text. Nothing else. */
--kol-content-shell:   1800px;
--kol-content-column:  768px;
--kol-content-measure: 65ch;
```

`kol-framework/kol-framework.css:36, 69, 78` declares a second, unrelated cap:

```
--kol-container-max: 100%;                                    /* base */
@media (min-width: 1024px) { --kol-container-max: 1400px; }
@media (min-width: 1280px) { --kol-container-max: 1600px; }
```

Who actually consumes what, across both packages:

| Token | Consumers |
|---|---|
| `--kol-content-shell` | **none** |
| `--kol-content-column` | **none** |
| `--kol-content-measure` | 2 — `kol-type-roles.css:64, 76` |
| `--kol-container-max` | 3 — `kol-framework.css:136` (`.kol-page`), `:148` (`.kol-page-hero`), `:264` (`.kol-overlay-sheet`) |

So the declared law says *"every page: `max-w-shell`"* (1800), while the component
that actually renders every page — `.kol-page` — clamps at `--kol-container-max`
(1600 desktop). **1800 vs 1600 on the same element, from the same design system.**

Both consumer apps then re-declare the framework token themselves rather than use
either: `apps/web/src/index.css:27` sets `--kol-container-max: 1600px` with a
comment explaining the container model, i.e. the app is documenting a DS contract
back at the DS.

## 2 — The missing stop

Nothing in the scale sits between `column` (768) and `shell` (1800). Real content
that needs it, from this consumer alone:

| Improvised cap | Where | What it holds |
|---|---|---|
| `max-w-[920px]` ×3 | `apps/brand/src/pages/Review.jsx:54, 60, 77` | doc-table + framed render stage |
| `max-w-[1200px]` ×2 | brand styleguide sections | section content |
| `max-w-[960px]` · `[720px]` · `[640px]` | brand pages | prose-ish blocks |

Whatever the right answer is (`--kol-content-panel`? `--kol-content-wide`?), the
gap is real and every consumer fills it by guessing.

## 3 — Three full-bleed mechanisms

| Mechanism | Definition | Technique | Call sites |
|---|---|---|---|
| `.kol-page--fullbleed` | `kol-framework.css:154` | `max-width: none !important; min-height: 100vh; padding: 64px 0` | 1 (`brand PageSection.jsx:8`) |
| `@utility full-bleed` | **consumer-local**, `apps/web/src/index.css:222` | negative `margin-inline` (−1 / −1.25 / −1.5rem, mirroring `.breakpoint-padding`) | 4 (HomeHero, StackHeroTall, Home, workshop embeds) |
| `width: 100vw; margin-left: calc(50% - 50vw)` | was brand-local `kol-site.css` | viewport-relative pull | dying with the client-era CSS |

The home hero and the /stack hero — the two most visible full-bleed surfaces in
the product — run on a utility the **DS does not ship**. Web had to author it
locally, and its comment says so: *"Values mirror kol-theme `.breakpoint-padding`
… this utility exists to cancel exactly that inset."* A DS that owns the inset
should own its cancellation.

### The trap inside the third mechanism

`50vw` measures the **viewport**, not the container. Inside
`.kol-brand-layout` — `grid-template-columns: var(--kol-sidenav-w) minmax(0,1fr)`,
sidenav `260px` (`kol-framework.css:34, 90`) — the content track is not centred in
the viewport, so the element overhangs left by roughly half the sidenav width and
is clipped by any ancestor with `overflow: hidden`.

This is not theoretical: it is exactly why the `/review` audit page renders
FeatureSplit and SigTicker sliced down the left edge. Nothing in the DS warns
about it, and nothing fails at build time — it only shows on screen.

## What the DS needs to decide

1. **One family.** Either `--kol-container-max` adopts the shell/column/measure
   names, or the theme trio is deleted. Two vocabularies for one concept is the
   root cause of all three failures above.
2. **Reconcile 1800 vs 1600** on `.kol-page`, and make the surviving token the one
   the stated law names.
3. **Add the missing mid-cap**, or rule explicitly that improvised caps are legal
   at the call site (and say so in the law's comment, which currently reads
   "Nothing else.").
4. **Ship one full-bleed**, promoting web's `@utility full-bleed` — the negative-margin
   technique is the only one of the three that is container-relative and therefore
   correct inside a sidenav layout.
5. **Document the viewport-vs-container trap** wherever full-bleed lands.

## Out of scope

`--kol-pad-page-*` / `--kol-pad-section-*` / `--kol-pad-band-y`
(`kol-framework.css:50-74`) are **not** part of this problem — that ladder is
complete, responsive across three breakpoints, and consistently consumed. Padding
is the part of the layout system that works; leave it alone.

## Related

- [[TableSeamTokenSplit]] — same shape of defect (two token families for one
  visual concept, one of them left behind by a half-finished migration).
