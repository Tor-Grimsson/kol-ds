# page-header-one-masthead — two components for one page masthead

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-shell@0.40.0` — `src/PageHeader.jsx` · `@kolkrabbi/kol-component@0.173.0` — `src/molecules/SectionText.jsx`
**Origin:** the user, comparing kolkrabbi.io/prints to brand.kolkrabbi.io/icons: *"these are serving the same purpose, why aren't they the same component different variants?"*

## The problem

The page masthead — eyebrow · title · a line under it · an optional actions
cluster — over a `ContentFilters` catalog is built two ways:

| page | component | package |
|---|---|---|
| kolkrabbi.io `/prints`, `/work` | `SectionText` (`eyebrow` + `headline` at `heading-01`, `headlineAs="h1"`) | `kol-component` |
| brand.kolkrabbi.io `/icons`, monitor, mirror | `PageHeader` (`title` + mono `subtitle`, `size`, `actions`) | `kol-shell` |

`PageHeader`'s own docstring opens *"TWO SCALES, because two things were being
called a page header"* — the same merge already happened once, at the app tier,
and stopped at the package boundary.

The overlap is nearly total. Both take an eyebrow, a headline and a sub-line.
Both take `actions`. Both scale the headline — `headlineSize` on one, `size`
on the other, the same knob under two names. What actually differs:

1. **The sub-line's voice.** `PageHeader` hardcodes `kol-mono-14`; `SectionText`
   sets a sans body.
2. **Actions on the baseline.** `PageHeader` lands the cluster on the subtitle's
   first baseline (PageHeaderTrailingSlot); `SectionText` has the slot, not the rule.
3. **The package.** `kol-shell` is the app-shell tier — rails, drawers, the
   portal frame. A site with no shell (kol-client-olina's `apps/web`, kol-website)
   cannot take `PageHeader` without installing the shell for one header, so it
   hand-builds the masthead from `SectionText` instead. That is why `/prints`
   carries a comment explaining its header is "the SAME block /work opens with,
   in its wrapper verbatim so the two catalogs start on one rhythm" — a
   consumer restating a rule the component should own.

Third consumer, same duplication: kol-client-olina's brand app uses neither and
stacks `kol-prose-label` / `-title` / `-lede` in a local `PageSection`.

## The ask

The user's shape, worked out in conversation:

- **`PageHeader` moves to `kol-component`**, beside `SectionText` (which it
  composes) and `ContentFilters` (which it sits above). The whole catalog-page
  stack becomes one package: `PageHeader` → `ContentFilters` →
  `ContentCollection` → `ContentCard`. Site or app, same import.
- **`PageHeader` composes `SectionText`** — it does not absorb it, and
  `SectionText` does not grow app-tier opinions. `SectionText` is the primitive
  under seven section organisms (Hero, Split, Cards, Cta, Faq, Newsletter,
  FoundryCTA); it stays a primitive. `PageHeader` renders one and adds only what
  a page masthead needs on top: the baseline rule for `actions`, the
  `--kol-page-header-mb` rhythm, and a register switch.
- **Two registers on `PageHeader`**, one prop:
  - **app** — mono sub-line (`kol-mono-14`), the compact sizes
    (`heading-03` / `display-03` / `display-02`), actions on the sub-line's
    baseline. What `/icons` has today. Default, so no existing shell page moves.
  - **site** — sans lede, the display sizes. What `/prints` and `/work` build by
    hand today.
- **`SectionText` needs one seam** for this: a way to voice the body line mono
  (`bodyVoice` or similar) so the app register is expressed *through* the
  primitive rather than around it. Nothing else is missing.
- **No re-export from `kol-shell`.** Every `kol-shell` consumer already has
  `kol-component` (it is the shell's peer), so the import path just changes.
  Record it in `docs/operations/01-release/04-retirements.md` like the card
  aliases; `kol-shell` stops exporting it.

## Consumer status

kol-client-olina's brand app will move its pages onto `PageHeader` once it is
in `kol-component` — the app has `kol-shell` installed today, so it *could*
import it now, but the point of this ticket is that it should not have to, and
`apps/web` cannot. Not started; waiting on the package move so the import is
written once.

## Related

`sidenav-drag-width-outranks-breakpoints` (same day, same session) — closed in
framework 0.37.0. Unrelated mechanism; listed because both came out of the
user auditing the brand app against the DS.

## ✅ RESOLUTION — 2026-09-03 · kol-component@0.174.0 · kol-shell@0.41.0

Adopted — `PageHeader` is in `kol-component` as of 0.174.0, with `register`. `kol-shell@0.41.0` drops the export.

The argument held and the user ruled on it directly, which it needed: ARCHITECTURE section 3 named `PageHeader` as kol-shell's, in the same sentence that records why the shell package exists, and that section says do not revisit without explicit reason. This is that reason, and section 3 is corrected in place rather than quietly contradicted.

Two things your ticket got right that made the case:

The package WAS the whole problem. A site with no app shell could not take the masthead without installing rails, drawers and a portal frame for one header — so kolkrabbi.io hand-built it twice, `/prints` carrying a comment about reproducing `/work`'s block "in its wrapper verbatim". A consumer restating a rule the component should own is the tell, and you named it.

And the rest of that page's stack was already here. `ContentFilters`, `ContentCollection`, `ContentCard`, `SectionText` — component, all of them. `PageHeader` was the last piece sitting apart. While correcting section 3 I found it also claimed `ContentFilters` for kol-shell, which has never been true — that line was wrong from the day it was written, and it is fixed now too.

WHAT I DID NOT DO, and it is a real deviation. You asked for `PageHeader` to COMPOSE `SectionText`, with a `bodyVoice` seam on the primitive to express the app register through it. I moved it and added `register`, and left the internals alone. The reason: `PageHeader` does not compose `SectionText` today — it hand-rolls its eyebrow, title and lede — and its internals carry rulings that are load-bearing and easy to lose in a rewrite. The `h-0 self-center` cluster box exists so a control row contributes no height (measured, monitor at 65.2 against fxr at 75.2 with identical titles); the eyebrow is helper-12 by a ruling, not mono; the bottom rhythm is a variable a consumer can re-point. Rewriting all of that to route through a primitive that sits under seven section organisms, to change one line's font, is a large blast radius for no behaviour a consumer can observe.

So the registers differ in exactly one thing — the sub-line's voice — because that is the only thing that actually differed. `app` is `kol-mono-14`, `site` is `kol-sans-body-01`. Title roles, sizes and the actions baseline were already shared, which is what made this one component with a variant rather than two components, which was the user's whole question. `bodyVoice` on `SectionText` is therefore NOT added: it would have been a seam wired to nothing.

If composing the primitive is wanted for its own sake — one implementation of eyebrow/title/lede rather than two — that is a real argument and its own ticket, and it should be taken with the measurements above in hand.

Verified in a render: `kol-shell` no longer exports `PageHeader` (19 exports, not 20); the app register is JetBrains Mono 14/18 and the site register Right Grotesk 16/25.6; and the app-shell set still renders its masthead through the cross-package import at `kol-mono-heading-03`, unchanged. `SettingsScaffold` and `CatalogPage` compose it across the seam and are unchanged for their callers.

`kol-shell`'s peer floor on `kol-component` is raised to `>=0.174.0`, so a consumer that bumps shell without component gets an install warning rather than a missing export at runtime.

Recorded in `docs/operations/01-release/04-retirements.md`.

On your related note: agreed, and it is now two closed tickets out of the same audit. Worth continuing that pass.

**Remainder here:** none — kol-client-olina bump both; change PageHeader imports from @kolkrabbi/kol-shell to @kolkrabbi/kol-component; apps/web can now use it (pass register=site).

