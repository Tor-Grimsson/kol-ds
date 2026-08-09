---
component: kol-doc-table (type-roles) · Pill/Tag chip family · link token · duplicate class homes
source: kol-website apps/brand /review card build-out (2026-07-29 → 07-30 session)
date: 2026-07-30
status: closed
deps: [kol-type-roles.css, kol-components-organisms.css, Pill, Tag, Badge, DocKit]
staged: 2026-07-30
---

# Doc-table + chip audit — 9 tasks, ALL CLOSED

> **Resolved 2026-07-30.** Shipped in **kol-theme 0.12.1** · **kol-component 0.13.0** · **kol-framework 0.6.4**.
>
> | # | Task | Resolution |
> |---|---|---|
> | 1 | `th` vertical-align | `vertical-align: top` added — `kol-type-roles.css` th rule |
> | 2 | single-line role on multi-line cells | split into `.kol-doc-table-token` (12px, line-height 1, nowrap) + `.kol-doc-table-copy` (12/18, wraps) |
> | 3 | `--wrap` modifier obsolete | deprecated, kept as alias with correct 18px leading |
> | 4 | slot naming in a role file | new roles named by role+tier; `-value` marked deprecated |
> | 5 | Pill defaults outline | default → `subtle` |
> | 6 | Pill defaults md | default → `sm`; **Tag audited, also flipped md → sm** |
> | 7 | Tag has no static-use docs | Pill/Tag/Badge taxonomy written into BOTH component headers |
> | 8 | two classes, two packages | framework copies of `.kol-prose-indented`/`-pullout`/`pre`/`code` **deleted** (the `pre` copy also hardcoded 'Right Grotesk Mono' over the token); elder `.kol-spectrum-grid` family deleted from framework — theme's inline-var contract is the survivor |
> | 9 | `.kol-fs-tile` defined nowhere | **ruled dead** — the tile's styling is `AssetFigure` + Tailwind `cursor-zoom-in`; strip the class consumer-side (`apps/brand/src/components/styleguide/FullscreenGallery.jsx:12`) |
>
> Consumer workarounds listed at the bottom can now be unwound.

Everything DS-side that surfaced while building the brand `/review` provenance
cards on `.kol-doc-*` roles. Each task = what's wrong · where · fix · how to
verify. Consumer-side workarounds currently in place are listed at the bottom so
they can be unwound once these land.

Companion entry: **[PillVariantDefaults](PillVariantDefaults.md)** (tasks 5-6
overlap it; that brief has the fuller Pill variant/size detail).

---

## 1. `.kol-doc-table th` has no `vertical-align` — labels center in tall rows

**Where:** `packages/theme/kol-type-roles.css:132`
**Wrong:** `td` sets `vertical-align: top` (line 143) but `th` doesn't, so the
label cell falls back to `middle`. In a 4-line row the label floats to the
vertical centre and the label↔value pairing gets hard to follow.
**Fix:** add `vertical-align: top` to the `.kol-prose th, .kol-doc-table th`
rule so both cell types agree.
**Verify:** a row whose value wraps to 4+ lines — label's first baseline should
sit on the value's first baseline.

## 2. `.kol-doc-table-value` is a single-line role used for multi-line cells

**Where:** `packages/theme/kol-type-roles.css:151`
**Wrong:** the role is `12px / line-height 16px / white-space: nowrap` — correct
for one token (hex, class name, count), but it's the ONLY value role available,
so any wrapping cell inherits 16px leading on 12px mono. Reads as a block, not
a list (measured: 4 lines in 89px).
**Fix:** split along the mono fault line (kol-type-conform law) — a nowrap cell
role built on the `kol-helper-*` tier (line-height 1, single-line chrome) and a
wrapping cell role built on the `kol-mono-*` tier (line-height-bearing, ~18-20px
leading at 12-14px).
**Verify:** the 4-line case reads as four distinct lines; single-token cells
unchanged.

**Instance #3 — same law, different surface (2026-07-30):** the shell header
tab (`packages/framework/kol-framework.css:826`) declared its own `font-size:
13px` with a `16px` bump at 1600, while the JSX carried a `kol-mono-14` class —
equal specificity, so the winner was decided by which sheet loaded last. It
rendered 14px on kol-website and 16px in the showcase from IDENTICAL package
CSS, because the showcase imported `kol-framework.css` unlayered (unlayered
beats layered regardless of specificity) and the website imported it into
`layer(components)`. Fixed by stating 14/18 in the rule and deleting the class.
**The general law both instances point at: a component's type belongs in its
own rule at the correct tier — `kol-helper-*` for single-line chrome,
`kol-mono-*` for anything that wraps — never as a utility class racing the
component's own rule.** Consumer contract now documented in ARCHITECTURE §5,
both READMEs, and the package topology doc.

## 3. `--wrap` modifier becomes obsolete with task 2

**Where:** `packages/theme/kol-type-roles.css:157`
**Wrong:** `.kol-doc-table-value--wrap { white-space: normal }` is an escape
hatch bolted onto the nowrap role — it flips the wrapping behavior but leaves
the single-line leading in place, which is the actual defect in task 2.
**Fix:** retire it once two real cell roles exist (wrapping is a role, not a
modifier). Keep as a deprecated alias if consumers already use it.

## 4. `.kol-doc-table-value` is named after a slot, not a role

**Where:** same rule · pattern origin `packages/theme/kol-components-organisms.css:90-145`
(`.kol-table-cell-title` · `-cell-text` · `-cell-meta` · `-cell-meta-strong`)
**Wrong:** the doc-table copied the organisms Table's **slot** naming into a
file whose whole contract is **role** naming (`kol-doc-body`, `kol-mono-12`,
`kol-helper-10`). One class ends up doing both jobs, and a consumer can't tell
from the name what type tier it belongs to.
**Fix:** name the two new cell roles by role+tier per the type protocol; if slot
names must survive for the organisms Table, keep those two families explicitly
separate and documented as such.

## 5. Pill defaults to `outline` — violates the never-outline law

**Where:** `packages/component/src/atoms/Pill.jsx` — `variant = 'outline'`
**Wrong:** standing user law: nothing defaults to outline (Button defaults
primary; outline needs a stated reason). Pill is the one chip opting out —
looks like elder behavior carried into the DS unexamined.
**Fix:** either author a `primary` variant (filled, matching Button-primary) and
default to it, or rule `subtle` the primary-equivalent for chips and default to
that. Only three variants exist today: `outline` · `subtle` · `inverse`
(`.pill-outline` / `.pill-subtle` / `.pill-inverse`) — there is no `primary`.

## 6. Pill defaults to `md` — chip law is `sm`

**Where:** same file — `size = 'md'`
**Wrong:** user law 2026-07-29: chips default **sm**, not md.
**Fix:** flip the default; audit **Tag**'s defaults in the same pass (same
family, same laws).

## 7. Tag has no static use — document the taxonomy

**Where:** `packages/component/src/atoms/Tag.jsx` + wherever chip docs live
**Wrong:** nothing in the component or docs states that a Tag's states signal
interaction, so agents/consumers reach for Tag as decoration (I did, on this
very page — three static Tags with no click target).
**Fix:** document the split at the source: **Pill** = static label ·
**Tag** = interactive/filterable (its `active`/`onClick`/`onRemove` states are
the point) · **Badge** = system status/count.

## 8. Two classes defined in two packages — cascade coin-flip

**Where:**
- `.kol-prose-indented` / `.kol-prose-pullout` → `theme/kol-components-atoms.css` AND `framework/kol-framework.css`
- `.kol-spectrum-grid*` → `theme/kol-components-molecules.css` AND `framework/kol-framework.css`

**Wrong:** both packages ship the same selectors; whichever imports later wins.
A consumer editing the "wrong" copy sees no change.
**Fix:** one home each (theme owns component chrome per the 2026-07-28 ruling),
delete the framework copies.
**Verify:** grep each selector — exactly one defining file.

## 9. `.kol-fs-tile` is referenced but defined nowhere

**Where:** consumer `apps/brand/src/components/styleguide/FullscreenGallery.jsx`
uses it; grep across `theme/*.css` + `framework/*.css` → **zero definitions**.
**Wrong:** a naming hook with no CSS behind it — either a lost rule or dead
markup.
**Fix:** decide which (define it, or strip the class); consumer-side cleanup
follows the ruling.

---

## Already fixed in repo, unpublished (noted so it isn't re-reported)

`--kol-link` / `--kol-link-hover` were raw Tailwind blue (`#2563EB` / `#60A5FA`)
in published **kol-theme 0.11.24**, which is what makes `.kol-table a`
(`kol-components-organisms.css:211`) render brand-foreign blue links in
consumers today. Repo source (`kol-color.css:50-51`, theme **0.12.0**) already
resolves them to `currentColor` with a documented rebind hook — ships on the
next theme publish.

## Missing precedent (not a defect, a gap)

`packages/workshop/src/docs/DocKit.jsx:26-34` (`DocSection`) renders a bare
`h2.kol-doc-section-title` — no heading+chip row pattern anywhere in the DS, so
the consumer had to invent the alignment (header row sharing the table's
max-width, cell padding zeroed on outer columns so heading/labels/stage share
one left edge, pills right-justified, `items-center` because the compact display
role at `line-height: 100%` parks baseline-aligned chips at the heading's
bottom). Worth promoting into DocKit as a `DocSection`/`DocSpecCard` variant if
this shape recurs.

## Consumer workarounds to unwind once the above land

In `apps/brand/src/pages/Review.jsx`:
- `[&_tr>*:first-child]:pl-0 [&_tr>*:last-child]:pr-0` on the table — kills the
  outer cell padding so the card aligns to the page text column (the 16px inset
  suits framed tables, not bare ones; consider a `--bare` doc-table modifier).
- `size="sm" variant="subtle"` passed explicitly on every Pill (tasks 5-6).
- `align-top` on `th` will be added as the stopgap for task 1.
